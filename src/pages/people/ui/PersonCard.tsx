import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@/shared/lib';
import type { Person } from '../model/person';
import { PersonLinks } from './PersonLinks';
import styles from './PersonCard.module.css';

type PopoverSide = 'left' | 'right';

interface PopoverPlacement {
  readonly side: PopoverSide;
  readonly width: number;
}

const POPOVER_WIDTH_PX = 320;
/** The stylesheet's 12px gap to the card, plus a margin from the viewport edge. */
const POPOVER_CLEARANCE_PX = 28;
const DEFAULT_PLACEMENT: PopoverPlacement = { side: 'right', width: POPOVER_WIDTH_PX };

/** Opens toward the roomier side of the card, narrowing only when neither side
 *  can hold the full width, so the panel never pushes past the viewport. */
function placePopover(card: HTMLElement): PopoverPlacement {
  const rect = card.getBoundingClientRect();
  const roomRight = document.documentElement.clientWidth - rect.right;
  const roomLeft = rect.left;
  const room = Math.max(roomRight, roomLeft) - POPOVER_CLEARANCE_PX;
  return {
    side: roomRight >= roomLeft ? 'right' : 'left',
    width: Math.min(POPOVER_WIDTH_PX, room),
  };
}

/** Who the panel is about, so it reads on its own when it covers the tile. */
function AboutHeading({ person }: { person: Person }) {
  return (
    <div>
      <div className={styles.aboutName}>{person.name}</div>
      <div className={styles.aboutRole}>{person.role}</div>
    </div>
  );
}

function AboutContent({ person }: { person: Person }) {
  return (
    <>
      {person.bio && <p className={styles.bio}>{person.bio}</p>}
      {person.topics.length > 0 && (
        <p className={styles.topics}>
          <span className={styles.topicsLabel}>Works on</span>
          {person.topics.join(', ')}
        </p>
      )}
    </>
  );
}

/** Pointer screens: floats beside the tile on hover or keyboard focus. It is a
 *  visual copy — screen readers get the tile's own hidden text instead. */
function AboutPopover({ person, placement }: { person: Person; placement: PopoverPlacement }) {
  const width = { '--popover-width': `${placement.width}px` } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={cx(styles.popover, placement.side === 'left' && styles.popoverLeft)}
      style={width}
    >
      <div className={styles.panel}>
        <div className={styles.aboutHeader}>
          <AboutHeading person={person} />
        </div>
        <AboutContent person={person} />
      </div>
    </div>
  );
}

/** Touch screens: a sheet across the bottom of the viewport, portalled to the
 *  body so no section's stacking or clipping can reach it. A tile's grid column
 *  is too narrow to read a bio in. */
function AboutSheet({ person, id, onClose }: { person: Person; id: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => closeRef.current?.focus(), []);

  return createPortal(
    <>
      <div aria-hidden="true" className={styles.backdrop} onClick={onClose} />
      <div
        id={id}
        role="dialog"
        aria-label={`About ${person.name}`}
        className={cx(styles.sheet, 'nl-fade-up-fast')}
        onKeyDown={(event) => event.key === 'Escape' && onClose()}
      >
        <div className={styles.aboutHeader}>
          <AboutHeading person={person} />
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
            Close
          </button>
        </div>
        <AboutContent person={person} />
      </div>
    </>,
    document.body,
  );
}

/**
 * One roster tile: portrait, name, role and links. The bio and research topics
 * open beside the tile on hover, so every tile keeps the same height however
 * much there is to say. Touch screens have no hover; an "About" button opens
 * the same details in a sheet there.
 */
export function PersonCard({ person }: { person: Person }) {
  const aboutId = useId();
  const itemRef = useRef<HTMLLIElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Portraits are dropped into public/uploads separately; until one lands the
  // tinted frame stands in rather than a broken image.
  const [photoFailed, setPhotoFailed] = useState(false);
  const [placement, setPlacement] = useState(DEFAULT_PLACEMENT);
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasAbout = Boolean(person.bio) || person.topics.length > 0;

  const handleReveal = () => {
    if (itemRef.current) setPlacement(placePopover(itemRef.current));
  };

  const closeSheet = () => {
    setSheetOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <li
      ref={itemRef}
      className={cx(styles.item, hasAbout && styles.hasAbout)}
      onMouseEnter={hasAbout ? handleReveal : undefined}
      onFocus={hasAbout ? handleReveal : undefined}
    >
      <div className={styles.card}>
        <div className={styles.portrait}>
          {person.photo && !photoFailed && (
            <img
              src={person.photo}
              alt={person.name}
              className={styles.photo}
              loading="lazy"
              onError={() => setPhotoFailed(true)}
            />
          )}
        </div>
        <div className={styles.details}>
          <div className={styles.name}>{person.name}</div>
          <div className={styles.role}>{person.role}</div>
          {hasAbout && (
            <div className={styles.visuallyHidden}>
              <AboutContent person={person} />
            </div>
          )}
          <PersonLinks links={person.links} name={person.name} />
          {hasAbout && (
            <button
              ref={toggleRef}
              type="button"
              className={styles.toggle}
              aria-expanded={sheetOpen}
              aria-controls={aboutId}
              onClick={() => setSheetOpen(true)}
            >
              About
            </button>
          )}
        </div>
      </div>
      {hasAbout && <AboutPopover person={person} placement={placement} />}
      {sheetOpen && <AboutSheet person={person} id={aboutId} onClose={closeSheet} />}
    </li>
  );
}

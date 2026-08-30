import { useState } from 'react';
import { cx } from '@/shared/lib';
import { Container } from '../Container';
import { Eyebrow } from '../Eyebrow';
import { Reveal } from '../Reveal';
import { BannerArt, type BannerMotif } from './banner-art';
import styles from './SectionBanner.module.css';

interface SectionBannerProps {
  /** Small mono label above the title. */
  eyebrow: string;
  /** The page's h1. */
  title: string;
  /** One or two sentences of standfirst copy. */
  lede?: string;
  /** Which generated artwork sits behind the copy. */
  motif: BannerMotif;
  /** A photograph to use in place of the artwork. Falls back to `motif` if it
   *  fails to load, so a missing upload never leaves an empty band. */
  photo?: { readonly src: string; readonly alt: string };
}

/**
 * The full-bleed masthead that opens every route-level page: artwork or a
 * photograph, a scrim, and the page title over the top. It carries the h1, so
 * pages using it should not also render a PageHeading.
 */
export function SectionBanner({ eyebrow, title, lede, motif, photo }: SectionBannerProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = Boolean(photo) && !photoFailed;

  return (
    <section className={cx(styles.banner, showPhoto && styles.tall)}>
      {showPhoto && photo ? (
        <img
          src={photo.src}
          alt={photo.alt}
          className={styles.image}
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <BannerArt motif={motif} />
      )}

      <div aria-hidden="true" className={styles.scrim} />

      <Container className={styles.content}>
        <Reveal>
          <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal as="h1" delay={80} className={styles.title}>
          {title}
        </Reveal>
        {lede && (
          <Reveal as="p" delay={170} className={styles.lede}>
            {lede}
          </Reveal>
        )}
      </Container>
    </section>
  );
}

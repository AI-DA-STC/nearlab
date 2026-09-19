import styles from './LogoMark.module.css';

/** The NEAR Lab logo (shared with the rest of the lab's material).
 *  `tone` flips the artwork for a dark surface: the source PNG is dark ink on
 *  transparency, so `inverse` inverts it to white, matching how the mark is
 *  treated on the Jekyll site's dark navbar. */
const LOGO_SRC = '/uploads/logo/near_lab.png';

export function LogoMark({ tone = 'navy' }: { tone?: 'navy' | 'inverse' }) {
  return <img src={LOGO_SRC} alt="NEAR Lab" className={tone === 'inverse' ? styles.inverse : styles.photo} />;
}

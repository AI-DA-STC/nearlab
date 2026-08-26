import { Container } from '@/shared/ui';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div
        role="img"
        aria-label="Hero video placeholder — looping lab footage, muted, autoplay, 16:9 cover crop"
        className={styles.media}
      >
        <span className={styles.mediaNote}>
          hero video — loop, muted, autoplay
          <br />
          object-fit: cover · replace this element with &lt;video&gt;
        </span>
      </div>
      <div aria-hidden="true" className={styles.scrimBottom} />
      <div aria-hidden="true" className={styles.scrimLeft} />
      <Container className={styles.content}>
        <h1 className={styles.title}>Different robots. Difficult worlds. Adaptive teams.</h1>
        <p className={styles.lede}>
          Building a future where diverse robots and humans form capable teams on demand:
          discovering how to work together, interacting intelligently with the physical world, and
          adapting when environments or other agents behave against their expectations.
        </p>
      </Container>
    </section>
  );
}

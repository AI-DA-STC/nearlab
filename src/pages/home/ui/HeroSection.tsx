import { useEffect, useRef } from 'react';
import { Container, Reveal } from '@/shared/ui';
import { useReducedMotion } from '@/shared/lib';
import styles from './HeroSection.module.css';

const HERO_VIDEO = '/uploads/home/hero-video.mp4';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  // A full-bleed autoplaying loop is exactly what prefers-reduced-motion is
  // for; CSS alone cannot stop video playback, so hold the first frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) video.pause();
    else void video.play().catch(() => undefined);
  }, [reduced]);

  return (
    <section className={styles.hero}>
      <video
        ref={videoRef}
        className={styles.media}
        src={HERO_VIDEO}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div aria-hidden="true" className={styles.scrimBottom} />
      <div aria-hidden="true" className={styles.scrimLeft} />
      <Container className={styles.content}>
        <Reveal as="h1" className={styles.title}>
          Different robots. Difficult worlds. Adaptive teams.
        </Reveal>
        <Reveal as="p" delay={140} className={styles.lede}>
          We are working toward teams of different robots and people that come together on demand.
          Those teams have to work out how to cooperate, handle the physical world intelligently, and
          adapt when the environment or other agents stop behaving the way they expected.
        </Reveal>
      </Container>
    </section>
  );
}

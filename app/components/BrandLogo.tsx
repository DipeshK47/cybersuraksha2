import styles from "./brand-logo.module.css";

export function BrandLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Static brand artwork needs no image transformation.
    <img
      className={styles.logo}
      src="/brand/cybershiksha.svg"
      alt="EEVSEC CyberShiksha"
      width="310"
      height="44"
      translate="no"
      data-no-translate
    />
  );
}

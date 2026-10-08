import { useThemeColors } from '../features/themes/preferences-context';
import darkGear from '../assets/GearAnimationDark.gif';
import lightGear from '../assets/GearAnimationLight.gif';
import styles from '../shared/site.module.css';
export const meta = () => [{ title: 'Armond Willingham' }];
export default function Home() {
  const colors = useThemeColors();
  const hex = colors.backgroundColor.primary;
  const channels = /^#[\da-f]{6}$/i.test(hex) ? [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16)) : [0, 0, 0];
  const isLight = channels[0] * .299 + channels[1] * .587 + channels[2] * .114 > 128;
  return <section className={styles.home}>
    <h1 id="page-title" tabIndex={-1}>This is an interactive gallery made by Armond Willingham, with love and care. It's still a work in progress.</h1>
    <a href="https://github.com/alw98/awillingham-site">Source</a>
    <img src={isLight ? darkGear : lightGear} className={styles.gearbox} alt="Work in progress — animated gears" />
    <p className={styles.motionNote}>Work in progress.</p>
  </section>;
}

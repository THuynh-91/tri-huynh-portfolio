import { MotionConfig } from 'framer-motion';
import '../styles/globals.css';
import CustomCursor from '../components/CustomCursor';

export default function App({ Component, pageProps }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain">
        <CustomCursor />
        <Component {...pageProps} />
      </div>
    </MotionConfig>
  );
}

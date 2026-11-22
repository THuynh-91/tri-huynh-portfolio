import { MotionConfig } from 'framer-motion';
import '../styles/globals.css';
import '../styles/ink.css';
import { useRouter } from 'next/router';
import CustomCursor from '../components/CustomCursor';

export default function App({ Component, pageProps }) {
  // the custom cursor belongs to the classic page; the manga keeps the system cursor
  const { pathname } = useRouter();
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain">
        {pathname === '/classic' && <CustomCursor />}
        <Component {...pageProps} />
      </div>
    </MotionConfig>
  );
}

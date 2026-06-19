import '../styles/globals.css';
import CustomCursor from '../components/CustomCursor';

export default function App({ Component, pageProps }) {
  return (
    <div className="grain">
      <CustomCursor />
      <Component {...pageProps} />
    </div>
  );
}

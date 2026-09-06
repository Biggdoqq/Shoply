import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteScroll() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

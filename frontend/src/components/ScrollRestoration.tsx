import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the route path changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
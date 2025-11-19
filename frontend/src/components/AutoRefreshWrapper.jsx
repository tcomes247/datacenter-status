import { useEffect, useState } from "react";
import "./AutoRefreshWrapper.css";

export default function AutoRefreshWrapper({ children, refreshKey }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 350);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  return (
    <div className={`auto-refresh-wrapper ${fade ? "fade" : ""}`}>
      {children}
    </div>
  );
}


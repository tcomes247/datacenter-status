import { useEffect, useState } from "react";

export default function AutoRefreshWrapper({ children, refreshKey }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 400);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  return (
    <div
      style={{
        transition: "opacity 0.3s ease",
        opacity: fade ? 0.4 : 1,
      }}
    >
      {children}
    </div>
  );
}

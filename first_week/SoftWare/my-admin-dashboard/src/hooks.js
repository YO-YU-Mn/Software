import { useState, useEffect, useRef } from "react";

// ─── COUNT-UP ANIMATION ───────────────────────────────────────
export function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  const start = useRef(null);

  useEffect(() => {
    start.current = null;
    const step = (ts) => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return val;
}

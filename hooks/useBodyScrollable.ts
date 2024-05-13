import { useEffect, useState } from "react";

function useBodyScrollable() {
  const [bodyScrollable, setBodyScrollable] = useState(
    document.body.scrollHeight > window.innerHeight,
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setBodyScrollable(document.body.scrollHeight > window.innerHeight);
    });
    resizeObserver.observe(document.body);
    return () => {
      resizeObserver.unobserve(document.body);
    };
  }, []);

  return bodyScrollable;
}

export default useBodyScrollable;

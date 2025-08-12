import { useState, useEffect } from "react";

function useIsPhoneSize() {
  const [isPhoneSize, setIsPhoneSize] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsPhoneSize(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isPhoneSize;
}

export default useIsPhoneSize;

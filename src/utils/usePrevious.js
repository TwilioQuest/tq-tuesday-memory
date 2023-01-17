import { useEffect, useRef } from "react";

function usePrevious(value) {
  const ref = useRef(value);

  useEffect(() => {
    console.log("prev value", value);
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;

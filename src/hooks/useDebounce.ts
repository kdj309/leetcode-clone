import { useEffect, useRef, useState } from 'react';

export default function useDebounce(value: string, delay: number) {
  const [debounceValue, setDebounceValue] = useState(value);
  const timerRef=useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current= setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay || 500]);

  return debounceValue;
}

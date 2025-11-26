// app/hooks/useInfiniteScroll.ts
import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (callback: () => void, hasMore: boolean, loading: boolean) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [callback, hasMore, loading]);

  return observerRef;
};
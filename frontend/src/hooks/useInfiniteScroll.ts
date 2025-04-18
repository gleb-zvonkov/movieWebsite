import { useEffect } from "react";

export function useInfiniteScroll(
  fetchMore: () => Promise<void>,
  threshold = 100
) {
  useEffect(() => {
    let isFetching = false;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottom = document.body.offsetHeight - threshold;

      if (scrollPosition >= bottom && !isFetching) {
        isFetching = true;
        fetchMore().finally(() => {
          setTimeout(() => {
            isFetching = false;
          }, 500); // Prevent rapid re-triggering
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMore, threshold]);
}

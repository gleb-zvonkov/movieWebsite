/**
 * useInfiniteScroll Hook
 * 
 * This hook listens for the scroll event on the window and triggers a `fetchMore` function when the user scrolls 
 * close to the bottom of the page.
 *  * Props:
 * - `fetchMore`: A function that returns a Promise, used to fetch additional data when the user reaches the threshold.
 * - `threshold`: The distance (in pixels) from the bottom of the page to trigger the fetchMore function. Defaults to 100 pixels.
 */



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

import { useEffect, useState, useRef, RefObject } from "react";

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

type ScrollDirection = "up" | "down" | "none";

interface EdgeInfo {
  isAtTopEdge: boolean;
  isAtBottomEdge: boolean;
  isFullyInView: boolean;
}

interface UseIntersectionObserverProps {
  onEnter?: () => void;
  onProgress?: (
    progress: number,
    direction: ScrollDirection,
    edges: EdgeInfo
  ) => void;
  options?: IntersectionObserverOptions;
  /** Minimum progress value required before callbacks start firing (0 to 1) */
  minThreshold?: number;
}

const useIntersectionObserver = <T extends HTMLElement>({
  onEnter,
  onProgress,
  options = {},
  minThreshold = 0
}: UseIntersectionObserverProps): RefObject<T | null> => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<T | null>(null);
  const prevProgress = useRef<number | null>(null);

  useEffect(() => {
    // Use multiple thresholds for fine-grained progress updates.
    const thresholds =
      options.threshold ||
      Array.from(new Array(101), (_, i) => i / 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;
        // Determine the viewport height (fallback to entry.rootBounds if available)
        const viewportHeight =
          window.innerHeight ||
          (entry.rootBounds && entry.rootBounds.height) ||
          0;

        // Calculate the total scrollable area for the element.
        const totalScrollable = rect.height + viewportHeight;
        // Calculate progress: when the element’s top is at the bottom of the viewport, progress ~0,
        // and when the element’s bottom is at the top of the viewport, progress ~1.
        let progress = (viewportHeight - rect.top) / totalScrollable;
        progress = Math.min(Math.max(progress, 0), 1);

        // Update previous progress even if below minThreshold for direction accuracy.
        if (prevProgress.current === null) {
          prevProgress.current = progress;
        }

        // Only proceed if the progress is above the minThreshold.
        if (progress < minThreshold) {
          prevProgress.current = progress;
          return;
        }

        // Determine scroll direction by comparing with previous progress.
        let direction: ScrollDirection = "none";
        if (prevProgress.current !== null) {
          if (progress > prevProgress.current) {
            direction = "down";
          } else if (progress < prevProgress.current) {
            direction = "up";
          }
        }
        prevProgress.current = progress;

        // Use a small tolerance to check if edges are aligned.
        const tolerance = 2; // in pixels
        const isAtTopEdge = Math.abs(rect.top) <= tolerance;
        const isAtBottomEdge = Math.abs(rect.bottom - viewportHeight) <= tolerance;
        // Check if the visible part of the element fills the viewport height.
        const intersectionRect = entry.intersectionRect;
        const isFullyInView = Math.abs(intersectionRect.height - viewportHeight) <= tolerance;

        // Fire the onProgress callback with additional edge info.
        if (onProgress) {
          onProgress(progress, direction, {
            isAtTopEdge,
            isAtBottomEdge,
            isFullyInView
          });
        }

        // Fire onEnter once when the element first becomes visible above the minThreshold.
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
          if (onEnter) {
            onEnter();
          }
        }
      },
      { threshold: thresholds, ...options }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [onEnter, onProgress, hasBeenVisible, options, minThreshold]);

  return elementRef;
};

export default useIntersectionObserver;
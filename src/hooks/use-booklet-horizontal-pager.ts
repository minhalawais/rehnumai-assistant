"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

type PagerOptions = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  enabled: boolean;
};

export function useBookletHorizontalPager({ page, pageCount, onPageChange, enabled }: PagerOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollEndTimer = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(pageCount, page + 1);

  const centerTrack = useCallback(
    (behavior: ScrollBehavior = "instant") => {
      const track = trackRef.current;
      if (!track || track.clientWidth < 1) return;
      track.scrollTo({ left: track.clientWidth, behavior: reducedMotion ? "auto" : behavior });
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (!enabled) return;
    centerTrack("instant");
  }, [page, enabled, centerTrack]);

  const commitFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth < 1) return;
    const w = track.clientWidth;
    const index = track.scrollLeft / w;
    if (index < 0.4 && page > 1) {
      onPageChange(page - 1);
      return;
    }
    if (index > 1.6 && page < pageCount) {
      onPageChange(page + 1);
      return;
    }
    centerTrack("smooth");
  }, [page, pageCount, onPageChange, centerTrack]);

  const onTrackScroll = useCallback(() => {
    if (scrollEndTimer.current != null) window.clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = window.setTimeout(commitFromScroll, 120);
  }, [commitFromScroll]);

  useEffect(() => {
    if (!enabled) return;
    const track = trackRef.current;
    if (!track) return;

    const onScrollEnd = () => commitFromScroll();
    track.addEventListener("scroll", onTrackScroll);
    track.addEventListener("scrollend", onScrollEnd);

    return () => {
      track.removeEventListener("scroll", onTrackScroll);
      track.removeEventListener("scrollend", onScrollEnd);
      if (scrollEndTimer.current != null) window.clearTimeout(scrollEndTimer.current);
    };
  }, [enabled, onTrackScroll, commitFromScroll, page]);

  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (event.key === "ArrowLeft" && page > 1) {
        event.preventDefault();
        onPageChange(page - 1);
      }
      if (event.key === "ArrowRight" && page < pageCount) {
        event.preventDefault();
        onPageChange(page + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, page, pageCount, onPageChange]);

  return { trackRef: trackRef as RefObject<HTMLDivElement>, prevPage, currentPage: page, nextPage };
}

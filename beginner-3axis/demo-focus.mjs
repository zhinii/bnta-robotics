/** Fit a demonstration and its explanation together, without moving the camera
 * or changing learner state. Very short screens retain a scrollable text rail. */
export function createDemoFocus(root, body, sceneSelector) {
  let active = false,
    pending = false,
    scrollRequested = false,
    fitKey = "",
    stableSquare = Infinity;
  function layout(scroll = false) {
    if (!active || !root.isConnected || !root.getBoundingClientRect().width)
      return;
    const scene = [...root.querySelectorAll(sceneSelector)].find(
      (e) => e.getBoundingClientRect().width > 0,
    );
    if (!scene) return;
    let scroller = root.parentElement;
    while (
      scroller &&
      !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)
    )
      scroller = scroller.parentElement;
    const nav = document.querySelector(".lesson-navigation");
    const header = document.querySelector("header");
    const viewport = window.visualViewport?.height || window.innerHeight;
    const scrollTop = scroller
      ? Math.max(0, scroller.getBoundingClientRect().top)
      : header?.getBoundingClientRect().height || 44;
    const top = scrollTop + (nav?.getBoundingClientRect().height || 38) + 8;
    const bottom =
      Math.min(viewport, scroller?.getBoundingClientRect().bottom || viewport) -
      12;
    const available = Math.max(200, bottom - top);
    const wide =
      root.clientWidth >= 620 || (root.clientWidth >= 460 && available < 360);
    root.dataset.focusLayout = wide ? "wide" : "stack";
    root.style.setProperty("--demo-room", `${available}px`);
    const figure = scene.closest("figure");
    const captionHeight =
      figure?.querySelector("figcaption")?.getBoundingClientRect().height || 0;
    const bodyHeight = body.scrollHeight;
    let size = wide
      ? Math.min(root.clientWidth * 0.55 - 8, available - captionHeight)
      : Math.min(
          root.clientWidth,
          Math.max(
            Math.min(200, available * 0.48),
            available - bodyHeight - captionHeight - 12,
          ),
        );
    const key = `${root.clientWidth}:${available}`;
    if (key !== fitKey) stableSquare = Infinity;
    fitKey = key;
    // Do not enlarge the scene when a long intro becomes a short live caption:
    // the playback button and steps must not jump under the learner's finger.
    stableSquare = Math.min(stableSquare, size);
    size = stableSquare;
    root.style.setProperty("--demo-square", `${Math.floor(size)}px`);
    root.style.setProperty(
      "--demo-text-room",
      `${Math.max(80, wide ? available : available - size - captionHeight - 12)}px`,
    );
    if (scroll) {
      const delta = root.getBoundingClientRect().top - top;
      if (scroller)
        scroller.scrollTo?.({
          top: scroller.scrollTop + delta,
          behavior: "instant",
        });
      else
        window.scrollTo?.({ top: window.scrollY + delta, behavior: "instant" });
    }
  }
  function schedule(scroll = false) {
    scrollRequested ||= scroll;
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      const shouldScroll = scrollRequested;
      scrollRequested = false;
      layout(shouldScroll);
    });
  }
  const resize =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(() => schedule());
  resize?.observe(root);
  resize?.observe(body);
  const onResize = () => schedule(true);
  window.addEventListener("resize", onResize);
  window.visualViewport?.addEventListener("resize", onResize);
  window.addEventListener(
    "pagehide",
    () => {
      resize?.disconnect();
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    },
    { once: true },
  );
  return {
    focus() {
      active = true;
      stableSquare = Infinity;
      root.classList.add("demo-focused");
      body.classList.add("demo-focus-body");
      // Layout synchronously before scrolling; the next frame picks up fonts/canvas.
      layout(true);
      schedule(true);
    },
    clear() {
      active = false;
      root.classList.remove("demo-focused");
    },
    refresh() {
      if (active) schedule();
    },
  };
}

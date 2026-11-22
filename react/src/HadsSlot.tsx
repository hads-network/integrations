"use client";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { slotClass, slotInnerHtml, type HadsSlotType } from "./markup.js";

export interface HadsSlotProps {
  /** Slot type. Default `inline`. */
  type?: HadsSlotType;
  /** Optional topical hint (`data-hads-topic`). */
  topic?: string;
  /** Allow ads from your other sites (`data-hads-allow-self`). */
  allowSelf?: boolean;
  /** Attribution link text. Default "Ads by HADS". */
  attribution?: string;
  /** Render skeleton placeholders until the ad arrives. Default true. */
  skeleton?: boolean;
  /** Extra classes, appended to `hads-unit hads-unit--{type}`. */
  className?: string;
  style?: CSSProperties;
  /**
   * Change this to request a fresh ad (e.g. pass the current route).
   * The slot element is remounted, and hads.js fills the new element.
   */
  refreshKey?: string | number;
}

type InnerProps = Omit<HadsSlotProps, "refreshKey"> & { type: HadsSlotType };

function SlotElement({ type, topic, allowSelf, attribution, skeleton, className, style }: InnerProps) {
  const ref = useRef<HTMLElement>(null);
  // React never re-renders these children: hads.js owns them after load.
  const html = useMemo(() => ({ __html: slotInnerHtml(type, { attribution, skeleton }) }), [type, attribution, skeleton]);

  useEffect(() => {
    // hads.js watches the DOM with a MutationObserver; this is a fallback
    // for when the script is already loaded and the observer is unavailable.
    const hads = (window as unknown as { HADS?: { scan?: (root: Element) => void } }).HADS;
    if (ref.current && hads && typeof hads.scan === "function") hads.scan(ref.current);
  }, []);

  return (
    <aside
      ref={ref}
      data-hads-slot={type}
      data-hads-topic={topic || undefined}
      data-hads-allow-self={allowSelf ? "" : undefined}
      className={className ? `${slotClass(type)} ${className}` : slotClass(type)}
      style={style}
      // hads.js adds data-hads-* state attributes and fills the children,
      // possibly before hydration; that is expected.
      suppressHydrationWarning
      dangerouslySetInnerHTML={html}
    />
  );
}

/** A HADS ad slot. The markup matches the snippets on hads.dev/docs. */
export function HadsSlot({ refreshKey, type = "inline", ...props }: HadsSlotProps) {
  // Any change that alters the markup or the request remounts the element,
  // because hads.js binds each element once.
  const key = [type, props.topic ?? "", props.allowSelf ? 1 : 0, props.attribution ?? "", props.skeleton === false ? 0 : 1, refreshKey ?? ""].join("|");
  return <SlotElement key={key} type={type} {...props} />;
}

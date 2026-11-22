import React, { useMemo, type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import { usePluginData } from "@docusaurus/useGlobalData";
import { slotClass, slotInnerHtml, type HadsSlotType } from "../../markup";
import type { NormalizedOptions } from "../../options";

export interface Props {
  type?: HadsSlotType;
  topic?: string;
  allowSelf?: boolean;
  attribution?: string;
  skeleton?: boolean;
  className?: string;
}

function SlotElement({ type, topic, allowSelf, attribution, skeleton, className }: Required<Pick<Props, "type">> & Props) {
  const html = useMemo(() => ({ __html: slotInnerHtml(type, { attribution, skeleton }) }), [type, attribution, skeleton]);
  return (
    <aside
      data-hads-slot={type}
      data-hads-topic={topic || undefined}
      data-hads-allow-self={allowSelf ? "" : undefined}
      className={className ? `${slotClass(type)} ${className}` : slotClass(type)}
      suppressHydrationWarning
      dangerouslySetInnerHTML={html}
    />
  );
}

/**
 * HADS ad slot. Use in MDX: `import HadsSlot from '@theme/HadsSlot';`.
 * Keyed by the current path, so client-side navigation mounts a fresh
 * element that hads.js fills with a new ad.
 */
export default function HadsSlot(props: Props): ReactNode {
  const { pathname } = useLocation();
  const global = usePluginData("docusaurus-plugin-hads") as NormalizedOptions | undefined;
  const type = props.type ?? "inline";
  const attribution = props.attribution ?? global?.attribution;
  const skeleton = props.skeleton ?? global?.skeleton ?? true;
  const key = [pathname, type, props.topic ?? "", props.allowSelf ? 1 : 0, attribution ?? "", skeleton ? 1 : 0].join("|");
  return <SlotElement key={key} {...props} type={type} attribution={attribution} skeleton={skeleton} />;
}

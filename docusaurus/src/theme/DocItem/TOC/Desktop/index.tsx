import React, { type ReactNode } from "react";
import Desktop from "@theme-init/DocItem/TOC/Desktop";
import type DesktopType from "@theme/DocItem/TOC/Desktop";
import type { WrapperProps } from "@docusaurus/types";
import { usePluginData } from "@docusaurus/useGlobalData";
import HadsSlot from "@theme/HadsSlot";
import type { NormalizedOptions } from "../../../../options";

type Props = WrapperProps<typeof DesktopType>;

export default function DesktopWrapper(props: Props): ReactNode {
  const opts = usePluginData("docusaurus-plugin-hads") as NormalizedOptions | undefined;
  const slot = opts?.tocAfter;
  if (!slot) return <Desktop {...props} />;
  return (
    // The classic TOC is position: sticky; keep the TOC + slot sticky together.
    <div className="hads-toc-after" style={{ position: "sticky", top: "calc(var(--ifm-navbar-height) + 1rem)" }}>
      <Desktop {...props} />
      <HadsSlot type={slot.type} topic={slot.topic} allowSelf={slot.allowSelf} />
    </div>
  );
}

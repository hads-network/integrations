import React, { type ReactNode } from "react";
import Footer from "@theme-init/DocItem/Footer";
import type FooterType from "@theme/DocItem/Footer";
import type { WrapperProps } from "@docusaurus/types";
import { usePluginData } from "@docusaurus/useGlobalData";
import HadsSlot from "@theme/HadsSlot";
import type { NormalizedOptions } from "../../../options";

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  const opts = usePluginData("docusaurus-plugin-hads") as NormalizedOptions | undefined;
  const slot = opts?.docAfter;
  return (
    <>
      <Footer {...props} />
      {slot ? (
        <div className="hads-doc-after margin-top--lg">
          <HadsSlot type={slot.type} topic={slot.topic} allowSelf={slot.allowSelf} />
        </div>
      ) : null}
    </>
  );
}

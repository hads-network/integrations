// Types for the theme component this plugin provides.
// Add "docusaurus-plugin-hads/theme-hads" to "types" in your tsconfig, or
// reference this file, to type `import HadsSlot from '@theme/HadsSlot'`.
declare module "@theme/HadsSlot" {
  import type { ReactNode } from "react";
  export interface Props {
    type?: "inline" | "card" | "row" | "teaser" | "rail";
    topic?: string;
    allowSelf?: boolean;
    attribution?: string;
    skeleton?: boolean;
    className?: string;
  }
  export default function HadsSlot(props: Props): ReactNode;
}

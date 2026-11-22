export type HadsSlotType = "inline" | "card" | "row" | "teaser" | "rail";
export interface HadsScriptProps {
  siteKey: string;
  baseUrl?: string;
}
export interface HadsSlotProps {
  type?: HadsSlotType;
  topic?: string;
  allowSelf?: boolean;
  attribution?: string;
  skeleton?: boolean;
  class?: string;
}
export declare const HadsScript: (props: HadsScriptProps) => any;
export declare const HadsSlot: (props: HadsSlotProps) => any;

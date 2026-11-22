import Link from "next/link";
import { HadsSlot } from "hads-react";
export default function Page() {
  return (<main><Link href="/docs/a">a</Link><HadsSlot type="card" /></main>);
}

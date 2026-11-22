import { HadsSlot } from "hads-react/next";
export function generateStaticParams() { return [{ slug: "a" }, { slug: "b" }]; }
export default async function Doc({ params }) {
  const { slug } = await params;
  return (<article><h1>{slug}</h1><HadsSlot type="inline" /></article>);
}

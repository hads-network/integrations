import { HadsScript, HadsSlot } from "hads-react/next";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <HadsSlot type="rail" topic="docs" />
        <HadsScript siteKey="EXAMPLE_KEY" />
      </body>
    </html>
  );
}

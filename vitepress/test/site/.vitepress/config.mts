import { defineConfig } from "vitepress";
import { hadsHead } from "vitepress-plugin-hads";
export default defineConfig({
  title: "HADS test",
  head: [...hadsHead({ siteKey: "EXAMPLE_KEY" })],
});

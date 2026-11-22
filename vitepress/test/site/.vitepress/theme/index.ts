import DefaultTheme from "vitepress/theme";
import { withHads } from "vitepress-plugin-hads/theme";
export default withHads(DefaultTheme, {
  docAfter: { type: "card", topic: "docs" },
  asideOutlineAfter: { type: "rail" },
});

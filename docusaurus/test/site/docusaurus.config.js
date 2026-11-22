module.exports = {
  title: "HADS test",
  url: "https://example.test",
  baseUrl: "/",
  onBrokenLinks: "throw",
  presets: [["classic", { docs: { routeBasePath: "/" }, blog: false, pages: false, theme: {} }]],
  plugins: [
    ["docusaurus-plugin-hads", { siteKey: "EXAMPLE_KEY", docAfter: { type: "card", topic: "docs" }, tocAfter: { type: "rail" } }],
  ],
};

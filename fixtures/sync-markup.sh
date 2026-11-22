#!/bin/sh
# Copy the canonical markup module into each JS integration.
set -e
cd "$(dirname "$0")"
for dest in ../react/src ../docusaurus/src ../vitepress/src; do
  cp markup.ts "$dest/markup.ts"
done

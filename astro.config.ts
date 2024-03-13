import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import simpleStackForm from "simple-stack-form";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), simpleStackForm()],
  output: "server",
  adapter: cloudflare(),
});

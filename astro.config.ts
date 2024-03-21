import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import simpleStackForm from "simple-stack-form";
import db from "@astrojs/db";
import { defineIntegration } from "astro-integration-kit";
import { addVirtualImportsPlugin } from "astro-integration-kit/plugins";
import node from "@astrojs/node";

const astroActionIntegration = defineIntegration({
  name: "astro:action",
  plugins: [addVirtualImportsPlugin],
  setup: () => ({
    async "astro:config:setup"({ addVirtualImports }) {
      addVirtualImports({
        "simple:action": `
        let actionFetchers = {};
        // TODO: figure out scraping the action names
        // without bundling the server file into the client
        const actionNames = ['buyTicket'];
        for (const action of actionNames) {
          console.log('action::', action);
          const searchParams = new URLSearchParams();
          searchParams.set('actionId', action);
          const url = '?' + searchParams;
          actionFetchers[action] = async (formData) => {
            const response = await fetch(url, {
              method: 'POST',
              body: formData,
              headers: {
                'Accept': 'application/json',
              }
            });
            if (response.headers.get('Content-Type')?.startsWith('application/json')) {
              return response.json();
            }
            throw new Error('Unexpected response');
          };
          actionFetchers[action].toString = () => url;
        }

        export const buyTicket = actionFetchers.buyTicket;
        `,
      });
    },
  }),
});

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), simpleStackForm(), db(), astroActionIntegration()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});

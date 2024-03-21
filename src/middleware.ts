import { defineMiddleware } from "astro:middleware";
import { ReadableStream } from "node:stream/web";
import { ActionPromise, ActionStore, action } from "./action";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.action = action;

  const actionId = new URL(context.request.url).searchParams.get("action-id");
  if (!actionId) return next();

  if (!isFormRequest(context.request)) {
    return next();
  }

  const formData = await context.request.clone().formData();

  return ActionStore.run({ id: actionId, formData }, async () => {
    try {
      await next();
    } catch (e) {
      if (e instanceof ActionPromise) {
        const res: unknown = await e.run(formData);
        if (res instanceof Response) return res;
        return new Response(JSON.stringify(res), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      throw e;
    }
    // If an action id was sent but no action claims it, return a 400.
    return new Response(null, { status: 400 });
  });
});

const formContentTypes = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
];

function isFormRequest(request: Request) {
  return formContentTypes.some((t) =>
    request.headers.get("content-type")?.startsWith(t)
  );
}

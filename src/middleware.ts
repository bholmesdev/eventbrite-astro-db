import { defineMiddleware } from "astro:middleware";
import { ReadableStream } from "node:stream/web";
import { ActionResponse, ActionStore } from "./action";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  const actionId = new URL(context.request.url).searchParams.get("action-id");
  if (!actionId) return next();

  if (!isFormRequest(context.request)) {
    return next();
  }

  const formData = await context.request.clone().formData();

  return ActionStore.run({ id: actionId, formData }, async () => {
    try {
      return await next();
    } catch (e) {
      if (e instanceof ActionResponse) {
        return e;
      }
      throw e;
    }
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

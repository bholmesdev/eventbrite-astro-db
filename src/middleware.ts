import { defineMiddleware } from "astro:middleware";
import { ReadableStream } from "node:stream/web";
import * as _actions from "./actions";

const actions = _actions as Record<string, (formData: FormData) => unknown>;

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  const actionId = new URL(context.request.url).searchParams.get("actionId");
  if (!actionId || !(actionId in actions)) return next();

  const action = actions[actionId];

  if (!isFormRequest(context.request)) {
    return next();
  }

  const formData = await context.request.clone().formData();
  const res = await action(formData);

  if (res instanceof Response) return res;

  if (context.request.headers.get("accept")?.startsWith("application/json")) {
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return next();
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

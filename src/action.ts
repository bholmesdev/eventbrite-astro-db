import { AsyncLocalStorage } from "node:async_hooks";

export type ActionData = {
  id: string;
  formData: FormData;
};

export const ActionStore = new AsyncLocalStorage<ActionData>();

// TODO: figure out stable id generation across renders.
// Something like simple:scope to pull the file where the action was declared.
const HARDCODED_ID = "action-id";

export class ActionResponse extends Response {
  constructor(
    body?: BodyInit | null | undefined,
    init?: ResponseInit | undefined
  ) {
    super(body, init);
  }
}

export async function defineAction<
  T extends (formData: FormData) => MaybePromise<unknown>
>(fn: T): Promise<string> {
  const action = ActionStore.getStore();
  if (action?.id !== HARDCODED_ID) return `?action-id=${HARDCODED_ID}`;

  const res: unknown = await fn(action.formData);
  if (res instanceof Response) {
    throw res;
  } else {
    console.log("res", res);
    throw new ActionResponse(JSON.stringify(res), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

type MaybePromise<T> = T | Promise<T>;

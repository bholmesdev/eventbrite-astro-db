import { AsyncLocalStorage } from "node:async_hooks";

export type ActionData = {
  id: string;
  formData: FormData;
};

export const ActionStore = new AsyncLocalStorage<ActionData>();

// TODO: figure out stable id generation across renders.
// Something like simple:scope to pull the file where the action was declared.
const HARDCODED_ID = "action-id";

export class ActionPromise {
  constructor(private fn: (formData: FormData) => unknown) {}

  async run(formData: FormData) {
    return this.fn(formData);
  }
}

export function defineAction<
  T extends (formData: FormData) => MaybePromise<unknown>
>(fn: T): string {
  const action = ActionStore.getStore();
  if (action?.id !== HARDCODED_ID) return `?action-id=${HARDCODED_ID}`;

  throw new ActionPromise(fn);
}

type MaybePromise<T> = T | Promise<T>;

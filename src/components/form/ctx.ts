import type { FormValidator } from "simple:form";
import { createContext } from "../context";
import type { WritableAtom } from "nanostores";

export type FormStatus = "idle" | "validating" | "errored";
export type FormContext = {
  validator: FormValidator;
  status: WritableAtom<FormStatus>;
};

export const formContext = createContext<FormContext | undefined>(undefined);

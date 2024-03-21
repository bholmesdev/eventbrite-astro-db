/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="simple-stack-form/types" />
declare namespace App {
  interface Locals {
    action: typeof import("./action").action;
  }
}

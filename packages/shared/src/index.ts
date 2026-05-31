// @petster/shared — the single source of truth for the Petster Payload schema.
// Consumed by both runtimes: apps/cms (admin + REST/GraphQL) and apps/web (public
// site via the Local API). Import the config from "@petster/shared/config".

export { default as config } from "./payload.config";
export * from "./payload-types";

// Re-export the shared Payload schema so the existing `@payload-config` alias
// (tsconfig paths → ./src/payload.config.ts) keeps resolving. The real config
// lives once in @goodpet/shared and is transpiled via next.config transpilePackages.
export { default } from "@goodpet/shared/config";

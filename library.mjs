import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import permissionsPlugin from "@rello-platform/eslint-plugin-permissions";
import slugsPlugin from "@rello-platform/eslint-plugin-slugs";
import platformRulesPlugin from "@rello-platform/eslint-plugin-platform-rules";

const eslintConfig = defineConfig([
  // Libraries don't ship a Next runtime, so the parser comes from
  // @typescript-eslint/parser directly (the /next variant gets it
  // transitively via eslint-config-next/typescript). Applies to TS
  // sources only; JS files fall back to eslint's default espree parser.
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tsParser,
    },
  },
  // @rello-platform/slugs/no-legacy-literal — forbid hardcoded legacy slug
  // literals (homeready, HOMESTRETCH, MarketIntel, scout, etc.). Canonical
  // hyphenated forms live in @rello-platform/slugs; UPPERCASE_UNDERSCORE
  // routing identifiers (HOME_READY, OPEN_HOUSE_HUB, MILO_ENGINE) are the
  // legitimate SourceAppIdentifier namespace and are not flagged.
  {
    plugins: { "@rello-platform/slugs": slugsPlugin },
    rules: { "@rello-platform/slugs/no-legacy-literal": "error" },
  },
  // @rello-platform/permissions/no-string-permission — forbid string-literal
  // permission slugs anywhere except the canonical PERMISSION_SLUGS literal
  // tuple in @rello-platform/permissions itself. Permission slugs MUST be
  // imported from @rello-platform/permissions to keep the PermissionSlug
  // compile-time type and runtime PERMISSION_SLUGS array in lockstep.
  {
    plugins: { "@rello-platform/permissions": permissionsPlugin },
    rules: { "@rello-platform/permissions/no-string-permission": "error" },
  },
  // @rello-platform/platform-rules/* — eight rules codifying drift signals
  // from PLATFORM-PATTERNS-CATALOG.md. Same severities as /next consumers.
  // Path-scoped rules (no-inline-tab-arrays, no-redeclared-api-response-types,
  // no-fixture-data-when-upstream-unshipped, no-env-var-bearer-fallback) only
  // fire when their target file globs hit — most library-shaped consumers
  // never touch those paths, so the additional rules are no-ops there.
  // Universal-floor rules (no-empty-catches, canonical-slug-imports,
  // no-process-env-secret-compare, lead-not-contact) DO fire across library
  // code and are the primary value-add for /library consumers.
  {
    plugins: { "@rello-platform/platform-rules": platformRulesPlugin },
    rules: {
      "@rello-platform/platform-rules/no-empty-catches": "error",
      "@rello-platform/platform-rules/canonical-slug-imports": "error",
      "@rello-platform/platform-rules/no-process-env-secret-compare": "error",
      "@rello-platform/platform-rules/no-env-var-bearer-fallback": "error",
      "@rello-platform/platform-rules/no-inline-tab-arrays": "warn",
      "@rello-platform/platform-rules/no-redeclared-api-response-types": "warn",
      "@rello-platform/platform-rules/no-fixture-data-when-upstream-unshipped": "warn",
      "@rello-platform/platform-rules/lead-not-contact": "warn",
    },
  },
  // Tests and fixtures may legitimately reference legacy forms (verifying
  // the backward-compat read path, the LEGACY_ALIASES table, etc.) and
  // historical permission strings (audit logs, regression tests). Stylistic
  // platform-rules also off in tests — security + architecture rules stay on.
  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/__tests__/**",
      "**/__fixtures__/**",
    ],
    rules: {
      "@rello-platform/slugs/no-legacy-literal": "off",
      "@rello-platform/permissions/no-string-permission": "off",
      "@rello-platform/platform-rules/no-empty-catches": "off",
      "@rello-platform/platform-rules/lead-not-contact": "off",
      "@rello-platform/platform-rules/no-fixture-data-when-upstream-unshipped": "off",
    },
  },
]);

export default eslintConfig;

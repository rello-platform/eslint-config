import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import permissionsPlugin from "@rello-platform/eslint-plugin-permissions";
import slugsPlugin from "@rello-platform/eslint-plugin-slugs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
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
  // Tests and fixtures may legitimately reference legacy forms (verifying
  // the backward-compat read path, the LEGACY_ALIASES table, etc.) and
  // historical permission strings (audit logs, regression tests).
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
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

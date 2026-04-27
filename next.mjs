import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
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
  // Tests and fixtures may legitimately reference legacy forms (verifying
  // the backward-compat read path, the LEGACY_ALIASES table, etc.).
  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/__tests__/**",
      "**/__fixtures__/**",
    ],
    rules: { "@rello-platform/slugs/no-legacy-literal": "off" },
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

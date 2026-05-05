import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import permissionsPlugin from "@rello-platform/eslint-plugin-permissions";
import slugsPlugin from "@rello-platform/eslint-plugin-slugs";
import platformRulesPlugin from "@rello-platform/eslint-plugin-platform-rules";

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
  // @rello-platform/platform-rules/* — eight rules codifying drift signals
  // from PLATFORM-PATTERNS-CATALOG.md (per SPEC-PLATFORM-LINT-RULES-AND-HOOKS).
  // Severities split: 4 error (universal floor + Rule I + canonical slug
  // arrays), 4 warn (Rule G + Rule E + Rule L heuristic + lead-not-contact
  // heuristic). Severity ramp warn → error for the graced rules is gated on
  // Kelly authorization OR 14-day soak per spec §Phase 3.C.
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
  // historical permission strings (audit logs, regression tests). Select
  // platform-rules also turn off in tests: empty catches + lead-not-contact
  // + fixture-data heuristic are stylistic discipline that legitimately
  // diverges in test code. Rule I (no-process-env-secret-compare +
  // no-env-var-bearer-fallback), canonical-slug-imports, no-inline-tab-arrays,
  // and no-redeclared-api-response-types stay enforced — security +
  // architecture invariants don't relax in tests.
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

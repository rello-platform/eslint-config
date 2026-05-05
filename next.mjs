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
  //
  // Severity table (v0.6.1 — adjusted per discovered violation reality):
  //   error (1):
  //     no-process-env-secret-compare  (Rule I — auth-fragmentation Phase
  //                                     3+4 already cleaned; error prevents
  //                                     regression)
  //   warn (7 — graced):
  //     no-empty-catches               (universal floor; demoted from error
  //                                     v0.6.0 → warn v0.6.1 because the
  //                                     production tree carries 200+ existing
  //                                     violations beyond spec assumption.
  //                                     Cleanup ships in F8 spec; flip back
  //                                     to error in F4 Phase 3.C ramp.)
  //     canonical-slug-imports         (universal floor; demoted same reason
  //                                     — 11 existing violations in seeders
  //                                     and audit scripts. Cleanup in F8.)
  //     no-env-var-bearer-fallback     (Rule I — admin/route.ts scope; demoted
  //                                     because heuristic detector flags
  //                                     legitimate non-Bearer env reads in
  //                                     route handlers that also call
  //                                     validateApiKey. Audit and promote in
  //                                     v0.2.0 of plugin per spec §F7.)
  //     no-inline-tab-arrays           (Rule G; warn permanent until ramp)
  //     no-redeclared-api-response-types  (Rule E; warn permanent until ramp)
  //     no-fixture-data-when-upstream-unshipped  (Rule L heuristic; warn
  //                                               permanent — human-judged)
  //     lead-not-contact               (heuristic; warn until F1 cleanup ramps)
  //
  // Severity ramp warn → error gated on Kelly authorization OR 14-day soak
  // per spec §Phase 3.C, with F8 production-tree cleanup as prerequisite for
  // no-empty-catches + canonical-slug-imports.
  {
    plugins: { "@rello-platform/platform-rules": platformRulesPlugin },
    rules: {
      "@rello-platform/platform-rules/no-empty-catches": "warn",
      "@rello-platform/platform-rules/canonical-slug-imports": "warn",
      "@rello-platform/platform-rules/no-process-env-secret-compare": "error",
      "@rello-platform/platform-rules/no-env-var-bearer-fallback": "warn",
      "@rello-platform/platform-rules/no-inline-tab-arrays": "warn",
      "@rello-platform/platform-rules/no-redeclared-api-response-types": "warn",
      "@rello-platform/platform-rules/no-fixture-data-when-upstream-unshipped": "warn",
      "@rello-platform/platform-rules/lead-not-contact": "warn",
    },
  },
  // Dev-only / non-production paths — turn ALL platform-rules off. These
  // surfaces are not the rules' target: smoke/verification scripts run once,
  // prisma seeders legitimately enumerate slug arrays, public/sw.js is
  // service-worker boilerplate. Production-quality discipline applies to
  // src/ tree, not to scripts/ or seeders.
  {
    files: [
      "scripts/**",
      "scripts-ad-hoc/**",
      "prisma/seed-*.ts",
      "prisma/seed-*.js",
      "public/**/*.js",
    ],
    rules: {
      "@rello-platform/platform-rules/no-empty-catches": "off",
      "@rello-platform/platform-rules/canonical-slug-imports": "off",
      "@rello-platform/platform-rules/no-process-env-secret-compare": "off",
      "@rello-platform/platform-rules/no-env-var-bearer-fallback": "off",
      "@rello-platform/platform-rules/no-inline-tab-arrays": "off",
      "@rello-platform/platform-rules/no-redeclared-api-response-types": "off",
      "@rello-platform/platform-rules/no-fixture-data-when-upstream-unshipped": "off",
      "@rello-platform/platform-rules/lead-not-contact": "off",
    },
  },
  // Tests and fixtures may legitimately reference legacy forms (verifying
  // the backward-compat read path, the LEGACY_ALIASES table, etc.) and
  // historical permission strings (audit logs, regression tests). Select
  // platform-rules also turn off in tests: empty catches + lead-not-contact
  // + fixture-data heuristic are stylistic discipline that legitimately
  // diverges in test code. Rule I (no-process-env-secret-compare),
  // canonical-slug-imports, no-inline-tab-arrays, and
  // no-redeclared-api-response-types stay enforced — security +
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

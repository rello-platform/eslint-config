# @rello-platform/eslint-config

Canonical ESLint config for the Rello platform. Single source of truth for the slim Next.js baseline plus the `@rello-platform/slugs/no-legacy-literal` rule.

## Why an npm package (not a reusable workflow / template)

A workflow template only fires at scaffolding time — once a repo is forked, drift is on the contributor. A versioned npm package (with a tag-driven publish) is the durable shape: each consumer pins a version, dependabot surfaces updates, and one upgrade lands across every consumer rather than N copy-paste edits.

Mirrors the adoption shape of `@rello-platform/sentry-init`, `@rello-platform/api-client`, `@rello-platform/permissions`, `@rello-platform/slugs`, etc.

## Consumption shim

Each consumer's `eslint.config.mjs` is 1–3 lines:

```js
import baseConfig from "@rello-platform/eslint-config/next";

export default baseConfig;
```

If a consumer needs repo-specific overrides (extra ignores, test allowlists), spread the base and append:

```js
import baseConfig from "@rello-platform/eslint-config/next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...baseConfig,
  {
    files: ["scripts/**"],
    rules: { "no-console": "off" },
  },
]);
```

## What's included

- `eslint-config-next/core-web-vitals` (Next.js + a11y baseline)
- `eslint-config-next/typescript` (TypeScript rules)
- `@rello-platform/slugs/no-legacy-literal` (`error` on `homeready` / `HOMESTRETCH` / `MarketIntel` / `scout` / etc., per platform-wide canonical-slug enforcement; off for `**/*.test.{ts,tsx}` and `**/__fixtures__/**`)
- Default ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

## Turning on the brand rule (`no-legacy-brand-in-visible-text`)

Available from v0.14.0 (plugin v0.6.0) and off by default; v0.14.2 carries plugin v0.6.1 (compounds, decoded entities/escapes, component props, Error messages; RALLYROO RA-02/03). A repo turns it on in its own `eslint.config.mjs`, in the PR that clears its visible "Rello" copy. The fix the rule asks for is `PLATFORM_BRAND.name` from `@rello-platform/slugs` v0.14.0 or later.

```js
import baseConfig from "@rello-platform/eslint-config/next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...baseConfig,
  {
    rules: {
      "@rello-platform/platform-rules/no-legacy-brand-in-visible-text": [
        "error",
        { allow: ["src/test/**"] }, // optional: file globs (**, *, ?) for genuine exceptions
      ],
    },
  },
]);
```

Use eslint-config **v0.14.2 or later** (v0.14.1 is plugin 0.6.0; v0.13.2 and v0.14.0 pin the plugin by tag, and npm keeps an older locked plugin on a bump). After installing, check that `node -e "console.log(require('@rello-platform/eslint-plugin-platform-rules/package.json').version)"` prints `0.6.1`.

### The second guard: served content (`brand:scan`)

Lint sees JS/TS only. Copy a site serves straight from files (`public/*.json`, `*.md`, `*.html`, the web manifest) needs the plugin's `brand-content-scan` CLI, run as a package script. It is not a hook:

```json
"scripts": {
  "brand:scan": "brand-content-scan"
}
```

Default globs `public/**/*.{json,md,mdx,txt,html,webmanifest}` and `src/**/*.{json,md,mdx}`; exit 0 clean, 1 hits (printed as `file:line`), 2 unreadable. Exceptions go in `.brand-scan-allow` (one file glob per line). Use the bin name as shown: if the plugin is missing it fails with 127, while `node node_modules/…/brand-content-scan.js` would exit 1, the same code as "hits". See the plugin README.

The plugin is already registered by the base config, so add the rule line only, never a second `plugins` entry. Tests, specs and fixtures are exempt by file name; see the plugin README for the full exempt list.

## Peers

Consumers must already have:

- `eslint` (^9)
- `eslint-config-next` (^16.1)

The slug plugin (`@rello-platform/eslint-plugin-slugs`) ships transitively as a dependency of this package — consumers do not install it directly.

## Installing from GitHub Packages

The package lives in the GitHub Packages registry. Each consumer repo needs `.npmrc`:

```
@rello-platform:registry=https://npm.pkg.github.com
```

CI / Railway / local installs use a `read:packages`-scoped token via `NODE_AUTH_TOKEN` or `NPM_TOKEN` (see `project_rello_platform_npm_token_strategy.md`).

## Publishing (maintainers)

Tag-driven publish via `.github/workflows/publish.yml`:

```
git tag v0.1.0
git push origin v0.1.0
```

The workflow verifies tag matches `package.json#version` and publishes to GitHub Packages using the workflow-provisioned `GITHUB_TOKEN`.

## Severity ramp

`v0.7.0` (2026-05-06) — `no-empty-catches`, `canonical-slug-imports`, and `no-env-var-bearer-fallback` ramped from `warn` to `error` after F8 production-tree cleanup (Waves 1+2) drained the backlog across Rello + 13 siblings. See `CHANGELOG.md` and `BUILT/SPEC-PLATFORM-LINT-PRODUCTION-CLEANUP.md` §Wave 3.

## Provenance

PA-051 (April 2026 Platform Audit) — six byte-identical "slim" `eslint.config.mjs` copies + Rello's slug-rule variant consolidated into this single shared package. Companion: `~AUDITS/April2026 Platform Audit/PA-051-ESLINT-CONFIG-CANONICAL-TEMPLATE-042626-PARTIAL.md`.

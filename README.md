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

## Provenance

PA-051 (April 2026 Platform Audit) — six byte-identical "slim" `eslint.config.mjs` copies + Rello's slug-rule variant consolidated into this single shared package. Companion: `~AUDITS/April2026 Platform Audit/PA-051-ESLINT-CONFIG-CANONICAL-TEMPLATE-042626-PARTIAL.md`.

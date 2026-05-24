# Changelog

## v0.10.0 (2026-05-24) -- Wire no-module-eval-cross-app-clients rule

- Added `@rello-platform/platform-rules/no-module-eval-cross-app-clients` at `error` severity in both `next.mjs` and `library.mjs`
- Scripts/seed + test/fixture override blocks turn it off (consistent with sibling rules)
- Bumped plugin pin to Phase 1 SHA `abf81678366b5c93a48d048a2716a39643e95122` (plugin v0.3.0 with 9th rule)
- Retroactively tagged v0.8.0 (769d401) and v0.9.0 (a078583)

## v0.8.0 / v0.9.0 -- Retroactive tags

- v0.8.0 (769d401): no-console rule
- v0.9.0 (a078583): no-wildcard-apikey-permissions rule
- Tags were missing; retroactively created in this release cycle

## v0.9.0 — 2026-05-18 — Wire `no-wildcard-apikey-permissions` rule (Layer 1 of WILDCARD-APIKEY-DEPRECATION DISPATCH-8)

Wires the new `@rello-platform/slugs/no-wildcard-apikey-permissions` rule (added in `@rello-platform/eslint-plugin-slugs` v0.3.0) into both `next.mjs` and `library.mjs` at severity `error`. The rule rejects `permissions: ["*"]` (or any permissions array containing the `"*"` wildcard literal) on objects shaped like ApiKey row construction — module-scope literals with sibling `appSource` / `targetApp` / etc., or Prisma write-call payloads under `data` / `create` / `update` (covers `apiKey.create` / `apiKey.update` / `apiKey.upsert`).

Layer 1 of the 3-layer defense-in-depth from `WILDCARD-APIKEY-DEPRECATION-CROSS-PLATFORM-SWEEP` DISPATCH-8. Layers 2-3 (Prisma extension + Postgres CHECK constraint) land in the companion Rello-side PR.

- `@rello-platform/eslint-plugin-slugs` pin bumped to v0.3.0 SHA `521887937aae0df7873a644b883f83e853c1c5b6`.
- Test-override blocks (`**/*.test.{ts,tsx}`, `**/*.spec.{ts,tsx}`, `**/__tests__/**`, `**/__fixtures__/**`) turn the rule `off` — tests for the Prisma extension + DB CHECK construct ApiKey-shaped fixtures with `permissions: ["*"]` specifically to assert the guard throws. Production-tree discipline only.

Mirrored block (Kelly Option A) — same rule applied to both `next.mjs` and `library.mjs`.

Wildcard permissions bypass per-pair least-privilege isolation enforced by `validateApiKey` + `hasPermission`. All 7 active wildcard rows in Rello prod Neon were retired by DISPATCHES 1-7 of the workstream; the rule prevents the class from being re-introduced. See `~API-KEY-LIFECYCLE-README.md` §9.2 + §13 + DL-SPEC-Q5/Q6.

Adoption shape: each consumer spoke bumps the `@rello-platform/eslint-config` git-tag pin from `v0.8.0` → `v0.9.0` (explicit-ref form per `feedback-npm-github-tag-stale-resolve`). The post-DISPATCH 1-7 production tree has zero wildcard violations remaining, so the bump is safe to land atomically with no preceding sweep.

## v0.8.0 — 2026-05-18 — Add `no-console` rule (universal-floor enforcement)

Promotes the universal-floor rule body — "no `console.log` in production (use `console.error` / `console.warn`)" — from inherited-via-CLAUDE.md guidance to durable lint-time enforcement.

- `no-console` — added at severity `error` with `{ allow: ["warn", "error", "info", "debug"] }`. Allow list covers operational signals (`warn` / `error`) plus structured-logger primitives (`info` / `debug`). Each consumer spoke's `src/lib/**/logger*` files were verified at compose time to use only the allow-list methods — no raw `console.log` inside logger primitives.

Mirrored block (Kelly Option A) — same rule applied to both `next.mjs` and `library.mjs`. Override blocks turn the rule `off` for `scripts/**`, `scripts-ad-hoc/**`, `prisma/seed-*.{ts,js}`, `public/**/*.js` (dev-only) and `**/*.test.{ts,tsx}`, `**/*.spec.{ts,tsx}`, `**/__tests__/**`, `**/__fixtures__/**` (test paths) — production-tree discipline only.

Per `DISCOVERED-CROSS-SPOKE-CONSOLE-LOG-DRIFT-051626` DL3. Adoption shape: each consumer spoke (THS / Rello / OHH / NS / Drumbeat) bumps the `@rello-platform/eslint-config` git-tag pin from `v0.7.0` → `v0.8.0` in the same PR that lands its `console.log` retro-sweep at zero `src/app/api/**/*.ts` instances. Sweep + pin-bump are atomic per Rule J — landing the pin against a non-zero baseline would surface ~185 cross-spoke errors and block CI.

## v0.7.0 — 2026-05-06 — Severity ramp warn → error (F8 Wave 3)

Ramps three platform-rules from `warn` back to `error` after F8 production-tree cleanup drained the violation backlog across Rello + 13 sibling consumer repos:

- `@rello-platform/platform-rules/no-empty-catches` — `warn` → `error`
- `@rello-platform/platform-rules/canonical-slug-imports` — `warn` → `error`
- `@rello-platform/platform-rules/no-env-var-bearer-fallback` — `warn` → `error`

Mirrored block (Kelly Option A) — same flips applied to both `next.mjs` and `library.mjs`. Dev-only / test override blocks (`scripts/**`, `prisma/seed-*.ts`, `**/*.test.ts`, `**/__fixtures__/**`) unchanged — those still resolve to `off` for these rules.

Gated on F8 Cleanup Waves 1+2 — Rello (Wave 1) plus 13 sibling cleanups (Wave 2) all closed with zero F8-scope error-severity violations remaining.

**Sibling-bump fan-out:** Wave 4 dispatches all 14 consumer repos to bump `@rello-platform/eslint-config` git-tag pin from `v0.6.x` → `v0.7.0` (explicit-ref form per `feedback-npm-github-tag-stale-resolve`). Lockfile rewrite to `https` form per Phase 1 PR-D Railway-ssh defense-in-depth.

Spec: `BUILT/SPEC-PLATFORM-LINT-PRODUCTION-CLEANUP.md` §Wave 3.

## v0.6.3 — Pin plugin deps to SHAs (was tags) to avoid Railway ssh ls-remote

## v0.6.x — Foundation grace warn-demotes for the three rules above (per spec §Phase 3.B)

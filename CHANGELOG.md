# Changelog

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

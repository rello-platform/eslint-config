# Changelog

## v0.14.2 (2026-11-25) -- Bump plugin to v0.6.1 (brand rule recall fixes + brand-content-scan CLI; RA-02/03/04)

- Plugin pin `#aecc2ed2...` (v0.6.0) -> `#f47569a14ccfa8a52fb084b29a2c0b00b084f627` (v0.6.1). Full-SHA pin, per the v0.14.1 rule.
- v0.6.1 changes only `no-legacy-brand-in-visible-text`, which is still **not wired** into `next` or `library` (opt-in per repo). It now reports compounds (`RelloCRM`, `Rello2`), decodes what renders (entities, JS escapes, zero-width splitters), reports `RELLO` in rendered JSX, reports any prop of a Capitalized component except key/ref/className/data-*, and reports Error/throw messages. Hub `src/`: 903 -> 925 reports (+22) for a repo that has the rule on.
- New in the plugin: `bin/brand-content-scan.js`, the served-content scan. Consumers add `"brand:scan"` (README, "The second guard").
- No other rule's code changed (`git diff v0.6.0 v0.6.1 -- lib` touches only `lib/brand-text.js` (new) and the brand rule). No severity or wiring change. A repo without the rule line sees no change.
- Lockfile: plugin entry hand-edited (git+https, version 0.6.1, the new `bin`), as in v0.14.0/v0.14.1.
- `eslint-config` is a devDep, so no Trigger.dev redeploy is owed (PLATFORM-PACKAGE-PIN-CONVENTION §7).

## v0.14.1 (2026-11-25) -- Pin the plugin by exact commit so a bump actually delivers it (RA-01)

- Plugin pin `#v0.6.0` -> `#aecc2ed2efb76a5ed3eae207b02ba532d46d90a7` (the same commit v0.6.0 tags). No code change.
- **Why.** npm only re-checks a locked transitive git dependency against its spec when the spec names a full 40-character commit (`@npmcli/arborist/lib/dep-valid.js`: `reqCommit = /^[a-fA-F0-9]{40}$/`). Any other committish (a tag) counts as "same repo, still valid". So a consumer bumping eslint-config kept its old plugin. Rello's lock @ `f47ebe75c` declares eslint-config 0.13.2 (plugin `#v0.5.3`) but still resolves the plugin to 0.5.1 / `eedaabc`. Reproduced in a fresh project: eslint-config v0.13.1 -> `npm install ...#v0.14.0` leaves plugin 0.5.1; the v0.14.1 tarball installed over that same lock moves it to 0.6.0 / `aecc2ed2`.
- v0.13.1 pinned by SHA and was correct. v0.13.2 and v0.14.0 pinned by tag and are affected; skip them.
- **Rule for future bumps:** pin every git dependency here by full commit SHA. Name the tag in the CHANGELOG, not in `package.json`.


## v0.14.0 (2026-11-25) -- Bump plugin to v0.6.0 (no-legacy-brand-in-visible-text available, opt-in)

- Bumped plugin pin `v0.5.3` -> `v0.6.0` (tag, commit `aecc2ed2`).
- v0.6.0 adds `no-legacy-brand-in-visible-text` (RALLYROO rename Phase 2): it reports "Rello"/"RELLO" and hand-typed "Rallyroo" spellings in visible strings, and asks for `PLATFORM_BRAND.name` from `@rello-platform/slugs` v0.14.0. **It is NOT wired into `next` or `library`.** Each consumer enables it at `"error"` in its own config, in the PR that clears its copy (README, "Turning on the brand rule").
- No other rule's code changed between plugin v0.5.3 and v0.6.0 (`git diff v0.5.3 v0.6.0 -- lib` touches only the new rule file). No severity or wiring change to either preset.
- Consumers still on eslint-config **v0.13.1** (plugin v0.5.1) also pick up v0.5.3's transitive `no-db-in-liveness` walk on this bump, at `error` in `next`. Measured on origin/main 2026-11-25, it newly flags HomeReady and TheHomeStretch (2 each, `src/app/api/health/route.ts` -> `@/lib/email/public-origin-health` / `@/lib/referral/suppression-contract` -> `@/lib/db`). The other 10 are unchanged.
- Lockfile: the plugin entry is hand-edited to `git+https`. `npm install` rewrites all three git deps to `git+ssh`, which the platform lockfile gate (`check-lockfile-ssh`) refuses. The root `version` was stale at 0.13.1 and is corrected.
- `eslint-config` is a devDep, so no Trigger.dev redeploy is owed (PLATFORM-PACKAGE-PIN-CONVENTION §7).

## v0.13.2 (2026-09-17) -- Bump plugin to v0.5.3 (no-db-in-liveness transitive import closure, A-111)

- Bumped plugin pin `eedaabc0` (eslint-plugin-platform-rules v0.5.1) -> `v0.5.3` (tag).
- v0.5.3 extends `no-db-in-liveness` to follow the **transitive import closure** of a liveness route's local imports (relative + `@/`), so a DB client reached through a helper (`route -> @/lib/health/collect -> @/lib/__plant__/deep -> @/lib/db`) is now caught -- the direct-import behavior is unchanged. Additive `dbInLivenessTransitive` message; the rule stays `error`.
- No severity/wiring change to the recommended config. `eslint-config` is a devDep, so no Trigger.dev redeploy is owed (PLATFORM-PACKAGE-PIN-CONVENTION §7). Consumers (Rello, Home Scout) arm the transitive walk on their next eslint-config bump; their pre-push repo-wide ESLint is the proof.

## v0.12.1 (2026-06-02) -- Broaden prisma dev-script override globs (seed.ts + backfill-* + migrate-*)

- Arming `require-tenantid-in-where` to error (v0.12.0) surfaced bare-tenant Prisma queries in `prisma/seed.ts`, `prisma/backfill-*.ts`, and `prisma/migrate-*.ts` -- legitimate full-table enumeration in one-off `npx tsx` dev scripts (run after a `db push`, never the request path), NOT a runtime tenant-isolation leak. These are exactly the dev-only/seeder class the override block was designed to exempt, but the original glob (`prisma/seed-*.ts`) caught only the *hyphenated* seeders and missed the unhyphenated entry seeder + the backfill/migrate siblings.
- Broadened the dev-only override `files` globs in both `next.mjs` and `library.mjs`: `prisma/seed-*.{ts,js}` -> `prisma/seed*.{ts,js}` (now covers `seed.ts`), plus added `prisma/backfill-*.{ts,js}` and `prisma/migrate-*.{ts,js}`. ALL platform-rules (not just require-tenantid) turn off there, consistent with the existing scripts/seed convention.
- No severity/wiring change to the recommended config -- require-tenantid-in-where stays `error`. After this fix, Rello's repo-wide `eslint .` (the husky pre-push lint gate) is green at the armed pin.

## v0.12.0 (2026-06-02) -- ARM require-tenantid-in-where warn -> error (Layer 1 forcing-function lock)

- Flipped `@rello-platform/platform-rules/require-tenantid-in-where` from `warn` to `error` in both `next.mjs` and `library.mjs` recommended configs -- the DECISION-WALK item-A forcing-function lock the locked ruling specified: "Arms to error (hard pre-push gate) once green."
- Green confirmed before arming: Rello drove all ~1367 AST-FAIL sites to 0 / `EXEMPT-UPSTREAM-VERIFIED` marker-exempt (Wave Final PR #296); pre-arm `npx eslint src` against Rello origin/main at v0.11.1 reported 0 `require-tenantid-in-where` occurrences repo-wide.
- A NEW bare-tenant `where`-clause query now hard-fails `eslint` / `next build` / the husky pre-push gate (no longer a non-gating warning).
- No severity change to the scripts/seed + test/fixture override blocks -- they stay `off`, matching the other ARMED rules (no-process-env-secret-compare, canonical-slug-imports, etc.).
- No plugin pin change (still `911dd5df` / plugin v0.4.1) -- this is a wiring-only severity bump. `eslint-config` is a devDep, so no Trigger.dev redeploy is owed (per PLATFORM-PACKAGE-PIN-CONVENTION §7).

## v0.11.1 (2026-06-01) -- Bump plugin to v0.4.1 (transaction-entry block-marker fix)

- Bumped plugin pin `c03d8431` -> `911dd5df` (eslint-plugin-platform-rules v0.4.1)
- v0.4.1 fixes `require-tenantid-in-where` block-marker recognition for the canonical transaction-entry convention (marker in the enclosing function above a `$transaction(...)` call now suppresses the nested cascade cluster). No severity/wiring change -- still `warn`.

## v0.11.0 (2026-06-01) -- Wire require-tenantid-in-where rule (Layer 1 tenantId enforcement)

- Added `@rello-platform/platform-rules/require-tenantid-in-where` at `warn` severity in both `next.mjs` and `library.mjs` -- Layer 1 of the 3-layer tenantId structural enforcement locked in `DECISION-WALK-LOCKED-ANSWERS-2026-06-01` item A
- Severity is `warn` (NOT `error`): the rule cannot arm to error until every AST-FAIL site (~779 across ~265 files at recon) is tenantId-filtered or `EXEMPT-UPSTREAM-VERIFIED` marker-exempt -- building the rule IS the forcing function driving the remaining waves to green
- Scripts/seed override turns it off (consistent with sibling rules); test/fixture override turns it off too (warn-severity, non-gating)
- Bumped plugin pin to `c03d8431691d0212ed6d3c1436e3c4e064683626` (plugin v0.4.0, 10th rule)

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

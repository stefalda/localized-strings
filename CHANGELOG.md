# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.2] - 2026-10-04

### Changed

- Modernized and slimmed down the development toolchain: ESLint 8 + Airbnb config
  → ESLint 10 with a [`typescript-eslint`](https://typescript-eslint.io/) flat
  config; Vite 6 → 8; Vitest 2 → 5; TypeScript 5.7 → 6.0.
- Tests run in the Node test environment instead of `jsdom` and mock the global
  `navigator` with `vi.stubGlobal`.
- `tsconfig.json` now sets `rootDir` explicitly (required by TypeScript 6).
- CI runs on Node 24 and is triggered for the `master` branch (it previously
  listened on `main`, so it never ran).

### Removed

- `eslint-config-airbnb-base`, `eslint-plugin-import` and `@types/node`
  dev dependencies, plus the legacy `.eslintrc.js` / `.eslint.rc` files.
- Dropped the unused `jsdom` test environment requirement.

> This release contains no runtime or public TypeScript API changes; the
> generated `lib/LocalizedStrings.d.ts` is identical to 2.1.1. The bundle is
> slightly smaller due to the newer bundler.

## [2.1.1] - 2026-10-04

### Added

- First-class generic TypeScript typings. `LocalizedStringsProps`,
  `LocalizedStringsOptions` and `LocalizedStringsMethods` are now exported, and
  `LocalizedStrings<T>` is generic, so `new LocalizedStrings<MyStrings>({ en })`
  exposes the string keys with their types ([#36](https://github.com/stefalda/localized-strings/issues/36)).
- A TypeScript usage example (`example/typescript/example.ts`).
- `LICENSE` file (MIT).

### Changed

- README "TypeScript support" section rewritten around the generic constructor,
  with the `LocalizedStringsMethods` interface documented as a fallback.
- README: added NativeScript 7+ and pre-7 usage examples.

### Fixed

- `LocalizedStringsMethods`, documented in the README, was not exported from the
  generated declarations since 2.0.0.

### Breaking (TypeScript only — runtime unchanged)

- The default export is now a value (`LocalizedStringsFactory`) rather than a
  class declaration. As a result the default import can no longer be used as a
  bare type (`const s: LocalizedStrings`) or extended
  (`class X extends LocalizedStrings`) in TypeScript. Use
  `LocalizedStringsMethods` or `LocalizedStrings<T>` for typing instead.

## [2.0.3] - 2025-01-12

### Changed

- Regenerated the published TypeScript declarations.

## [2.0.2] - 2025-01-12

### Fixed

- `formatString()` return type widened to `string | any[]` to match the runtime
  behavior.

## [2.0.1] - 2025-01-12

### Added

- A simple usage example.

## [2.0.0] - 2025-01-12

### Changed

- Migrated the build to Vite, producing ESM (`lib/LocalizedStrings.es.js`) and
  UMD (`lib/LocalizedStrings.umd.js`) bundles.
- Added the `exports` map, `main`/`module`/`types` entry points and a `files`
  allow-list.
- TypeScript declarations are now generated from the source with `tsc`
  (`lib/*.d.ts`).
- Rewrote the library and its tests in TypeScript.
- Replaced the Babel build and Jasmine test runner with Vite and Vitest.

## [1.0.0] - 2024-12-26

### Changed

- Migrated the package to ESM with CommonJS compatibility.

## Legacy (pre-1.0)

Versions `0.0.x`–`0.2.x` predate this changelog. See the git history and the
`v0.0.11` … `v0.2.4` tags for details.

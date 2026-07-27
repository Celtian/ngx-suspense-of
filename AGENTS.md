# AGENTS.md

This file provides repository-specific guidance for coding agents working in this project.

## Project overview

- This is an Angular 22 workspace managed with Bun.
- `projects/ngx-suspense-of/` contains the published library.
- `projects/demo/` contains the demo application and usage examples.
- `projects/ngx-suspense-of/src/public-api.ts` defines the package's public API.
- Unit tests use Vitest through Angular's `@angular/build:unit-test` builder.

## Environment

- Use Node.js 24, as specified by `.nvmrc`.
- Use Bun 1.3.14 for dependency management. Do not create an npm lockfile.
- Install dependencies with `bun ci`.
- The install hook generates `projects/demo/src/environments/version.ts`. This file is generated and
  gitignored; do not edit or commit it.

## Common commands

Run commands from the repository root.

```sh
bun run start                              # Serve the demo application
bun run build                              # Build the library for production
bun run build:demo                         # Build the demo for production
bun run test                               # Test both the library and demo
bun run ng test ngx-suspense-of            # Test only the library
bun run ng test demo                       # Test only the demo
bun run lint                               # Lint all projects
bun run check-circular-dependencies        # Check public APIs for circular imports
```

For a complete validation matching pull-request CI, run:

```sh
bun run lint
bun run check-circular-dependencies
bun run test
bun run build:demo
bun run build
```

## Code conventions

- Follow the existing standalone Angular component and directive patterns.
- Prefer Angular dependency injection with `inject()` where it matches nearby code.
- Keep TypeScript and Angular template checking strict; do not weaken compiler or lint settings to
  accommodate a change.
- Follow `.prettierrc`: two spaces, single quotes, semicolons, no trailing commas, and a 120-character
  print width.
- Keep imports and declarations consistent with neighboring files.
- Preserve the library's small dependency footprint. Do not add runtime dependencies without a clear
  requirement.
- Keep public symbols exported through `projects/ngx-suspense-of/src/public-api.ts`.

## Tests

- Add or update colocated `*.spec.ts` tests for behavior changes.
- Use Vitest globals such as `describe`, `it`, `expect`, and `vi`.
- Prefer deterministic tests. Use fake timers for delayed RxJS streams and restore real timers after
  each test.
- Test library behavior in `projects/ngx-suspense-of/`; update demo tests only when demo behavior changes.
- Run the narrowest relevant test target while developing, then run the full validation appropriate to
  the change.

## Documentation and public API changes

- Update the root `README.md` when usage, compatibility, or the public API changes.
- The root README is the source copied into the library package by `bun run script:sync-projects`; avoid
  editing `projects/ngx-suspense-of/README.md` independently.
- Maintain backwards compatibility unless the task explicitly calls for a breaking change.
- Do not manually edit versions or `CHANGELOG.md` as part of ordinary feature or fix work.

## Change discipline

- Keep changes scoped to the requested task and preserve unrelated working-tree changes.
- Do not commit generated output from `dist/`, `coverage/`, `.angular/`, or generated `version.ts` files.
- Do not run `bun run version`, `bun run postversion`, `release:*`, `publish:*`, or registry setup scripts unless
  the user explicitly requests a release or publication.
- Use Angular-style conventional commit messages when a commit is requested; commitlint enforces them.

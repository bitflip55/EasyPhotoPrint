# Release Checklist

## Fixed Workflow

This project uses a strict branch and release flow:

1. All development happens on `develop`.
2. `main` only receives reviewed merges from `develop`.
3. Stable release tags are created only on `main`.
4. After each stable release, `main` must be merged back into `develop`.

Do not skip the PR step and do not tag directly from `develop`.

## Development On `develop`

1. Work locally on `develop`.
2. Test locally on Linux.
3. Run:

```bash
npm run doctor
npm test
./node_modules/.bin/tsc -p tsconfig.app.json --noEmit
cargo check --manifest-path src-tauri/Cargo.toml
```

4. Push `develop` to GitHub.
5. Wait for the `Develop Build Artifacts` workflow to finish.
6. Verify the Linux, Windows and macOS artifacts if needed.

## PR To `main`

1. Open a PR from `develop` to `main`.
2. Wait for:
   - CodeRabbit
   - `Main PR Verify`
3. Fix all required findings on `develop`.
4. Push again to `develop`.
5. Merge only when CodeRabbit and all PR checks are green.

## Stable Release From `main`

1. Switch to `main`.
2. Pull the merged PR result:

```bash
git checkout main
git pull --ff-only origin main
```

3. Create the new version tag on `main`:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

4. Wait for the `Main Release` workflow to finish.
5. Verify the GitHub Release assets:
   - `.deb`
   - `.rpm`
   - `.msi`
   - `.dmg`

## Smoke Test On Fresh Ubuntu

1. Install the generated `.deb`.
2. Launch from the app launcher.
3. Import mixed image types.
4. Change format, orientation, rows and columns.
5. Export a multi-page PDF.
6. Print with `2` copies.

## After Release

1. Merge `main` back into `develop` immediately:

```bash
git checkout develop
git merge --no-edit main
git push origin develop
```

2. Confirm `develop` and `main` point to the same release commit before starting new work.

## Known Operational Notes

1. Printing relies on the system `lp` command.
2. Linux desktop icon caches may require a fresh install or launcher refresh to update icons.

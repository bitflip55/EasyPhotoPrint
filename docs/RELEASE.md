# Release Checklist

## Before Build

1. Verify `npm run doctor` passes on the release machine.
2. Verify `npm test` and TypeScript checks are green.
3. Verify `cargo check` is green.
4. Verify version in `package.json` and `src-tauri/tauri.conf.json`.
5. Verify icons and bundle metadata are final.

## Build

```bash
npm install
npm run build:linux
```

For day-to-day work:

1. Develop and test locally on `develop`.
2. Let GitHub Actions build Linux, Windows and macOS artifacts from `develop`.
3. Open a PR from `develop` to `main`.
4. Let CodeRabbit and the `main` verification workflow review that PR.
5. Merge the PR.
6. Tag `main` with the next stable version.

## Smoke Test On Fresh Ubuntu

1. Install the generated `.deb`.
2. Launch from the app launcher.
3. Import mixed image types.
4. Change format, orientation, rows and columns.
5. Export a multi-page PDF.
6. Print with `2` copies.

## Publish

1. Tag the release in git.
2. Create a GitHub Release.
3. Upload:
   - `.deb`
   - `.rpm`
   - `.msi`
   - `.dmg`
4. Add installation notes for Ubuntu.

## Known Operational Notes

1. Printing relies on the system `lp` command.
2. Linux desktop icon caches may require a fresh install or launcher refresh to update icons.

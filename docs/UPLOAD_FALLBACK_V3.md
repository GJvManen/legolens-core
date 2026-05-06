# LegoLens Core v3.0.0 upload fallback

The v3.0.0 release can be published through normal GitHub repository commits instead of a single ZIP upload.

## Why this fallback exists

Large artifact upload and some inline asset upload attempts can fail in browser or connector flows. The reliable route is to keep release documentation and lightweight interface examples as regular repository files.

## Expected v3.0.0 files

- `README.md`
- `package.json`
- `.github/workflows/ci.yml`
- `docs/RELEASE_NOTES_V3_FINAL.md`
- `docs/QC_REPORT_V3_FINAL.md`
- `docs/screenshots/v3_0/README.md`
- `docs/screenshots/v3_0/01-overview-dashboard.svg`
- `docs/screenshots/v3_0/02-content-updates-run-all.svg`
- `docs/screenshots/v3_0/03-media-library-attribution.svg`

## Recommended GitHub release route

1. Keep source, documentation and interface examples in the repository as commits.
2. Protect `main` with pull requests and the `Validate release` status check.
3. Create or update the release tag `v3.0.0` from the final protected `main` commit.
4. If release asset upload fails, use GitHub's automatically generated source ZIP and tar.gz archives for the tag.

## Manual local fallback

```bash
git pull origin main
git checkout -b release/v3.0.0-final
npm install
npm test
npm run browser:smoke
npm run release:check
git tag v3.0.0
git push origin v3.0.0
```

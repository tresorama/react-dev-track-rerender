# react-dev-track-rerender

React Component that Tracks Mount and Rerender

## Documentation

Refer to [readme](./packages//dev-track-rerender/README.md)

## How to release

We use [changeset](https://github.com/changesets), and (for now) we don't automate the release process, but run it from local machine.

1. In your feature branch, commit code, and open a PR
2. When you are ready to merge, run from root `pnpm changeset` and follow the wizard.  
   This will:
   - Create a file `.changeset/xxx.md` with data for the change.  
   - Commit this file in the feature branch.
   ⚠️ Nothing is released to NPM yet.
3. Puh the new commit, and merge the PR  
   This enure that every md files in `.changeset` are included in the `main` branch now.  
   ⚠️ Nothing is released to NPM yet.
4. Go to `main` branch, do a `git pull`  
   This will ensure that the `main` branch is up-to-date.
5. From root, run `pnpm changeset version`  
   This will:
   - Read all .changeset/*.md files and calculate the new versions for all packages.
   - Bump version in package.json files accordingly.
   - Update CHANGELOG.md for each package.
   - Delete the .changeset/*.md files used for this release.
   - Commit the version bump to `main`.
   ⚠️ Packagege are not released to NPM yet, but package.json are updated.
6. From root run `pnpm changeset publish`
   This will publish all packages to npm
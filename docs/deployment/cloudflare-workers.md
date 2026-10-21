# LifeHub — Cloudflare Workers deployment (preview)

## Current implementation status

The repo currently contains a **Today Dashboard prototype**, not a fully connected production Life OS. Try it at `/today?demo=1`. The default `/today` intentionally shows an API-not-connected state. The demo stores Quick Capture drafts in the browser session only; it is not a secure multi-user account backend.

The deployment uses **Next.js + OpenNext Cloudflare adapter**. Cloudflare's general guidance as of October 2026 recommends vinext for *new* apps; this repo is already an existing Next.js App Router project, so OpenNext is the lower-risk incremental adaptation for the current prototype. Evaluate vinext migration separately.

## Required Cloudflare dashboard setup

Cloudflare Workers & Pages → Worker `lifehub` → Builds → Git integration: `Irsan-R/LifeHub`.

| Field | Value |
| --- | --- |
| Project / Worker name | `lifehub` |
| Production branch | `main` |
| Build command | `npm install --no-audit --no-fund && npm run cf:build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Preview command | `npx opennextjs-cloudflare upload` (only if branch previews are desired) |
| Root directory | repository root |
| Node version | 22 (set `NODE_VERSION=22` if your build image does not default to 22) |

**Important:** `npm run build` alone produces a Next.js build, not the Cloudflare Worker artifact. `npx wrangler deploy` alone is not the documented deployment command for this adapter. Use the OpenNext commands above.

### After connecting the repo

1. Merge the implementation PR to `main` **only after CI succeeds**.
2. Confirm Cloudflare Workers Builds is enabled and watches `main`; the integration should build and deploy automatically on each push/merge.
3. Inspect the Workers Builds log. Verify the build produced `.open-next/worker.js`.
4. Open the Worker URL provided by Cloudflare and visit `/today?demo=1`.
5. Check navigation, Search, Quick Capture and mobile rendering.
6. Set branch protection on `main` to require the CI check before merge.

**Avoid duplicate deployments:** This repository's GitHub Actions workflow builds/tests but **does not deploy**. Cloudflare Workers Builds is the only production deployer. Do not add a second GitHub deploy workflow unless the Cloudflare Git integration is disabled.

## Security

- Never commit Cloudflare API tokens, account IDs, service-role keys, database URLs or `.dev.vars`.
- Use Cloudflare dashboard build secrets and Worker runtime secrets for sensitive configuration. Public `NEXT_PUBLIC_*` values are not secret.
- Grant Cloudflare Git integration least-privilege repository access.
- Protect `main`, require PR review + passing CI. Preview deployments are not private by default; protect with Cloudflare Access if they contain nonpublic data.
- Do not expose production personal data in demo fixtures.
- Authentication, data isolation, authorization and database security **are not implemented** by the Today prototype. Do not store sensitive user data until those controls are added.
- Cloudflare account permissions, secrets, domain and actual deploy status cannot be audited from the setup screenshot alone.

## Dependency reproducibility

This PR adds OpenNext/Wrangler dependencies in package.json, but package-lock.json is not yet updated. Refresh and commit `package-lock.json` with `npm install` in a network-enabled development environment, then change CI install from `npm install` to `npm ci`. Until then the Cloudflare build command explicitly runs `npm install` to reconcile the lockfile. Treat a committed, synchronized lockfile as a **required follow-up before production**.

## Local verification

```sh
npm install
npm run dev
# http://localhost:3000/today?demo=1

npm run build
npm run cf:build
npm run cf:preview
```

The Cloudflare Worker may require an active account and limits appropriate for your plan. Validate size and compatibility in the actual build logs.

## Rollback

Use Cloudflare Worker Versions / Deployments to roll back to a previously healthy version. Record the failing Git commit and build logs before retrying. Avoid automatic retries that mask a failing build.

## Reference documentation

- https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://opennext.js.org/cloudflare/cli

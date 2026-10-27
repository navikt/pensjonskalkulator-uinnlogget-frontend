This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Use the Node.js version specified in `.nvmrc` for local development.
CI pins Node.js 24.22.1 explicitly in the workflows:

```bash
nvm install
nvm use
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Runtime security

[CVE-2026-111497](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
affects the Brotli decoder bundled with Node.js. The Node 24 runtime must be
24.22.1 or a later patched 24.x release. Updating npm packages does not patch
Node's bundled decoder.

The container defaults to the Chainguard `nav.no/node:24-slim` image through
the Nav pull-through registry, configured by the `NODE_DEPLOY_IMG` build argument.
Rebuild and redeploy to update running containers; a base-image update alone
does not update an existing deployment.
Scheduled builds currently do not deploy to sandbox or production. Production
deployment requires manually running the deployment workflow on `main` with
the `prod` input enabled.

Verify the running container's Node version and check its exact image digest
against the vendor's security advisory/SBOM:

```bash
node -p 'JSON.stringify({node: process.version, brotli: process.versions.brotli})'
```

Node security releases may backport the fix without changing the reported Brotli
version, so the Brotli version string alone is not proof of patch status.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

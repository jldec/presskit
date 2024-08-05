# presskit-worker
OG based on `pnpm create hono` with `cloudflare-workers` template.

## install
```sh
pnpm install  # note: vitest is installed at root of workspace
```

## dev
```sh
pnpm watch:css # run tailwindcss builds in watch mode
pnpm dev       # run wrangler dev in a separate terminal
```

## deploy
Renamed `deploy` -> `ship` because pnpm deploy does something else.
```sh
pnpm ship # calls wrangler deploy
```

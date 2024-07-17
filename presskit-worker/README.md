# presskit-worker
- `pnpm create hono`
- choose `cloudflare-workers` template
- modify package json etc. to taste

## install
```sh
pnpm install
pnpm dev # calls wrangler dev
```

## deploy
renamed `deploy` -> `ship` because pnpm deploy does something else.
```sh
pnpm ship # calls wrangler deploy
```

import { Hono as HonoBase, Context as ContextBase } from 'hono'
export type { StatusCode } from 'hono/utils/http-status'

export type Bindings = {
	PAGE_CACHE: KVNamespace
	IMAGES: R2Bucket
	AI: any
	GH_PAT: string
	IMAGE_KEY: string
	ENVIRONMENT: string
}

export class Hono extends HonoBase<{ Bindings: Bindings }> {}
export type Context = ContextBase<{ Bindings: Bindings }>

export type Content = {
	attrs: any
	md: string
	html: string
}

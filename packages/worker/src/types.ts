import { Hono as HonoBase, Context as ContextBase } from 'hono'
import type { StatusCode as StatusCodeBase } from 'hono/utils/http-status'

export type StatusCode = StatusCodeBase

export type Bindings = {
	PAGE_CACHE: KVNamespace
	IMAGES: R2Bucket
	AI: any
	GH_PAT: string
	IMAGE_KEY: string
}

export class Hono extends HonoBase<{ Bindings: Bindings }> {}
export type Context = ContextBase<{ Bindings: Bindings }>

export type Content = {
	statusCode: StatusCode
	attrs: any
	html: string
	summary?: AiSummarizationOutput
}

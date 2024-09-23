import { PageData, Env, type WaitUntil } from './types'
import { DurableObject } from 'cloudflare:workers'
import { getMarkdown } from './markdown/get-markdown'

export class Page extends DurableObject {
	page: PageData | null = null
	waitUntil: WaitUntil = (promise:Promise<any>) => this.ctx.waitUntil(promise)

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env)
	}

	// fetch page content on first access
	// refetch content if noCache = true
	async getPage(path: string, noCache = false) {
		if (!this.page || noCache) {
			this.page = await getMarkdown(path, this.env as Env, this.waitUntil, noCache)
			console.log('getPage', this.page?.path, this.page?.dir?.length || 'no-dir', noCache)
		}
		return this.page
	}
}

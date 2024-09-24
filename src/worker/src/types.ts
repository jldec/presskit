import { Hono as HonoBase, Context as ContextBase } from 'hono'
import type { Page } from './page'
import type { Party } from './party'
export type { StatusCode } from 'hono/utils/http-status'

export type Env = {
	PAGE_CACHE: KVNamespace
	IMAGES: R2Bucket
	AI: any
	GH_PAT: string
	GH_REPO: string
	IMAGE_KEY: string
	ENVIRONMENT: string
	APP_URL: string
	CHATS: DurableObjectNamespace<Party>
	PAGES: DurableObjectNamespace<Page>
}

export type WaitUntil = (promise: Promise<any>) => void

export class Hono extends HonoBase<{ Bindings: Env }> {}
export type Context = ContextBase<{ Bindings: Env }>

export type DirPageData = {
	path: string
	attrs?: Frontmatter
	nextPath?: string
	nextTitle?: string
}

export type PageData = {
	path: string
	attrs: Frontmatter
	md: string
	html: string
	dir?: DirPageData[]
}

export interface Frontmatter {
	layout?: string
	title?: string
	appurl?: string // e.g. https://jldec.me
	icon?: Icon | string
	sidebars?: Array<Sidebar>
	navlinks?: Array<Navlink> // main menu
	hero?: Hero
	actionlinks?: Array<Navlink> // contact sales, etc.
	features?: Array<Navlink>
	footer?: Footer
	twitter?: string // e.g. @jldec - for meta tags
	error?: unknown
	sortby?: string
	date?: Date
	[key: string]: unknown
}

export interface Navlink {
	href: string
	text: string
	icon?: Icon | string
	image?: string
	details?: string
}

// vertical sidebar with sections
// top-level href used for URL path prefix matching to show/hide sidebar
export interface Sidebar extends Navlink {
	sections: Array<SidebarSection>
}

export interface SidebarSection {
	text: string
	links: Array<Navlink>
	collapsed?: boolean
}

export interface Icon {
	image?: string
	class?: string
	text?: string
	imageonly?: boolean
}

export interface Hero {
	name: string
	text: string
	tagline?: string
	icon?: Icon | string
	downicon?: Icon | string
	actionlinks?: Array<Navlink>
	video?: string
}

export interface Footer {
	text: string
}

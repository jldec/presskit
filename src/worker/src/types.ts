import { Hono as HonoBase, Context as ContextBase } from 'hono'
export type { StatusCode } from 'hono/utils/http-status'

export type Env = {
	PAGE_CACHE: KVNamespace
	TREE_CACHE: KVNamespace
	IMAGES: R2Bucket
	AI: any
	GH_PAT: string
	GH_REPO: string
	IMAGE_KEY: string
	ENVIRONMENT: string
	APP_URL: string
	PAGES: DurableObjectNamespace
}

export type WaitUntil = (promise: Promise<any>) => void

export class Hono extends HonoBase<{ Bindings: Env }> {}
export type Context = ContextBase<{ Bindings: Env }>

export type PageData = {
	path: string
	attrs: Frontmatter
	md: string
	html: string
	dir?: string[]
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
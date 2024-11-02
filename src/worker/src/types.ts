import { Hono as HonoBase, Context as ContextBase } from 'hono'
import type { Party } from './party'
import type { RedirectStatusCode } from 'hono/utils/http-status'
export type { StatusCode, RedirectStatusCode } from 'hono/utils/http-status'

export type Env = {
  PAGE_CACHE: KVNamespace
  STATIC_CACHE: KVNamespace
  IMAGES: R2Bucket
  AI: any
  GH_PAT: string
  GH_OWNER: string
  GH_REPO: string
  GH_BRANCH: string
  GH_PATH: string
  IMAGE_KEY: string
  CHATS: DurableObjectNamespace<Party>
  ENVIRONMENT: string
  DEBUG: string
}

export type WaitUntil = (promise: Promise<any>) => void

export class Hono extends HonoBase<{ Bindings: Env }> {}
export type Context = ContextBase<{ Bindings: Env }>

// TODO: DirData should be part of PageData
export type DirData = {
  path: string
  attrs?: Frontmatter
  next?: Navlink
  prev?: Navlink
}

export type PageData = {
  path: string
  attrs: Frontmatter
  md: string
  html: string
  dir?: DirData[]
}

export interface Frontmatter {
  draft?: boolean
  layout?: string
  title?: string
  description?: string
  siteurl?: string // e.g. https://jldec.me
  icon?: string
  navlinks?: Navlink[] // main menu
  sociallinks?: Navlink[] // main menu
  actionlinks?: Navlink[] // contact sales, etc.
  features?: Navlink[]
  twitter?: string // e.g. jldec - for meta tags
  error?: unknown
  sortby?: string
  date?: string
  image?: string
  splashimage?: string
  splash?: Splash
  favicon?: string
  [key: string]: unknown
}
export interface Navlink {
  href: string
  text: string
  icon?: string
  image?: string
  details?: string
}

export interface Splash {
  image?: string;
  title?: string;
  subtitle?: string;
}

export interface Redirect {
  redirect: string
  status?: RedirectStatusCode
}
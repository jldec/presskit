// from https://github.com/vuejs/vitepress/tree/256d742/src/node/markdown/plugins
// markdown-it plugin for rewriting image src urls
// TODO: configurable prefix for image urls

import type MarkdownIt from 'markdown-it'
import { hash } from './hash'

export interface Options {
  /**
   * rewrite `<img>` src tags.
   * @default '/img/'
   */
  "imagePrefix"?: string
  "hashPrefix"?: string
}

export const imagePlugin = (md: MarkdownIt, { imagePrefix, hashPrefix }: Options = {}) => {
  const imageRule = md.renderer.rules.image!
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    let url = token.attrGet('src')
    if (url) {
      token.attrSet('src', rewriteUrl(url, imagePrefix ?? '/img/', hashPrefix ?? ''))
    }
    return imageRule(tokens, idx, options, env, self)
  }
}

// does not preserve extension if og has one (same as github user-attachments)
// hashPrefix should be secret to properly validate incoming img requests
export function rewriteUrl(url: string, imagePrefix: string, hashPrefix: string) {
	return `${imagePrefix}${hash(hashPrefix + url)}?og=${encodeURIComponent(url)}`
}

// from https://github.com/vuejs/vitepress/tree/256d742/src/node/markdown/plugins
// markdown-it plugin for rewriting image src urls
// TODO: configurable prefix for image urls

import type MarkdownIt from 'markdown-it'
import { rewriteUrl } from './rewrite-url'

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

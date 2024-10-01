import { test, extractYaml } from '@std/front-matter'
import type { Frontmatter } from '../types'

export function parseFrontmatter(s: string) {
  if (!test(s))
    return {
      frontMatter: '',
      body: s,
      attrs: {} as Frontmatter
    }

  try {
    return extractYaml<Frontmatter>(s)
  } catch (error) {
    return {
      frontMatter: '',
      body: s,
      attrs: { error }
    }
  }
}

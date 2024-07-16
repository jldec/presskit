import { test, extractYaml } from '@std/front-matter'

export function parseFrontmatter(s: string) {
	if (!test(s)) return undefined

	return extractYaml(s)
}

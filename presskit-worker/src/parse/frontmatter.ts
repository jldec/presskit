import { test, extractYaml } from '@std/front-matter'

export function parseFrontmatter(s: string) {
	if (!test(s))
		return {
			frontMatter: '',
			body: s,
			attrs: {} as any
		}

	return extractYaml(s)
}

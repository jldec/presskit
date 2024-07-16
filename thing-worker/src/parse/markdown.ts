import markdownit from 'markdown-it'

export function parseMarkdown(s: string) {
	const md = markdownit('commonmark')

	return md.render(s)
}

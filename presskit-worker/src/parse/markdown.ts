import markdownit from 'markdown-it'

export function parseMarkdown(s: string) {
	const md = markdownit({
		linkify: true
	})

	return md.render(s)
}

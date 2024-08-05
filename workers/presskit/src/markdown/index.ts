import markdownit from 'markdown-it'
import { imagePlugin } from './plugins/image'

export function parseMarkdown(s: string) {
	const md = markdownit({ linkify: true }).use(imagePlugin, { lazyLoading: true })

	return md.render(s)
}

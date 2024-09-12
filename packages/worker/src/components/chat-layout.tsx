import { raw } from 'hono/html'
import { type FC } from 'hono/jsx'

export const ChatLayout: FC = ({ page }) => {
	return (
		<>
			{raw(page?.html ?? '')}
			<div id="chat-root"></div>
			<script src="/js/partychat.js" type="module"></script>
		</>
	)
}

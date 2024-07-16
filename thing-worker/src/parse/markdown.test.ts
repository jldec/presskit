import { expect, test } from 'vitest'
import { parseMarkdown } from './markdown'

const markdown = `# markdown header
paragraph 1

paragraph 2
`

const expectedResult = `<h1>markdown header</h1>
<p>paragraph 1</p>
<p>paragraph 2</p>
`

test('parseMarkdown', {}, () => {
	expect(parseMarkdown(markdown)).toEqual(expectedResult)
})

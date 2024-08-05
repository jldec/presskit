import { expect, test } from 'vitest'
import { parseMarkdown } from '.'

const markdown = `# markdown header
paragraph 1

paragraph 2
![alt text](https://example.com/image.png)
`

const expectedResult = `<h1>markdown header</h1>
<p>paragraph 1</p>
<p>paragraph 2
<img src="https://example.com/image.png" alt="alt text" loading="lazy"></p>
`

test('parseMarkdown', {}, () => {
	let actual = parseMarkdown(markdown)
	expect(actual).toEqual(expectedResult)
})

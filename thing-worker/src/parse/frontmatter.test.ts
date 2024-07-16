import { expect, test } from 'vitest'
import { parseFrontmatter } from './frontmatter'

const frontMatter = `foo: bar
baz: 1
array: [1, 2, 3]
nested:
  inner: yo`

const body = `# markdown header
paragraphs`

const content = `---
${frontMatter}
---
${body}`

const attrs = {
	foo: 'bar',
	baz: 1,
	array: [1, 2, 3],
	nested: {
		inner: 'yo'
	}
}

const expectedResult = {
	frontMatter,
	body,
	attrs
}

test('parseFrontmatter', {}, () => {
	expect(parseFrontmatter(content)).toEqual(expectedResult)
})

test('parseFrontmatter undefined when no frontMatter', {}, () => {
	expect(parseFrontmatter('# no frontmatter here\nyo')).toBeUndefined()
})

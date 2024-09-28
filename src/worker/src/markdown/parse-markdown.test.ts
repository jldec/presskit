import { expect, test } from "vitest"
import { parseMarkdown } from "./parse-markdown"

const markdown = `# markdown header
paragraph 1

paragraph 2
![alt text](https://example.com/image.png)
![alt text](/images/image2.png)
`

const expectedResult = `<h1>markdown header</h1>
<p>paragraph 1</p>
<p>paragraph 2
<img src="/img/1xzq9lwjinar8?og=https%3A%2F%2Fexample.com%2Fimage.png" alt="alt text">
<img src="/img/19hzstclvpapa?og=http%3A%2F%2Flocalhost%3A1234%2Fimages%2Fimage2.png" alt="alt text"></p>
`

test("parseMarkdown", {}, () => {
  let actual = parseMarkdown(markdown, { sourcePrefix: "http://localhost:1234" })
	// console.log(actual)
  expect(actual).toEqual(expectedResult)
})

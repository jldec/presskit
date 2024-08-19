import { describe, it, expect } from 'vitest'
import { rewriteUrl } from './rewrite-url'

const url1 = 'https://github.com/user-attachments/assets/d43e5f3f-3d29-485d-882f-11a64c997213.jpg'
const hashPrefix = 'test-hashPrefix'
const url1Expected =
	'/img/1j7xqd4017goq?og=https%3A%2F%2Fgithub.com%2Fuser-attachments%2Fassets%2Fd43e5f3f-3d29-485d-882f-11a64c997213.jpg'

describe('rewriteUrl', () => {
	it('should rewrite url using a hash and og param', () => {
		expect(rewriteUrl(url1, '/img/', hashPrefix)).toBe(url1Expected)
	})
})

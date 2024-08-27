import { Hono } from './types'

// @ts-expect-error
import manifest from '__STATIC_CONTENT_MANIFEST'

// instance to be mounted at /api
export const api = new Hono()

// pretty-print json
function fjson(o: any) {
	return new Response(JSON.stringify(o, null, 2), {
		headers: { 'Content-Type': 'application/json;charset=UTF-8' }
	})
}

// echo request
// useful for debugging
api.get('/echo', async (c) => {
	const req = c.req.raw
	const echo = {
		method: req.method,
		url: req.url,
		headers: Object.fromEntries(req.headers.entries()),
		cf: req.cf,
		body: await req.text(),
		booger: 1
	}
	return fjson(echo)
})

api.get('/env', async (c) => {
	//⚠️ don't return c.env secrets
	return fjson(c.env.ENVIRONMENT)
})

api.get('/manifest', async (c) => {
	const o = JSON.parse(manifest)
	return fjson(o)
})

// page cache
api.get('/cache', async (c) => {
	const list = await c.env.PAGE_CACHE.list()
	const keys = list.keys.map((o) => o.name)
	return fjson(list)
})

api.delete('/cache', async (c) => {
	const list = await c.env.PAGE_CACHE.list()
	const keys = list.keys.map((o) => o.name)
	const deleted = await Promise.all(keys.map((key) => c.env.PAGE_CACHE.delete(key)))
	return fjson(deleted)
})

// images in R2
api.get('/images', async (c) => {
	const list = await c.env.IMAGES.list({ include: ['httpMetadata', 'customMetadata'] })
	const r2Objects = list.objects
	const data = r2Objects.map((r2Object) => ({
		key: r2Object.key,
		size: r2Object.size,
		...r2Object.customMetadata,
		...r2Object.httpMetadata,
		etag: r2Object.etag
	}))
	return fjson(data)
})

api.delete('/images', async (c) => {
	let keys = (await c.env.IMAGES.list()).objects.map((object) => object.key)
	await c.env.IMAGES.delete(keys)
	return fjson(keys)
})

api.get('/tree', async (c) => {
	let cachedTree = await c.env.PAGE_CACHE.get('TREE')
	if (cachedTree !== null) {
		return fjson(JSON.parse(cachedTree))
	} else return c.notFound()
})

import { hash } from './hash'

// does not preserve extension if og has one (same as github user-attachments)
// hashPrefix should be secret to properly validate incoming img requests
export function rewriteUrl(url: string, urlPrefix: string, hashPrefix: string) {
	return `${urlPrefix}${hash(hashPrefix + url)}?og=${encodeURIComponent(url)}`
}

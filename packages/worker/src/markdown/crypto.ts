// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

// encode a string to bytes
export function enc(s: string): Uint8Array {
  return textEncoder.encode(s)
}

// decode a previously encoded byte string
export function dec(rg: Uint8Array): string {
  return textDecoder.decode(rg)
}

// convert byte array to hex string
export function toHex(rg: Uint8Array): string {
  return Array.from(rg).map(b => b.toString(16).padStart(2,'0')).join('')
}

// convert hex string to byte array
export function fromHex(hstr: string): Uint8Array {
  if (hstr.length % 2 !== 0) {
    hstr = '0' + hstr;
  }
  const rg = new Uint8Array(hstr.length / 2);
  for (let i = 0; i < hstr.length; i += 2) {
    rg[i / 2] = parseInt(hstr.slice(i, i + 2), 16);
  }
  return rg
}

// convert byte array to base64 string
export function toB64(rg: Uint8Array): string {
  return btoa(String.fromCharCode.apply(null, Array.from(rg)))
}

// convert base64 string to byte array
export function fromB64(bstr: string): Uint8Array {
  return Uint8Array.from(atob(bstr), (c) => c.charCodeAt(0))
}

/**
  import a string key (not necessiarly base64 encoded)
 **/
export async function keyFrom(keyString: string) {
	return await crypto.subtle.importKey(
		'raw',
		enc(keyString),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	)
}

export async function sign(message: string, key: CryptoKey) {
  const signed = await crypto.subtle.sign(
    'HMAC',
    key,
    enc(message)
  )
  return new Uint8Array(signed)
}

export async function verify(message: string, signature: Uint8Array, key: CryptoKey) {
  return await crypto.subtle.verify(
    'HMAC',
    key,
    signature,
    enc(message)
  )
}

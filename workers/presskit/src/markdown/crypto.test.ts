import { describe, it, expect } from 'vitest'
import { hash } from './hash'
import { keyFrom, toHex, toB64, sign, verify } from './crypto'

const testUrl = 'https://github.com/user-attachments/assets/8cb9e73c-2675-457f-9f5b-dd80e6042da4'
const keyString = 'always be kind and nice to people'

describe('crypto', () => {
  it('will sign and verify URL', async () => {
    const key = await keyFrom(keyString)
    const sig = await sign(testUrl, key)
    const verified = await verify(testUrl, sig, key)
    expect(verified).toBe(true)
  })
  it('will sign and verify hash of URL', async () => {
    const key = await keyFrom(keyString)
    const hashedUrl = hash(testUrl)
    const sig = await sign(hashedUrl, key)
    const verified = await verify(hashedUrl, sig, key)
    expect(verified).toBe(true)
  })
  it('will sign and hex and hash and verify hex-hashed signature of URL', async () => {
    const key = await keyFrom(keyString)
    const sig = await sign(testUrl, key)
    const hexSig = toHex(sig)
    const hashedSig = hash(hexSig)
    const hexSig2 = toHex(await sign(testUrl, key))
    const hashedSig2 = hash(hexSig2)
    expect(hashedSig).toEqual(hashedSig2)
  })
  it('will sign and b64 and hash and verify b64-hashed signature of URL', async () => {
    const key = await keyFrom(keyString)
    const sig = await sign(testUrl, key)
    const b64Sig = toB64(sig)
    const hashedSig = hash(b64Sig)
    const b64Sig2 = toB64(await sign(testUrl, key))
    const hashedSig2 = hash(b64Sig2)
    expect(hashedSig).toEqual(hashedSig2)
  })
})

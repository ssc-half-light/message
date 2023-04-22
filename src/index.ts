import { verify as utilVerify, sign, toString } from '@ssc-hermes/util'
import stringify from 'json-stable-stringify'
import { Implementation } from '@oddjs/odd/components/crypto/implementation'
type KeyStore = Implementation['keystore']

interface SignedRequest {
    signature: string,
    [key: string]: any
}

export async function create (keystore:KeyStore, obj:object):Promise<SignedRequest> {
    const sig = toString(await sign(keystore, stringify(obj)))
    const req = { ...obj, signature: sig }
    return req
}

export async function verify (authorDID:string, msg:SignedRequest) {
    const sig = msg.signature
    const _msg:Partial<SignedRequest> = Object.assign({}, msg)
    delete _msg.signature
    return (await utilVerify(authorDID, sig, stringify(_msg)))
}

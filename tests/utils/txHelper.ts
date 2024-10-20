import { DummyProvider, DefaultProvider, TestWallet, bsv, UTXO } from 'scrypt-ts'
import { myPrivateKey } from './privateKey'
import { randomBytes } from 'crypto'

import * as dotenv from 'dotenv'

// Load the .env file
dotenv.config()

export const inputSatoshis = 10000


const wallets: Record<string, TestWallet> = {
    testnet: new TestWallet(
        myPrivateKey,
        new DefaultProvider({
            network: bsv.Networks.testnet,
        })
    ),
    local: new TestWallet(myPrivateKey, new DummyProvider()),
    mainnet: new TestWallet(
        myPrivateKey,
        new DefaultProvider({
            network: bsv.Networks.mainnet,
        })
    ),
}
export function getDefaultSigner(
    privateKey?: bsv.PrivateKey | bsv.PrivateKey[]
): TestWallet {
    const network = process.env.NETWORK || 'local'

    const wallet = wallets[network]

    if (privateKey) {
        wallet.addPrivateKey(privateKey)
    }

    return wallet
}

export const sleep = async (seconds: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({})
        }, seconds * 1000)
    })
}

export function randomPrivateKey() {
    const privateKey = bsv.PrivateKey.fromRandom(bsv.Networks.testnet)
    const publicKey = bsv.PublicKey.fromPrivateKey(privateKey)
    const publicKeyHash = bsv.crypto.Hash.sha256ripemd160(publicKey.toBuffer())
    const address = publicKey.toAddress()
    return [privateKey, publicKey, publicKeyHash, address] as const
}



export const dummyUTXO = {
    txId: randomBytes(32).toString('hex'),
    outputIndex: 0,
    script: '', // placeholder
    satoshis: inputSatoshis,
}

export function getDummyUTXO(
    satoshis: number = inputSatoshis,
    unique = false
): UTXO {
    if (unique) {
        return Object.assign({}, dummyUTXO, {
            satoshis,
            txId: randomBytes(32).toString('hex'),
        })
    }
    return Object.assign({}, dummyUTXO, { satoshis })
}

export function getDummySigner(
    privateKey?: bsv.PrivateKey | bsv.PrivateKey[]
): TestWallet {
    if (global.dummySigner === undefined) {
        global.dummySigner = new TestWallet(myPrivateKey, new DummyProvider())
    }
    if (privateKey !== undefined) {
        global.dummySigner.addPrivateKey(privateKey)
    }
    return global.dummySigner
}
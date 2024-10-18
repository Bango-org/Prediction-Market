import { expect, use } from 'chai'
import { HashedMap, MethodCallOptions, PubKey, sha256, toByteString, toNumber } from 'scrypt-ts'
import { Event } from '../src/contracts/event'
import { dummyUTXO, getDefaultSigner, inputSatoshis } from './utils/txHelper'
import chaiAsPromised from 'chai-as-promised'
import { before, describe, it } from 'node:test'
import { myAddress } from './utils/privateKey'

use(chaiAsPromised)

describe("Test SmartContract Demo", () => {
    let instance: Event

    before(async () => {
        Event.loadArtifact()


        let yesShares: HashedMap<PubKey, bigint>  = new HashedMap<PubKey, bigint> ();
        let noShares: HashedMap<PubKey, bigint>  = new HashedMap<PubKey, bigint> ();


        instance = new Event(toByteString("793ff39de7e1dce2d853e24256099d25fa1b1598ee24069f24511d7a2deafe6c"),BigInt(1),BigInt(123),yesShares,noShares);
        await instance.connect(getDefaultSigner())
    })

    // it('Initiate map', async () => {

    //     const deployTx = await instance.deploy(1)

    //     // console.log(`Deployed contract "Demo": ${deployTx.id}`)

    //     const call = async () => {
    //         const yesShares = instance.yesShares;
            
    //         // console.log(yesShares,"====")
    //     }
    //     await expect(call()).not.to.be.rejected
    // });

    it('should add a and b', async () => {

        // instance.to = PubKey(myAddress.toByteString()); // Set 'this.to' before method call


        const call = async () => {

            const pubkey = PubKey(myAddress.toByteString());
            const yesShares = await instance.methods.storeMap(pubkey, BigInt(12), {
                fromUTXO: dummyUTXO,
                next: {
                    instance: instance,
                    balance: inputSatoshis,
                },
            } as MethodCallOptions<Event>);

            // instance.yesShares.set(pubkey, BigInt(13));
            console.log(instance.yesShares.get(pubkey));
            // console.log(instance.noShares);

        }
        await expect(call()).not.to.be.rejected
    })

})

import {
    assert,
    ByteString,
    hash256,
    HashedMap,
    method,
    prop,
    PubKey,
    Sig,
    SmartContract,
    Utils,
} from 'scrypt-ts'

export class Event extends SmartContract {
    @prop()
    readonly eventName: ByteString
    
    @prop()
    readonly eventId: bigint
    
    @prop()
    readonly expiryDate: bigint  // Unix timestamp for market expiry
    
    @prop(true)
    yesShares: HashedMap<PubKey, bigint>
    
    @prop(true)
    noShares: HashedMap<PubKey, bigint>
    
    @prop()
    totalYesShares: bigint
    
    @prop()
    totalNoShares: bigint
    
    @prop(true)
    isFinalized: boolean


    constructor(
        eventName: ByteString,
        eventId: bigint,
        expiryDate: bigint,
        yesShares: HashedMap<PubKey, bigint>,
        noShares: HashedMap<PubKey, bigint>,
    ) {
        super(...arguments);
        this.eventName = eventName;
        this.eventId = eventId;
        this.expiryDate = expiryDate;
        this.totalYesShares = 0n;
        this.totalNoShares = 0n;
        this.isFinalized = false;

        this.yesShares = yesShares;
        this.noShares = noShares;
    }

    @method()
    public fn1() {
        assert(2>1, "s");
    }

    @method()
    public storeMap(pubkey: PubKey, value: bigint) {
        this.yesShares.set(pubkey, value);
        assert(true, "s");
    }

    @method()
    public purchaseYesShares(user: PubKey, userSig: Sig, amount: bigint) {
        // Verify signature
        assert(this.checkSig(userSig, user), 'Invalid signature')
        
        this.yesShares.set(user, amount)
        
        // Update total shares
        this.totalYesShares += amount
        assert(!this.timeLock(this.expiryDate), 'Market has expired')
    }

    // @method()
    // public purchaseNoShares(user: PubKey, userSig: Sig, amount: bigint) {
    //     // Verify signature
    //     assert(this.checkSig(userSig, user), 'Invalid signature')
        
    //     // Check market hasn't expired using reverse logic
    //     assert(!this.timeLock(this.expiryDate), 'Market has expired')
        
    //     // Update no shares
    //     const currentShares = this.noShares.get(user) || 0n
    //     this.noShares.set(user, currentShares + amount)
        
    //     // Update total shares
    //     this.totalNoShares += amount
    // }

    // @method()
    // public sellYesShares(
    //     seller: PubKey,
    //     sellerSig: Sig,
    //     buyer: PubKey,
    //     sharesToSell: bigint
    // ) {
    //     // Verify seller's signature
    //     assert(this.checkSig(sellerSig, seller), 'Invalid signature')
        
    //     // Check market hasn't expired using reverse logic
    //     assert(!this.timeLock(this.expiryDate), 'Market has expired')
        
    //     // Verify seller has enough shares
    //     const sellerShares = this.yesShares.get(seller) || 0n
    //     assert(sellerShares >= sharesToSell, 'Insufficient shares')
        
    //     // Update seller's shares
    //     this.yesShares.set(seller, sellerShares - sharesToSell)
        
    //     // Update buyer's shares
    //     const buyerShares = this.yesShares.get(buyer) || 0n
    //     this.yesShares.set(buyer, buyerShares + sharesToSell)
    // }

    // @method()
    // public sellNoShares(
    //     seller: PubKey,
    //     sellerSig: Sig,
    //     buyer: PubKey,
    //     sharesToSell: bigint
    // ) {
    //     // Verify seller's signature
    //     assert(this.checkSig(sellerSig, seller), 'Invalid signature')
        
    //     // Check market hasn't expired using reverse logic
    //     assert(!this.timeLock(this.expiryDate), 'Market has expired')
        
    //     // Verify seller has enough shares
    //     const sellerShares = this.noShares.get(seller) || 0n
    //     assert(sellerShares >= sharesToSell, 'Insufficient shares')
        
    //     // Update seller's shares
    //     this.noShares.set(seller, sellerShares - sharesToSell)
        
    //     // Update buyer's shares
    //     const buyerShares = this.noShares.get(buyer) || 0n
    //     this.noShares.set(buyer, buyerShares + sharesToSell)
    // }

    // @method()
    // private calculateTotalReward(): bigint {
    //     return this.totalYesShares + this.totalNoShares
    // }

    // @method()
    // private distributeRewards(
    //     shares: Map<PubKey, bigint>,
    //     totalShares: bigint,
    //     totalReward: bigint
    // ) {
    //     for (const [user, userShares] of shares.entries()) {
    //         if (userShares > 0n) {
    //             const reward = (userShares * totalReward) / totalShares
    //             // Transfer reward to user (implementation depends on specific requirements)
    //             // this.transferToAddress(user, reward)
    //         }
    //     }
    // }

    // @method()
    // public finalize(winningOption: bigint) {
    //     // Ensure market has expired using timeLock
    //     assert(this.timeLock(this.expiryDate), 'Market not yet expired')
        
    //     // Check if not already finalized
    //     assert(!this.isFinalized, 'Market already finalized')
        
    //     // Validate winning option
    //     assert(winningOption === 1n || winningOption === 2n, 'Invalid winning option')
        
    //     const totalReward = this.calculateTotalReward()
        
    //     // Distribute rewards based on winning option
    //     if (winningOption === 1n) {
    //         // Yes wins
    //         this.distributeRewards(this.yesShares, this.totalYesShares, totalReward)
    //     } else {
    //         // No wins
    //         this.distributeRewards(this.noShares, this.totalNoShares, totalReward)
    //     }
        
    //     this.isFinalized = true
    // }
}
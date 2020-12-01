import Steering from "./steering.js";
import Vector2 from 'phaser/src/math/Vector2'
import Npc from "../../characters/npc.js";

export default class Trade extends Steering {

    constructor (owner, merchants, force = 1, ownerSpeed= 80) {
        super(owner, [], force);
        this.ownerSpeed = ownerSpeed;
        
        this.merchants = merchants;
        this.nextMerchant = 0;
    }

    static seek(owner, target, maxSpeed) {
        const desiredVelocity = new Vector2(target.x - owner.x, target.y-owner.y)
            .normalize().scale(maxSpeed);
        const prevVelocity = new Vector2(owner.body.x-owner.body.prev.x, owner.body.y-owner.body.prev.y);
        return desiredVelocity.subtract(prevVelocity);
    }

    currentMerchant() {
        return this.merchants[this.nextMerchant];
    }

    setNextMerchant() {
        this.nextMerchant = (this.nextMerchant + 1) % this.merchants.length;
    }

    reachedMerchant(self, merchant) {
        const dist = Math.sqrt(
            (self.x - merchant.x) * (self.x - merchant.x) +
            (self.y - merchant.y) * (self.y - merchant.y));

        return dist < 10;
    }

    calculateImpulse () {
        console.log(this.nextMerchant);

        let target = this.currentMerchant();
        const self = this.owner.trader;

        if (this.reachedMerchant(self, target)) {
            this.setNextMerchant();
            console.log('Reached merchant, next is:', this.nextMerchant);
            target = this.currentMerchant();
        }

        const searcherDirection = self.body.velocity;        
        const targetPos = new Vector2(target.x, target.y);
        const targetDirection = target.body.velocity;
        const toTarget = new Vector2(self.x - target.x, self.y - target.y);
        const relativeHeading = searcherDirection.dot(targetDirection);

        if (toTarget.dot(targetDirection) < 0 || relativeHeading > -0.95)
            return Trade.seek(self, targetPos, this.ownerSpeed);

        const lookAheadTime = toTarget.length / (this.ownerSpeed)
        
        return Trade.seek(self, 
            targetPos.add(target.body.velocity.clone().scale(lookAheadTime)), 
            this.ownerSpeed);
    }
}
import Steering from "./steering.js";
import Vector2 from 'phaser/src/math/Vector2'
import Npc from "../../characters/npc.js";

export default class ExploreMap extends Steering {

    constructor(owner, worldMap, force = 1, ownerSpeed=80) {
        super(owner, [], force);
        this.ownerSpeed = ownerSpeed;
        this.worldMap = worldMap;
        this.target = null;
    }

    static seek(owner, target, maxSpeed) {
        const desiredVelocity = new Vector2(target.x - owner.x, target.y-owner.y)
            .normalize().scale(maxSpeed);
        const prevVelocity = new Vector2(owner.body.x-owner.body.prev.x, owner.body.y-owner.body.prev.y);
        return desiredVelocity.subtract(prevVelocity);
    }

    getNextTarget(self) {
        const nextArea = this.worldMap.closestUnknownArea(self.x, self.y)
        this.target = nextArea ? nextArea.center : null;
    }

    calculateImpulse () {
        const self = this.owner.explorer;

        if (!this.target) {
            this.getNextTarget(self);
            return new Vector2(0, 0);
        }

        if (this.worldMap.registerMovement(self.x, self.y)) {
            this.getNextTarget(self);
            console.log(this.worldMap);
            return new Vector2(0, 0);
        } else {
            const target = this.target;
            const searcherDirection = self.body.velocity;        
            const targetPos = new Vector2(target.x, target.y);
            const toTarget = new Vector2(self.x - target.x, self.y - target.y);
            const relativeHeading = searcherDirection
    
            if (toTarget < 0 || relativeHeading > -0.95)
                return ExploreMap.seek(self, targetPos, this.ownerSpeed);
                
            return ExploreMap.seek(self, 
                targetPos, 
                this.ownerSpeed);

        
        }
    }
}
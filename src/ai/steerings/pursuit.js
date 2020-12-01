import Steering from "./steering.js";
import Vector2 from 'phaser/src/math/Vector2'
import Npc from "../../characters/npc.js";

export default class Pursuit extends Steering {

    constructor (owner, target, force = 1, ownerSpeed= 80, targetSpeed = 100) {
        super(owner, [target], force);
        this.ownerSpeed = ownerSpeed;
        this.targetSpeed = targetSpeed
    }

    static seek(owner, target, maxSpeed) {
        const desiredVelocity = new Vector2(target.x - owner.x, target.y-owner.y)
        .normalize().scale(maxSpeed);
        const prevVelocity = new Vector2(owner.body.x-owner.body.prev.x, owner.body.y-owner.body.prev.y);
        //console.log(owner.evader.body.prev.x,desiredVelocity)
        return desiredVelocity.subtract(prevVelocity);
    }

    calculateImpulse () {
        // console.log(this.objects[0])
        // console.log(this.objects[0].Steering.objects[0])
        // ev = 5;
        const target = this.objects[0];
        let pursuitMen;
        if (target instanceof Npc) {
            pursuitMen = this.objects[0].Steering.objects[0];
            console.log('Target is NPC, setting pursuit men to', pursuitMen);
        } else {
            pursuitMen = this.owner.evader;
            console.log('Target is not NPC, setting pursuit men to', pursuitMen);
        }    
    
        const searcherDirection = pursuitMen.body.velocity;        
        const targetPos = new Vector2(target.x, target.y);
        const targetDirection = target.body.velocity;
        const toTarget = new Vector2(pursuitMen.x - target.x, pursuitMen.y - target.y);
        const relativeHeading = searcherDirection.dot(targetDirection);
        //console.log(target.x, pursuitMen.x,target.y, pursuitMen.y)
        
        if (Math.abs(target.x - pursuitMen.x) < 40 && Math.abs(target.y - pursuitMen.y) < 40)
            return  new Vector2(0, 0);

        if (toTarget.dot(targetDirection) < 0 || relativeHeading > -0.95)
            return Pursuit.seek(pursuitMen, targetPos, this.ownerSpeed);

        
            
              
        
        const lookAheadTime = toTarget.length / (this.ownerSpeed + this.targetSpeed)
        
        return Pursuit.seek(pursuitMen, 
            targetPos.add(target.body.velocity.clone().scale(lookAheadTime)), 
            this.ownerSpeed);
    }
}
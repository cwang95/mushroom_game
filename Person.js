class Person extends GameObject {
    constructor(config) {
        super(config);
        this.isPlayerControlled = config.isPlayerControlled || false;
        this.isStanding = false;
        this.isEmoting = false;

        this.movingProgressRemaining = 0;
        // CHANGE SPEED

        this.maxSpeed = 1;

        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state) {
        if (this.movingProgressRemaining>0) {
            this.updatePosition(state.deltaTime);
        } else {

            // more cases for starting to walk will come here
            // Case: keyboard ready and key has been pressed
            if (state.map.isCutscenePlaying == false && this.isPlayerControlled && state.arrow) {
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                });
            }
            this.updateSprite(state);
        }
    }

    startBehavior(state, behavior) {
        // Set character direction to whichever behavior has triggered
        this.direction = behavior.direction ?? "down";
        
        if (behavior.type === "walk") {
            // Stop here if there is a wall
            if (state.map.isSpaceTaken(this.x, this.y, this.direction) && this.isPlayerControlled) {
                return;
            }
            // Ready to walk
            // Reserve wall
            // state.map.moveWall(this.x, this.y, this.direction)
            this.movingProgressRemaining = 16;
            this.updateSprite(state);
        }

        if (behavior.type === "stand") {
            this.isStanding = true;
            setTimeout(()=> {
                utils.emitEvent("PersonStandComplete", { whoId: this.id})
            }, behavior.time);
            this.updateSprite(state);
            this.isStanding = false;
        }

        // if (behavior.type === "emote") {
        //     this.emoting = true;
        //     setTimeout(()=> {
        //         utils.emitEvent("PersonEmotionComplete", { whoId: this.id})
        //         this.emoting = false;
        //     }, 1000);
        // }
    }

    updatePosition(deltaTime) {
        const [property, change] = this.directionUpdate[this.direction];

        const delta = Math.max(Math.round(deltaTime/8), 1);

        this[property] += change*delta;
        this.movingProgressRemaining -= delta;

        if (this.movingProgressRemaining <= 0) {
            this.movingProgressRemaining = 0;
            // walking finished, trigger custom events
            utils.emitEvent("PersonWalkingComplete", { whoId: this.id });
        }
    }

    updateSprite(state) {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation(`walk-${this.direction}`)
        } else {
            this.sprite.setAnimation(`idle-${this.direction}`)
        }

        if (state.deltaTime > 10) {
            this.sprite.setFrameLimit(4);
        } else {
            this.sprite.setFrameLimit(8);
        }
    }
}
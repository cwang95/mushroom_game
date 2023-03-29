class Door extends StaticGameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "./images/emotions.png",
            height: config.height,
            width: config.width,
            animations: config.animations ?? {
                "idle" : [ [0,0] ],
                "moveNear" : [ [0,0], [0,1], [0,2], [1, 0], [1, 1], [1, 2] ],
                "near" : [ [0,1] ],
                "moveFar" : [ [0,0], [0,1], [0,2], [1, 0], [1, 1], [1, 2] ],
            },
            currentAnimation: "idle",
            height: config.height,
            width: config.width,
            animationFrameLimit: config.animationFrameLimit ?? 8
        });
        this.radius = utils.getInteractionRadius(this.x, this.y, config.radius ?? utils.withGrid(2)) ?? {};

        this.x = config.offsetX != null ? config.x+config.offsetX : config.x ?? 0;
        this.y = config.offsetY != null ? config.y+config.offsetY : config.y ?? 0;
        this.nextMap = {};

        this.entranceSpaces = config.entranceSpaces ?? {};

        this.required = config.required ?? [];
    }

    cancel() {
        clearTimeout(this.timeoutID);
    }

    isOpen() {
        return this.required.every(sf => {
            return window.playerState.storyFlags[sf];
        });
    }

    enter() {

    }

    heroApproach(map) {
        if (typeof this.timeoutID === "number") {
          this.cancel();
        }
        
        this.sprite.setAnimation("moveNear");
        this.timeoutID = setTimeout(()=> {
            this.sprite.setAnimation("near");
        }, 1000);
    }
    
    heroLeave() {
        if (typeof this.timeoutID === "number") {
          this.cancel();
        }
        if (!this.isOpen()) return;
        this.sprite.setAnimation("moveFar");
        this.timeoutID = setTimeout(()=> {
            this.sprite.setAnimation("idle");
        }, 1000);
    }
}
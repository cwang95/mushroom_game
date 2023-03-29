class StaticGameObject extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "./images/emotions.png",
            height: config.height,
            width: config.width,
            animations: {
                "idle": [[0, 0]],
                "moveNear": [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]],
                "near": [[0, 1]],
                "moveFar": [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]],
                ...config.animations
            },
            currentAnimation: "idle",
            height: config.height,
            width: config.width,
            animationFrameLimit: config.animationFrameLimit ?? 8
        });
        this.radius = utils.getInteractionRadius(this.x, this.y, config.radius ?? utils.withGrid(2)) ?? {};
        this.timeoutID = undefined;
        this.nearHero = false;

        this.x = config.offsetX != null ? config.x + config.offsetX : config.x ?? 0;
        this.y = config.offsetY != null ? config.y + config.offsetY : config.y ?? 0;
        // TODO: Filter out radius interaction and userInteraction
        this.radiusInteraction = config.radiusInteraction ?? true;
        this.userInteraction = config.userInteraction ?? true;

        this.interactionSpaces = config.interactionSpaces ?? null;
    }

    cancel() {
        clearTimeout(this.timeoutID);
    }

    propOpen() {
        this.nearHero = true;
        this.sprite.setAnimation("near");
    }

    heroApproach() {
        if (typeof this.timeoutID === "number") {
            this.cancel();
        }
        this.sprite.setAnimation("moveNear");
        this.timeoutID = setTimeout(() => {
            this.sprite.setAnimation("near");
        }, 1000);
    }

    heroLeave() {
        if (typeof this.timeoutID === "number") {
            this.cancel();
        }
        this.sprite.setAnimation("moveFar");
        this.timeoutID = setTimeout(() => {
            this.sprite.setAnimation("idle");
        }, 1000);
    }
}
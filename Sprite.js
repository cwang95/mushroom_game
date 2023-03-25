class Sprite {
    constructor(config) {
        // set up sprite image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }
        
        // Shadow
        this.shadow = new Image();
        this.shadow.src = "./images/characters/shadow.png";
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }
        this.useShadow = true;

        // Emotions
        this.emotions = new Image();
        this.emotions.src = "./images/emotes/emotes.png";
        this.emotions.onload = () => {
            this.isEmotionsLoaded = true;
        }

        this.animations = config.animations || {
            "idle-down" : [ [0,0] ],
            "idle-right": [ [0,1] ],
            "idle-up"   : [ [0,2] ],
            "idle-left" : [ [0,3] ],
            "walk-down" : [ [1,0],[0,0],[3,0],[0,0] ],
            "walk-right": [ [1,1],[0,1],[3,1],[0,1] ],
            "walk-up"   : [ [1,2],[0,2],[3,2],[0,2] ],
            "walk-left" : [ [1,3],[0,3],[3,3],[0,3] ],
        }
        this.currentAnimation = config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        // how many game loop frames we want to show each sprite frame
        // lower means more manic movement
        this.animationFrameLimit = config.animationFrameLimit || 8;

        this.animationFrameProgress = this.animationFrameLimit;


        this.gameObject = config.gameObject;

        this.height = config.height || 32;
        this.width = config.width || 32;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setFrameLimit(fps) {
        this.animationFrameLimit = fps;
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        // downtick any progress before we switch
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    drawEmotion(ctx, xOffset, yOffset, emotionHandler) {
        const x = this.gameObject.x + 3 + xOffset;
        const y = this.gameObject.y - 29 + yOffset; 

        if (this.gameObject.emoting) {
            emotionHandler.emote(ctx, x, y, this.gameObject.emoting);
        }
    }

    draw(ctx, xOffset, yOffset) {
        const x = this.gameObject.x - 8 + xOffset;
        const y = this.gameObject.y - 18 + yOffset; 

        const [spriteFrameX, spriteFrameY] = this.frame;
        
        this.isShadowLoaded && ctx.drawImage(this.shadow, x,y)
        this.isLoaded && ctx.drawImage(
            this.image, 
            spriteFrameX * this.height, //left cut 
            spriteFrameY * this.width, //top cut,
            this.height, //width of cut
            this.width, //height of cut
            x, // Canvas X
            y, // Canvas Y
            this.height,
            this.width
         )
        this.updateAnimationProgress();
    }

    drawWithCameraPerson(ctx, cameraPerson) {
        const x = this.gameObject.x - 8 + utils.withGrid(MAP_TOP_X*2) - cameraPerson.x;
        const y = this.gameObject.y - 18 + utils.withGrid(MAP_TOP_Y*2) - cameraPerson.y; 

        const [spriteFrameX, spriteFrameY] = this.frame;
        
        this.isShadowLoaded && ctx.drawImage(this.shadow, x,y)
        this.isLoaded && ctx.drawImage(
            this.image, 
            spriteFrameX * 32, //left cut 
            spriteFrameY * 32, //top cut,
            32, //width of cut
            32, //height of cut
            x, // Canvas X
            y, // Canvas Y
            32,
            32
         )
        this.updateAnimationProgress();
    }
}
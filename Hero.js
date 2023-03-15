class Hero {
    constructor(overworld) {
        this.overworld = overworld;
        this.width = 32;
        this.height = 32;

        // TODO: Replace with initial coordiants from this.map
        this.x = utils.withGrid(6);
        this.y = utils.withGrid(2);

        this.speedX = 0;
        this.speedY = 0;

        this.maxSpeed = 1;
        this.sprite = new Sprite({
            gameObject: overworld,
            src: "/images/characters/people/hero.png",
        })

    }

    draw(context) {
        const x = this.x - 12 + utils.withGrid(MAP_TOP_X);
        const y = this.y - 18 + utils.withGrid(MAP_TOP_Y); 

        // context.fillRect(x, y, this.width, this.height);
        // this.sprite.updateAnimationProgress();
        this.sprite.draw(context);

    }

    setSpeed(speedX, speedY) {
        this.speedX = speedX;
        this.speedY = speedY;

    }

    update(direction) {
        // if (this.)
        if (direction === 'left') {
            this.setSpeed(-this.maxSpeed, 0)
        } else if (direction === 'right') {
            this.setSpeed(this.maxSpeed, 0)
        } else if (direction === 'up') {
            this.setSpeed(0, -this.maxSpeed)
        } else if (direction === 'down') {
            this.setSpeed(0, this.maxSpeed)
        } else {
            this.setSpeed(0,0)
        }
        if (this.overworld.map.isSpaceTaken(this.x, this.y, direction)) {
            this.setSpeed(0,0);
        }
        this.x += this.speedX;
        this.y += this.speedY;
    }

}
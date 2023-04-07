class CameraHandler {
    constructor(config) {
        // const MAP_TOP_X = 3.5;
        // const MAP_TOP_Y = 3.5
        this.defaultConfig = {
            mapWidth: utils.withGrid(33),
            mapHeight: utils.withGrid(17),
            small: {
                followHero: true,
                cameraX: utils.withGrid(5),
                cameraY: utils.withGrid(5),
                boundaries: {
                    left: utils.withGrid(2),
                    right: utils.withGrid(2),
                    up: utils.withGrid(5),
                    down:  utils.withGrid(8)
                }
            },
            medium: {
                followHero: true,
                cameraX: utils.withGrid(7),
                cameraY: utils.withGrid(7),
                boundaries: {
                    left: utils.withGrid(4),
                    right: utils.withGrid(16),
                    up: utils.withGrid(5),
                    down:  utils.withGrid(8)
                }
            }
        }
        this.config = { ...this.defaultConfig, ...config };

        this.size = window.sizeState.size ?? "medium";

        // console.log(`size: ${this.size}`);

        this.followHero = this.config?.[this.size]?.followHero;

        // different for small/medium
        // small
        this.cameraX = this.config[this.size]?.cameraX;
        this.cameraY = this.config[this.size]?.cameraY;

        // grab from this.config
        this.mapWidth = this.config.mapWidth;
        this.mapHeight = this.config.mapHeight;


        // this.boundaryUp = up ?? 0;
        // this.boundaryDown = this.mapHeight - down ?? this.mapHeight - utils.withGrid(6);

        // this.boundaryLeft = this.config.boundaryLeft ?? utils.withGrid(3);
        // medium
        // this.boundaryRight = this.mapWidth - utils.withGrid(16);
        
        // small
        // this.boundaryRight = this.size == "small" ? this.mapWidth - utils.withGrid(4) : this.mapWidth - utils.withGrid(16);
    }

    get cameraPos() {
        return {
            x: this.config[this.size].cameraX,
            y: this.config[this.size].cameraY
        }
    }

    get boundaries() {
        const { left, right, up, down } = this.config[this.size].boundaries ?? this.defaultConfig[this.size].boundaries;
        return {
            up,
            down: this.mapHeight - down,
            left,
            right: this.mapWidth - right
        }
    }

    getCameraX(heroX) {
        if (!this.followHero) {
            return this.cameraX;
        }

        const { left, right } = this.boundaries;

        if (heroX < right && heroX > left ) {
            return (this.cameraX - heroX);
        }
        
        if (heroX <= left) {
            return this.cameraX - left;
        }
        
        if (heroX >= right) {
            return this.cameraX - right;
        }
    }

    getCameraY(heroY) {
        if (!this.followHero) {
            return this.cameraY;
        }

        const { up, down } = this.boundaries;

        if (heroY < down && heroY > up ) {
            return (this.cameraY - heroY);
        }
        
        if (heroY <= up) {
            return this.cameraY - up;
        }
        
        if (heroY >= down) {
            return this.cameraY - down;
        }
    }

    shiftCameraY() {
        // this.cameraX = this.size == "small" ? utils.withGrid(5) : utils.withGrid(7);

        this.followHero = this.config?.[this.size]?.followHero ?? this.defaultConfig?.[this.size]?.followHero;

        // different for small/medium
        // small
        this.cameraX = this.config?.[this.size]?.cameraX ?? this.defaultConfig?.[this.size]?.cameraX;
        this.cameraY = this.config?.[this.size]?.cameraY ?? this.defaultConfig?.[this.size]?.cameraY;
    }

    updateSize({ newSize }) {
        console.log("Resizing...");
        console.log(newSize);
        // this.shiftCameraX(newSize);
        this.size = newSize;
        // this.shiftBoundaryX();
        this.shiftCameraY();
        // this.boundaryRight = this.size == "small" ? this.mapWidth - utils.withGrid(4) : this.mapWidth - utils.withGrid(16);

    }

    init() {
        document.addEventListener("CanvasSizeChanged", utils.debounce((e)=> {
            this.updateSize(e.detail)
        }));
    }
}
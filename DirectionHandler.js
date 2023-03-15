class DirectionHandler {
    constructor() {
        // Keep track of arrows in array
        this.heldDirections = [];

        this.map = {
            "ArrowUp": "up",
            "ArrowDown": "down",
            "ArrowLeft": "left",
            "ArrowRight": "right",
            "KeyW": "up",
            "KeyS":"down",
            "KeyA": "left",
            "KeyD": "right",
        }

    }

    get direction() {
        return this.heldDirections[0];
    }

    init() {
        document.addEventListener("keydown", e=> {
            const dir = this.map[e.code];
            if (dir && this.heldDirections.indexOf(dir)===-1) {
                this.heldDirections.unshift(dir);
            }
        })
        document.addEventListener("keyup", e=> {
            const dir = this.map[e.code];
            const idx = this.heldDirections.indexOf(dir);
            if (idx> -1) {
                this.heldDirections.splice(idx, 1);
            }
        })
    }
}

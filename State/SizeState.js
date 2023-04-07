class SizeState {
    constructor() {
        this.size = "small";
        this.offsetMap = {
            "small": 100,
            "medium": 0,
        }
    }

    get heroOffsetX() { 
        return this.offsetMap[this.size] ?? 0 
    }

    updateSize(newSize) {
        this.size = newSize;
    }
}
window.sizeState = new SizeState();
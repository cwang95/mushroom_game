class KeypressListener {
    constructor(keyCode, callback) {
        let keySafe = true;
        this.keyDownFunction = function(event) {
            if(event.code == keyCode || keyCode == "AllKeys") {
                if (keySafe) {
                    keySafe = false;
                    callback();
                }
            }
        }
        this.keyUpFunction = function(event) {
            if(event.code == keyCode || keyCode == "AllKeys") {
                keySafe = true;
            }
        }
        document.addEventListener("keydown", this.keyDownFunction)
        document.addEventListener("keyup", this.keyUpFunction)
    }

    unbind() {
        document.removeEventListener("keydown", this.keyDownFunction)
        document.removeEventListener("keyup", this.keyUpFunction)
    }
}
class GameController {
    constructor(config) {
        this.element = config.element;
    }
    
    createElement() {
        this.controllerElement = document.createElement("div");
        this.controllerElement.innerHTML =[`
            <button id="ArrowUp" class="up arrow"> UP </button>
            <br/>
            <button id="ArrowLeft" class="left arrow"> LEFT </button>
            <button id="ArrowDown" class="down arrow"> DOWN </button>
            <button id="ArrowRight" class="right arrow"> RIGHT </button>
        `]
        this.controllerElement.querySelectorAll("button").forEach((button)=> {
            button.addEventListener('mousedown', () => {
                utils.emitEvent("ControllerMousedown", { code: button.id });
            });
            button.addEventListener('mouseup', () => {
                utils.emitEvent("ControllerMouseup", { code: button.id });
            });
            button.addEventListener('pointerdown', () => {
                utils.emitEvent("ControllerMousedown", { code: button.id });
            });
            button.addEventListener('pointerup', () => {
                utils.emitEvent("ControllerMouseup", { code: button.id });
            });
        })
    }

    init() {
        this.createElement()
        this.element.appendChild(this.controllerElement)
        // this.element.addEventListener('keydown', function(e){console.log(e.target.innerText);});
    }
}

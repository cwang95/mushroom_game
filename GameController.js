
function getRelativeCoordinates (event, referenceElement) {

    const position = {
      x: event.pageX,
      y: event.pageY
    };
  
    const offset = {
      left: referenceElement.offsetLeft,
      top: referenceElement.offsetTop
    };
  
    let reference = referenceElement.offsetParent;
  
    while(reference){
      offset.left += reference.offsetLeft;
      offset.top += reference.offsetTop;
      reference = reference.offsetParent;
    }
  
    return { 
      x: position.x - offset.left,
      y: position.y - offset.top,
    }; 
  
  }

function getDirection(x, y) {
    if ( y >= 70 ) { //
        return "ArrowDown";
    } else if (x <=40) {
        return "ArrowLeft";
    } else if (x >= 80) {
        return "ArrowRight";
    } else if (y <=40 ) {
        return "ArrowUp";
    }
    return null;
}
class GameController {
    constructor(config) {
        this.element = config.element;
        this.direction = null;
    }
    
    createElement() {
        this.engagementElement = document.createElement("div");
        this.engagementElement.classList.add("engage");
        this.engagementElement.innerHTML =[`
            <button id="Engagement"> Engage </button>
        `]

        //ControllerEngagement
        this.engagementElement.addEventListener("click", (e) => {
            e.preventDefault();
            utils.emitEvent("ControllerEngagement", {});
        })

        this.controllerElement = document.createElement("div");
        this.controllerElement.classList.add("controller");
        this.controllerElement.innerHTML =[`
            <button id="ArrowUp" class="up arrow"> UP </button>
            <br/>
            <br/>
            <button id="ArrowLeft" class="left arrow"> LEFT </button>
            <button id="ArrowDown" class="down arrow"> RIGHT </button>
            <br/>
            <br/>
            <button id="ArrowRight" class="right arrow"> DOWN </button>
        `]
        this.controllerElement.addEventListener("pointerover", (e) => {
            e.preventDefault();
            const { x, y } = getRelativeCoordinates(e, this.controllerElement);
            const nextDirection = getDirection(x, y) ?? this.direction;
            this.direction = nextDirection;
            utils.emitEvent("ControllerMousedown", { code: nextDirection });
        })

        this.controllerElement.addEventListener("pointermove", (e) => {
            e.preventDefault();
            const { x, y } = getRelativeCoordinates(e, this.controllerElement);
            const nextDirection = getDirection(x, y);
            if (nextDirection == null || nextDirection === this.direction ) {
                utils.emitEvent("ControllerMousedown", { code: this.direction });
            } else {
                utils.emitEvent("ControllerMouseup", { code: this.direction });
                this.direction = nextDirection;
                utils.emitEvent("ControllerMousedown", { code: nextDirection });
            }
        })
        // this.controllerElement.addEventListener("touchmove", (e) => {
        //     e.preventDefault();
        //     console.log("touch movving");
        // })
        // // this.controllerElement.addEventListener("pointermove", (e) => {
        //     e.preventDefault();
        //     console.log("pointer movving");
        // })
        this.controllerElement.addEventListener("pointerleave", (e) => {
            e.preventDefault();
            utils.emitEvent("ControllerMouseup", { code: this.direction });
        })

        // this.controllerElement.querySelectorAll(".arrow").forEach((button)=> {
        //     button.addEventListener('pointerenter', (e) => {
        //         // e.preventDefault()
        //         console.log("pointer entered");
        //         utils.emitEvent("ControllerMousedown", { code: button.id });
        //     });
        // })
    }

    init() {
        this.createElement();
        this.element.appendChild(this.controllerElement);
        this.element.appendChild(this.engagementElement);
        // this.element.addEventListener('keydown', function(e){console.log(e.target.innerText);});
    }
}

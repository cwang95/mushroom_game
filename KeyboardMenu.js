class KeyboardMenu {
    constructor({className}) {
      this.options = []; //set by updater method
      this.className = className;
    }
  
    setOptions(options) {
      this.options = options;
      this.element.innerHTML = this.options.map((option, index) => {
        const disabledAttr = option.disabled ? "disabled" : "";
        const classes = option.classList?.join(" ") ?? "";
        const dataButton = option.data ?? "";
        return (`
            <button class="${classes}" ${disabledAttr} data-button="${dataButton}_${index}" data-description="${option.description}">
              ${option.label}
            </button>
        `)
      }).join("");
  
    //   <button class="Pda_button Overlay_button" data-button="showMap">Map</button>

      this.element.querySelectorAll("button").forEach((button, index) => {
        button.addEventListener("click", () => {
          const chosenOption = this.options[ index ];
          chosenOption.handler();
        })
      })
    }
  
    createElement() {
      this.element = document.createElement("div");
      this.element.classList.add(this.className);
    }
  
    end() {
      //Remove menu element and description element
      this.element.remove();
    }
  
    init(container) {
      this.createElement();
      container.appendChild(this.element);
    }
  
  }
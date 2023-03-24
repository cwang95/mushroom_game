class Overlay {
    constructor() {
        this.element = null;
        this.isActive = false;
        this.innerElements = null;
    }

    show(chosen) {
        if (this.isActive == false) {
            this.isActive = true;
            this.element.style.display = "block";
        }
        this.innerElements.map(elem => {
            if (elem.id === chosen) elem.show();
            else elem.hide();
        });
    }

    hide() {
        this.isActive = false;
        this.element.style.display = "none";
    }

    setInnerElements(elements) {
        elements.forEach(elem => {
            console.log(elem);
            elem.init(this.innerComponent);
        });
        this.innerElements = elements;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Overlay");
        this.element.innerHTML = (`
          <div class="Overlay_component"></div>
          <button class="Overlay_exit" data-button="Close_overlay">Close</button>
        `);

        this.element.querySelector("button").addEventListener("click", () => {
          this.hide();
        });
        
        this.innerComponent = this.element.querySelector(".Overlay_component");
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}
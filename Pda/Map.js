class Map {
    constructor() {
        this.element = null;
        // this.onComplete = 
        this.isActive = false;
    }

    show() {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Map");
        this.element.innerHTML = (`
          <p class="Map_title">Map</p>
          <button class="Map_button">Map button</button>
        `);

        this.element.querySelector("button").addEventListener("click", () => {
          //Close the text message
          console.log("Map button clicked");
        });
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}
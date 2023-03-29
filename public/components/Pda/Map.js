import OverlayComponent from "../OverlayComponent";

export default class Map extends OverlayComponent {
    constructor(config) {
        super(config);
        this.id = "Map"
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
}
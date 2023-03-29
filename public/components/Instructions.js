import OverlayComponent from './OverlayComponent';

export default class Instructions extends OverlayComponent {
    constructor(config) {
        super(config);
        this.id = "Instructions";
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Instructions");
        this.element.innerHTML = (`
          <p class="Instructions_title">HELP ME!</p>
        `);
    }
}
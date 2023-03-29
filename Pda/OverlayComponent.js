class OverlayComponent {
    constructor() {
        this.element = null;
        this.isActive = false;
    }

    show() {
        this.element.style.display = "block";
        this.isActive = true;
    }

    hide() {
        this.element.style.display = "none";
        this.isActive = false;
    }

    createElement() {

    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}
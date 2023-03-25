class Instructions extends OverlayComponent {
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

class Settings {
    constructor() {
        this.actionListeners = [];
    }

    bindListeners() {
        this.actionListeners.push(new KeypressListener("Enter", ()=> {
            this.done();
        }));
        this.actionListeners.push(new KeypressListener("Space", ()=> {
            this.done();
        }));
    }

    done() {
        this.overlay.hide();
        this.actionListeners.map(al => al.unbind());
    }

    show() {
        this.overlay.show("Instructions");
    }

    // createElement()
    init(container) {
        this.overlay = new Overlay();
        this.overlay.init(container);
        this.overlay.setInnerElements([new Instructions()])
        this.bindListeners();
    }
}
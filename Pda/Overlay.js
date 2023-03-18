class Overlay {
    constructor() {
        this.element = null;
        // this.onComplete = 
        this.isActive = false;

        this.map = null;
        this.inbox = null;
    }

    showMap() {
        this.map.show();
        this.inbox.hide();
    }

    showInbox() {
        this.inbox.show();
        this.map.hide();
    }


    show(chosen) {
        if (this.isActive == false) {
            this.isActive = true;
            this.element.style.display = "block";
        }
        this[chosen]();
    }

    hide() {
        this.isActive = false;
        this.element.style.display = "none";
    }

    update() {
        this.inbox.update();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Overlay");
        this.element.innerHTML = (`
          <div class="Overlay_component"></div>
          <button class="Overlay_exit" data-button="Close_overlay">Close</button>
        `);

        this.element.querySelector("button").addEventListener("click", () => {
          //Close the text message
          this.hide();
        });
        
        const overlayComponent = this.element.querySelector(".Overlay_component");

        // Mount PDA components
        this.map = new Map();
        this.map.init(overlayComponent);

        this.inbox = new Inbox();
        this.inbox.init(overlayComponent);
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}
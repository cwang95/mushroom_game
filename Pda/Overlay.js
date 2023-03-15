class Overlay {
    constructor() {
        this.element = null;
        // this.onComplete = 
        this.isActive = false;

        this.map = null;
        this.inbox = null;
    }

    showMap() {
        console.log("Show map!")
        this.map.show();
        this.inbox.hide();
    }

    showInbox() {
        console.log("Show inbox!")
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

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Overlay");
        this.element.innerHTML = (`
          <p class="Overlay_title">${this.type}</p>
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
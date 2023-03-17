class Pda {
    constructor(progress) {
        this.openMap = false;
        this.openInbox = false;
        this.openChat = false;
        this.hasNewMessages = false;
        this.progress = progress;

    }

    update() {
        const { clockState, playerState } = window;
        // const clockElement = this.pdaElement.querySelector(".Pda_clock");
        // clockElement.innerText = clockState.getTime();
        // const inboxElement = this.pdaElement.querySelector(".Pda_inbox");
        // inboxElement.innerText = `${playerState.inbox.length}`;
        console.log("PDA update")

        this.overlayElement.update();
    }

    createElement() {
        this.pdaElement = document.createElement("div");
        this.pdaElement.classList.add("Pda");
        this.pdaElement.innerHTML = (`
          <p class="Pda_title">PDA</p>
          <button class="Pda_button Overlay_button" data-button="showMap">Map</button>
          <button class="Pda_button Overlay_button" data-button="showInbox">Inbox</button>
          <button class="Pda_button Pda_save_button" data-button="saveGame">Save</button>
        `);

        this.pdaElement.querySelectorAll(".Overlay_button").forEach(button => {
          button.addEventListener("click", () => {
            const chosen = button.dataset.button;
            this.overlayElement.show(chosen);
          })
        })

        this.pdaElement.querySelector(".Pda_save_button").addEventListener("click", () => {
          this.progress.save();
        });
    }



    init(container) {
        this.createElement();
        this.overlayElement = new Overlay();
        this.overlayElement.init(container);
        container.appendChild(this.pdaElement);
    }
}
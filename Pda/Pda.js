class Pda {
    constructor(progress) {
        this.openMap = false;
        this.openInbox = false;
        this.openChat = false;
        this.hasNewMessages = false;
        this.progress = progress;

        this.activeElement = null;
    }

      getOptions() {
        return [
            {
                label: "my.Cellium",
                classList: ["Pda_title"],
                data: "PdaButton",
                disabled: true,
                handler: ()=> {}
            },
            {
                label: "Map",
                classList: ["Pda_button", "Overlay_button"],
                data: "PdaButton",
                handler: ()=> {
                    this.overlayElement.show("Map");
                }
            },
            {
                label: "Inbox",
                classList: ["Pda_button", "Overlay_button"],
                data: "PdaButton",
                handler: ()=> {
                    this.overlayElement.show("Inbox");
                }
            },
            {
              label: "Save",
              classList: ["Pda_button", "Pda_save_button"],
              data: "PdaButton",
              handler: ()=> {
                  this.progress.save();
              }

            }
        ];
    }

    createElement() {
        this.pdaElement = document.createElement("div");
        this.pdaElement.classList.add("PdaContainer");

        this.keyboardMenu = new KeyboardMenu({ className: "Pda" });
        this.keyboardMenu.init(this.pdaElement);
        this.keyboardMenu.setOptions(this.getOptions());
    }

    init(container) {
        this.createElement();
        this.overlayElement = new Overlay();
        this.overlayElement.init(container);
        this.overlayElement.setInnerElements([new Map(), new Inbox()])
        container.appendChild(this.pdaElement);
    }
}
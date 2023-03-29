class TitleScreen {
    constructor({ progress }) {
        this.progress = progress;
    }

    getOptions(resolve) {
        return [
            {
                label: "New Game",
                handler: ()=> {
                    this.close();
                    resolve();
                }
            },
            {
                label: "Load Game",
                handler: ()=> {
                    this.close();
                    resolve(true);
                }
            },
            // continue option
        ];
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");
        this.element.innerHTML = (
            `
            <img class="TitleScreen_logo" src = "/images/logo.png" alt="Pizza Legends" />
            `
        );

    }

    close() {
        this.keyboardMenu.end();
        this.element.remove();
    }

    init(container) {
        return new Promise(resolve => {
            this.createElement();
            container.appendChild(this.element);
            this.keyboardMenu = new KeyboardMenu({ className: "NewGameButton" });
            this.keyboardMenu.init(this.element);
            this.keyboardMenu.setOptions(this.getOptions(resolve));

        })
    }
}
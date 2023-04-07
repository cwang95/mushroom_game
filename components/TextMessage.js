class TextMessage {
    constructor({text, isChat, from, onComplete}) {
        this.text = text;
        this.from = from;
        this.isChat = isChat;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        // Create element
        this.element = document.createElement("div");
        if (this.isChat) this.element.classList.add("ChatMessage")
        else this.element.classList.add("TextMessage")

        if (window.sizeState.size == "small") this.element.classList.add("sizeSmall")

        const headline = this.isChat ? `New chat from ${this.from}` : `${this.from}`;

        this.element.innerHTML =[`
            <p class="TextMessage_from">${headline}: </p>
            <p class="TextMessage_p"></p>
            <button class="TextMessage_button">${this.isChat ? "Ok" : "Next"}</button>
        `]

        // Initialize typewriter effect
        this.revealingText = new RevealingText({
            text: this.text,
            element: this.element.querySelector(".TextMessage_p")
        })

        this.element.querySelector("button").addEventListener("click", ()=> {
            // Close message
            this.done();
        })

        this.actionListener = new KeypressListener("Enter", ()=> {
            this.done();
        })
    }

    done() {
        if (this.revealingText.isDone || this.isChat) {
            this.actionListener.unbind();
            this.element.remove();
            this.onComplete();
        } else {
            this.revealingText.warpToDone();
        }
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
        this.revealingText.init();
    }
}
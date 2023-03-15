class MultiMessage {
    constructor({ texts, responses, onComplete }) {
        this.texts = [...texts];
        this.responses = [...responses];
        this.element = null;
        this.message = null;
        this.onComplete = onComplete;
        this.container = null;

        this.isDialogFinished = false;
    }

    nextSlide() {
        // Remove n
        const nextText = this.texts.splice(0,1)[0];
        if (nextText != null && !this.isDialogFinished) {
            this.message = new TextMessage({
                text: nextText, 
                onComplete: () => this.nextSlide()
            })
            this.message.init(this.container);
        } else {
            this.isDialogFinished = true;
            this.onComplete()
        }
    }

    init(container) {
        this.container = container;
        this.nextSlide();
    }
}
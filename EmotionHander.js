class EmotionHandler {
    constructor() {
        // Emotions
        this.emotions = new Image();
        this.emotions.src = "./images/emotes/emotes.png";
        this.emotions.onload = () => {
            this.isEmotionsLoaded = true;
        }

        this.emotionMap = {
            "blush" : [0,0],
            "heart": [0,1],
            "smile"   : [0,2],
            "angry" : [1,0],
            "frown" : [1,1],
            "neutral": [1,2],
            "exclamation" : [2,0],
            "dots" : [2,1],
            "x" : [2,2],
        }
    }
    
    emote(ctx, x, y, emotion = "blush") {
        const [frameX, frameY] = this.emotionMap[emotion];
        this.isEmotionsLoaded && ctx.drawImage(
            this.emotions, 
            frameY * 11, //left cut 
            frameX * 11, //top cut,
            11, //width of cut
            11, //height of cut
            x, // Canvas X
            y, // Canvas Y
            11,
            11
        );
    }
}
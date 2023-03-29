export default class Progress {
    constructor() {
        this.saveFileKey = "MushroomProgress_SaveFile1";
        this.mapId = "Bedroom";
        this.startingHeroX = 0;
        this.startingHeroY = 0;
        this.startingHeroDirection = "down";

    }

    save() {
        window.localStorage.setItem(this.saveFileKey, JSON.stringify({
            mapId: this.mapId,
            startingHeroX: this.startingHeroX,
            startingHeroY: this.startingHeroY,
            startingHeroDirection: this.startingHeroDirection,
            playerState: {
                storyFlags: playerState.storyFlags,
                inbox: playerState.inbox
            },
            clockState: {
                time: clockState.time
            }
        }))
    }

    getSaveFile() {
        const file = window.localStorage.getItem(this.saveFileKey);
        return file ? JSON.parse(file) : null;
    }

    load() {
        const file = this.getSaveFile();
        if (file) {
            this.mapId = file.mapId;
            this.startingHeroX = file.startingHeroX;
            this.startingHeroY = file.startingHeroY;
            this.startingHeroDirection = file.startingHeroDirection;
            Object.keys(file.playerState).forEach(key=> {
                playerState[key] = file.playerState[key];
            });
            Object.keys(file.clockState).forEach(key=> {
                clockState[key] = file.clockState[key];
            });
        }
    }
}
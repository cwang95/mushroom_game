import Sprite from "./Sprite";

export default class GameObject {
    constructor(config) {
        this.id = null;
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "./images/characters/people/hero.png",
            height: config.height,
            width: config.width,
            offsetWidth: config.offsetWidth,
            offsetHeight: config.offsetHeight
        })

        // Grab behavior loop from config or set to nothing
        this.behaviorLoop = config.behaviorLoop || [];

        // Starting behavior loop index is 0
        this.behaviorIndex = 0;

        this.talking = config.talking || [];
        this.loopId = null;
    }

    mount(map) {
        this.isMounted = true;
        const uniq = 'id' + (new Date()).getTime();

        this.loopId = uniq;

        // Mount a "wall" in position of game object
        // map.addWall(this.x, this.y);

        // Kick off internal behaviors after a short delay
        setTimeout(()=> {
            this.doBehaviorEvent(map);
        }, 100)
    }

    unmount(map) {
        this.isMounted = false;
    }

    async doBehaviorEvent(map) {
        // Pause behaviors if cutscene is playing or no behavior loop set
        if (!this.isMounted || map.isCutscenePlaying || this.behaviorLoop.length == 0 || this.isStanding) {
            return;
        }

        // Set up event with config and ID
        let eventConfig = this.behaviorLoop[this.behaviorIndex];
        eventConfig.who = this.id;

        // Create a new event out of the given config
        const eventHandler = new OverworldEvent({ map, event: eventConfig});

        // Kick off current event and emit it
        // Wait on it to finish before moving on (hence the await)
        // "init" might be better characterized as "kick off"
        // Returns a promise that 
        await eventHandler.init();

        // Set next event to fire
        this.behaviorIndex += 1;
        if (this.behaviorIndex === this.behaviorLoop.length) {
            this.behaviorIndex = 0;
        }

        // Repeat behavior
        this.doBehaviorEvent(map);
    }

    update() {

    }
}
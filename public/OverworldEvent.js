import SceneTransition from "./components/SceneTransition";
import TextMessage from "./components/Text/TextMessage";
import utils from "./utils";

export default class OverworldEvent {
    constructor({ map, event}) {
        this.map = map;
        this.event = event;
    }


    stand(resolve) {
        // pulls reference on window to actual game object
        const who = this.map.gameObjects[this.event.who];

        who.startBehavior({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        })


        /**
         * Create a handler that will be triggered when "PersonWalkingComplete" is emitted
         * with the current overworld event "who" ID & ispatch the resolve
         * 
         * @param {*} e Event  object that's attached to "PersonWalkingComplete" dispatch
         * Will contain information on which object emitted the "PersonWalkingComplete"
         */
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                
                // when this is triggered, await Promise will be resolved
                resolve();
            }
        }

        // Attach the complete handler to PersonWalkingComplete dispatch event
        document.addEventListener("PersonStandComplete", completeHandler)
    }

    emote(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.emoting  = this.event.emotion;
        setTimeout(()=> {
            who.emoting  = null;
        }, this.event.time);

        resolve();
    }

    teleport(resolve) {
        const who = this.map.gameObjects[this.event.who];
        // setTimeout(()=> {
        //     who.emoting  = null;
        // }, this.event.time);
        who.x = this.event.coordinates.x;
        who.y = this.event.coordinates.y;

        resolve();
    }

    walk(resolve) {
        // pulls reference on window to actual game object
        const who = this.map.gameObjects[this.event.who];

        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })


        /**
         * Create a handler that will be triggered when "PersonWalkingComplete" is emitted
         * with the current overworld event "who" ID & ispatch the resolve
         * 
         * @param {*} e Event  object that's attached to "PersonWalkingComplete" dispatch
         * Will contain information on which object emitted the "PersonWalkingComplete"
         */
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }

        // Attach the complete handler to PersonWalkingComplete dispatch event
        document.addEventListener("PersonWalkingComplete", completeHandler)
    }

    textMessage(resolve) {
        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }
        const message = new TextMessage({
            text: this.event.text, 
            isChat: false,
            from: this.event.from || "Boop", // TODO: UPDATE TEXT TO CONTAIN FROM
            onComplete: () => resolve()
        })

        message.init(document.querySelector(".game-container"))
    }

    chatMessage(resolve) {
        const updateInbox = () => {
            const { playerState }  = window;
            playerState.addInboxItem({ 
                text: this.event.text, 
                from: this.event.from, 
                time: "0", 
                acknowledged: false 
            })
            utils.emitEvent("NewInboxItem", { text: this.event.text, from: this.event.from, acknowledged: false });
            resolve();
        }

        const message = new TextMessage({
            text: this.event.text,
            isChat: true,
            from: this.event.from,
            onComplete: updateInbox
        })

        message.init(document.querySelector(".game-container"))
    }

    multiMessage(resolve) {
        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }
        const multiMessage = new MultiMessage({
            texts: this.event.texts, 
            responses: this.event.responses,
            onComplete: () => {
                utils.emitEvent("ConversationComplete", { whoId: this.id });
            }
        })
        multiMessage.init(document.querySelector(".game-container"));
        const completeHandler = e => {
            document.removeEventListener("ConversationComplete", completeHandler);
            resolve();
        }

        // Attach the complete handler to PersonWalkingComplete dispatch event
        document.addEventListener("ConversationComplete", completeHandler)
    }

    changeMap(resolve) {
        const sceneTransition = new SceneTransition();
        this.map.unmountObjects()

        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverworldMaps[this.event.map], this.event.heroConfig);
            resolve();

            sceneTransition.fadeOut();
        })
    }

    addStoryFlag(resolve) {
        window.playerState.storyFlags[this.event.flag] = true;
        utils.emitEvent("StoryFlagAdded", { flag: this.event.flag });
        resolve();
    }

    removeStoryFlag(resolve) {
        window.playerState.storyFlags[this.event.flag] = false;
        utils.emitEvent("StoryFlagRemoved", { flag: this.event.flag });
        resolve();
    }

    init() {
        return new Promise(resolve => {
            // this.event.type => walk/stand
            this[this.event.type](resolve);
        });
    }
}
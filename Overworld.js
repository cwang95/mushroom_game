// Keeps track of state
// Overall world of game
class Overworld {
 constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    //  this.width = config.width;
    //  this.height = config.height;
 }

 startGameLoop() {
    let lastTime = 0;
    const step = (timeStamp) => {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;

      // Clear previous canvas 
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.map.updateObjects({
        map: this.map,
        arrow: this.directionHandler.direction,
        deltaTime: deltaTime
      })

      this.map.draw(this.ctx);

      requestAnimationFrame((ts)=>{ step(ts)})
   }
   step(lastTime);
 }

 bindActionHandlers() {
   new KeypressListener("Enter", ()=> {
     // Check for person
     this.map.checkForActionCutscene();
   });
 }

 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId==="hero") {
       this.map.checkForFootstepCutscene();
     }
   })
 }

 bindClockCheck() {
  document.addEventListener("TimePassed", e  => {
    this.map.checkForTimedCutscene();
  })
 }

 startMap(mapConfig, heroConfig = null) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
    if (heroConfig) {
      this.map.gameObjects.hero.x = heroConfig.x;
      this.map.gameObjects.hero.y = heroConfig.y;
      this.map.gameObjects.hero.direction = heroConfig.direction;
    }
    this.map.playInitialScenes();

    this.progress.mapId = mapConfig.id;
    this.progress.startingHeroX =  this.map.gameObjects.hero.x;
    this.progress.startingHeroY =  this.map.gameObjects.hero.y;
    this.progress.startingHeroDirection =  this.map.gameObjects.hero.direction;
 }

 async init() {
    const container = document.querySelector(".game-container");
    this.progress = new Progress();

    // show title screen
    // this.titleScreen = new TitleScreen({
    //   progress: this.progress
    // })

    // const useSaveFile = await this.titleScreen.init(container);

    let heroInitial = null;
    const savedMap = this.progress.getSaveFile();
    if (savedMap) {
      this.progress.load();
      heroInitial = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection
      }
    } else {
      this.instructions = new Instructions();
    }
    this.pda = new Pda(this.progress);
    this.pda.init(container);


    this.startMap(window.OverworldMaps[this.progress.mapId], heroInitial);

    this.bindActionHandlers();
    this.bindHeroPositionCheck();
    this.bindClockCheck();

    this.directionHandler = new DirectionHandler();
    this.directionHandler.init();

    this.startGameLoop();
  }
}
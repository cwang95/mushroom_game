class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.canvas.style.width='100%';
    this.canvas.style.height='100%';
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  resizeCanvas() {
    console.log("x: " + window.innerWidth+"      y: " + window.innerHeight);
    if (window.innerWidth <= 865) {
      this.element.style.width='200px';
      window.sizeState.updateSize("small");
    }
    if (window.innerWidth >= 865) {
      this.element.style.width='400px';
      window.sizeState.updateSize("medium");
    }
    this.canvas.style.width='100%';
    this.canvas.style.height='100%';
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    if (this.pda!= null) this.pda.updateSize();
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

      requestAnimationFrame((ts) => { step(ts) })
    }
    step(lastTime);
  }

  bindActionHandlers() {
    new KeypressListener("Enter", () => {
      // Check for person
      this.map.checkForActionCutscene();
    });
  }

  bindResizeHandler() {
    window.addEventListener("resize", utils.debounce((e)=> {this.resizeCanvas(e)}));
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        this.map.checkForFootstepCutscene();
        this.map.checkForStaticObjectAnimation();
      }
    })
  }

  bindClockCheck() {
    document.addEventListener("TimePassed", e => {
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
      if (heroConfig.nearDoor) {
        const door = this.map.gameObjects[heroConfig.nearDoor];
        door?.propOpen();
      }
    }
    this.map.playInitialScenes();

    this.progress.mapId = mapConfig.id;
    this.progress.startingHeroX = this.map.gameObjects.hero.x;
    this.progress.startingHeroY = this.map.gameObjects.hero.y;
    this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
  }

  async init() {
    this.progress = new Progress();

    // show title screen
    // this.titleScreen = new TitleScreen({
    //   progress: this.progress
    // })

    // const useSaveFile = await this.titleScreen.init(this.element);

    this.settings = new Settings();
    this.settings.init(this.element);

    let heroInitial = null;
    const savedMap = this.progress.getSaveFile();
    if (savedMap) {
      this.progress.load();
      heroInitial = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection
      }
    }

    this.pda = new Pda(this.progress);
    this.pda.init(this.element);

    this.emotionHandler = new EmotionHandler();


    this.startMap(window.OverworldMaps[this.progress.mapId], heroInitial);

    this.bindActionHandlers();
    this.bindResizeHandler()
    this.bindHeroPositionCheck();
    this.bindClockCheck();

    this.directionHandler = new DirectionHandler();
    this.directionHandler.init();

    this.resizeCanvas();

    this.startGameLoop();
  }
}
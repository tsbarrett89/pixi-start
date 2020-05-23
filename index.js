const Application = PIXI.Application;
const loader = PIXI.Loader.shared;
const resources = PIXI.Loader.shared.resources;
const Sprite = PIXI.Sprite;
const Container = PIXI.Container;
const Text = PIXI.Text;

let app = new Application({
    width: window.innerWidth,
    height: window.innerHeight
})

document.body.appendChild(app.view)

app.renderer.backgroundColor = 0x333;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

loader
    .add([
        "images/dragonRed.png",
        "images/warrior.png",
        "images/wizard.png",
        "images/wood.png"
    ])
    .load(setup);

let redDragon;
let warrior;
let wizard;
let board;
let state;

let messageBoard = new Container()
let messageStyle = ({
    fill: 'white'
})
let message = new Text("Practice Game", messageStyle)

function setup() {
    redDragon = new Sprite(
        resources["images/dragonRed.png"].texture
    );
    redDragon.position.set(200, 200);
    redDragon.scale.set(0.3);
    redDragon.anchor.set(0.5);
    redDragon.vx = 0;
    redDragon.vy = 0;
    app.stage.addChild(redDragon);

    warrior = new Sprite(
        resources["images/warrior.png"].texture
    );
    warrior.position.set(400, 400);
    warrior.scale.set(0.3);
    warrior.anchor.set(0.5);
    warrior.vx = 0;
    warrior.vy = 0;
    warrior.interactive = true;
    app.stage.addChild(warrior)

    wizard = new Sprite(
        resources["images/wizard.png"].texture
    )
    wizard.position.set(200, 400)
    wizard.scale.set(-0.3, 0.3);
    wizard.anchor.set(0.5);
    wizard.vx = 0;
    wizard.vy = 0;
    wizard.interactive = true;
    app.stage.addChild(wizard)

    board = new Sprite(
        resources["images/wood.png"].texture
    )
    board.width = app.renderer.width;
    board.height = 150;
    board.position.y = app.renderer.height - 150;
    messageBoard.addChild(board)

    message.position.y = app.renderer.height - 120;
    message.position.x = 50;
    message.interactive = true;
    message.click = () => message.text = "did it work?"
    messageBoard.addChild(message)

    app.stage.addChild(messageBoard)

    let left = keyboard("ArrowLeft")
    let up = keyboard("ArrowUp")
    let right = keyboard("ArrowRight")
    let down = keyboard("ArrowDown")
    let jump = keyboard("Tab")

    // left
    left.press = () => {
        redDragon.vx = -5;
        redDragon.vy = 0;
    };
    left.release = () => {
        if(!right.isDown && redDragon.vy === 0){
            redDragon.vx = 0;
        }
    };

    //up
    up.press = () => {
        redDragon.vy = -5;
        redDragon.vx = 0;
    };
    up.release = () => {
        if(!down.isDown && redDragon.vx === 0){
            redDragon.vy = 0
        }
    }

    //right
    right.press = () => {
        redDragon.vx = 5;
        redDragon.vy = 0;
    }
    right.release = () => {
        if(!left.isDown && redDragon.vy === 0){
            redDragon.vx = 0
        }
    }

    //down
    down.press = () => {
        redDragon.vy = 5;
        redDragon.vx = 0;
    }
    down.release = () => {
        if(!up.isDown && redDragon.vx === 0){
            redDragon.vy = 0
        }
    }

    //jump
    jump.press = () => {
        gsap.to(redDragon, {duration: 2, x: redDragon.x + 100})
        redDragon.vx = 0;
        warrior.vy = -2;
        warrior.vx = 0;
    }
    jump.release = () => {
        redDragon.vy = 0;
        warrior.vy = 0;
    }


    state = play;

    app.ticker.add(delta => gameLoop(delta))
}

function gameLoop(delta){
    state(delta)
}

function play(delta){
    redDragon.x += redDragon.vx;
    redDragon.y += redDragon.vy;
    warrior.x += warrior.vx;
    warrior.y += warrior.vy;
    wizard.x += wizard.vx;
    wizard.y += wizard.vy;
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
}

let keyObject = keyboard(keyValue)

keyObject.unsubscribe();

message.on("click", () => message.text = "Did it work?")
message.click = () => message.text = "did it work?"


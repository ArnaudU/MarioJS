import { State } from "../state/state";

//Dans le spritesheet preleve les images de mario move: position x de l'image dans le spritesheet 
//et sx sy sh sw pour donner les premiers parametres de la fonction drawImage
const MarioSpriteMovement = {
    motionless: { move: [5], sx: 30.2, sy: 0, sh: 30, sw: 18, dw: 65, dh: 105 },
    runLeft: { move: [0, 1, 2, 3, 4], sx: 31, sy: 0, sh: 30, sw: 18, dw: 65, dh: 105 },
    runRight: { move: [7, 8, 9, 10, 11], sx: 30, sy: 0, sh: 30, sw: 18, dw: 65, dh: 105 },
    swimingLeft: { move: [5, 4, 3], sx: 30, sy: 120, sh: 30, sw: 19, dw: 65, dh: 105 },
    swimmingRight: { move: [7, 8, 9], sx: 30, sy: 120, sh: 30, sw: 20, dw: 65, dh: 105 },
    jumpLeft: { move: [2, 3, 4], sx: 30, sy: 40, sh: 30, sw: 18, dw: 65, dh: 105 },
    jumpRight: { move: [7, 8, 9], sx: 30, sy: 40, sh: 30, sw: 18, dw: 65, dh: 105 },
    jumpStatic: { move: [5], sx: 30, sy: 80, sh: 30, sw: 18, dw: 65, dh: 105 },
    bendingLeft: { move: [1], sx: 123, sy: 167, sh: 15, sw: 18, dw: 65, dh: 50 },
    bendingRight: { move: [1], sx: 210, sy: 167, sh: 15, sw: 18, dw: 65, dh: 50 },
    lookingBehind: { move: [1], sx: 150, sy: 40, sh: 30, sw: 18, dw: 65, dh: 105 },
    lookingLeft: { move: [4], sx: 30, sy: 0, sh: 30, sw: 18, dw: 65, dh: 105 },
    lookingRight: { move: [7], sx: 30.25, sy: 0, sh: 30, sw: 18, dw: 65, dh: 105 },
    climbBehind: { move: [1, 10], sx: 30, sy: 120, sh: 30, sw: 18, dw: 65, dh: 105 },
}


//Fonction qui permet de dessiner mario
const MarioRenderer = (ctx: CanvasRenderingContext2D, state: State) => {
    const sprites = state.mario.img;
    ctx.imageSmoothingEnabled = false;

    function draw(statement: any) {
        if (state.mario.x + state.mario.size.width > state.size.width) {
            ctx.drawImage(
                sprites,
                statement.move[Math.floor(state.iteration / 5 % statement.move.length)] * statement.sx,
                statement.sy,
                statement.sw,
                statement.sh,
                state.size.width - state.mario.size.width,
                state.mario.y,
                statement.dw,
                statement.dh
            );
        }
        else if (state.mario.x < 0) {
            ctx.drawImage(
                sprites,
                statement.move[Math.floor(state.iteration / 5 % statement.move.length)] * statement.sx,
                statement.sy,
                statement.sw,
                statement.sh,
                0,
                state.mario.y,
                statement.dw,
                statement.dh
            );
        }
        else {
            ctx.drawImage(
                sprites,
                statement.move[Math.floor(state.iteration / 5 % statement.move.length)] * statement.sx,
                statement.sy,
                statement.sw,
                statement.sh,
                state.mario.x,
                state.mario.y,
                statement.dw,
                statement.dh
            );
        }
    }

    function update() {
        let statement;
        var traits = state.mario.traits;
        if (traits.dead) {
            return
        }
        else if (traits.bending) {
            if (state.mario.dx < 0) {
                statement = MarioSpriteMovement.bendingLeft;
            }
            else {
                statement = MarioSpriteMovement.bendingRight;
            }
        }
        else if (traits.jumping) {

            if (state.mario.dx < 0) {
                statement = MarioSpriteMovement.jumpLeft;
            }
            else if (state.mario.dx > 0) {
                statement = MarioSpriteMovement.jumpRight;
            }
            else {
                statement = MarioSpriteMovement.jumpStatic;
            }
        }
        else if (traits.climbing) {
            statement = MarioSpriteMovement.climbBehind;
        }
        else if (traits.running) {
            if (state.mario.dx < 0) {
                statement = MarioSpriteMovement.runLeft;
            }
            if (state.mario.dx > 0) {
                statement = MarioSpriteMovement.runRight;
            }
        }
        else if (traits.falling) {
            return
        }

        else {
            if (state.mario.dx > 0) {
                statement = MarioSpriteMovement.lookingRight
            }
            else if (state.mario.dx < 0) {
                statement = MarioSpriteMovement.lookingLeft
            }
            else {
                statement = MarioSpriteMovement.motionless;

            }
        }
        draw(statement);

    }

    return update;

}
export default MarioRenderer;
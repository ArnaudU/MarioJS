import { terrainSkyBoundary } from "../conf";
import { State } from "../state/state";

const showMarioRect = (ctx: CanvasRenderingContext2D) => (state: State) => {
    ctx.strokeStyle = "red"
    ctx.strokeRect(
        state.mario.x - state.frame.x,
        state.mario.y - state.frame.y,
        state.mario.size.width,
        state.mario.size.height); // Draw the rectangle around Mario
    ctx.strokeRect(state.mario.x - state.frame.x, state.mario.y - state.frame.y, 10, 10)
    ctx.strokeStyle = "black"
    ctx.strokeRect(state.mario.x - state.mario.camera.width / 2 - state.frame.x,
        state.mario.y - state.frame.y - state.mario.camera.height / 2,
        state.mario.camera.width + state.mario.size.width,
        state.mario.camera.height + state.mario.size.height,//+ (state.mario.camera.height * 2)
    )
}

const showGrass = (ctx: CanvasRenderingContext2D) => (state: State) => {
    // Début du chemin
    ctx.strokeStyle = "black"
    ctx.beginPath();
    // Déplacer le stylo à un point initial
    ctx.moveTo(0, terrainSkyBoundary(state) - state.frame.y); // x=50, y=50
    ctx.lineTo(state.screen.width, terrainSkyBoundary(state) - state.frame.y)

    // Dessiner la ligne
    ctx.stroke();
}

const showDrapeau = (ctx: CanvasRenderingContext2D) => (state: State) => {
    ctx.strokeRect(state.drapeau.x - state.frame.x, state.drapeau.y - state.frame.y, state.drapeau.size.width, -state.drapeau.size.height)
}

const showObstacle = (ctx: CanvasRenderingContext2D) => (state: State) => {
    state.obstacle.forEach(obstacle => { ctx.strokeRect(obstacle.x - state.frame.x, obstacle.y - state.frame.y, 10, 10) })

    state.obstacle.forEach(obstacle => { ctx.strokeRect(obstacle.x - state.frame.x, obstacle.y - state.frame.y, obstacle.size.width, obstacle.size.height) })
}

const showShell = (ctx: CanvasRenderingContext2D) => (state: State) => {
    for (let shell of state.object) {
        ctx.strokeRect(shell.x - state.frame.x, shell.y - state.frame.y, shell.size.width, shell.size.height);
        ctx.strokeRect(shell.x - state.frame.x, shell.y - state.frame.y, 10, 10);
    }
}
export const RenderDev = (ctx: CanvasRenderingContext2D) => (state: State) => {
    showMarioRect(ctx)(state)
    showGrass(ctx)(state)
    showObstacle(ctx)(state)
    showDrapeau(ctx)(state)
    showShell(ctx)(state)
}

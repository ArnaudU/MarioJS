import { terrainSkyBoundary } from "../conf";
import { State } from "../state/state";

const showMarioRect = (ctx: CanvasRenderingContext2D) => (state: State) => {
    ctx.strokeStyle = "red"
    ctx.strokeRect(
        state.mario.x,
        state.mario.y,
        state.mario.size.width,
        state.mario.size.height); // Draw the rectangle around Mario
}

const showGrass = (ctx: CanvasRenderingContext2D) => (state: State) => {
    // Début du chemin
    ctx.strokeStyle = "black"
    ctx.beginPath();
    // Déplacer le stylo à un point initial
    ctx.moveTo(0, terrainSkyBoundary(state)); // x=50, y=50
    ctx.lineTo(state.size.width, terrainSkyBoundary(state))
    ctx.strokeRect(state.mario.x, state.mario.y, 10, 10)
    // Dessiner la ligne
    ctx.stroke();
}

const showDrapeau = (ctx: CanvasRenderingContext2D) => (state: State) => {
    ctx.strokeRect(state.drapeau.x, state.drapeau.y, state.drapeau.size.width, -state.drapeau.size.height)
}

const showPOV = (ctx: CanvasRenderingContext2D) => (state: State) => {
    ctx.strokeStyle = "blue"
    ctx.strokeRect(state.mario.x + state.mario.size.width / 2 - 250,
        state.mario.y + state.mario.size.height - 200, 500, 200)
}

const showObstacle = (ctx: CanvasRenderingContext2D) => (state: State) => {
    state.obstacle.forEach(obstacle => { ctx.strokeRect(obstacle.x, obstacle.y, 10, 10) })

    state.obstacle.forEach(obstacle => { ctx.strokeRect(obstacle.x, obstacle.y, obstacle.size.width, obstacle.size.height) })
}

const showObject = (ctx: CanvasRenderingContext2D) => (state: State) => {
    for (let shell of state.object) {
        ctx.strokeRect(shell.x, shell.y, shell.size.width, shell.size.height);
        ctx.strokeRect(shell.x, shell.y, 10, 10);
    }
}
export const RenderDev = (ctx: CanvasRenderingContext2D) => (state: State) => {
    showMarioRect(ctx)(state)
    showGrass(ctx)(state)
    showPOV(ctx)(state)
    showObstacle(ctx)(state)
    showDrapeau(ctx)(state)
    showObject(ctx)(state)
}

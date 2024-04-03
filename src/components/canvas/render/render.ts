import { devMode } from "../conf";
import { Shell } from "../state/object";
import { State } from "../state/state"
import { UpdateAudio } from "./audio";
import { RenderDev } from "./dev";
import MarioRenderer from "./mario";
import { DrapeauRenderer, ShellRenderer, WoodWallRenderer } from "./obstacle";


const refresh = (ctx: CanvasRenderingContext2D) => (state: State) => {
    state.frame.refresh(ctx, state)
    ctx.imageSmoothingEnabled = false;
    state.screen = ctx.canvas
}

const showMarioLife = (ctx: CanvasRenderingContext2D) => (state: State) => {
    ctx.font = '24px arial'
    ctx.strokeStyle = "black"
    ctx.strokeText(`Life: ${state.mario.life}`, 50, 50)
}

const showFrame = (ctx: CanvasRenderingContext2D) => (state: State) => {
    showFonctionalities(ctx)(state)
    if (!state.frame.showingFrame) return
    ctx.strokeStyle = "black"
    const fps = `FPS: ${state.frame.showFrame()}`
    const actualfps = `N°: ${state.frame.showActualFrame()}`
    ctx.font = '24px arial'
    ctx.strokeText(fps, 50, 75)
    ctx.strokeText(actualfps, 50, 100)
}

const showFonctionalities = (ctx: CanvasRenderingContext2D) => (state: State) => {
    ctx.font = '24px arial'
    ctx.strokeStyle = "black"
    ctx.strokeText("[s]: sound", state.screen.width - 150, 50)
    ctx.strokeText("[q]: fps", state.screen.width - 150, 75)
}

function update(ctx: CanvasRenderingContext2D, state: State) {
    // Montre les éléments de dév comme les contours des persos
    if (devMode) RenderDev(ctx)(state)
    UpdateAudio(state)

    state.obstacle.forEach(obstacle => WoodWallRenderer(ctx, state, obstacle))
    DrapeauRenderer(ctx, state, state.drapeau);
    // Dessine Mario
    MarioRenderer(ctx, state)();
    state.object.forEach(object => { if (object instanceof Shell) ShellRenderer(ctx, state, object) })
    showMarioLife(ctx)(state)
    showFrame(ctx)(state)
}

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
    // Rafraichis le canvas
    refresh(ctx)(state)
    //update le canvas
    update(ctx, state)
    if (state.mario.life <= 0) {
        const text = 'GAME OVER :-('
        ctx.font = '48px arial'
        ctx.fillText(text, state.screen.width / 2, state.screen.height / 2)
    }
    else if (state.endOfGame) {
        const text = 'FELICITATION !'
        ctx.font = '48px arial'
        ctx.fillText(text, state.screen.width / 2, state.screen.height / 2)
        state.input.sound = false
        clearInterval(0)
    }
}
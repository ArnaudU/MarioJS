import { devMode } from "../conf";
import { Fusee, Heart, Mushroom, Shell } from "../state/object";
import { BlocWall, WoodWall } from "../state/obstacle"
import { State } from "../state/state"
import { UpdateAudio } from "./audio";
import { RenderDev } from "./dev";
import MarioRenderer from "./mario";
import { BlocWallRenderer, DrapeauRenderer, FuseeRenderer, HeartRender, MushroomRender, ShellRenderer, WoodWallRenderer } from "./obstacle";

//Rafraichis le canvas
const refresh = (ctx: CanvasRenderingContext2D) => (state: State) => {
    state.frame.refresh(ctx, state)
    ctx.imageSmoothingEnabled = false;
    state.screen = ctx.canvas
}

// Montre le nombre de vie de Mario en haut à gauche
const showMarioLife = (ctx: CanvasRenderingContext2D) => (state: State) => {
    ctx.font = '24px arial'
    ctx.strokeStyle = "black"
    ctx.strokeText(`Life: ${state.mario.life}`, 50, 50)
}

//Montre le nombre de FPS
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

//Montre les commandes permettant de voir ou non certains params
const showFonctionalities = (ctx: CanvasRenderingContext2D) => (state: State) => {
    ctx.font = '24px arial'
    ctx.strokeStyle = "black"
    ctx.strokeText("[s]: sound", state.screen.width - 150, 50)
    ctx.strokeText("[q]: fps", state.screen.width - 150, 75)
    ctx.strokeText("[d]: block", state.screen.width - 150, 100)
}

//Dessine les obstacles
const showObstacle = (ctx: CanvasRenderingContext2D) => (state: State) => {
    state.obstacle.forEach(obstacle => {
        if (obstacle instanceof WoodWall) new WoodWallRenderer().render(ctx, state, obstacle)
        if (obstacle instanceof BlocWall) new BlocWallRenderer().render(ctx, state, obstacle)
    })
}

//Dessine les objets
const showObject = (ctx: CanvasRenderingContext2D) => (state: State) => {
    state.object.forEach(object => {
        if (object instanceof Shell) new ShellRenderer().render(ctx, state, object)
        if (object instanceof Fusee) new FuseeRenderer().render(ctx, state, object)
        if (object instanceof Mushroom) new MushroomRender().render(ctx, state, object)
        if (object instanceof Heart) new HeartRender().render(ctx, state, object)
    })
    new DrapeauRenderer().render(ctx, state, state.drapeau);
}

function update(ctx: CanvasRenderingContext2D, state: State) {
    // Montre les éléments de dév comme les contours des persos
    UpdateAudio(state)
    showObstacle(ctx)(state)
    showObject(ctx)(state)
    // Dessine Mario
    MarioRenderer(ctx, state)();
    showMarioLife(ctx)(state)
    showFrame(ctx)(state)
    if (state.input.dev) RenderDev(ctx)(state)
}

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
    // Rafraichis le canvas
    refresh(ctx)(state)
    //update le canvas
    update(ctx, state)
    if (state.mario.life <= 0) {
        const text = 'GAME OVER !'
        ctx.font = '48px arial'
        ctx.fillText(text, state.screen.width / 2 - 24 * 7, state.screen.height / 2)
        window.location.href = "/"
    }
    else if (state.endOfGame) {
        const text = 'FELICITATION !'
        ctx.font = '48px arial'
        ctx.fillText(text, state.screen.width / 2 - 24 * 7, state.screen.height / 2)
        state.input.sound = false
        window.location.href = "/"
    }
}
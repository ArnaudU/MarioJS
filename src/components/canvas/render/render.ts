import { backgroundImage, devMode } from "../conf";
import { State } from "../state/state"
import { UpdateAudio } from "./audio";
import { RenderDev } from "./dev";
import MarioRenderer from "./mario";
import { DrapeauRenderer, ShellRenderer, WoodWallRenderer } from "./obstacle";

export class BackGroundFrame {
    static imageStatic = new Image();
    image: HTMLImageElement;
    fps: number;
    cptFPS: number;
    elapsedTime: number;
    timeShowFrameCalled: number;
    showingFrame: boolean;
    position: { x: number, y: number }

    constructor() {
        this.image = BackGroundFrame.imageStatic;
        this.image.src = backgroundImage;
        this.fps = 0;
        this.cptFPS = 0;
        this.elapsedTime = 0;
        this.timeShowFrameCalled = Date.now()
        this.showingFrame = true
        this.position = { x: 0, y: 0 }
    }

    refresh(ctx: CanvasRenderingContext2D, state: State) {
        ctx.clearRect(0, 0, state.size.width, state.size.height);
        this.position.x += 1
        this.drawBackground(ctx, state)
        this.updateFrame()
    }

    drawBackground(ctx: CanvasRenderingContext2D, state: State) {
        ctx.drawImage(this.image, 0, 0, state.size.width, state.size.height);
    }
    updateFrame() {
        this.cptFPS++
        var tmpTime = Date.now()
        this.elapsedTime += tmpTime - this.timeShowFrameCalled
        this.timeShowFrameCalled = tmpTime
        if (this.elapsedTime > 1000) {
            this.fps = this.cptFPS
            this.cptFPS = 0
            this.elapsedTime = 0
        }
    }
    showFrame() {
        return this.fps === 0 ? this.cptFPS : this.fps;
    }
    showActualFrame() {
        return this.cptFPS;
    }
}

const refresh = (ctx: CanvasRenderingContext2D) => (state: State) => {
    state.frame.refresh(ctx, state)
    ctx.imageSmoothingEnabled = false;
    state.size = ctx.canvas
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
    ctx.strokeText("[s]: sound", state.size.width - 150, 50)
    ctx.strokeText("[q]: fps", state.size.width - 150, 75)
}

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {

    UpdateAudio(state)
    // Rafraichis le canvas
    refresh(ctx)(state)
    state.obstacle.forEach(obstacle => WoodWallRenderer(ctx, obstacle))
    DrapeauRenderer(ctx, state.drapeau);
    // Dessine Mario
    MarioRenderer(ctx, state)();
    if (state.object.length > 0) ShellRenderer(ctx, state)
    showMarioLife(ctx)(state)
    showFrame(ctx)(state)
    // Montre les éléments de dév comme les contours des persos
    if (devMode) RenderDev(ctx)(state)

    if (state.mario.life <= 0) {
        const text = 'GAME OVER :-('
        ctx.font = '48px arial'
        ctx.fillText(text, state.size.width / 2, state.size.height / 2)
    }
    else if (state.endOfGame) {
        const text = 'FELICITATION !'
        ctx.font = '48px arial'
        ctx.fillText(text, state.size.width / 2, state.size.height / 2)
        state.input.sound = false
        clearInterval(0)
    }
}
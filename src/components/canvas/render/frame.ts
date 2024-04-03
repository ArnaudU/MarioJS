import { backgroundImage, terrainSkyBoundary } from "../conf";
import { ObjectImmobile } from "../state/object";
import { State } from "../state/state";

const BackGroundContour = {
    grass: { sx: 50, sy: 1080, sw: 980, sh: 110 },
    sky: { sx: 0, sy: 0, sw: 1520, sh: 1080 },
}

export class BackGroundFrame {
    static imageStatic = new Image();
    image: HTMLImageElement;
    fps: number;
    cptFPS: number;
    elapsedTime: number;
    timeShowFrameCalled: number;
    showingFrame: boolean;
    //Position des nuages
    background: { x: number, y: number }
    x: number
    y: number

    constructor() {
        this.image = BackGroundFrame.imageStatic;
        this.image.src = backgroundImage;
        this.fps = 0;
        this.cptFPS = 0;
        this.elapsedTime = 0;
        this.timeShowFrameCalled = Date.now()
        this.showingFrame = true
        this.background = { x: 0, y: 0 }
        this.x = 0
        this.y = 0
    }

    refresh(ctx: CanvasRenderingContext2D, state: State) {
        ctx.clearRect(0, 0, state.screen.width, state.screen.height);
        this.background.x = (this.background.x + 0.1) % state.screen.width
        this.drawBackground(ctx, state)
        this.updateFrame()
    }

    drawBackground(ctx: CanvasRenderingContext2D, state: State) {
        var x = Math.floor(this.background.x)
        var ysky = Math.floor(state.frame.y / 2)
        //Premier partie de l'image a draw
        ctx.drawImage(this.image, BackGroundContour.sky.sx, BackGroundContour.sky.sy, BackGroundContour.sky.sw, BackGroundContour.sky.sh,
            x, this.background.y - ysky, state.screen.width, state.screen.height);
        //Autre image a draw
        ctx.drawImage(this.image,
            BackGroundContour.sky.sx, BackGroundContour.sky.sy, BackGroundContour.sky.sw, BackGroundContour.sky.sh,
            x - state.screen.width, this.background.y - ysky, state.screen.width, state.screen.height);

        ctx.drawImage(this.image,
            BackGroundContour.sky.sx, BackGroundContour.sky.sy, BackGroundContour.sky.sw, BackGroundContour.sky.sh,
            x, this.background.y - ysky, state.screen.width, state.screen.height);

        var xgrass = -Math.floor(state.frame.x) % state.screen.width
        ctx.drawImage(this.image, BackGroundContour.grass.sx, BackGroundContour.grass.sy, BackGroundContour.grass.sw, BackGroundContour.grass.sh,
            xgrass, terrainSkyBoundary(state) - state.frame.y, state.screen.width, state.screen.height - terrainSkyBoundary(state));
        ctx.drawImage(this.image, BackGroundContour.grass.sx, BackGroundContour.grass.sy, BackGroundContour.grass.sw, BackGroundContour.grass.sh,
            xgrass + state.screen.width, terrainSkyBoundary(state) - state.frame.y, state.screen.width, state.screen.height - terrainSkyBoundary(state))
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

    canDraw(obj: ObjectImmobile, state: State) {
        return this.x + state.screen.width >= obj.x && obj.x + obj.size.width >= this.x
            && this.y + state.screen.height >= obj.y && obj.y + obj.size.height >= this.y
    }

    draw(obj: ObjectImmobile, ctx: CanvasRenderingContext2D, state: State,
        img: HTMLImageElement, sx: number,
        sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
        if (this.canDraw(obj, state)) {
            ctx.drawImage(img, sx, sy, sw, sh, dx - this.x, dy - this.y, dw, dh)
        }
    }

}
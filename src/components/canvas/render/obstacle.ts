import { drapeauImage, fuseeImage, goldentBlocImage, heartImage, mushroomImage, obstacleImage, shellImage } from "../conf"
import { ObjectImmobile, Shell } from "../state/object"
import { BlocWall, WoodWall, Drapeau } from "../state/obstacle"
import { State } from "../state/state"


const WoodWallContour = {
    carre: { sx: 0, sy: 0, sw: 17, sh: 17 },
    fissure: { sx: 0, sy: 17, sw: 17, sh: 17 }
}

export abstract class Renderer {
    abstract render(ctx: CanvasRenderingContext2D, state: State, obstacle: ObjectImmobile): void;
}

export class WoodWallRenderer extends Renderer {
    render(ctx: CanvasRenderingContext2D, state: State, obstacle: WoodWall) {
        obstacle.img.src = obstacleImage
        var img = WoodWallContour.carre
        state.frame.draw(obstacle, ctx, state, obstacle.img,
            img.sx, img.sy,
            img.sw, img.sh,
            obstacle.x, obstacle.y,
            obstacle.size.width, obstacle.size.height)
    }

}

const DrapeauContour = {
    bloc: { sx: 100, sy: 630, sw: 110, sh: 110 },
    baton: { sx: 147, sy: 500, sw: 17, sh: 17 },
    rectangle: { sx: 162, sy: 45, sw: 140, sh: 100 },
    boule: { sx: 130, sy: 0, sw: 52, sh: 48 }
}

export class DrapeauRenderer extends Renderer {
    render(ctx: CanvasRenderingContext2D, state: State, obstacle: Drapeau) {
        obstacle.img.src = drapeauImage
        //On draw le drapeau
        var img = DrapeauContour.rectangle
        state.frame.draw(obstacle.drapeau, ctx, state, obstacle.img,
            img.sx, img.sy,
            img.sw, img.sh,
            obstacle.drapeau.x,
            obstacle.drapeau.y,
            obstacle.drapeau.size.width,
            obstacle.drapeau.size.height)

        img = DrapeauContour.boule
        state.frame.draw(obstacle.boule, ctx, state, obstacle.img,
            img.sx, img.sy,
            img.sw, img.sh,
            obstacle.boule.x,
            obstacle.boule.y,
            obstacle.boule.size.width,
            obstacle.boule.size.height)

        //On draw le baton
        img = DrapeauContour.baton
        state.frame.draw(obstacle.baton, ctx, state, obstacle.img,
            img.sx, img.sy,
            img.sw, img.sh,
            obstacle.baton.x,
            obstacle.baton.y,
            obstacle.baton.size.width,
            obstacle.baton.size.height)


        img = DrapeauContour.bloc
        state.frame.draw(obstacle.bloc, ctx, state, obstacle.img,
            img.sx, img.sy,
            img.sw, img.sh,
            obstacle.bloc.x, obstacle.bloc.y,
            obstacle.bloc.size.width, obstacle.bloc.size.height)
    }
}

const ShellContour = {
    first: { sx: 32, sy: 0, sw: 32, sh: 32 },
    number: 12
}

export
    class ShellRenderer extends Renderer {
    render(ctx: CanvasRenderingContext2D, state: State, shell: Shell) {
        shell.img.src = shellImage;
        var img = ShellContour.first;
        var number = Math.floor((state.iteration / 2) % ShellContour.number);

        state.frame.draw(shell, ctx, state, shell.img,
            img.sx * number + 3, img.sy + 4,
            img.sw - 7, img.sh - 9,
            shell.x, shell.y,
            shell.size.width, shell.size.height);
    }
}

export class BlocWallRenderer extends Renderer {
    render(ctx: CanvasRenderingContext2D, state: State, obstacle: BlocWall) {
        var img
        if (obstacle.gift) {
            obstacle.img.src = goldentBlocImage
            state.frame.draw(obstacle, ctx, state, obstacle.img,
                0, 0,
                obstacle.img.width, obstacle.img.height,
                obstacle.x, obstacle.y,
                obstacle.size.width, obstacle.size.height)
        }
        else {
            img = DrapeauContour.bloc
            obstacle.img.src = drapeauImage
            state.frame.draw(obstacle, ctx, state, obstacle.img,
                img.sx, img.sy,
                img.sw, img.sh,
                obstacle.x, obstacle.y,
                obstacle.size.width, obstacle.size.height)
        }
    }
}

export class FuseeRenderer extends Renderer {
    render(ctx: CanvasRenderingContext2D, state: State, obstacle: ObjectImmobile) {
        obstacle.img.src = fuseeImage

        state.frame.draw(obstacle, ctx, state, obstacle.img,
            0, 0,
            obstacle.img.width, obstacle.img.height,
            obstacle.x, obstacle.y,
            obstacle.size.width, obstacle.size.height)
    }
}

export class MushroomRender extends Renderer {
    render(ctx: CanvasRenderingContext2D, state: State, object: ObjectImmobile) {
        object.img.src = mushroomImage
        state.frame.draw(object, ctx, state, object.img,
            0, 0,
            object.img.width, object.img.height,
            object.x, object.y,
            object.size.width, object.size.height)
    }
}

export class HeartRender extends Renderer {
    render(ctx: CanvasRenderingContext2D, state: State, object: ObjectImmobile) {
        object.img.src = heartImage
        state.frame.draw(object, ctx, state, object.img,
            0, 0,
            object.img.width, object.img.height,
            object.x, object.y,
            object.size.width, object.size.height)
    }
}
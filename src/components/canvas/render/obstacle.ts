import { drapeauImage, obstacleImage, shellImage } from "../conf"
import { Drapeau, Shell, WoodWall } from "../state/object"
import { State } from "../state/state"

const WoodWallContour = {
    carre: { sx: 0, sy: 0, sw: 17, sh: 17 },
}

export const WoodWallRenderer = (ctx: CanvasRenderingContext2D, obstacle: WoodWall) => {
    obstacle.img.src = obstacleImage
    var img = WoodWallContour.carre
    ctx.drawImage(obstacle.img,
        img.sx, img.sy,
        img.sw, img.sh,
        obstacle.x, obstacle.y,
        obstacle.size.width, obstacle.size.height)

}

const DrapeauContour = {
    bloc: { sx: 100, sy: 630, sw: 110, sh: 110 },
    baton: { sx: 147, sy: 500, sw: 17, sh: 17 },
    rectangle: { sx: 162, sy: 45, sw: 140, sh: 100 },
    boule: { sx: 130, sy: 0, sw: 52, sh: 48 }
}

export const DrapeauRenderer = (ctx: CanvasRenderingContext2D, obstacle: Drapeau) => {
    obstacle.img.src = drapeauImage
    //On draw le drapeau
    var img = DrapeauContour.rectangle
    ctx.drawImage(obstacle.img,
        img.sx, img.sy,
        img.sw, img.sh,
        obstacle.drapeau.x,
        obstacle.drapeau.y,
        obstacle.drapeau.size.width,
        obstacle.drapeau.size.height)

    img = DrapeauContour.boule
    ctx.drawImage(obstacle.img,
        img.sx, img.sy,
        img.sw, img.sh,
        obstacle.boule.x,
        obstacle.boule.y,
        obstacle.boule.size.width,
        obstacle.boule.size.height)


    //On draw le baton
    img = DrapeauContour.baton
    ctx.drawImage(obstacle.img,
        img.sx, img.sy,
        img.sw, img.sh,
        obstacle.baton.x,
        obstacle.baton.y,
        obstacle.baton.size.width,
        obstacle.baton.size.height)


    img = DrapeauContour.bloc
    ctx.drawImage(obstacle.img,
        img.sx, img.sy,
        img.sw, img.sh,
        obstacle.bloc.x, obstacle.bloc.y,
        obstacle.bloc.size.width, obstacle.bloc.size.height)
}

const ShellContour = {
    first: { sx: 32, sy: 0, sw: 32, sh: 32 },
    number: 12
}
export const ShellRenderer = (ctx: CanvasRenderingContext2D, state: State) => {
    const shell = state.object[0] as Shell;
    shell.img.src = shellImage;
    var img = ShellContour.first;
    var number = Math.floor((state.iteration / 2) % ShellContour.number);
    ctx.drawImage(shell.img,
        img.sx * number + 3, img.sy + 4,
        img.sw - 7, img.sh - 9,
        shell.x, shell.y,
        shell.size.width, shell.size.height);
}



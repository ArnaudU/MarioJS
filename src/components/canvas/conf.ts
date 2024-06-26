import { State } from "./state/state";


export const FPS: number = 60;
export const gravite: number = 0.301;
export const jumpHeight: number = 7;
export const marioSpeed: number = 4;

export const backgroundImage: string = "./img/image.png";
export const backgroundSound: string = "./sound/background.mp3";
export const marioImage: string = "./img/mario_spritesheet.png";
export const obstacleImage: string = "./img/obstacle.png";
export const drapeauImage: string = "./img/drapeau.png"
export const shellImage: string = "./img/shell.png"
export const warningCollision: string = './img/warningCollision.png'
export const fuseeImage: string = './img/fusee.png'
export const mushroomImage: string = './img/mushroom.png'
export const heartImage: string = './img/heart.png'
export const goldentBlocImage: string = './img/goldenbloc.png'

export const jump = new Audio("./sound/jump.wav");
export const dead = new Audio("./sound/gameover.wav");
export const bending = new Audio("./sound/bending.wav");
export const win = new Audio("./sound/win.wav");
export const colision = new Audio("./sound/colision.wav");
export const warningCollisionSound = new Audio("./sound/warningCollision.wav");


export const devMode: boolean = true;
export function terrainSkyBoundary(state: State) {
    return state.screen.height - state.screen.height * 0.09
}

export function terrainSkyBoundaryHeight(height: number) {
    return height - height * 0.09
}
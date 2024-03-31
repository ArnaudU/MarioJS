import { State } from "./state/state";

export const gravite: number = 0.201;
export const FPS: number = 60;
export const jumpHeight: number = 6;
export const marioSpeed: number = 5;
export const backgroundImage: string = "./img/image.png";
export const backgroundSound: string = "./sound/background.mp3";
export const marioImage: string = "./img/mario_spritesheet.png";
export const obstacleImage: string = "./img/obstacle.png";
export const drapeauImage: string = "./img/drapeau.png"
export const shellImage: string = "./img/shell.png"
export const warningCollision: string = './img/warningCollision.png'
export const devMode: boolean = true;
export function terrainSkyBoundary(state: State) {
    return state.size.height - state.size.height * 0.09
}

export function terrainSkyBoundaryHeight(height: number) {
    return height - height * 0.09
}
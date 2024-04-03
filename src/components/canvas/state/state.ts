import { BackGroundFrame } from "../render/frame";
import { Mario } from "./charactere"
import { Drapeau, WoodWall } from "./object";
import { ObjectMobile } from "./object"; // Import the missing ObjectMobile class

export type State = {
    mario: Mario
    screen: { height: number; width: number }
    position: { x: number, y: number }
    endOfGame: boolean
    iteration: number
    input: { keyUp: boolean, keyDown: boolean, keyRight: boolean, keyLeft: boolean, keyS: boolean, sound: boolean }
    frame: BackGroundFrame
    obstacle: Array<WoodWall>
    object: Array<ObjectMobile>
    drapeau: Drapeau
}


const winTheGame = (state: State): boolean => {
    return state.drapeau.collisionOnMario(state.mario)
}


const endOfGame = (state: State) => {
    state.mario.traits.jumping = true
    state.mario.traits.running = false
    state.mario.dx = 0
    state.endOfGame = true
    if (state.drapeau.drapeau.y + state.drapeau.drapeau.size.height < state.drapeau.bloc.y + state.drapeau.bloc.size.height) {
        state.drapeau.drapeau.y++
    }
    if (state.mario.y + state.mario.size.height < state.drapeau.y) {
        state.mario.y++
    }

}

const updateObstacles = (state: State) => {
    for (let i = 0; i < state.obstacle.length; i++) {
        if (state.obstacle[i].hasNoLife()) {
            state.obstacle.splice(i, 1)
            i--
        }
    }
    return state
}

const updateObjects = (state: State) => {
    for (let object of state.object) {
        object.step(state);
    }
    return state
}


export const step = (state: State): State => {
    if (winTheGame(state)) endOfGame(state)
    else if (state.mario.traits.dead) {
        return state
    }
    else {
        state = state.mario.step(state)
        state = updateObstacles(state)
        state = updateObjects(state)
    }
    return state
}
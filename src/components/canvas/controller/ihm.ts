import { State } from "../state/state"

export function onKeyPressed(event: KeyboardEvent, state: State) {
    switch (event.key) {
        case 'ArrowDown':
            state.input.keyDown = true
            break
        case 'ArrowUp':
            state.input.keyUp = true
            break
        case 'ArrowLeft':
            state.input.keyLeft = true
            break
        case 'ArrowRight':
            state.input.keyRight = true
            break
    }
    return state
}

export function onKeyReleased(event: KeyboardEvent, state: State) {
    switch (event.key) {
        case 'ArrowDown':
            state.input.keyDown = false
            break
        case 'ArrowUp':
            state.input.keyUp = false
            break
        case 'ArrowLeft':
            state.input.keyLeft = false
            break
        case 'ArrowRight':
            state.input.keyRight = false
            break
        case 'q':
            state.frame.showingFrame = !state.frame.showingFrame
            break
        case 's':
            state.input.sound = !state.input.sound
    }
    return state
}

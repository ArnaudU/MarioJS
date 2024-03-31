import { backgroundSound } from "../conf";
import { State } from "../state/state";

const audio = new Audio(backgroundSound);
const jump = new Audio("./sound/jump.wav");
const dead = new Audio("./sound/gameover.wav");
const bending = new Audio("./sound/bending.wav");
const win = new Audio("./sound/win.wav");
const colision = new Audio("./sound/colision.wav");
const warningCollision = new Audio("./sound/warningCollision.wav");
const chargeAudioBackground = () => audio.play();
const dechargeAudioBackground = () => audio.pause();
console.log("la musique de fond est chargée");


export const BackGroundSoundEffect = {
    chargeAudioBackground: chargeAudioBackground,
    dechargeAudioBackground: dechargeAudioBackground
}

export const WinSoundEffect = {
    win: win
}

export const MarioSoundEffect = {
    dead: { audio: dead, played: false },
    jump: { audio: jump, played: false },
    bending: { audio: bending, played: false },
    lostAlife: { audio: warningCollision, played: false },
    destroyed: { audio: colision, played: false }
}


const audioOnLoad = () => {
    return audio.readyState === 4 && jump.readyState === 4 && dead.readyState === 4 && win.readyState === 4
}

export const UpdateAudio = (state: State) => {
    if (state.input.sound && audioOnLoad()) {
        if (state.endOfGame) {
            BackGroundSoundEffect.dechargeAudioBackground()
            WinSoundEffect.win.play()
        }
        else if (state.mario.traits.dead && !MarioSoundEffect.dead.played) {
            BackGroundSoundEffect.dechargeAudioBackground()
            MarioSoundEffect.dead.audio.play();
            MarioSoundEffect.dead.played = true;
        }
        else if (!state.endOfGame && !state.mario.traits.dead) {
            BackGroundSoundEffect.chargeAudioBackground()
            if (state.mario.traits.jumping && state.mario.vy < 0 && !MarioSoundEffect.jump.played) {
                MarioSoundEffect.jump.audio.play();
                MarioSoundEffect.jump.played = true;
            }
            else MarioSoundEffect.jump.played = false;

            if (state.mario.traits.bending && !MarioSoundEffect.bending.played) {
                MarioSoundEffect.bending.audio.play();
                MarioSoundEffect.bending.played = true;
            }
            else if (!state.mario.traits.bending && MarioSoundEffect.bending.played) {
                MarioSoundEffect.bending.played = false;
            }
        }
        if ((state.mario.traits.hasDestroyed || state.mario.traits.collisionOnTop) && !MarioSoundEffect.destroyed.played) {
            MarioSoundEffect.destroyed.audio.play();
            MarioSoundEffect.destroyed.played = true;
        }
        else if ((!state.mario.traits.hasDestroyed || !state.mario.traits.collisionOnTop) && MarioSoundEffect.destroyed.played) {
            MarioSoundEffect.destroyed.played = false;
            state.mario.traits.hasDestroyed = false;
            state.mario.traits.collisionOnTop = false;
        }
        if (state.mario.traits.lostALife && !MarioSoundEffect.lostAlife.played) {
            MarioSoundEffect.lostAlife.played = true
            MarioSoundEffect.lostAlife.audio.play()
        }
        else {
            MarioSoundEffect.lostAlife.played = false
        }
    }

    else {
        BackGroundSoundEffect.dechargeAudioBackground()
    }
}
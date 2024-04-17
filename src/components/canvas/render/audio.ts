import { backgroundSound, bending, colision, dead, jump, warningCollisionSound, win } from "../conf";
import { State } from "../state/state";

const audio = new Audio(backgroundSound);
const chargeAudioBackground = () => audio.play();
const dechargeAudioBackground = () => audio.pause();


export const BackGroundSoundEffect = {
    chargeAudioBackground: chargeAudioBackground,
    dechargeAudioBackground: dechargeAudioBackground
}


export const MarioSoundEffect = {
    dead: { audio: dead, played: false },
    jump: { audio: jump, played: false },
    bending: { audio: bending, played: false },
    lostAlife: { audio: warningCollisionSound, played: false },
    destroyed: { audio: colision, played: false },
    win: { audio: win }
}


const audioOnLoad = () => {
    return audio.readyState === 4 && jump.readyState === 4 && dead.readyState === 4 && win.readyState === 4
}

export const UpdateAudio = (state: State) => {
    if (state.input.sound && audioOnLoad()) {
        if (state.endOfGame) {
            BackGroundSoundEffect.dechargeAudioBackground()
            MarioSoundEffect.win.audio.play()
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
        if ((state.mario.traits.hasDestroyed || state.mario.traits.collisionOnTop && (state.mario.traits.jumping)) && !MarioSoundEffect.destroyed.played) {
            MarioSoundEffect.destroyed.audio.play();
            MarioSoundEffect.destroyed.played = true;
        }
        else if ((!state.mario.traits.hasDestroyed || state.mario.traits.collisionOnTop) && MarioSoundEffect.destroyed.played) {
            MarioSoundEffect.destroyed.played = false;
            state.mario.traits.hasDestroyed = false;
            state.mario.traits.collisionOnTop = false;
        }
        if (state.mario.traits.lostALife && !MarioSoundEffect.lostAlife.played && state.mario.life > 0) {
            MarioSoundEffect.lostAlife.played = true
            MarioSoundEffect.lostAlife.audio.play()
            state.mario.traits.lostALife = false
        }
        else {
            MarioSoundEffect.lostAlife.played = false
        }
    }

    else {
        MarioSoundEffect.jump.played = false;
        MarioSoundEffect.bending.played = false;
        MarioSoundEffect.lostAlife.played = false;
        MarioSoundEffect.destroyed.played = false;
        MarioSoundEffect.dead.played = false;
        BackGroundSoundEffect.dechargeAudioBackground()
    }
}
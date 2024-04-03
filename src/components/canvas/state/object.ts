import { shellImage } from "../conf";
import { Character, Mario } from "./charactere";
import { State } from "./state";

export class ObjectImmobile {
    x: number;
    y: number;
    size: { height: number; width: number; };
    img: HTMLImageElement = new Image();

    constructor(x: number, y: number, size: { height: number; width: number; }) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.img = new Image();
    }
    collisionOnMario(mario: Mario) {
        return mario.x < this.x + this.size.width &&
            mario.x + mario.size.width > this.x &&
            mario.y < this.y + this.size.height &&
            mario.size.height + mario.y > this.y
    }
}

export abstract class ObjectMobile extends ObjectImmobile {

    vx: number;
    vy: number;
    dx: number;
    dy: number;
    constructor(x: number, y: number, size: { height: number; width: number; }, vx: number, vy: number) {
        super(x, y, size);
        this.vx = vx;
        this.vy = vy;
        this.dx = 0;
        this.dy = 0;
    }
    abstract step(state: State): void;
}

export class WoodWall extends ObjectImmobile {

    life: number = 3;
    constructor(position: { x: number, y: number }, size: { height: number; width: number; }) {
        super(position.x, position.y, size);
    }

    collisionOnTop(character: Character) {
        return ((character.y + character.size.height < this.y
            && character.y + character.vy + character.size.height > this.y
        ) || (character.y + character.size.height === this.y && character.dy <= 0))
            && character.x < this.x + this.size.width && character.x + character.size.width > this.x;
    }

    collisionOnBottom(character: Character) {
        const b = (character.y > this.y + this.size.height
            && character.y + character.vy < this.y + this.size.height
            && character.x < this.x + this.size.width && character.x + character.size.width > this.x);
        if (b) this.life--;
        const equal = this.y + this.size.height === character.y && character.x < this.x + this.size.width && character.x + character.size.width > this.x
        return b || equal;
    }

    collisionOnLeft(character: Character | ObjectMobile) {
        return (character.vx > 0 && character.x < this.x && character.x + character.size.width > this.x)
            && character.y < this.y + this.size.height && character.y + character.size.height > this.y;
    }

    collisionOnRight(character: Character | ObjectMobile) {
        return (character.vx < 0 && character.x > this.x && character.x < this.x + this.size.width)
            && character.y < this.y + this.size.height && character.y + character.size.height > this.y;
    }

    hasNoLife() {
        return this.life <= 0;
    }
}

//ATTENTION CETTE CLASSE A COMME COORDONNEE LE COIN EN BAS-GAUCHE DE L'IMAGE
export class Drapeau extends ObjectImmobile {

    baton: ObjectImmobile
    bloc: ObjectImmobile
    drapeau: ObjectImmobile
    boule: ObjectImmobile
    constructor(position: { x: number, y: number }, size: { height: number; width: number; }) {
        super(position.x, position.y, size);
        this.bloc = new ObjectImmobile(position.x, position.y, { height: -size.width, width: size.width })
        this.drapeau = new ObjectImmobile(position.x + 4 * size.width / 6, position.y - size.height + size.width, { height: size.width * 3 / 2, width: size.width * 2 })
        this.baton = new ObjectImmobile(position.x + size.width / 4, position.y - size.width, { height: -size.height + size.width * 2, width: size.width / 2 })
        this.boule = new ObjectImmobile(position.x, position.y - size.height + size.width, { height: -size.width, width: size.width })
    }
    //Les coordonnée sont différentes de celle des autres images donc on overide
    collisionOnMario(mario: Mario) {
        return mario.x < this.x + this.size.width &&
            mario.x + mario.size.width > this.x &&
            mario.y < this.y &&
            mario.size.height + mario.y > this.y - this.size.height
    }
}



export class Shell extends ObjectMobile {

    speed: number;
    dx: number = 0;
    constructor(position: { x: number, y: number }, size: { height: number; width: number; }, speed: number) {
        super(position.x, position.y, size, 0, 0);
        this.speed = speed
        this.dx = 0
    }
    step(state: State) {
        if (this.dx === 0) {
            this.dx = 1
        }
        for (let obstacle of state.obstacle) {
            if (obstacle.collisionOnLeft(this)) {
                this.dx = -1
                this.x = obstacle.x - this.size.width
            }
            if (obstacle.collisionOnRight(this)) {
                this.dx = 1
                this.x = obstacle.x + obstacle.size.width
            }
        }
        if (this.collisionOnMario(state.mario)) {
            if (state.mario.y + state.mario.size.height + state.mario.vy < this.y + this.size.height) {
                state = this.destroy(state);
                state.mario.traits.hasDestroyed = true

            }
            else {
                state.mario.traits.lostALife = true
                state.mario.life--;
                if (this.x > state.mario.x) {
                    this.dx = 1;
                } else {
                    this.dx = -1;
                }
            }

        }
        this.vx = this.dx * this.speed;
        this.x += this.vx
        return state
    }

    destroy(state: State): State {
        state.object.splice(state.object.indexOf(this), 1)
        return state;
    }
}


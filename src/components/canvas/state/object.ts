import { gravite, terrainSkyBoundary } from "../conf";
import { Character, Mario } from "./charactere";
import { State } from "./state";

export abstract class ObjectImmobile {
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

    abstract step(state: State): void;
    abstract weakObject(): boolean; //Permet de savoir si l'objet est destructible via n'import quel colision (mur en bois) execption avec mario

    collisionOnMario(mario: Mario) {
        return mario.x < this.x + this.size.width &&
            mario.x + mario.size.width > this.x &&
            mario.y < this.y + this.size.height &&
            mario.size.height + mario.y > this.y
    }

    collisionOnLeft(character: Character | ObjectMobile) {
        return (character.vx > 0 && character.x < this.x && character.x + character.vx + character.size.width > this.x)
            && character.y < this.y + this.size.height && character.y + character.size.height > this.y;
    }

    collisionOnRight(character: Character | ObjectMobile) {
        return (character.vx < 0 && character.x > this.x && character.x + character.vx < this.x + this.size.width)
            && character.y < this.y + this.size.height && character.y + character.size.height > this.y;
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
        const equal = this.y + this.size.height === character.y && character.x < this.x + this.size.width && character.x + character.size.width > this.x
        return b || equal;
    }
    hasNoLife() {
        return false
    }
}

export abstract class ObjectMobile extends ObjectImmobile {

    vx: number;
    vy: number;
    dx: number;
    dy: number;
    speed: number
    constructor(x: number, y: number, size: { height: number; width: number; }, vx: number, vy: number, speed: number) {
        super(x, y, size);
        this.vx = vx;
        this.vy = vy;
        this.dx = 0;
        this.dy = 0;
        this.speed = speed
    }
}

export abstract class ObjectBonus extends ObjectMobile {
    constructor(position: { x: number, y: number }, size: { height: number; width: number; }) {
        super(position.x, position.y, size, 0, 0, 2);
    }
}

export class ObjectNonSpecified extends ObjectImmobile {

    constructor(position: { x: number, y: number }, size: { height: number; width: number; }) {
        super(position.x, position.y, size);
    }
    step(state: State) { }

    weakObject(): boolean {
        return false
    }

}

export class Shell extends ObjectMobile {

    constructor(position: { x: number, y: number }, size: { height: number; width: number; }, speed: number) {
        super(position.x, position.y, size, 0, 0, speed);
    }
    step(state: State) {
        if (this.dx === 0) {
            this.dx = 1
        }
        for (let obstacle of state.obstacle) {
            if (obstacle.collisionOnLeft(this)) {
                this.dx = -1
                this.x = obstacle.x - this.size.width
                if (obstacle.weakObject()) {

                }
            }
            if (obstacle.collisionOnRight(this)) {
                this.dx = 1
                this.x = obstacle.x + obstacle.size.width
                if (obstacle.weakObject()) {

                }
            }
        }
        if (this.collisionOnMario(state.mario)) {
            if (state.mario.y + state.mario.size.height + state.mario.vy < this.y + this.size.height && state.mario.vy > 0) {
                state = this.destroy(state);
                state.mario.traits.hasDestroyed = true
            }
            else {
                state.mario.collisionDangerous()

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
    weakObject(): boolean {
        return false
    }
}

export class Mushroom extends ObjectMobile {

    constructor(position: { x: number, y: number }, size: { height: number; width: number; }) {
        super(position.x, position.y, size, 0, 0, 2);
    }
    step(state: State) {
        if (this.collisionOnMario(state.mario)) {
            state.mario.jumpHeight *= 1.75;

            state.object.splice(state.object.indexOf(this), 1)
            return state
        }
        if (this.dx === 0) this.dx = 1
        let inTop = false;
        for (let obstacle of state.obstacle) {
            if (obstacle.collisionOnLeft(this)) {
                this.dx = -1
            }
            if (obstacle.collisionOnRight(this) || this.x < 0) {
                this.dx = 1
            }
            if (obstacle.collisionOnTop(this)) {
                inTop = true
            }
        }
        if (!inTop && this.y + this.size.height + this.vy < terrainSkyBoundary(state)) {
            this.vy += gravite
        }
        else {
            this.vy = 0
        }
        this.y += this.vy
        this.vx = this.dx * this.speed;
        this.x += this.vx
        return state
    }
    weakObject(): boolean {
        return false
    }
}

export class Heart extends ObjectMobile {
    constructor(position: { x: number, y: number }, size: { height: number; width: number; }) {
        super(position.x, position.y, size, 0, 0, 2);
    }
    step(state: State) {
        if (this.collisionOnMario(state.mario)) {
            state.mario.life++;
            state.object.splice(state.object.indexOf(this), 1)
            return state
        }
        if (this.dx === 0) this.dx = 1
        let inTop = false;
        for (let obstacle of state.obstacle) {
            if (obstacle.collisionOnLeft(this)) {
                this.dx = -1
            }
            if (obstacle.collisionOnRight(this) || this.x < 0) {
                this.dx = 1
            }
            if (obstacle.collisionOnTop(this)) {
                inTop = true
            }
        }
        if (!inTop && this.y + this.size.height + this.vy < terrainSkyBoundary(state)) {
            this.vy += gravite
        }
        else {
            this.vy = 0
        }
        this.y += this.vy
        this.vx = this.dx * this.speed;
        this.x += this.vx
        return state
    }
    weakObject(): boolean {
        return false
    }
}


export class Fusee extends ObjectMobile {
    constructor(position: { x: number, y: number }, size: { height: number; width: number; }, speed: number) {
        super(position.x, position.y, size, 1, 0, speed);
        this.speed = speed
    }
    step(state: State) {
        if (this.dx === 0) {
            this.dx = -1
        }
        if (this.x < 0) {
            state.object.splice(state.object.indexOf(this), 1)
        }
        for (let obstacle of state.obstacle) {
            if (obstacle.collisionOnLeft(this) || obstacle.collisionOnRight(this)) {
                state.object.splice(state.object.indexOf(this), 1)
                if (obstacle.weakObject()) {

                }
                break
            }

        }

        if (this.collisionOnMario(state.mario)) {
            if (state.mario.y + state.mario.size.height + state.mario.vy < this.y + this.size.height && state.mario.vy > 0) {
                state.mario.traits.hasDestroyed = true
            }
            else {
                state.mario.collisionDangerous()
            }
            state.object.splice(state.object.indexOf(this), 1)
        }
        this.vx = this.dx * this.speed;
        this.x += this.vx
        return state
    }

    weakObject(): boolean {
        return true
    }
}
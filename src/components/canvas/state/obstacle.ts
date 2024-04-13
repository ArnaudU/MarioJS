import { Character, Mario } from "./charactere";
import { Mushroom, ObjectImmobile, ObjectMobile, ObjectNonSpecified } from "./object";
import { State } from "./state";

export class WoodWall extends ObjectImmobile {

    life: number = 3;
    constructor(position: { x: number, y: number }, size: { height: number; width: number; }) {
        super(position.x, position.y, size);
    }

    collisionOnBottom(character: Character) {
        const b = (character.y > this.y + this.size.height
            && character.y + character.vy < this.y + this.size.height
            && character.x < this.x + this.size.width && character.x + character.size.width > this.x);
        if (b) this.life--;
        const equal = this.y + this.size.height === character.y && character.x < this.x + this.size.width && character.x + character.size.width > this.x
        return b || equal;
    }
    hasNoLife() {
        return this.life <= 0;
    }
    step(state: State) {
        if (this.hasNoLife()) {
            state.obstacle.splice(state.obstacle.indexOf(this), 1);
        }
    }
    weakObject(): boolean {
        this.life--
        return true
    }
}

export class BlocWall extends ObjectImmobile {
    gift: ObjectMobile | undefined;
    constructor(position: { x: number, y: number }, size: { height: number; width: number; }, inside?: ObjectMobile) {
        super(position.x, position.y, size);
        this.gift = inside;
    }

    step(state: State) {
        if (this.gift !== undefined && this.collisionOnBottom(state.mario)) {
            state.object.push(this.gift);
            this.gift = undefined;
        }
    }
    weakObject(): boolean {
        return false
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
        this.bloc = new ObjectNonSpecified({ x: position.x, y: position.y }, { height: -size.width, width: size.width })
        this.drapeau = new ObjectNonSpecified({ x: position.x + 4 * size.width / 6, y: position.y - size.height + size.width }, { height: size.width * 3 / 2, width: size.width * 2 })
        this.baton = new ObjectNonSpecified({ x: position.x + size.width / 4, y: position.y - size.width }, { height: -size.height + size.width * 2, width: size.width / 2 })
        this.boule = new ObjectNonSpecified({ x: position.x, y: position.y - size.height + size.width }, { height: -size.width, width: size.width })
    }
    //Les coordonnée sont différentes de celle des autres images donc on modifie les fonctions de collision
    collisionOnMario(mario: Mario) {
        return mario.x < this.x + this.size.width &&
            mario.x + mario.size.width > this.x &&
            mario.y < this.y &&
            mario.size.height + mario.y > this.y - this.size.height
    }
    step(state: State): void { }
    weakObject(): boolean {
        return true
    }
}
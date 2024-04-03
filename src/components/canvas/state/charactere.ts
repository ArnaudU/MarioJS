import { gravite, marioImage, terrainSkyBoundary } from "../conf";
import { State } from "./state";

export class Character {
    x: number;
    y: number;
    vx: number;
    vy: number;
    dx: number;
    dy: number;
    size: { height: number; width: number; };
    img: HTMLImageElement;

    constructor(x: number, y: number, vx: number, vy: number, size: { height: number; width: number; }, img: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        //Permet de savoir dans quel direction il court
        this.dx = 0;
        this.dy = 0;
        this.size = size;
        this.img = img;
    }
}

export class Mario extends Character {
    jumpHeight: number;
    speed: number;

    traits = {
        jumping: false, running: false, bending: false,
        falling: false, climbing: false, dead: false,
        collisionOnTop: false, collisionOnBottom: false,
        hasDestroyed: false, lostALife: false
    };
    immunise: number = 0
    life: number = 3
    camera: { width: number, height: number }
    //Ajouter height et width
    constructor(position: { x: number, y: number }, vx: number, vy: number, size: { height: number, width: number },
        speed: number, jumpHeight: number) {
        super(position.x, position.y, vx, vy, size, new Image())
        this.speed = speed;
        this.jumpHeight = jumpHeight;
        this.img.src = marioImage;
        this.camera = { width: size.width * 10, height: size.height * 2 }
    }

    actionOnMario(state: State) {
        if (this.life <= 0) this.traits.dead = true
        //S'il appuie sur fleche haut + n'est pas deja en l'air
        if (state.input.keyUp && !this.traits.jumping && !this.traits.bending) {
            this.dy = 1
            this.vy = -this.jumpHeight
            this.traits.jumping = true
        }
        else if (!state.input.keyUp && !this.traits.jumping) {
            this.dy = 0
            this.vy = 0
            this.traits.jumping = false
        }
        //S'il n'est pas baisé et appuie sur fleche bas
        if (state.input.keyDown && !this.traits.bending) {
            this.y = this.y + this.size.height / 2
            this.size.height = this.size.height / 2
            this.traits.bending = true
        }
        else if (!state.input.keyDown && this.traits.bending) {
            this.y = this.y - this.size.height
            this.size.height = this.size.height * 2
            this.traits.bending = false
        }
        if (state.input.keyRight || state.input.keyLeft) {
            state.input.keyRight ? this.dx = 1 : this.dx = -1
            this.vx = this.speed * this.dx
            this.traits.running = true
        }
        else {
            this.vx = 0
            this.traits.running = false
        }
    }

    graviteOnMario(state: State): void {
        let hitObstacleOnTopOfMario = false
        for (const obstacle of state.obstacle) {
            if (obstacle.collisionOnTop(this)) {
                this.traits.jumping = false
                this.y = obstacle.y - this.size.height
                this.dy = 0
                hitObstacleOnTopOfMario = true
            }
            if (obstacle.collisionOnBottom(this)) {
                this.traits.jumping = false
                this.traits.collisionOnTop = true
                this.vy = 0
                this.dy = 0
            }
        }
        if (hitObstacleOnTopOfMario) return

        //Dans le cas où il n'est pas au sol
        if (this.y + this.size.height + this.vy < terrainSkyBoundary(state)) {
            this.traits.jumping = true
            this.vy += gravite
        }

        //Dans le cas où il n'est pas au sol et qu'il est en train de se baisser
        else if (this.traits.bending && this.y + this.vy > terrainSkyBoundary(state) - this.size.height) {
            this.y = terrainSkyBoundary(state) - this.size.height
            this.traits.jumping = false
            this.vy = 0
        }

        else {
            this.y = terrainSkyBoundary(state) - this.size.height
            this.traits.jumping = false
            this.vy = 0
        }
        this.y += this.vy
    }

    walkingMario(state: State): void {
        for (const obstacle of state.obstacle) {
            if (obstacle.collisionOnLeft(this) && this.vx > 0) {
                this.vx = 0
            }
            else if (obstacle.collisionOnRight(this) && this.vx < 0) {
                this.vx = 0
            }
        }
        if (!this.traits.bending) {
            this.x += this.vx
        }
        if (this.x <= 0) {
            this.x = 0
        }
    }

    step(state: State): State {
        this.actionOnMario(state)
        this.graviteOnMario(state)
        this.walkingMario(state)
        return state
    }
}



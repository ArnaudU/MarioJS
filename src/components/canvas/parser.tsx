import { jumpHeight, marioSpeed, terrainSkyBoundaryHeight } from "./conf";
import { BackGroundFrame } from "./render/frame";
import { Mario } from "./state/charactere";
import { Fusee, Heart, Mushroom, ObjectImmobile, ObjectMobile, Shell } from "./state/object";
import { Drapeau, BlocWall, WoodWall } from "./state/obstacle";
import extract from "../levels/export_json";

export function parseJSON(height: number, width: number, level: string): any {

    const obstacles: ObjectImmobile[] = [];
    const object: ObjectMobile[] = [];
    const data = extract(level);
    if ("obstacle" in data) {
        for (const obstacleData of data.obstacle as { type: string, position: { x: number, y: number } }[]) {
            if (obstacleData.type === "wood") {
                const position = obstacleData.position;
                const obstacle = new WoodWall({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y }, { height: 50, width: 50 });
                obstacles.push(obstacle);
            }
            else if (obstacleData.type === "bloc champignon") {
                const position = obstacleData.position;
                const champignon = new Mushroom({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y - 50 }, { height: 50, width: 50 });
                const obstacle = new BlocWall({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y }, { height: 50, width: 50 }, champignon);
                obstacles.push(obstacle);
            }
            else if (obstacleData.type === "bloc coeur") {
                const position = obstacleData.position;
                const coeur = new Heart({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y - 50 }, { height: 50, width: 50 });
                const obstacle = new BlocWall({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y }, { height: 50, width: 50 }, coeur);
                obstacles.push(obstacle);
            }
            else if (obstacleData.type === "bloc simple") {
                const position = obstacleData.position;
                const obstacle = new BlocWall({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y }, { height: 50, width: 50 });
                obstacles.push(obstacle);
            }
        }
    }
    if ("object" in data) {
        for (const obj of data.object as { type: string, interval: number, position: { x: number, y: number }, speed: number }[]) {
            if (obj.type === "shell") {
                const position = obj.position;
                const shell = new Shell({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y }, { height: 40, width: 45 }, obj.speed); // Vous devez définir la taille appropriée ici
                obj.interval === undefined || obj.interval === 0 ? object.push(shell) : setInterval(() => object.push(
                    new Shell({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y },
                        { height: 40, width: 45 }, obj.speed) // Vous devez définir la taille appropriée ici
                ), obj.interval);
            }
            if (obj.type === "fusee") {
                const position = obj.position;
                const fusee = new Fusee({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y }, { height: 50, width: 50 }, obj.speed); // Vous devez définir la taille appropriée ici
                object.push(fusee)
                if (obj.interval !== 0) setInterval(() => object.push(
                    new Fusee({ x: position.x, y: terrainSkyBoundaryHeight(height) - position.y },
                        { height: 50, width: 50 }, obj.speed)),
                    obj.interval * 1000);
            }
        }
    }

    return {
        mario: new Mario(
            { x: 0, y: 0 },
            0, 0,
            { height: 100, width: 50 },
            marioSpeed,
            jumpHeight
        ),
        position: { x: 0, y: 0 },
        input: { keyUp: false, keyDown: false, keyRight: false, keyLeft: false, keyS: false, sound: false },
        screen: { height, width },
        endOfGame: false,
        iteration: 0,
        frame: new BackGroundFrame(),
        drapeau: new Drapeau({ x: data.drapeau.position.x, y: terrainSkyBoundaryHeight(height) - data.drapeau.position.y },
            { height: 500, width: 50 }),
        obstacle: obstacles,
        object: object
    }
}
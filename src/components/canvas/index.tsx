import { useRef, useEffect } from 'react';
import { State, step } from './state/state';
import { onKeyPressed, onKeyReleased } from './controller/ihm';
import { Mario } from './state/charactere';
import { FPS, jumpHeight, marioSpeed, terrainSkyBoundaryHeight } from './conf';
import { BackGroundFrame, render } from './render/render';
import { Drapeau, Shell, WoodWall } from './state/object';

const initCanvas =
    (iterate: (ctx: CanvasRenderingContext2D) => void) =>
        (canvas: HTMLCanvasElement) => {
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            setInterval(() => iterate(ctx), 1000 / FPS)
        }

const Canvas = ({ height, width }: { height: number; width: number }) => {

    const initialState: State = {
        mario: new Mario(
            { x: width / 2, y: 0 },
            0, 0,
            { height: 100, width: 60 },
            marioSpeed,
            jumpHeight
        ),
        coords: { x: 0, y: 0 },
        input: { keyUp: false, keyDown: false, keyRight: false, keyLeft: false, keyS: false, sound: false },
        size: { height, width },
        endOfGame: false,
        iteration: 0,
        frame: new BackGroundFrame(),
        drapeau: new Drapeau({ x: 1300, y: terrainSkyBoundaryHeight(height) }, { height: 500, width: 50 }),
        obstacle: [
            new WoodWall({ x: 900, y: terrainSkyBoundaryHeight(height) - 50 }, { height: 50, width: 50 }),
            new WoodWall({ x: 950, y: terrainSkyBoundaryHeight(height) - 50 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1000, y: terrainSkyBoundaryHeight(height) - 50 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1050, y: terrainSkyBoundaryHeight(height) - 50 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1100, y: terrainSkyBoundaryHeight(height) - 50 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1150, y: terrainSkyBoundaryHeight(height) - 50 }, { height: 50, width: 50 }),

            new WoodWall({ x: 950, y: terrainSkyBoundaryHeight(height) - 100 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1000, y: terrainSkyBoundaryHeight(height) - 100 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1050, y: terrainSkyBoundaryHeight(height) - 100 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1100, y: terrainSkyBoundaryHeight(height) - 100 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1150, y: terrainSkyBoundaryHeight(height) - 100 }, { height: 50, width: 50 }),

            new WoodWall({ x: 1000, y: terrainSkyBoundaryHeight(height) - 150 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1050, y: terrainSkyBoundaryHeight(height) - 150 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1100, y: terrainSkyBoundaryHeight(height) - 150 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1150, y: terrainSkyBoundaryHeight(height) - 150 }, { height: 50, width: 50 }),

            new WoodWall({ x: 1050, y: terrainSkyBoundaryHeight(height) - 200 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1100, y: terrainSkyBoundaryHeight(height) - 200 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1150, y: terrainSkyBoundaryHeight(height) - 200 }, { height: 50, width: 50 }),

            new WoodWall({ x: 1100, y: terrainSkyBoundaryHeight(height) - 250 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1150, y: terrainSkyBoundaryHeight(height) - 250 }, { height: 50, width: 50 }),
            new WoodWall({ x: 1150, y: terrainSkyBoundaryHeight(height) - 300 }, { height: 50, width: 50 }),

            new WoodWall({ x: 500, y: terrainSkyBoundaryHeight(height) - 50 }, { height: 50, width: 50 }),

            new WoodWall({ x: 200, y: terrainSkyBoundaryHeight(height) - 200 }, { height: 50, width: 50 }),
        ],
        object: [
            new Shell({ x: 600, y: terrainSkyBoundaryHeight(height) - 40 }, { height: 40, width: 45 }, 3)
        ]
    }

    const ref = useRef<any>()
    const state = useRef<State>(initialState)

    const iterate = (ctx: CanvasRenderingContext2D) => {
        state.current.iteration++
        state.current = step(state.current)
        render(ctx)(state.current)
    }


    useEffect(() => {
        if (ref.current) {
            initCanvas(iterate)(ref.current);
            document.addEventListener('keydown', (event) => onKeyPressed(event, state.current));
            document.addEventListener('keyup', (event) => onKeyReleased(event, state.current));
        } else {
            document.removeEventListener('keydown', (event) => onKeyPressed(event, state.current));
            document.removeEventListener('keyup', (event) => onKeyReleased(event, state.current));
        }
    }, []);
    return <canvas {...{ height, width, ref }} />;
};

export default Canvas;

import { useRef, useEffect } from 'react';
import { State, step } from './state/state';
import { onKeyPressed, onKeyReleased } from './controller/ihm';
import { render } from './render/render';
import { parseJSON } from './parser';
import { FPS } from './conf';

const initCanvas =
    (iterate: (ctx: CanvasRenderingContext2D) => void) =>
        (canvas: HTMLCanvasElement) => {
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            setInterval(() => iterate(ctx), 1000 / FPS)
        }

const Canvas = ({ height, width, level }: { height: number; width: number, level: string }) => {

    const initialState: State = parseJSON(height, width, level)
    const ref = useRef<any>()
    const state = useRef<State>(initialState)

    const iterate = (ctx: CanvasRenderingContext2D) => {
        state.current.screen = { height: ref.current.clientHeight - 5, width: ref.current.clientWidth - 5 }
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

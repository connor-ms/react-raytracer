import React, { useEffect, useRef } from 'react';
import { Renderer } from '../util/render';

interface CanvasProps {
    renderer: Renderer;
    onRender: (ctx: CanvasRenderingContext2D) => void;
}

const Canvas: React.FC<CanvasProps> = ({ renderer, onRender }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const render = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                onRender(ctx);
            }
        }
    };

    useEffect(render, []);

    return (
        <div className={`flex flex-col items-center w-[${renderer.cam.imageWidth}px]`}>
            <canvas ref={canvasRef} width={renderer.cam.imageWidth} height={renderer.cam.imageHeight} />
            <button className="btn btn-primary mt-3" onClick={render}>Render</button>
        </div>
    );
};

export default Canvas;
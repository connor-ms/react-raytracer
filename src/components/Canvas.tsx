import React, { useEffect, useRef } from 'react';
import { Renderer } from '../util/render';

interface CanvasProps {
    renderer: Renderer;
    onRender: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ renderer, onRender }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const render = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const imageData = ctx.getImageData(0, 0, renderer.cam.imageWidth, renderer.cam.imageHeight);
                renderer.buildFrame(imageData);
                ctx.putImageData(imageData, 0, 0);

                // Update state to rerender settings component
                onRender();
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
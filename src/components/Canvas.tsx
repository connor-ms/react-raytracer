import React, { useEffect, useRef } from 'react';
import RenderManager from '../util/render-manager';

// interface CanvasProps {
//     renderer: Renderer;
//     onRender: () => void;
// }

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const manager = new RenderManager(15);

    const render = () => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');

            if (ctx) {
                manager.setContext(ctx);
            }

            manager.begin();
        }
    }

    //useEffect(render, []);

    return (
        <div className={`flex flex-col items-center text-center w-[700px]`}>
            <canvas ref={canvasRef} width={manager.camera.imageWidth} height={manager.camera.imageHeight} />
            <button className="btn btn-primary my-3" onClick={render}>Render</button>
        </div>
    );
};

export default Canvas;
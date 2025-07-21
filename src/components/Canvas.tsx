import React, { useEffect, useRef } from 'react';
import RenderManager from '../util/render-manager';

interface CanvasProps {
    renderManager: RenderManager;
    //onRender: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ renderManager }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const render = () => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');

            if (ctx) {
                renderManager.setContext(ctx);
            }

            renderManager.begin();
        }
    }

    useEffect(render, []);

    return (
        <div className={`flex flex-col items-center text-center w-[700px]`}>
            <canvas ref={canvasRef} width={renderManager.camera.imageWidth} height={renderManager.camera.imageHeight} />
            <button className="btn btn-primary my-3" onClick={render}>Render</button>
        </div>
    );
};

export default Canvas;
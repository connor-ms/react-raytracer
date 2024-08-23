import React, { useRef, useEffect } from 'react';
import { Renderer } from '../util/render';

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestRef = useRef<number>(0);

    const renderer = new Renderer();

    const render = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                renderer.buildFrame(ctx, requestRef.current);
            }
        }
        requestRef.current = requestAnimationFrame(render);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <canvas ref={canvasRef} width={renderer.cam.imageWidth} height={renderer.cam.imageHeight} />
    );
};

export default Canvas;
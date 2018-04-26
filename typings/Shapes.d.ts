namespace GD.Shapes {
    interface Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        color: GD.Math.Vector4;
        colorUniform: ?WebGLUniformLocation;
        getBufferArray(): Float32Array;
        draw(): void;
        setRenderingContext(renderingContext: WebGLRenderingContext): void;
        getRenderingContext(): WebGLRenderingContext;
    }
}
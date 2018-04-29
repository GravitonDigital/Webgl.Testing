namespace GD.Shapes {
    interface Rectangle extends GD.Core.Position, GD.Core.Size {
        width: number;
        height: number;
        color: GD.Math.Vector4;
        colorUniform: ?WebGLUniformLocation;
        draw(): void;
    }
}
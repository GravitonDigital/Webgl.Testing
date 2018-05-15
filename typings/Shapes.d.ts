namespace GD.Shapes {
    interface Rectangle extends GD.Core.Position, GD.Core.Size, GD.Core.HasParent, GD.Core.CanBeDirty {
        color: GD.Math.Vector4;
        colorUniform: ?WebGLUniformLocation;
    }
}
namespace GD.Shapes {
    interface Rectangle extends GD.Core.Position, GD.Core.Size, GD.Core.HasParent, GD.Core.CanBeDirty {
        id: string;
        color: GD.Math.Vector4;
    }
}
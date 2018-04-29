namespace GD.Core {
    interface Position {
        getPosition: () => GD.Math.Vector2;
        setPosition: (position: GD.Math.Vector2) => void;
    }

    interface Size {
        getSize: () => { width: number; height: number };
        setSize: (width: number, height: number) => void;
    }
}

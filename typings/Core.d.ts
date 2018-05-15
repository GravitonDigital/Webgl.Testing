namespace GD.Core {
    interface Position {
        getPosition(): GD.Math.Vector2;
        setPosition(position: GD.Math.Vector2): void;
    }

    interface Size {
        getSize(): { width: number; height: number };
        setSize(width: number, height: number): void;
    }

    interface HasParent {
        setParent(parent: object);
        getParent(): object;
        getGlobalPosition(): GD.Math.Vector2;
    }

    interface CanBeDirty {
        isDirty(): boolean;
        setDirty(dirtyState: boolean): void;
        render(): void;
    }

    interface HasChildren {
        add(child: object);
        addAt(child: object, index: number);
        remove(child): void;
        removeAll(): void;
        hasDirtyChildren(): boolean;
        render(): void;
        update(): void;
    }

    interface Scene extends GD.Core.HasChildren, GD.Core.CanBeDirty {
        name: string;
    }

    interface Container extends GD.Core.HasChildren, GD.Core.CanBeDirty, GD.Core.Position {}

    interface Renderer {
        render(): void;
        update(dt: number): void;
        getScenes(): Array<GD.Core.Scene>;
        addScene(scene: GD.Core.Scene): void;
        addSceneAt(scene: GD.Core.Scene, index: number): void;
        removeScene(scene: GD.Core.Scene): void;
        isDirty(): boolean;
        getRenderingContext(): WebGLRenderingContext;
        getAttribLocation(): GLint;
        getUniformLocation(): GLint;
        onSceneAdded: signals.Signal;
        onSceneRemoved: signals.Signal;
    }
}

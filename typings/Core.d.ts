namespace GD.Core {
    interface Position {
        getPosition(): GD.Math.Vector2;
        setPosition(position: GD.Math.Vector2): void;
    }

    interface Size {
        getSize(): { width: number; height: number };
        setSize(width: number, height: number): void;
    }

    interface Scene {
        children: [],
        draw(gl: WebGLRenderingContext): void;
        add(child: any): void;
        addAt(child: any, index: number): void;
        remove(child): void;
        removeAll(): void;
        isDirty(): boolean;
    }

    interface Renderer {
        render(): void;
        getScenes(): Array<GD.Core.Scene>;
        addScene(scene: GD.Core.Scene): void;
        addSceneAt(scene: GD.Core.Scene, index: number): void;
        removeScene(scene: GD.Core.Scene): void;
        isDirty(): boolean;
        getRenderingContext(): WebGLRenderingContext;
        getAttribLocation(): GLint; 
        getUniformLocation(): GLint;
    }
}

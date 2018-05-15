namespace GD.UserInterface {
    interface ScenePicker {
        attachTo(renderer: GD.Core.Renderer);
        addScene(scene: GD.Core.Scene);
        removeScene(scene: GD.Core.Scene);
        getDom(): HTMLElement;
    }
}

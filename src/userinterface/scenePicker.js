/**
 * @returns {GD.UserInterface.ScenePicker}
 */
export default function scenePicker() {
    /** @type {GD.UserInterface.ScenePicker} */
    const state = {};

    /**@type {GD.Core.Renderer} */
    let renderer = undefined;
    let sceneAddedBinding = undefined;
    let sceneRemovedBinding = undefined;
    /**@type {Array<GD.Core.Renderer>} */
    const scenes = [];
    let dom = document.createElement('div');
    dom.classList.add('scene-picker');
    dom.innerText = 'Scene Picker';

    function clearDom() {
        while (dom.firstChild) {
            dom.removeChild(dom.firstChild);
        }
        const title = document.createElement('span');
        title.innerText = 'Scene Picker';
        dom.appendChild(title);
    }

    function updateDom() {
        clearDom();
        if (renderer) {
            // const currentScenes = renderer.getScenes();
            // currentScenes.forEach(scene => {
            //     addSceneToDom(scene);
            // });

            scenes.forEach(scene => {
                // if (currentScenes.indexOf(scene) === -1) {
                addSceneToDom(scene);
                // }
            });
        }
    }

    function addSceneToDom(scene) {
        const sceneDom = document.createElement('div');

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.checked = false;
        if (renderer && renderer.getScenes().indexOf(scene) !== -1) {
            checkBox.checked = true;
        }
        checkBox.onclick = () => {
            if (checkBox.checked) {
                renderer.addScene(scene);
            } else {
                renderer.removeScene(scene);
            }
        };

        const name = document.createElement('span');
        name.innerText = scene.name || dom.childElementCount;

        sceneDom.appendChild(checkBox);
        sceneDom.appendChild(name);
        dom.appendChild(sceneDom);
    }

    function attachTo(newRenderer) {
        if (renderer) {
            if (sceneAddedBinding) {
                renderer.onSceneAdded.remove(sceneAddedBinding);
            }
            if (sceneRemovedBinding) {
                renderer.onSceneRemoved.remove(sceneRemovedBinding);
            }
        }
        renderer = newRenderer;

        sceneAddedBinding = renderer.onSceneAdded.add(() => {
            updateDom();
        });
        sceneAddedBinding = renderer.onSceneRemoved.add(() => {
            updateDom();
        });

        updateDom();
    }

    function addScene(scene) {
        scenes.push(scene);

        updateDom();
    }

    function removeScene(sceneToRemove) {
        const index = scenes.indexOf(sceneToRemove);
        if (index !== -1) {
            scenes.splice(index, 1);

            // remove from renderer as well
            if (renderer) {
                renderer.removeScene(sceneToRemove);
            }

            updateDom();
        }
    }

    function getDom() {
        return dom;
    }

    return Object.assign(state, {
        attachTo,
        addScene,
        removeScene,
        getDom
    });
}

import './styles/base.scss';
import rectangle from './shapes/rectangle';
import vector4 from './math/vector4';
import vector2 from './math/vector2';
import renderer from './core/renderer';
import scene from './core/scene';
import Stats from 'stats.js';
import scenePicker from './userinterface/scenePicker';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function render(myRenderer) {
    requestAnimationFrame(() => {
        stats.begin();

        myRenderer.render();

        stats.end();

        render(myRenderer);
    });
}

function main() {
    // Get A WebGL context
    const canvas = document.createElement('canvas');
    const app = document.getElementById('app');
    app.appendChild(canvas);

    const myRenderer = renderer(canvas);
    const myScene = scene('Rectangle scene');

    const rect = rectangle();
    rect.setPosition(vector2(300, 40));
    rect.setSize({ width: 100, height: 300 });
    rect.color = vector4(1, 0, 0);
    rect.colorUniform = myRenderer.getUniformLocation('u_color');
    
    myScene.add(rect);
    
    const myScenePicker = scenePicker();
    app.appendChild(myScenePicker.getDom());
    myScenePicker.attachTo(myRenderer);
    myScenePicker.addScene(myScene);
    
    myRenderer.addScene(myScene);

    render(myRenderer);
}
main();

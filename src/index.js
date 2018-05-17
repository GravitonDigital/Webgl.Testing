import './styles/base.scss';
import renderer from './core/renderer';
import scene from './core/scene';
import Stats from 'stats.js';
import scenePicker from './userinterface/scenePicker';
import randomWalker from './simulations/randomWalker';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
let last = undefined;

function render(myRenderer) {
    requestAnimationFrame(time => {
        stats.begin();

        if (!last) {
            last = time;
        }
        myRenderer.update(time - last);
        last = time;

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
    // myRenderer.skipClear = true;
    const walkerScene = scene('Walker scene');

    const walker = randomWalker();
    walkerScene.add(walker);

    const myScenePicker = scenePicker();
    app.appendChild(myScenePicker.getDom());
    myScenePicker.attachTo(myRenderer);
    myScenePicker.addScene(walkerScene);

    render(myRenderer);
}
main();

import './styles/base.scss';
import renderer from './core/renderer';
import scene from './core/scene';
import Stats from 'stats.js';
import scenePicker from './userinterface/scenePicker';
import randomWalker from './simulations/randomWalker';
import normalDistribution from './utils/normalDistribution';
import rectangle from './shapes/rectangle';
import vector2 from './math/vector2';
import vector4 from './math/vector4';
import normalDistributionGraph from './simulations/normalDistributionGraph';

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

    const myScenePicker = scenePicker();
    app.appendChild(myScenePicker.getDom());
    myScenePicker.attachTo(myRenderer);

    myScenePicker.addScene(createWalkerScene());
    const nds = createNormalDistributionScene();
    myScenePicker.addScene(nds);
    myRenderer.addScene(nds);

    render(myRenderer);
}

function createNormalDistributionScene() {
    const normalDistScene = scene('Normal Distribution');
    const ndg = normalDistributionGraph();
    ndg.run(10000, 0, 100);
    normalDistScene.add(ndg);

    return normalDistScene;
}

function createWalkerScene() {
    const walkerScene = scene('Walker scene');

    const walker = randomWalker();
    walkerScene.add(walker);

    return walkerScene;
}

main();

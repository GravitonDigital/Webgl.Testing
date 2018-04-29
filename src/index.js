import './styles/base.scss';
import rectangle from './shapes/rectangle';
import vector4 from './math/vector4';
import vector2 from './math/vector2';
import renderer from './core/renderer';
import scene from './core/scene';

function render(myRenderer) {
    requestAnimationFrame(() => {
        myRenderer.render();
        render(myRenderer);
    });
}

function main() {
    // Get A WebGL context
    const canvas = document.createElement('canvas');
    const app = document.getElementById('app');
    app.appendChild(canvas);

    const myRenderer = renderer(canvas);
    const myScene = scene();

    const rect = rectangle();
    rect.setPosition(vector2(10, 40));
    rect.setSize({ width: 100, height: 300 });
    rect.color = vector4(1, 0, 0);
    rect.colorUniform = myRenderer.getUniformLocation('u_color');

    myScene.add(rect);

    myRenderer.setScene(myScene);

    render(myRenderer);
}

main();

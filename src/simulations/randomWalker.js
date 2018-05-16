import container from '../core/container';
import pipe from '../utils/pipe';
import rectangle from '../shapes/rectangle';
import vector2 from '../math/vector2';
import vector4 from '../math/vector4';

export default function randomWalker() {
    const state = {};

    const timeBetweenSteps = 1;
    let timeSinceLastStep = 0;
    const currentPos = vector2(600, 600);
    const stepSize = vector2(5, 5);

    function update(dt) {
        timeSinceLastStep += dt;
        if (timeSinceLastStep > timeBetweenSteps) {
            timeSinceLastStep -= timeBetweenSteps;
            step();
        }
    }

    function hasChildOnPosition(position) {
        return state.getChildren().some(c => {
            const cPos = c.getPosition();
            return cPos.x === position.x && cPos.y === position.y;
        });
    }

    function step() {
        const direction = getDirection();
        currentPos.x += stepSize.x * direction.x;
        currentPos.y += stepSize.y * direction.y;

        if (!hasChildOnPosition(currentPos)) {
            const rect = rectangle();
            rect.setSize({ width: stepSize.x, height: stepSize.y });
            rect.setPosition(vector2(currentPos.x, currentPos.y));
            rect.color = vector4(Math.random(), Math.random(), Math.random());
            state.add(rect);
        }
    }

    function getDirection() {
        const dir = vector2(0, 0);
        const random = Math.floor(Math.random() * 4);
        if (random === 0) {
            dir.x = -1;
        } else if (random === 1) {
            dir.x = 1;
        } else if (random === 2) {
            dir.y = -1;
        } else if (random === 3) {
            dir.y = 1;
        }
        return dir;
    }

    const containerState = container();

    return Object.assign(state, containerState, {
        update: pipe(update, containerState.update)
    });
}

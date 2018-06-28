import container from '../core/container';
import rectangle from '../shapes/rectangle';
import vector2 from '../math/vector2';
import { TYPE } from '../Const';
import normalDistribution from '../utils/normalDistribution';

export default function normalDistributionGraph() {
    const state = {
        type: TYPE.NORMAL_DISTRIBUTION_GRAPH
    };

    function run(samples, mean, variance) {
        const gen = normalDistribution(mean, variance);
        const list = [];
        for (let i = 0; i < samples; i += 1) {
            list.push(gen.next());
        }
        list.sort((a, b) => a - b);
        const min = list[0];
        const max = list[list.length - 1];
        const range = max - min;
        const cols = 100;
        const rangePerCol = range / cols;

        const maxColHeight = samples;
        const colWidth = 3;

        for (let colIndex = 0; colIndex < cols; colIndex += 1) {
            const rect = rectangle();
            rect.setPosition(vector2(colWidth * colIndex, 0));
            const inRange = list.filter(n => n - min > colIndex * rangePerCol && n - min <= (colIndex + 1) * rangePerCol);
            rect.setSize({ width: colWidth, height: maxColHeight / samples * inRange.length });
            state.add(rect);
        }
    }

    const containerState = container();

    return Object.assign(state, containerState, {
        run
    });
}

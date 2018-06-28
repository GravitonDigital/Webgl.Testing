import vector4 from '../math/vector4';
import position from '../core/position';
import size from '../core/size';
import pipe from '../utils/pipe';
import hasParent from '../core/hasParent';
import canBeDirty from '../core/canBeDirty';
import { TYPE } from '../Const';

let rectIndex = 0;

/**
 * @param {WebGLRenderingContext} renderingContext
 * @returns {GD.Shapes.Rectangle}
 */
export default function rectangle() {
    /**@type {GD.Shapes.Rectangle} */
    const state = {
        color: vector4(1, 1, 1, 1),
        id: `rect_${rectIndex}`,
        type: TYPE.RECTANGLE,
        renderObject: undefined
    };
    rectIndex += 1;

    function getBufferArray() {
        const position = state.getGlobalPosition();
        const size = state.getSize();
        const x1 = position.x;
        const x2 = position.x + size.width;
        const y1 = position.y;
        const y2 = position.y + size.height;

        const positionBuffer = [x1, y1, 1, x2, y1, 1, x2, y2, 1, x1, y2, 1];

        return positionBuffer;
    }

    function render(renderer) {
        if (state.isDirty() || renderer.isDirty()) {
            if (!state.renderObject) {
                state.renderObject = {
                    id: state.id,
                    color: [],
                    positions: [],
                    indices: [],
                    isNew: true,
                    isDirty: false
                };
            } else {
                state.renderObject.isDirty = true;
            }

            state.renderObject.color = [state.color.x, state.color.y, state.color.z, state.color.w];
            state.renderObject.positions = getBufferArray();
            state.renderObject.indices = [0, 1, 2, 0, 2, 3];
        }

        renderer.renderObjects.push(state.renderObject);
        return renderer;
    }

    function setSize(size) {
        state.setDirty(true);
        return size;
    }

    function setPosition(position) {
        state.setDirty(true);
        return position;
    }

    const positionState = position();
    const sizeState = size();
    const hasParentState = hasParent(state);
    const canBeDirtyState = canBeDirty();

    Object.assign(state, positionState, sizeState, hasParentState, canBeDirtyState, {
        render: pipe(render, canBeDirtyState.render),
        setSize: pipe(setSize, sizeState.setSize),
        setPosition: pipe(setPosition, positionState.setPosition)
    });

    state.setSize({width: 1, height: 1});

    return state;
}

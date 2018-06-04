import hasChildren from './hasChildren';
import pipe from '../utils/pipe';
import canBeDirty from './canBeDirty';
import position from './position';
import { TYPE } from '../Const';

/**
 * @returns {GD.Core.Container}
 */
export default function container() {
    /**@type {GD.Core.Container} */
    const state = {
        type: TYPE.CONTAINER
    };

    function setPosition(position) {
        state.setDirty(true);
        return position;
    }

    const hasChildrenState = hasChildren(state);
    const canBeDirtyState = canBeDirty();
    const positionState = position();

    return Object.assign(state, hasChildrenState, canBeDirtyState, positionState, {
        update: pipe(hasChildrenState.update),
        render: pipe(hasChildrenState.render, canBeDirtyState.render),
        isDirty: pipe(hasChildrenState.hasDirtyChildren, canBeDirtyState.isDirty),
        setPosition: pipe(setPosition, positionState.setPosition)
    });
}

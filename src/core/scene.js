import hasChildren from './hasChildren';
import pipe from '../utils/pipe';
import canBeDirty from './canBeDirty';
import hasParent from './hasParent';
import { TYPE } from '../Const';

/**
 * @returns {GD.Core.Scene}
 */
export default function scene(name) {
    /**@type {GD.Core.Scene} */
    const state = {
        name: name || '',
        type: TYPE.SCENE
    };

    const hasChildrenState = hasChildren(state);
    const canBeDirtyState = canBeDirty();
    const hasParentState = hasParent(state);

    return Object.assign(state, hasChildrenState, canBeDirtyState, hasParentState, {
        update: pipe(hasChildrenState.update),
        render: pipe(hasChildrenState.render, canBeDirtyState.render),
        isDirty: pipe(hasChildrenState.hasDirtyChildren, canBeDirtyState.isDirty)
    });
}

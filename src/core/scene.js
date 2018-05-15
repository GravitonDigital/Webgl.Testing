import hasChildren from './hasChildren';
import pipe from '../utils/pipe';
import canBeDirty from './canBeDirty';

/**
 * @returns {GD.Core.Scene}
 */
export default function scene(name) {
    /**@type {GD.Core.Scene} */
    const state = {
        name: name || ''
    };

    const hasChildrenState = hasChildren(state);
    const canBeDirtyState = canBeDirty();

    return Object.assign(state, hasChildrenState, canBeDirtyState, {
        update: pipe(hasChildrenState.update),
        render: pipe(hasChildrenState.render, canBeDirtyState.render),
        isDirty: pipe(hasChildrenState.hasDirtyChildren, canBeDirtyState.isDirty)
    });
}

/**
 * @returns {GD.Core.CanBeDirty}
 */
export default function canBeDirty() {
    let _isDirty = true;

    function setDirty(dirtyState) {
        _isDirty = !!dirtyState;
    }

    function isDirty(dirtyState) {
        return _isDirty || !!dirtyState;
    }

    function render(renderer){
        setDirty(false);
        return renderer;
    }

    return {
        isDirty,
        setDirty,
        render
    };
}

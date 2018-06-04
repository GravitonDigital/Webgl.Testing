import vector2 from '../math/vector2';

/**
 * @returns {GD.Core.HasParent}
 */
export default function hasParent(state) {
    let parent = undefined;

    function setParent(newParent) {
        parent = newParent;
    }

    function getParent() {
        return parent;
    }

    function getGlobalPosition() {
        let position = vector2();
        if (state.getPosition) {
            position = state.getPosition();
        }

        if (parent) {
            let parentPos = new vector2();
            if (parent.getGlobalPosition) {
                parentPos = parent.getGlobalPosition();
            } else if (parent.getPosition) {
                parentPos = parent.getPosition();
            }
            position.x += parentPos.x;
            position.y += parentPos.y;
        }

        return position;
    }

    function getParentOfType(type) {
        if (!parent) {
            return null;
        }
        if (parent.type === type) {
            return parent;
        } else if (parent.getParentOfType) {
            return parent.getParentOfType(type);
        }
        return null;
    }

    return {
        setParent,
        getParent,
        getGlobalPosition,
        getParentOfType
    };
}

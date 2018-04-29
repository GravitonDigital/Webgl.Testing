import vector2 from '../math/vector2';

/**
 * @returns {GD.Core.Position}
 */
export default function position() {
    let x = 0;
    let y = 0;

    function getPosition() {
        return vector2(x, y);
    }

    function setPosition(position) {
        x = position.x;
        y = position.y;
        return position;
    }

    return {
        getPosition,
        setPosition
    };
}

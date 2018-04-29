/**
 * @returns {GD.Core.Size}
 */
export default function size() {
    let width = 0;
    let height = 0;

    function getSize() {
        return { width, height };
    }

    function setSize(size) {
        width = size.width;
        height = size.height;
        return size;
    }

    return {
        getSize,
        setSize
    };
}

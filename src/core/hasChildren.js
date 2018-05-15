/**
 * @returns {GD.Core.HasChildren}
 */
export default function hasChildren() {
    let childrenChanged = false;
    let children = [];

    function add(child) {
        children.push(child);
        childrenChanged = true;
    }

    function addAt(child, index) {
        children.splice(index, 0, child);
        childrenChanged = true;
    }

    function remove(child) {
        const index = children.indexOf(child);
        if (index !== -1) {
            children.splice(index, 1);
        }
        childrenChanged = true;
    }

    function removeAll() {
        children = [];
        childrenChanged = true;
    }

    function hasDirtyChildren(dirtyState) {
        return children.some(c => c.isDirty && c.isDirty()) || childrenChanged || !!dirtyState;
    }

    function update(dt) {
        for (let i = 0; i < children.length; i += 1) {
            if (children[i].update) {
                children[i].update(dt);
            }
        }
    }

    function render(gl) {
        for (let i = 0; i < children.length; i += 1) {
            children[i].render(gl);
        }
        childrenChanged = false;
    }

    return {
        add,
        addAt,
        remove,
        removeAll,
        hasDirtyChildren,
        render,
        update
    };
}

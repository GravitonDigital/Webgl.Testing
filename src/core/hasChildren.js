/**
 * @returns {GD.Core.HasChildren}
 */
export default function hasChildren(state) {
    let childrenChanged = false;
    let children = [];

    function setParentOnChild(child, parent) {
        if (child.setParent) {
            child.setParent(parent);
        }
    }

    function add(child) {
        children.push(child);
        setParentOnChild(child, state);
        childrenChanged = true;
    }

    function addAt(child, index) {
        children.splice(index, 0, child);
        setParentOnChild(child, state);
        childrenChanged = true;
    }

    function remove(child) {
        const index = children.indexOf(child);
        if (index !== -1) {
            children.splice(index, 1);
            setParentOnChild(child, undefined);
            childrenChanged = true;
        }
    }

    function removeAll() {
        for (let i = 0; i < children.length; i += 1) {
            setParentOnChild(children[i], undefined);
        }
        children = [];
        childrenChanged = true;
    }

    function getChildren(){
        return children;
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

    function render(renderer) {
        for (let i = 0; i < children.length; i += 1) {
            children[i].render(renderer);
        }
        childrenChanged = false;
        return renderer;
    }

    return {
        add,
        addAt,
        remove,
        removeAll,
        getChildren,
        hasDirtyChildren,
        render,
        update
    };
}

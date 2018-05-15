/**
 * @returns {GD.Core.Scene}
 */
export default function scene(name = '') {
    /**@type {GD.Core.Scene} */
    const state = {
        children: [],
        name: name
    };

    function update(dt) {
        for (let i = 0; i < state.children.length; i += 1) {
            if (state.children[i].update) {
                state.children[i].update(dt);
            }
        }
    }

    function draw(gl) {
        for (let i = 0; i < state.children.length; i += 1) {
            state.children[i].draw(gl);
        }
    }

    function add(child) {
        state.children.push(child);
    }

    function addAt(child, index) {
        state.children.splice(index, 0, child);
    }

    function remove(child) {
        const index = state.children.indexOf(child);
        if (index !== -1) {
            state.children.splice(index, 1);
        }
    }

    function removeAll() {
        state.children = [];
    }

    function isDirty() {
        return state.children.some(c => c.isDirty);
    }

    return Object.assign(state, {
        update,
        draw,
        add,
        addAt,
        remove,
        removeAll,
        isDirty
    });
}

import {
    defineStore,
} from 'pinia';

const usePlayerStore = defineStore({
    id: 'playerStore',
    state() {
        return {
            index: 1,
            theme: '#5FB878',
        }
    },
    getters: {
        mulIndex: (state) => state.index * 2,
    },
    actions: {

        incresement() {
            this.index++;
        }

    }
})

export default usePlayerStore;
import {
    defineStore,
} from 'pinia';

const usePlayerStore = defineStore({
    id: 'playerStore',
    state() {
        return {
            index: 1,
            theme: '#ff7875',
            playerQueueShow: false,
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
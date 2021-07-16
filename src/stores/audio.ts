import {
    defineStore,
} from 'pinia';

const defaultAudioOptions = {
    volume: .5, //
    order: 'order', // random、loop
    src: '',
    playbackRate: 1,
    playStatus: 0,
    start: 0,
    end: Infinity,
    currentTime: 0,
    duration: 0,
}

const useAudioStore = defineStore({
    id: 'audioStore',
    state() {
        return {
            ...defaultAudioOptions,
        }
    },
    getters: {

    },
    actions: {

        setCurrentTime(currentTime: number) {
            this.currentTime = currentTime;
        },



    }
})

export default useAudioStore;
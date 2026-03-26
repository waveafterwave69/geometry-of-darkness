import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Track {
    src: string
    name: string
    text: any[]
}

export const useTrackStore = defineStore('track', () => {
    const track = ref<Track | null>(null)

    const changeTrack = (newTrack: Track) => {
        track.value = newTrack
    }

    return { track, changeTrack }
})

<script setup lang="ts">
import { songs } from '@/static/songs'
import LyricsComponent from '@/components/LyricsComponent.vue'
import PlayerBar from '@/components/PlayerBar.vue'
import { useAudioStore } from './stores/audioStore'
import { onMounted, onUnmounted } from 'vue'

const audioStore = useAudioStore()

const stopAudioFull = () => {
    audioStore.audio.pause()
    audioStore.audio.currentTime = 0
    audioStore.isPlaying = false
    if (audioStore.animationId) cancelAnimationFrame(audioStore.animationId)
}

const handleVisibility = () => {
    if (document.hidden && audioStore.isPlaying) audioStore.audio.pause()
    else if (!document.hidden && audioStore.isPlaying) audioStore.audio.play().catch(() => {})
}

onMounted(() => {
    window.addEventListener('visibilitychange', handleVisibility)

    window.addEventListener('beforeunload', stopAudioFull)

    if (audioStore.isPlaying && !audioStore.animationId) audioStore.animate()
})

onUnmounted(() => {
    window.removeEventListener('visibilitychange', handleVisibility)
})
</script>

<template>
    <main class="container">
        <RouterView />
        <LyricsComponent
            v-if="songs[0] && audioStore.isPlaying"
            :lyrics="songs[0].text"
            :isPlaying="audioStore.isPlaying"
            :currentTime="audioStore.currentTime"
            :isTextVisible="audioStore.isTextVisible"
            :bassValue="audioStore.bassValue"
        />
        <PlayerBar
            :duration="audioStore.duration"
            :currentTime="audioStore.currentTime"
            :isPlaying="audioStore.isPlaying"
            :changeAudio="audioStore.changeAudio"
            :toggleText="audioStore.toggleText"
            :isTextVisible="audioStore.isTextVisible"
        />
    </main>
</template>

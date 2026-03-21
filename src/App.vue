<script setup lang="ts">
import { songs } from '@/static/songs'
import LyricsComponent from '@/components/LyricsComponent.vue'
import PlayerBar from '@/components/PlayerBar.vue'
import { useAudioPlay } from './composables/useAudioPlay'

const { changeAudio, toggleText, isPlaying, currentTime, isTextVisible, bassValue, duration } =
    useAudioPlay()
</script>

<template>
    <main class="container">
        <RouterView />
        <LyricsComponent
            v-if="songs[0] && isPlaying"
            :lyrics="songs[0].text"
            :isPlaying="isPlaying"
            :currentTime="currentTime"
            :isTextVisible="isTextVisible"
            :bassValue="bassValue"
        />
        <PlayerBar
            :duration="duration"
            :currentTime="currentTime"
            :isPlaying="isPlaying"
            :changeAudio="changeAudio"
            :toggleText="toggleText"
            :isTextVisible="isTextVisible"
        />
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface LyricLine {
    time: number
    text: string
}

interface Props {
    lyrics: LyricLine[]
    isPlaying: boolean
    currentTime: number
    isTextVisible: boolean
    bassValue: number
}

const props = defineProps<Props>()

const activeLyric = computed(() => {
    const line = [...props.lyrics].reverse().find((l) => props.currentTime >= l.time)
    return line ? line.text : ''
})
</script>

<template>
    <div class="lyrics-container" v-if="isPlaying && isTextVisible">
        <transition name="lyric-zoom" mode="out-in">
            <span
                :key="activeLyric"
                class="lyric-word"
                :data-text="activeLyric"
                :style="{ transform: `scale(${1 + (bassValue / 255) * 0.15})` }"
            >
                {{ activeLyric }}
            </span>
        </transition>
    </div>
</template>

<style scoped>
.lyrics-container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 15;
    pointer-events: none;
    text-align: center;
    padding: 16px;
}

.lyric-word {
    font-size: clamp(32px, 8vw, 80px);
    max-width: min(90vw, 1200px);
    font-weight: 900;
    text-transform: uppercase;
    color: #fff;
    font-family: 'Inter', sans-serif;
    padding: 0 clamp(16px, 4vw, 40px);
    text-shadow:
        0 0 clamp(15px, 3vw, 30px) rgba(255, 255, 255, 0.192),
        0 0 clamp(30px, 6vw, 60px) rgba(255, 255, 255, 0.164);
    line-height: 1.2;
    display: block;
    will-change: transform, opacity;
    word-break: break-word;
}

/* Анимация lyric-zoom */
.lyric-zoom-enter-active,
.lyric-zoom-leave-active {
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}
.lyric-zoom-enter-from {
    opacity: 0;
    transform: scale(1.5);
    filter: blur(20px);
}
.lyric-zoom-leave-to {
    opacity: 0;
    transform: scale(0.8);
    filter: blur(15px);
}
</style>

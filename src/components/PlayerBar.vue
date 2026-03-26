<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    duration: number
    currentTime: number
    isPlaying: boolean
    changeAudio: (pos: number, duration: number) => void
    toggleText: () => void
    isTextVisible: boolean
}

const props = defineProps<Props>()

const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const progressPercent = computed(() =>
    props.duration ? (props.currentTime / props.duration) * 100 : 0,
)

const seek = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    props.changeAudio(pos, props.duration)
}
</script>

<template>
    <div class="player-bar" v-if="isPlaying">
        <div class="player-progress-container" @click="seek">
            <div class="player-progress-bg">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
        </div>
        <div class="player-info">
            <span class="time">{{ formatTime(currentTime) }}</span>
            <div class="track-block">
                <span class="track-name">pyrokinesis — притча во языцех</span>
            </div>
            <span class="time">{{ duration ? formatTime(duration) : '00:00' }}</span>
        </div>
        <button class="player__button" @click="toggleText">
            <span>{{ isTextVisible ? 'Скрыть текст' : 'Показать текст' }}</span>
        </button>
    </div>
</template>

<style scoped>
.player-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 100%);
    backdrop-filter: blur(15px);
    padding: clamp(15px, 2vh, 25px) clamp(20px, 4vw, 50px);
    z-index: 100;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.player__button {
    margin-top: clamp(8px, 1.5vh, 10px);
    background: var(--color-light);
    color: var(--color-dark);
    border: none;
    padding: clamp(6px, 1.5vh, 8px) clamp(30px, 10vw, 50px);
    font-size: clamp(14px, 2vw, 16px);
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;
    z-index: 30;
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
    display: block;
}

.player__button:hover {
    transform: scale(1.02);
    background: #f0f0f0;
}

.player-progress-container {
    cursor: pointer;
}

.player-progress-bg {
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    position: relative;
    margin-bottom: clamp(8px, 1.5vh, 10px);
}

.progress-fill {
    height: 100%;
    background: var(--color-light);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    transition: width 0.1s linear;
}

.player-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-light);
    font-size: clamp(12px, 2vw, 14px);
    gap: 10px;
    flex-wrap: wrap;
}
</style>

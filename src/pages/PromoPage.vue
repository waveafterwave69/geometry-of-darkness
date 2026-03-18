<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import track from '../audio/pyrokinesis-1.mp3'
import { songs } from '@/static/songs'
import LyricsComponent from '@/components/LyricsComponent.vue'
import PlayerBar from '@/components/PlayerBar.vue'

const audio = new Audio(track)
audio.loop = true
audio.volume = 0.4

const isPlaying = ref(false)
const imgScale = ref(1)
const bassValue = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const isTextVisible = ref(true)
const isBlurMode = ref(true)

const changeAudio = (pos: number, duration: number) => {
    audio.currentTime = pos * (duration || 0)
}

let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let dataArray: Uint8Array | null = null
let animationId: number | null = null

const initAnalyser = () => {
    if (audioContext) return
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    audioContext = new AudioContextClass()
    const source = audioContext.createMediaElementSource(audio)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    dataArray = new Uint8Array(analyser.frequencyBinCount)
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    animate()
}

const animate = () => {
    if (!analyser || !dataArray) return
    currentTime.value = audio.currentTime
    if (!duration.value && audio.duration) duration.value = audio.duration

    analyser.getByteFrequencyData(dataArray as any)
    const currentBass = dataArray[0] ?? 0
    bassValue.value = currentBass
    const targetScale = 1 + (currentBass / 255) * 0.1
    imgScale.value += (targetScale - imgScale.value) * 0.2
    animationId = requestAnimationFrame(animate)
}

const toggleAudio = () => {
    if (!audioContext) initAnalyser()
    if (audioContext?.state === 'suspended') audioContext.resume().catch(() => {})
    if (isPlaying.value) {
        audio.pause()
        isPlaying.value = false
    } else {
        audio.play().catch(() => {})
        isPlaying.value = true
    }
}

const toggleText = () => {
    isTextVisible.value = !isTextVisible.value
    if (!isTextVisible.value) {
        isBlurMode.value = false
    } else {
        isBlurMode.value = true
    }
}

onMounted(() => {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying.value) audio.pause()
        else if (!document.hidden && isPlaying.value) audio.play().catch(() => {})
    })
})

onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    audio.pause()
})
</script>

<template>
    <div
        class="promo__wrapper"
        :class="{
            'is-playing-mode': isPlaying && isBlurMode,
            'is-text-hidden': !isTextVisible,
        }"
    >
        <div class="screen-glow" :style="{ opacity: (bassValue / 255) * 0.6 }"></div>

        <lyrics-component
            v-if="songs[0]"
            :lyrics="songs[0].text"
            :isPlaying="isPlaying"
            :currentTime="currentTime"
            :isTextVisible="isTextVisible"
            :bassValue="bassValue"
        />

        <player-bar
            :duration="duration"
            :currentTime="currentTime"
            :isPlaying="isPlaying"
            :changeAudio="changeAudio"
            :toggleText="toggleText"
            :isTextVisible="isTextVisible"
        />
        <div class="promo" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }">
            <div class="main__content">
                <div class="text__content">
                    <h1 class="promo__title">Геометрия Тьмы</h1>
                    <p class="promo__subtitle">by: pyrokinesis</p>
                    <div class="promo__text">
                        <p>
                            <span>слова разработчика:</span> <br />
                            данным проектом хочу выразить свою любовь к творчеству андрея
                            пирокинезиса, а именно к его работе под названием "геометрия тьмы"
                        </p>
                    </div>
                </div>

                <div class="promo__img-container">
                    <div
                        class="img__glow-aura"
                        :style="{
                            transform: `scale(${1 + (bassValue / 255) * 0.7})`,
                            opacity: (bassValue / 255) * 0.8,
                        }"
                    ></div>
                    <img
                        src="../img/logo.png"
                        alt="Logo"
                        class="promo__img"
                        :style="{ transform: `scale(${imgScale})` }"
                    />
                </div>
            </div>

            <div class="button-center">
                <button class="promo__button" @click="toggleAudio">
                    <span>{{ isPlaying ? 'Выключить' : 'Слушать' }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.promo__wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    padding-bottom: clamp(60px, 10vh, 100px);
}

.is-playing-mode .promo {
    filter: blur(15px) brightness(0.3);
    transform: scale(0.9);
    pointer-events: none;
    transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-text-hidden .promo {
    filter: none;
    transform: scale(1);
    pointer-events: auto;
}

.promo {
    position: relative;
    z-index: 5;
    width: 100%;
    padding: 0 clamp(16px, 5vw, 40px);
    transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.screen-glow {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    box-shadow: inset 0 0 clamp(50px, 10vw, 150px) rgba(255, 255, 255, 0.25);
    will-change: opacity;
}

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
    color: var(--color-light);
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

/* Адаптивный дизайн контента */
.main__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(20px, 5vw, 60px);
    flex-wrap: wrap;
}

.text__content {
    flex: 1;
    min-width: min(100%, 400px);
}

.promo__img-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
}

.promo__img {
    width: clamp(200px, 40vw, 450px);
    height: auto;
    z-index: 3;
    border-radius: 4px;
    will-change: transform;
}

.img__glow-aura {
    position: absolute;
    width: clamp(150px, 30vw, 300px);
    height: clamp(150px, 30vw, 300px);
    background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
    filter: blur(clamp(20px, 4vw, 40px));
    z-index: 2;
}

.button-center {
    display: flex;
    justify-content: center;
    margin-top: clamp(40px, 8vh, 80px);
}

.promo__button {
    background: var(--color-light);
    color: var(--color-dark);
    border: none;
    padding: clamp(14px, 2vh, 18px) clamp(30px, 6vw, 50px);
    font-size: clamp(16px, 2vw, 18px);
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;
    z-index: 30;
    white-space: nowrap;
}

.promo__button:hover {
    transform: scale(1.05);
}

.track-block {
    flex: 1;
    min-width: min(200px, 100%);
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 10px;
}

.track-name {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pulsing {
    animation: blink 2s infinite;
}

@keyframes blink {
    50% {
        opacity: 0.3;
    }
}

/* Адаптивная типографика */
.promo__title {
    font-size: clamp(42px, 8vw, 86px);
    color: var(--color-light);
    line-height: 1.1;
    word-break: break-word;
}

.promo__subtitle {
    font-size: clamp(18px, 3vw, 28px);
    color: var(--color-light);
    opacity: 0.6;
    margin-bottom: clamp(20px, 4vh, 40px);
}

.promo__text {
    font-size: clamp(16px, 2vw, 20px);
    color: var(--color-light);
    max-width: min(100%, 650px);
    opacity: 0.8;
    line-height: 1.6;
    max-width: 700px;
}

.promo__text span {
    font-weight: bold;
    text-transform: uppercase;
    font-size: clamp(11px, 1.5vw, 13px);
    letter-spacing: clamp(1px, 0.2vw, 2px);
}

/* Медиа-запросы для мобильных устройств */
@media (max-width: 768px) {
    .main__content {
        flex-direction: column-reverse;
        text-align: center;
    }

    .text__content {
        text-align: center;
    }

    .promo__text {
        margin-left: auto;
        margin-right: auto;
    }

    .player-info {
        flex-direction: column;
        gap: 5px;
    }

    .track-block {
        width: 100%;
        text-align: center;
    }

    .time {
        width: 100%;
        text-align: center;
    }
}

/* Для очень маленьких экранов */
@media (max-width: 480px) {
    .lyric-word {
        font-size: 28px;
        padding: 0px 20px;
        line-height: 1.3;
        top: 200px;
        position: fixed;
    }

    .player-bar {
        padding: 10px 15px;
    }

    .promo__button {
        padding: 12px 25px;
        font-size: 15px;
    }

    .promo__img {
        margin-top: 30px;
    }

    .button-center {
        margin-bottom: 150px;
    }
}

/* Альбомная ориентация на мобильных */
@media (max-width: 896px) and (orientation: landscape) {
    .main__content {
        flex-direction: row;
    }

    .promo__img {
        width: 150px;
    }

    .promo__title {
        font-size: 36px;
    }

    .promo__subtitle {
        font-size: 16px;
        margin-bottom: 15px;
    }

    .promo__text {
        font-size: 14px;
    }

    .button-center {
        margin-top: 30px;
    }
}
</style>

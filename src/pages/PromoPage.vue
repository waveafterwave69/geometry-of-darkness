<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import track from '../audio/pyrokinesis-1.mp3'

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

const lyrics = [
    { time: 11, text: 'Не ликую, не тоскую' },
    { time: 13, text: 'Чтоб художнику освоить мастерскую' },
    { time: 15, text: 'Надо знать на отлично все азы' },
    { time: 17, text: 'Цех не имеет выходных' },
    { time: 18.5, text: 'И это притча во языцех' },
    { time: 20, text: '(Работа должна идти)' },
    { time: 22, text: 'А я всё дурно по мирку роя' },
    { time: 23.5, text: 'Но хватит и два шага от Сатурна до Меркурия' },
    { time: 26.5, text: 'И от мифа до легенды' },
    { time: 28, text: 'Я шагаю налегке и между ними' },
    { time: 30.3, text: 'Там, где-то тогда помру и я' },
    { time: 32.5, text: 'Старый подлунный сквер' },
    { time: 34.2, text: 'Какой-то волшебный флёр и свет мягенький как эклер' },
    { time: 37.2, text: 'Давно пусто свято место — было три же' },
    { time: 39.2, text: 'Гендальф Серый, Саша Белый, Борис Рыжий' },
    { time: 41.5, text: 'Последний, кстати, повесился' },
    { time: 43.2, text: 'Повесился, чтоб сохранить момент' },
    { time: 45, text: 'А не потому что трус' },
    { time: 46.6, text: 'И как-то один француз задачку не мог решить' },
    { time: 49.6, text: 'А Боря, в ответ Камю:' },
    { time: 51, text: '«Смерть не стоит того, чтоб жить»' },
    { time: 52.5, text: '...' },
    { time: 54, text: 'Рыцарь кичится ослице' },
    { time: 55.5, text: 'Ходят слухи, ставят мат, и это притча во языцех' },
    { time: 58.2, text: 'Ну, а там' },
    { time: 59, text: 'Мышь крадётся, киса плачет' },
    { time: 60.5, text: 'Жива смерть, и по-другому тут всё так или иначе' },
    { time: 63, text: 'Будто всё наоборот' },
    { time: 65, text: 'Рыцарь кичится ослице' },
    { time: 66.5, text: 'Ходят слухи, ставят мат, и это притча во языцех' },
    { time: 69.2, text: 'Ну, а там' },
    { time: 70, text: 'Мышь крадётся, киса плачет' },
    { time: 71.5, text: 'Жива смерть, и по-другому тут всё так или иначе' },
    { time: 74, text: 'Будто всё наоборот' },
    { time: 75.5, text: 'Сколько лет как ни марал...' },
    { time: 77.8, text: 'Чернила чтоб преодолеть материал' },
    { time: 80.5, text: 'И не ставшие канонами апокрифы' },
    { time: 83, text: 'Рубят правду-матку на части, как остриё глефы' },
    { time: 86.8, text: 'Земля-мать, я к твоей дочке' },
    { time: 88.4, text: 'Тяну язык, и вдоль уха веду по мочке' },
    { time: 91.0, text: 'И понимать — ведь не иметь в виду помочь' },
    { time: 93.6, text: 'Во что в итоге истоптали когда-то святую почву' },
    { time: 96.2, text: 'А теперь#@%&^@@' },
    { time: 97, text: 'Так и бросят ничью жильцы' },
    { time: 98.3, text: 'И помнится, как приснилася бабочка Чжуаньцзы' },
    { time: 101, text: 'Или бабочке — Чжуаньцзы' },
    { time: 102.4, text: 'Или бабочка с Чжуаньцзы' },
    { time: 103.7, text: 'Одновременно мне' },
    { time: 104.8, text: 'И кажется, река Нева чем-то давно беременна' },
    { time: 107.2, text: 'Давно пора мне' },
    { time: 108.2, text: 'Но, я жду отлив и с ним я жду твоё дитя' },
    { time: 110.1, text: 'Лишь, чтобы бросить топора в него' },
    { time: 112.1, text: 'И я подозреваю: Боря знал' },
    { time: 113.7, text: 'Письма большой секрет' },
    { time: 115.2, text: 'И умер, чтоб преодолеть материал' },
    { time: 117.0, text: '...' },
    { time: 119.0, text: 'Рыцарь кичится ослице' },
    { time: 120.5, text: 'Ходят слухи, ставят мат, и это притча во языцех' },
    { time: 122.8, text: 'Ну, а там' },
    { time: 123.9, text: 'Мышь крадётся, киса плачет' },
    { time: 125.4, text: 'Жива смерть, и по-другому тут всё так или иначе' },
    { time: 128.0, text: 'Будто всё наоборот' },
    { time: 129.5, text: 'Рыцарь кичится ослице' },
    { time: 131.0, text: 'Ходят слухи, ставят мат, и это притча во языцех' },
    { time: 133.6, text: 'Ну, а там' },
    { time: 134.5, text: 'Мышь крадётся, киса плачет' },
    { time: 136, text: 'Жива смерть, и по-другому тут всё так или иначе' },
    { time: 138.4, text: 'Будто всё наоборот' },
    { time: 140.5, text: 'Рыцарь кичится ослице' },
    { time: 142.0, text: 'Ходят слухи, ставят мат, и это притча во языцех' },
    { time: 144.6, text: 'Ну, а там' },
    { time: 145.5, text: 'Мышь крадётся, киса плачет' },
    { time: 147.0, text: 'Жива смерть, и по-другому тут всё так или иначе' },
    { time: 149.4, text: 'Будто всё наоборот' },
    { time: 151.0, text: '' },
]

const activeLyric = computed(() => {
    const line = [...lyrics].reverse().find((l) => currentTime.value >= l.time)
    return line ? line.text : ''
})

const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, '00')}:${secs.toString().padStart(2, '00')}`
}

const progressPercent = computed(() =>
    duration.value ? (currentTime.value / duration.value) * 100 : 0,
)

const seek = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    audio.currentTime = pos * (duration.value || 0)
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
        class="promo-wrapper"
        :class="{
            'is-playing-mode': isPlaying && isBlurMode,
            'is-text-hidden': !isTextVisible,
        }"
    >
        <div class="screen-glow" :style="{ opacity: (bassValue / 255) * 0.6 }"></div>

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
                        class="img-glow-aura"
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
    </div>
</template>

<style scoped>
/* Базовые стили */
.promo-wrapper {
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

.img-glow-aura {
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
    background: #fff;
    color: #000;
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

/* Адаптивный плеер */
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
    background: #fff;
    color: #000;
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
    background: #fff;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    transition: width 0.1s linear;
}

.player-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: clamp(12px, 2vw, 14px);
    gap: 10px;
    flex-wrap: wrap;
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
    color: #fff;
    line-height: 1.1;
    word-break: break-word;
}

.promo__subtitle {
    font-size: clamp(18px, 3vw, 28px);
    color: #fff;
    opacity: 0.6;
    margin-bottom: clamp(20px, 4vh, 40px);
}

.promo__text {
    font-size: clamp(16px, 2vw, 20px);
    color: #fff;
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

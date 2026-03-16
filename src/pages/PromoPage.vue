<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import track from '../audio/pyrokinesis-1.mp3'

const audio = new Audio(track)
audio.loop = true
audio.volume = 0.2

const handleVisibilityChange = () => {
    if (document.hidden) {
        audio.pause()
    } else {
        audio.play().catch(() => {})
    }
}

const playAudio = () => {
    audio
        .play()
        .then(() => {
            window.removeEventListener('click', playAudio)
            window.removeEventListener('mousemove', playAudio)
        })
        .catch(() => {})
}

onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)

    window.addEventListener('click', playAudio)
    window.addEventListener('mousemove', playAudio)
})

onUnmounted(() => {
    audio.pause()
    audio.src = ''
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('click', playAudio)
    window.removeEventListener('mousemove', playAudio)
})
</script>

<template>
    <div
        class="promo"
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 1000 } }"
    >
        <div class="main__content">
            <div class="text__content">
                <h1
                    class="promo__title"
                    v-motion
                    :initial="{ opacity: 0, x: -100, filter: 'blur(10px)' }"
                    :enter="{
                        opacity: 1,
                        x: 0,
                        filter: 'blur(0px)',
                        transition: { delay: 200, duration: 800 },
                    }"
                >
                    Геометрия Тьмы
                </h1>
                <p
                    class="promo__subtitle"
                    v-motion
                    :initial="{ opacity: 0, x: -50 }"
                    :enter="{ opacity: 1, x: 0, transition: { delay: 500, duration: 800 } }"
                >
                    by: pyrokinesis
                </p>
                <div
                    class="promo__text"
                    v-motion
                    :initial="{ opacity: 0, y: 30 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 800, duration: 1000 } }"
                >
                    <p>
                        <span>слова разработчика:</span> <br />
                        данным проектом хочу выразить свою любовь к творчеству андрея пирокинезиса,
                        а именно к его работе под названием “геометрия тьмы”, которая является по
                        истине величайшим альбомом, который слушается и читается как единая история
                    </p>
                </div>
            </div>
            <a
                class="promo__link"
                target="_blank"
                href="https://genius.com/albums/Pyrokinesis/Geometry-of-darkness"
                v-motion
                :initial="{ opacity: 0, scale: 0.8, rotate: 5 }"
                :enter="{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    transition: {
                        delay: 400,
                        duration: 1200,
                        scale: { type: 'spring', stiffness: 50 },
                    },
                }"
            >
                <img
                    src="../img/logo.png"
                    alt="Геометрия Тьмы"
                    class="promo__img"
                    v-motion
                    :enter="{
                        y: [0, -15, 0],
                        transition: {
                            y: { repeat: Infinity, duration: 4000, ease: 'easeInOut' },
                        },
                    }"
                />
            </a>
        </div>
        <button
            class="promo__button"
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1, transition: { delay: 1500 } }"
        >
            Начать
        </button>
    </div>
</template>

<style scoped>
.promo {
    margin-top: 170px;
}

.main__content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.text__content {
    display: flex;
    flex-direction: column;
}

.promo__title {
    font-size: 86px;
    margin-bottom: -10px;
    color: var(--color-light);
}

.promo__subtitle {
    font-size: 30px;
    font-family: var(--subtitle-font);
    margin-bottom: 45px;
    color: var(--color-light);
    opacity: 0.8;
}

.promo__text {
    font-size: 22px;
    max-width: 800px;
    line-height: 1.4;
}

.promo__text span {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 1px;
}

.promo__img {
    width: 470px;
    box-shadow: 15px 15px 70px -40px var(--color-light);
    border-radius: 4px;
    display: block;
}

.promo__button {
    color: var(--color-dark);
    background-color: var(--color-light);
    padding: 15px 60px;
    font-family: var(--title-font);
    font-size: 26px;
    display: flex;
    justify-content: center;
    margin: 80px auto 0;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 30px -10px rgba(255, 255, 255, 0.5);
}
</style>

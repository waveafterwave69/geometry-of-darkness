import { ref } from 'vue'
import track from '../audio/pyrokinesis-1.mp3'
import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audio', () => {
    const audio = new Audio(track)
    audio.loop = true
    audio.volume = 0.4

    let audioContext: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let dataArray: Uint8Array | any = null
    let animationId: number | null = null

    const isPlaying = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const bassValue = ref(0)
    const imgScale = ref(1)
    const isTextVisible = ref(true)
    const isBlurMode = ref(true)

    const initAnalyser = () => {
        if (audioContext) return

        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext
        const context = new AudioContextClass() as AudioContext
        audioContext = context

        const source = context.createMediaElementSource(audio)
        const node = context.createAnalyser()
        node.fftSize = 256

        analyser = node
        dataArray = new Uint8Array(node.frequencyBinCount)

        source.connect(node)
        node.connect(context.destination)
    }

    const animate = () => {
        currentTime.value = audio.currentTime
        if (audio.duration && duration.value !== audio.duration) {
            duration.value = audio.duration
        }

        if (analyser && dataArray) {
            analyser.getByteFrequencyData(dataArray)

            const lowFreq = dataArray[0] ?? 0
            bassValue.value = lowFreq

            const targetScale = 1 + (lowFreq / 255) * 0.12
            imgScale.value += (targetScale - imgScale.value) * 0.2
        }

        animationId = requestAnimationFrame(animate)
    }

    const toggleAudio = async () => {
        if (!audioContext) initAnalyser()
        if (audioContext?.state === 'suspended') await audioContext.resume()

        if (isPlaying.value) {
            audio.pause()
            isPlaying.value = false
            if (animationId) cancelAnimationFrame(animationId)
        } else {
            await audio.play()
            isPlaying.value = true
            animate()
        }
    }

    const changeAudio = (pos: number, total: number) => {
        if (total > 0) {
            audio.currentTime = pos * total
            currentTime.value = audio.currentTime
        }
    }

    const toggleText = () => {
        isTextVisible.value = !isTextVisible.value
        isBlurMode.value = isTextVisible.value
    }

    return {
        audio,
        animationId,
        animate,
        isPlaying,
        currentTime,
        duration,
        bassValue,
        imgScale,
        isTextVisible,
        isBlurMode,
        audioContext,
        toggleAudio,
        changeAudio,
        toggleText,
        initAnalyser,
    }
})

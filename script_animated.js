/** =========================================================================
 *  HOLI ANIMATED V2 — script_animated.js
 *  Complete JavaScript with synced breathing, throwing, and strict powder.
 *  ========================================================================= */

let timelineStarted = false;
let throwInterval = null; // Reference to the continuous throw loop

const hookLayer = document.getElementById('hook');
const audioEl = document.getElementById('flute-track');
const silhouettesEnv = document.getElementById('silhouettes-env');
const krishnaWrapper = document.getElementById('krishna-wrapper');
const radhaWrapper = document.getElementById('radha-wrapper');
const krBlack = document.getElementById('krishna-black');
const rdBlack = document.getElementById('radha-black');
const petalsEnv = document.getElementById('petals-env');
const finaleEnv = document.getElementById('finale-env');
const signature = document.getElementById('dev-signature');

// === GLOBAL TAP LISTENER ===
document.addEventListener('click', handleGlobalTap);
document.addEventListener('touchstart', handleGlobalTap, { passive: false });

/**
 * Global Tap Handler
 * - Haptics fire on EVERY tap.
 * - Subsequent taps produce powder bursts.
 * - First tap initializes the cinematic sequence.
 */
function handleGlobalTap(e) {
    const tX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const tY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    const originX = tX / window.innerWidth;
    const originY = tY / window.innerHeight;

    // Haptics on EVERY tap
    if ('vibrate' in navigator) {
        try { navigator.vibrate([50, 50, 50]); } catch (err) { }
    }

    // Subsequent taps: powder burst at tap location
    if (timelineStarted) {
        confetti({
            particleCount: 200,
            spread: 70,
            scalar: 0.4,
            shapes: ['circle'], // STRICT ENFORCEMENT: ONLY CIRCLES
            colors: ['#ff0090', '#00f0ff', '#ffea00', '#ff6600'],
            origin: { x: originX, y: originY },
            gravity: 0.8
        });
        return;
    }

    // === FIRST TAP: Initialize Timeline ===
    timelineStarted = true;

    // 1. Check if audioEl actually exists to prevent the script from crashing
    if (audioEl) {
        audioEl.volume = 0;
        // 2. Play immediately - This is the "gesture unlock" for mobile
        audioEl.play().then(() => {
            // 3. Only if it successfully starts, run the fade-in
            let vol = 0;
            const fade = setInterval(() => {
                vol += 0.05;
                if (vol >= 1) {
                    audioEl.volume = 1;
                    clearInterval(fade);
                } else {
                    audioEl.volume = vol;
                }
            }, 150);
        }).catch(err => {
            console.error("Audio failed to start:", err);
        });
    }

    // Request Gyroscope permissions
    initGyroscope();

    // Hide the hook text
    hookLayer.style.opacity = '0';

    // === [ PHASE 3: THE OMNIDIRECTIONAL EXPLOSION (T=0.2s) ] ===
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 70,
            scalar: 0.4,
            shapes: ['circle'], // STRICT ENFORCEMENT: ONLY CIRCLES
            colors: ['#ff0090', '#00f0ff', '#ffea00', '#ff6600'],
            origin: { x: 0.5, y: 0.5 }, // Center burst
            gravity: 0.8
        });
    }, 200);

    // === [ PHASE 4: THE DIVINE REVEAL & COLORING (T=1.0s) ] ===
    setTimeout(() => {
        // Reveal silhouettes container
        silhouettesEnv.classList.remove('hidden');
        krBlack.style.opacity = '1';
        rdBlack.style.opacity = '1';

        // Start idle breathing animation on both wrappers
        krishnaWrapper.classList.add('breathing');
        radhaWrapper.classList.add('breathing');

        // After 1.5s, apply Holi powder coloring
        setTimeout(() => {
            krBlack.classList.add('bathed-in-yellow');
            rdBlack.classList.add('bathed-in-pink');
        }, 1500);
    }, 1000);

    // === [ PHASE 5: THE PLAYFUL BATTLE (T=2.5s) ] ===
    // Fire once immediately, then repeat every 3.5 seconds
    setTimeout(() => {
        fireDirectionalCannons(); // First volley

        // Continuous throwing interval loop
        throwInterval = setInterval(() => {
            fireDirectionalCannons();
        }, 3500); // Repeat every 3.5 seconds
    }, 2500);

    // === [ PHASE 6: THE 3D PARALLAX ENVIRONMENT (T=3.0s) ] ===
    setTimeout(() => {
        beginGeneratingPetals();
    }, 3000);

    // === [ PHASE 7: THE GRAND FINALE (T=4.5s) ] ===
    setTimeout(() => {
        finaleEnv.classList.remove('hidden');
        void finaleEnv.offsetWidth;
        finaleEnv.classList.add('sharp');

        signature.classList.remove('hidden');
        void signature.offsetWidth;
        signature.classList.add('visible');
    }, 4500);
}

/**
 * Directional Cannons — Synced with CSS throw animations.
 * Fires powder from Krishna's and Radha's hand positions,
 * while simultaneously triggering their lunge animations.
 */
function fireDirectionalCannons() {
    // 1. Apply throwing animation classes (overrides idle breath)
    krishnaWrapper.classList.add('active-throw-k');
    radhaWrapper.classList.add('active-throw-r');

    // 2. Fire confetti from Krishna's hand (LEFT → RIGHT)
    confetti({
        particleCount: 200,
        spread: 70,
        scalar: 0.4,
        shapes: ['circle'], // STRICT ENFORCEMENT: ONLY CIRCLES
        colors: ['#ff0090', '#00f0ff', '#ffea00', '#ff6600'],
        origin: { x: 0.15, y: 0.85 }, // Krishna Hand Coordinates
        gravity: 0.8,
        angle: 30
    });

    // 3. Fire confetti from Radha's hand (RIGHT → LEFT)
    confetti({
        particleCount: 200,
        spread: 70,
        scalar: 0.4,
        shapes: ['circle'], // STRICT ENFORCEMENT: ONLY CIRCLES
        colors: ['#ff0090', '#00f0ff', '#ffea00', '#ff6600'],
        origin: { x: 0.85, y: 0.85 }, // Radha Hand Coordinates
        gravity: 0.8,
        angle: 150
    });

    // 4. Cleanup: Remove throw classes after 0.6s so they revert to breathing
    setTimeout(() => {
        krishnaWrapper.classList.remove('active-throw-k');
        radhaWrapper.classList.remove('active-throw-r');
    }, 600);
}

// === Core Utility: Petal Spawner ===
function beginGeneratingPetals() {
    const symbols = ['🌸', '🌺', '💮'];
    setInterval(() => {
        const p = document.createElement('div');
        p.className = 'petal';
        p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = Math.random() * 90 + 'vw';
        const dur = 5 + Math.random() * 5;
        p.style.animation = `fallAndSway ${dur}s linear forwards`;
        petalsEnv.appendChild(p);
        setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, dur * 1000);
    }, 400);
}

// === Core Utility: 3D Hardware Sensor Reader ===
function initGyroscope() {
    function updateTransforms(e) {
        if (!e.gamma || !e.beta) return;
        const mx = 25;
        const xTilt = Math.min(Math.max(e.gamma, -mx), mx);
        const yTilt = Math.min(Math.max(e.beta - 45, -mx), mx);

        petalsEnv.style.transform = `translate3d(${xTilt * 1.5}px, ${yTilt * 1.5}px, 0)`;
        silhouettesEnv.style.transform = `translate3d(${xTilt * 0.5}px, ${yTilt * 0.5}px, 0)`;
    }

    // Explicit iOS 13+ permission request WITHOUT thread-blocking alerts
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(state => {
            if (state === 'granted') {
                window.addEventListener('deviceorientation', updateTransforms);
            }
        }).catch(console.error);
    } else {
        // Standard Android
        window.addEventListener('deviceorientation', updateTransforms);
    }
}

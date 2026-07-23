// ==========================================================================
// CONTROLADOR DE AUDIO LOCAL (song.mp3)
// ==========================================================================
let isPlaying = false;
let audioEl = null;
let audioBtn = null;

function initLocalAudio() {
    audioEl = document.getElementById("background-music");
    audioBtn = document.getElementById("audio-toggle-btn");

    if (!audioEl || !audioBtn) return;

    const forceAutoPlay = () => {
        if (!isPlaying && audioEl) {
            audioEl.play()
                .then(() => {
                    audioBtn.classList.add("playing");
                    isPlaying = true;
                    cleanupGestureListeners();
                })
                .catch(() => {
                    // Control de rechazo silencioso en autoplay restrictivo
                });
        }
    };

    const cleanupGestureListeners = () => {
        document.removeEventListener("click", forceAutoPlay);
        document.removeEventListener("touchstart", forceAutoPlay);
        window.removeEventListener("scroll", forceAutoPlay);
    };

    document.addEventListener("click", forceAutoPlay);
    document.addEventListener("touchstart", forceAutoPlay, { passive: true });
    window.addEventListener("scroll", forceAutoPlay, { passive: true });

    audioBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!audioEl) return;

        if (isPlaying) {
            audioEl.pause();
            audioBtn.classList.remove("playing");
            isPlaying = false;
            cleanupGestureListeners();
        } else {
            audioEl.play()
                .then(() => {
                    audioBtn.classList.add("playing");
                    isPlaying = true;
                });
        }
    });
}

// ==========================================================================
// SISTEMA FAILSAFE DE REVELADO AUTOMÁTICO EN SCROLL (Especial iOS / Android)
// ==========================================================================
function initScrollAnimations() {
    const reveals = document.querySelectorAll(".reveal");
    
    if (reveals.length === 0) return;

    let ticking = false;

    const checkPositions = () => {
        const windowHeight = window.innerHeight;
        // Margen dinámico óptimo para celulares (90% de la altura total de pantalla)
        const activationThreshold = windowHeight * 0.90; 

        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Activación cuando el elemento asoma en el viewport
            if (rect.top < activationThreshold) {
                el.classList.add("active");
            }
        });
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                checkPositions();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    
    // Disparo inmediato tras la carga de recursos de la página
    setTimeout(checkPositions, 250);
}

// ==========================================================================
// LÓGICA DE INICIALIZACIÓN GENERAL
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Inicializar audio local
    initLocalAudio();

    // Inicializar animaciones de scroll directas para móviles
    initScrollAnimations();

    // 1. Contador de Cuenta Regresiva
    const targetDate = new Date("May 15, 2027 17:00:00 -0600").getTime();

    const updateCountdown = () => {
        const countdownEl = document.getElementById("countdown");
        if (!countdownEl) return;

        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            countdownEl.innerHTML = "<h3 class='text-accent' style='color:#5D6532; font-size: 1.8rem; grid-column: 1/-1;'>¡Llegó el gran día!</h3>";
            clearInterval(intervalId);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const dEl = document.getElementById("days");
        const hEl = document.getElementById("hours");
        const mEl = document.getElementById("minutes");
        const sEl = document.getElementById("seconds");

        if (dEl) dEl.innerText = String(days).padStart(2, "0");
        if (hEl) hEl.innerText = String(hours).padStart(2, "0");
        if (mEl) mEl.innerText = String(minutes).padStart(2, "0");
        if (sEl) sEl.innerText = String(seconds).padStart(2, "0");
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);


    // 2. Soporte Táctil para Tarjetas Giratorias
    const flipCards = document.querySelectorAll(".flip-card");
    flipCards.forEach(card => {
        card.addEventListener("click", function(e) {
            if (e.target.closest("a") || e.target.closest("button") || e.target.closest(".btn")) {
                return;
            }
            this.classList.toggle("flipped");
        });
    });


    // 3. Generación Inteligente de Hojas flotantes
    const leafContainer = document.getElementById("falling-leaves-container");
    if (leafContainer) {
        const isMobile = window.innerWidth < 768;
        const numLeaves = isMobile ? 3 : 7;
        const leafPaths = [
            "M10,0 C15,10 15,20 10,30 C5,20 5,10 10,0 Z",
            "M10,0 C20,10 20,20 10,30 C0,20 0,10 10,0 Z"
        ];

        for (let i = 0; i < numLeaves; i++) {
            const leaf = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            leaf.setAttribute("viewBox", "0 0 20 30");
            leaf.classList.add("falling-leaf");
            
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", leafPaths[Math.floor(Math.random() * leafPaths.length)]);
            path.setAttribute("fill", "currentColor");
            leaf.appendChild(path);

            const size = Math.random() * 8 + 10;
            leaf.style.width = `${size}px`;
            leaf.style.height = `${size * 1.5}px`;
            leaf.style.left = `${Math.random() * 88}vw`;
            leaf.style.animationDelay = `${Math.random() * 8}s`;
            leaf.style.animationDuration = `${Math.random() * 6 + 12}s`;
            
            leafContainer.appendChild(leaf);
        }
    }


    // 4. Paralaje para stickers de fondo
    const stickers = document.querySelectorAll(".parallax-sticker");
    let lastScrollY = window.scrollY;
    let tickingParallax = false;

    window.addEventListener("scroll", () => {
        lastScrollY = window.scrollY;
        if (!tickingParallax) {
            window.requestAnimationFrame(() => {
                stickers.forEach((sticker, index) => {
                    const speed = (index % 2 === 0) ? 0.04 : -0.02;
                    const rotation = lastScrollY * 0.006;
                    sticker.style.transform = `translate3d(0, ${lastScrollY * speed}px, 0) rotate(${rotation}deg)`;
                });
                tickingParallax = false;
            });
            tickingParallax = true;
        }
    }, { passive: true });


    // 5. Galería de Fotos
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot-indicator");
    let currentSlideIndex = 0;
    const slideIntervalTime = 3800;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        if(slides[index]) slides[index].classList.add("active");
        if(dots[index]) dots[index].classList.add("active");
        currentSlideIndex = index;
    }

    function nextSlide() {
        let nextIndex = currentSlideIndex + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, slideIntervalTime);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });

    if (slides.length > 0) {
        startSlideShow();
    }


    // 6. Enlace personalizado de WhatsApp
    const WHATSAPP_DESTINO = "526562672194";

    function decodeToken(str) {
        try {
            const jsonStr = decodeURIComponent(escape(atob(str)));
            return JSON.parse(jsonStr);
        } catch (e) {
            return null;
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const guestToken = urlParams.get('g');

    const guestBadge = document.getElementById("guest-details-badge");
    const lblGuestName = document.getElementById("lbl-guest-name");
    const lblGuestPasses = document.getElementById("lbl-guest-passes");
    const btnPersonalWhatsapp = document.getElementById("btn-personal-whatsapp");

    let currentGuestData = null;

    if (guestToken) {
        currentGuestData = decodeToken(guestToken);
        
        if (currentGuestData && currentGuestData.n && guestBadge) {
            guestBadge.style.display = "block";
            if (lblGuestName) lblGuestName.innerText = currentGuestData.n;
            
            const numPasses = parseInt(currentGuestData.p) || 1;
            if (lblGuestPasses) {
                if (numPasses === 1) {
                    lblGuestPasses.innerText = "Reservado: 1 Pase Individual";
                } else {
                    lblGuestPasses.innerText = `Reservados: ${numPasses} Pases / Lugares`;
                }
            }
        }
    }

    if (btnPersonalWhatsapp) {
        btnPersonalWhatsapp.addEventListener("click", () => {
            let message = "";
            const targetPhone = WHATSAPP_DESTINO; 

            if (currentGuestData) {
                const guestName = currentGuestData.n;
                const guestPasses = parseInt(currentGuestData.p) || 1;
                const pasesTexto = (guestPasses === 1) ? "1 pase individual" : `${guestPasses} pases`;
                message = `¡Hola! 👋\n\nCon mucho gusto confirmamos nuestra asistencia a su boda.\n\n✨ *Invitado:* ${guestName}\n🎟 *Lugares:* ${pasesTexto}\n\n¡Nos alegra mucho acompañarlos en este gran día! 🥂💍`;
            } else {
                message = `¡Hola! 👋\n\nMe gustaría confirmar mi asistencia a su boda. Me pongo en contacto para verificar los pases correspondientes. ¡Muchas gracias!`;
            }

            const encodedText = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;
            window.open(whatsappUrl, "_blank");
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    
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


    // 2. Sistema de Revelado al hacer Scroll (Intersection Observer)
    const sectionsToReveal = document.querySelectorAll(".reveal");

    if (sectionsToReveal.length > 0) {
        const revealOnScrollOptions = {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, revealOnScrollOptions);

        sectionsToReveal.forEach(section => {
            revealObserver.observe(section);
        });
    }


    // 3. Hojas Botánicas Cayendo de forma Discreta en Primer Plano
    const leafContainer = document.getElementById("falling-leaves-container");
    if (leafContainer) {
        const numLeaves = 8;
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

            const size = Math.random() * 15 + 10;
            leaf.style.width = `${size}px`;
            leaf.style.height = `${size * 1.5}px`;
            leaf.style.left = `${Math.random() * 95}vw`;
            leaf.style.animationDelay = `${Math.random() * 12}s`;
            leaf.style.animationDuration = `${Math.random() * 10 + 12}s`;
            
            leafContainer.appendChild(leaf);
        }
    }


    // 4. Efecto de Paralaje Dinámico Avanzado en los Stickers de Fondo Grandes
    const stickers = document.querySelectorAll(".parallax-sticker");
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        stickers.forEach((sticker, index) => {
            const speed = (index % 2 === 0) ? 0.08 : -0.05;
            const rotation = scrolled * 0.01;
            sticker.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
        });
    });


    // 5. Sistema de Galería (Visor/Lightbox)
    const lightbox = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const galleryItems = document.querySelectorAll(".interactive-gallery");

    if (lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener("click", () => {
                const imgSrc = item.getAttribute("data-image");
                lightbox.style.display = "block";
                lightboxImg.src = imgSrc;
                document.body.style.overflow = "hidden";
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        };

        if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (e) => {
            if (e.target !== lightboxImg) {
                closeLightbox();
            }
        });
    }


    // 6. Integración del Reproductor Invisible de YouTube (L-O-V-E - Nat King Cole)
    const audioBtn = document.getElementById("audio-toggle-btn");
    let ytPlayer = null;
    let isPlaying = false;

    // Carga asíncrona de la API oficial de Iframe de YouTube
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Esta función global es llamada automáticamente por la API de YouTube al estar lista
    window.onYouTubeIframeAPIReady = () => {
        ytPlayer = new YT.Player('yt-player', {
            height: '0',
            width: '0',
            videoId: 'J5RYeaM9U90', // ID del video de Nat King Cole - L-O-V-E
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'loop': 1,
                'playlist': 'J5RYeaM9U90', // Requerido para que funcione el bucle (loop)
                'modestbranding': 1,
                'playsinline': 1,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    };

    function onPlayerReady(event) {
        // Ajustamos volumen moderado (escala de 0 a 100)
        ytPlayer.setVolume(45);
        
        // Configuración de disparadores gestuales para forzar Autoplay
        document.addEventListener("click", forceAutoPlay);
        document.addEventListener("touchstart", forceAutoPlay);
        window.addEventListener("scroll", forceAutoPlay);
    }

    const forceAutoPlay = () => {
        if (ytPlayer && typeof ytPlayer.playVideo === 'function' && !isPlaying) {
            ytPlayer.playVideo();
            audioBtn.classList.add("playing");
            isPlaying = true;
            cleanupGestureListeners();
        }
    };

    const cleanupGestureListeners = () => {
        document.removeEventListener("click", forceAutoPlay);
        document.removeEventListener("touchstart", forceAutoPlay);
        window.removeEventListener("scroll", forceAutoPlay);
    };

    // Control manual por el botón flotante
    if (audioBtn) {
        audioBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!ytPlayer || typeof ytPlayer.playVideo !== 'function') return;

            if (isPlaying) {
                ytPlayer.pauseVideo();
                audioBtn.classList.remove("playing");
                isPlaying = false;
                cleanupGestureListeners(); // Detiene el intento de autoplay si el usuario pausó
            } else {
                ytPlayer.playVideo();
                audioBtn.classList.add("playing");
                isPlaying = true;
            }
        });
    }


    // 7. Número Telefónico Único para Confirmación de Asistencia (WhatsApp)
    const WHATSAPP_DESTINO = "526562672194";

    // Decodificador seguro UTF-8 / Base64
    function decodeToken(str) {
        try {
            const jsonStr = decodeURIComponent(escape(atob(str)));
            return JSON.parse(jsonStr);
        } catch (e) {
            console.warn("No se pudo decodificar el token de invitado o es inexistente.");
            return null;
        }
    }

    // Procesamiento de URL
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

    // Acción de envío del mensaje de asistencia
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
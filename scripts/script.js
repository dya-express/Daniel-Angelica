document.addEventListener("DOMContentLoaded", () => {
    
    const targetDate = new Date("May 15, 2027 17:00:00 -0600").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            document.getElementById("countdown").innerHTML = "<h3 class='text-accent' style='color:#5D6532; font-size: 1.8rem;'>¡Llegó el gran día!</h3>";
            clearInterval(intervalId);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, "0");
        document.getElementById("hours").innerText = String(hours).padStart(2, "0");
        document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
        document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);


    // 2. Sistema de Revelado al hacer Scroll (Intersection Observer)
    const sectionsToReveal = document.querySelectorAll(".reveal");

    const revealOnScrollOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
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

});
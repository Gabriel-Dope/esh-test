if (!history.state) {
    history.replaceState({ page: "home" }, "", "#home");
}
// Globalne varijable
let originalniSadrzaj;
let slides, dots;
let currentSlide = 0;
let slideInterval;
let userInteracted = false;


// Čekamo da se DOM učita
window.addEventListener("DOMContentLoaded", () => {
    // spremi početni HTML
    originalniSadrzaj = document.getElementById("content").innerHTML;
    const cartIcon = document.querySelector(".kosarica");
    const cartPanel = document.querySelector(".cart-panel");
    const closeCart = document.querySelector(".close-cart");

    if (!cartIcon || !cartPanel || !closeCart) {
        console.log("CART: elementi nisu pronađeni");
        return;
    }

    cartIcon.addEventListener("click", () => {
        cartPanel.classList.toggle("active");
    });

    closeCart.addEventListener("click", () => {
        cartPanel.classList.remove("active");
    });

    ucitajStranicuIzURL();
});

// ---------------- Slideshow ----------------
function initSlideshow() {
    slides = document.querySelectorAll(".slide");
    dots = document.querySelectorAll(".dot");
    currentSlide = 0;
    userInteracted = false;

    if (slides.length === 0 || dots.length === 0) return;

    showSlide(0);
    startSlideshow();

    dots.forEach((dot, i) => {
        dot.onclick = () => goToSlide(i);
    });
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? "block" : "none";
        dots[i].classList.toggle("active", i === index);
    });
    currentSlide = index;
}

function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function startSlideshow() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        if (!userInteracted) {
            nextSlide();
        } else {
            userInteracted = false;
        }
    }, 4000);
}

function goToSlide(index) {
    showSlide(index);
    userInteracted = true;
}

// ---------------- Browser back button ----------------
window.addEventListener("popstate", function (event) {
     if (!event.state || event.state.page === "home") {
        ucitajPocetnu();
    }

    if (event.state?.page === "kosarica") ucitajKosaricu();
    if (event.state?.page === "opis") ucitajOpis();
    if (event.state?.page === "forma") ucitajFormu();
    if (event.state?.page === "najprodavanije") ucitajNajprodavanije();
    if (event.state?.page === "ponude") ucitajPonude();
});


// isključi browser scroll
history.scrollRestoration = "manual";

// spremi scroll
window.addEventListener("beforeunload", () => {
    localStorage.setItem("scrollY", window.scrollY);
});

// vrati scroll (VAŽNO: više puta pokušaj)
window.addEventListener("load", () => {
    const scrollY = localStorage.getItem("scrollY");

    if (scrollY !== null) {
        let attempts = 0;

        const interval = setInterval(() => {
            window.scrollTo(0, parseInt(scrollY));

            attempts++;
            if (attempts > 10) clearInterval(interval); // stani nakon par pokušaja
        }, 50);
    }
});
function vratiPocetnu() {
    document.getElementById("content").innerHTML = originalniSadrzaj;
    window.scrollTo(0, 0);
    initSlideshow();
}
function ucitajPocetnu(push=true) {
    if(push){
        if (location.hash !== "#home") {
          history.pushState({ page: "home" }, "", "#home");
        }
    }

    document.getElementById("content").innerHTML = originalniSadrzaj;

    initSlideshow();
    ucitajPonude();
    renderMiniKosarica();
    ucitajNajprodavanije();
    updateCartBadge();
    window.scrollTo(0, 0);
}
function ucitajStranicuIzURL() {
    const hash = window.location.hash;

    if (hash === "#kosarica") {
        ucitajKosaricu(false);
    } 
    else if (hash === "#opis") {
        ucitajOpis(false);
    } 
    else if (hash === "#forma") {
        ucitajFormu(false);
    } 
    else if(hash=="#proizvodi"){
        generisiGroupedProizvode(false);
    }
    else {
        ucitajPocetnu(false);
    }

    renderMiniKosarica();
    updateCartBadge();
}


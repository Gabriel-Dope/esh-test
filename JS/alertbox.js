// ==================== CUSTOM ALERT BOX ====================
// Koristi postojeći alertbox.css (#alert-root, .alert-box, .alert-mode ...)

function prikaziAlert(naslov, tekst) {
    const root = document.getElementById("alert-root");
    if (!root) {
        // fallback ako alert-root ne postoji u HTML-u
        alert(naslov + "\n" + tekst);
        return;
    }

    root.innerHTML = `
        <div class="alert-box">
            <div class="alert-top">
                <span class="checkmark">✓</span>
            </div>
            <div class="alert-content">
                <h2></h2>
                <p></p>
                <button type="button">U redu</button>
            </div>
        </div>
    `;

    // tekst ubacujemo preko textContent (ne innerHTML) radi sigurnosti
    root.querySelector(".alert-content h2").textContent = naslov;
    root.querySelector(".alert-content p").textContent = tekst;
    root.querySelector(".alert-content button").addEventListener("click", zatvoriAlert);

    // klik izvan boxa (na tamni overlay) zatvara alert
    root.onclick = (e) => {
        if (e.target === root) zatvoriAlert();
    };

    document.documentElement.classList.add("alert-mode");
}

function zatvoriAlert() {
    document.documentElement.classList.remove("alert-mode");
    const root = document.getElementById("alert-root");
    if (root) root.innerHTML = "";
}

// zatvori na ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") zatvoriAlert();
});

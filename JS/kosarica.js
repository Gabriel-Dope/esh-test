// ==================== KOSARICA ====================

function dodajUKosaricu(proizvod) {
    let kosarica = JSON.parse(localStorage.getItem("kosarica")) || [];

    let postoji = kosarica.find(p =>
        p.id == proizvod.id &&
        p.okus == proizvod.okus &&
        p.gramaza == proizvod.gramaza
    );

    if (postoji) {
        postoji.kolicina += 1;
    } else {
        kosarica.push(proizvod);
    }

    localStorage.setItem("kosarica", JSON.stringify(kosarica));
}

function ucitajKosaricu(push = true) {
    if (push) {
        history.pushState({ page: "kosarica" }, "", "#kosarica");
    }

    let kosarica = JSON.parse(localStorage.getItem("kosarica")) || [];

    let htmlProizvodi = "";
    let ukupnaCijena = 0;
    let ukupnoKomada = 0;

    kosarica.forEach(p => {
        let ukupno = p.cijena * p.kolicina;

        ukupnaCijena += ukupno;
        ukupnoKomada += p.kolicina;

        htmlProizvodi += `
        <div class="wrapper">
            <div class="slikeProizvodaKosarice">
                <img src="${p.slika}">
            </div>
            <div class="podatciIzBaze">
                <a>${p.naziv}</a>
                <a>${p.cijena} KM</a>
                <button>-</button>
                <span>${p.kolicina}</span>
                <button>+</button>
                <a>${p.okus}</a>
                <a>${ukupno} KM</a>
            </div>
        </div>
        `;
    });

    document.getElementById("content").innerHTML = `
    <div class="glavniOkvir">
        <div class="tekstKosarica">
           <h3>Zašto baš mi?</h3>
           <p>tralalalallala</p>
        </div>

        <div class="kosaricaOkvir">

        <div class="naslovKosarice">
            <h1>Tvoja košarica 🛒</h1>
        </div>

        <div class="sadrzajKosarice">

            <div class="opisKosariceProizvoda">
                <a>Naziv</a>
                <a>Cijena</a>
                <a>Kolicina</a>
                <a>Okus</a>
                <a>Ukupno</a>
            </div>

            ${htmlProizvodi || "<p>Košarica je prazna</p>"}

        </div>

        <div class="tipkePredkupnju">
           <div class="ukupnoTekst">
              <p>Ukupan broj proizvoda: ${ukupnoKomada}</p>
              <p>Ukupna cijena: ${ukupnaCijena} KM</p>
           </div>
           <button onclick="ucitajFormu()">Potvrdi kupnju</button>
        </div>

        </div>
    </div>
    `;

    window.scrollTo(0, 0);
}

function obrisiProizvodIzKosarice(id, okus, gramaza) {
    let kosarica = JSON.parse(localStorage.getItem("kosarica")) || [];

    kosarica = kosarica.filter(p =>
        !(p.id == id && p.okus == okus && p.gramaza == gramaza)
    );

    localStorage.setItem("kosarica", JSON.stringify(kosarica));

    renderMiniKosarica();
    ucitajKosaricu(false);
}

function updateCartBadge() {
    let kosarica = JSON.parse(localStorage.getItem("kosarica")) || [];

    let broj = 0;
    kosarica.forEach(p => { broj += p.kolicina; });

    const badge = document.getElementById("cart-count");
    if (!badge) return;

    if (broj === 0) {
        badge.style.display = "none";
    } else {
        badge.style.display = "block";
        badge.innerText = broj;
    }
}

// ==================== EVENT LISTENERI ZA KOSARICU ====================

document.addEventListener("click", (e) => {

    // ➕ PLUS
    if (e.target.classList.contains("plus")) {
        const box = e.target.closest(".quantity");
        const countEl = box.querySelector(".count");
        let count = parseInt(countEl.innerText);
        countEl.innerText = count + 1;
    }

    // ➖ MINUS
    if (e.target.classList.contains("minus")) {
        const box = e.target.closest(".quantity");
        const countEl = box.querySelector(".count");
        let count = parseInt(countEl.innerText);
        if (count > 1) countEl.innerText = count - 1;
    }

    // 🗑️ OBRIŠI PROIZVOD
    if (e.target.classList.contains("remove-item")) {
        const el = e.target.closest("[data-id]");
        if (!el) return;

        const id = el.dataset.id;
        const okus = el.dataset.okus;
        const gramaza = el.dataset.gramaza;

        obrisiProizvodIzKosarice(id, okus, gramaza);
    }
});

document.addEventListener("change", (e) => {
    if (e.target.name === "dostava") {
        const kosarica = JSON.parse(localStorage.getItem("kosarica")) || [];
        let ukupno = 0;

        kosarica.forEach(p => { ukupno += p.cijena * p.kolicina; });

        const dostava = Number(e.target.value);

        document.getElementById("ukupnoSve").innerText =
            "Ukupno sa dostavom: " + (ukupno + dostava) + " KM";
    }
});

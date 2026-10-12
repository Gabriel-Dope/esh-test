function ucitajFormu(push=true){
    if(push){
        history.pushState({ page: "forma" }, "", "#forma");
    } 
       
    document.getElementById("content").innerHTML=`   

    <div class="formHolder">

        <!-- 👤 PODACI -->
        <div class="gridForm">
            <div class="field" id="field-ime">
                <label for="ime">Ime</label>
                <input oninput="ValidirajIme()" type="text" id="ime">
                <span class="field-esh-error-msg" id="err-ime"></span>
            </div>
            <div class="field" id="field-prezime">
                <label for="prezime">Prezime</label>
                <input oninput="ValidirajPrezime()" type="text" id="prezime">
                <span class="field-esh-error-msg" id="err-prezime"></span>
            </div>
            <div class="field" id="field-broj">
                <label for="broj">Broj</label>
                <input oninput="ValidirajBroj()" type="text" id="broj">
                <span class="field-esh-error-msg" id="err-broj"></span>
            </div>
            <div class="field" id="field-email">
                <label for="email">E-mail</label>
                <input oninput="ValidirajEmail()" type="text" id="email">
                <span class="field-esh-error-msg" id="err-email"></span>
            </div>
            <div class="field" id="field-adresa">
                <label for="adresa">Adresa</label>
                <input oninput="ValidirajAdresu()" type="text" id="adresa">
                <span class="field-esh-error-msg" id="err-adresa"></span>
            </div>
            <div class="field" id="field-postbr">
                <label for="postbr">PoštBr</label>
                <input oninput="ValidirajPostbr()" type="text" id="postbr">
                <span class="field-esh-error-msg" id="err-postbr"></span>
            </div>
        </div>

        <!-- 🧾 PREGLED KOŠARICE -->
        <div class="pregledNarudzbe">
            <h3>Pregled narudžbe</h3>
            <div id="order-items"></div>
            <p id="ukupnoProizvodi">Ukupno: 0 KM</p>
            <div class="dostava">
            <h3>Dostava</h3>

              <label>
                <input type="radio" name="dostava" value="5" checked>
                Brza pošta (5 KM)
              </label>

              <label>
                <input type="radio" name="dostava" value="0">
                Lično preuzimanje (0 KM)
              </label>

              <p id="ukupnoSve">Ukupno sa dostavom: 0 KM</p>
            </div>
        </div>


    </div>

    <div class="bttnHolder">
        <button onclick="ZavrsiKupnju()">Završi kupnju!</button>
    </div>
    `;

    window.scrollTo(0,0);

    // 🔥 učitaj pregled
    renderPregledNarudzbe();
}
function renderPregledNarudzbe() {
    const kosarica = JSON.parse(localStorage.getItem("kosarica")) || [];
    const container = document.getElementById("order-items");
    const ukupnoEl = document.getElementById("ukupnoProizvodi");
    const ukupnoSveEl = document.getElementById("ukupnoSve");

    if (!container) return;

    container.innerHTML = "";

    let ukupno = 0;

    kosarica.forEach(p => {
        let suma = p.cijena * p.kolicina;
        ukupno += suma;
        container.innerHTML += `
        <div class="order-item">

            <div class="item-left">
             <img src="${p.slika}" alt="${p.naziv}">
           </div>

           <div class="item-middle">
             <p class="naziv">${p.naziv}</p>
             <p class="detalji">${p.okus} • ${p.gramaza}</p>
           </div>
 
           <div class="item-right">
             <p>${p.kolicina} x ${p.cijena} KM</p>
            </div>

         </div>`;



    });

    ukupnoEl.innerText = "Ukupno: " + ukupno + " KM";

    let dostava = 5;
    ukupnoSveEl.innerText = "Ukupno sa dostavom: " + (ukupno + dostava) + " KM";
}
// ==================== REGEX VALIDACIJA ====================

const ESH_REGEX = {
    ime: /^[A-Za-zČĆŠĐŽčćšđž]{2,30}$/,
    prezime: /^[A-Za-zČĆŠĐŽčćšđž]{2,30}$/,
    broj: /^\+?[0-9\s-]{6,15}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    adresa: /^.{4,60}$/,
    postbr: /^\d{5}$/
};

function eshValidirajPolje(id, regex, poruka) {
    const input = document.getElementById(id);
    const polje = document.getElementById("field-" + id);
    const greska = document.getElementById("err-" + id);

    if (!input || !polje || !greska) return false;

    const vrijednost = input.value.trim();
    const ispravno = regex.test(vrijednost);

    polje.classList.remove("field-esh-invalid", "field-esh-valid");

    if (vrijednost === "") {
        greska.innerText = "";
        return false;
    }

    if (ispravno) {
        polje.classList.add("field-esh-valid");
        greska.innerText = "";
    } else {
        polje.classList.add("field-esh-invalid");
        greska.innerText = poruka;
    }

    return ispravno;
}

function ValidirajIme() {
    return eshValidirajPolje("ime", ESH_REGEX.ime, "Ime mora imati barem 2 slova, bez brojeva.");
}

function ValidirajPrezime() {
    return eshValidirajPolje("prezime", ESH_REGEX.prezime, "Prezime mora imati barem 2 slova, bez brojeva.");
}

function ValidirajBroj() {
    return eshValidirajPolje("broj", ESH_REGEX.broj, "Unesi ispravan broj telefona (6-15 cifara, može +).");
}

function ValidirajEmail() {
    return eshValidirajPolje("email", ESH_REGEX.email, "Unesi ispravnu e-mail adresu (npr. ime@primjer.com).");
}

function ValidirajAdresu() {
    return eshValidirajPolje("adresa", ESH_REGEX.adresa, "Adresa mora imati barem 4 karaktera.");
}

function ValidirajPostbr() {
    return eshValidirajPolje("postbr", ESH_REGEX.postbr, "Poštanski broj mora imati tačno 5 cifara.");
}

function eshValidirajCijeluFormu() {
    // pozovi sve validacije (i za polja koja korisnik nije ni dirnuo)
    const rezultati = [
        ValidirajIme(),
        ValidirajPrezime(),
        ValidirajBroj(),
        ValidirajEmail(),
        ValidirajAdresu(),
        ValidirajPostbr()
    ];

    // za prazna polja koja gornje funkcije ignorišu (vrijednost === ""), označi ih kao invalid
    Object.keys(ESH_REGEX).forEach(id => {
        const input = document.getElementById(id);
        const polje = document.getElementById("field-" + id);
        if (input && polje && input.value.trim() === "") {
            polje.classList.add("field-esh-invalid");
            document.getElementById("err-" + id).innerText = "Ovo polje je obavezno.";
        }
    });

    return rezultati.every(r => r === true);
}

async function ZavrsiKupnju() {

    const ime = document.getElementById("ime").value;
    const prezime = document.getElementById("prezime").value;
    const broj = document.getElementById("broj").value;
    const email = document.getElementById("email").value;
    const adresa = document.getElementById("adresa").value;
    const postbr = document.getElementById("postbr").value;

    const kosarica = JSON.parse(localStorage.getItem("kosarica")) || [];

    // 🚫 VALIDACIJA
    if (!eshValidirajCijeluFormu()) {
        prikaziAlert("Provjeri podatke", "Neka polja nisu ispravno popunjena. Provjeri označena polja i pokušaj ponovo.");
        return;
    }

    if (kosarica.length === 0) {
        prikaziAlert("Košarica je prazna", "Dodaj barem jedan proizvod u košaricu prije nego završiš kupnju.");
        return;
    }

    // 🚚 dostava
    const dostavaEl = document.querySelector('input[name="dostava"]:checked');
    const dostava = dostavaEl ? Number(dostavaEl.value) : 0;

    const data = {
        kupac: {
            ime,
            prezime,
            broj,
            email,
            adresa,
            postbr
        },
        kosarica,
        dostava
    };

    try {
    const res = await fetch("http://localhost:3000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
    },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.log("SERVER ERROR:", errText);
      prikaziAlert("Greška", "Došlo je do greške pri slanju narudžbe. Pokušaj ponovo.");
      return;
    }

        const odgovor = await res.json();

        prikaziAlert("Narudžba uspješna!", "Hvala na kupovini, tvoja narudžba je uspješno primljena.");

        // 🧹 reset
        localStorage.removeItem("kosarica");
        renderMiniKosarica();
        updateCartBadge();

        ucitajPocetnu();

    } catch (err) {
        console.log(err);
        prikaziAlert("Greška", "Došlo je do greške pri slanju narudžbe. Pokušaj ponovo.");
    }
}
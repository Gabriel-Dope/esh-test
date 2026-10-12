function renderMiniKosarica() {

    const kosarica =
        JSON.parse(localStorage.getItem("kosarica")) || [];

    const lista =
        document.getElementById("cart-items");

    const brojEl =
        document.getElementById("brojProizvoda");

    const ukupnoEl =
        document.getElementById("ukupnaCijena");

    if (!lista) {
        console.log("NEMA #cart-items");
        return;
    }

    lista.innerHTML = "";

    let ukupno = 0;
    let broj = 0;

    kosarica.forEach(p => {

        ukupno += p.cijena * p.kolicina;
        broj += p.kolicina;

        lista.innerHTML += `

        <li class="mini-item"
            data-id="${p.id}"
            data-okus="${p.okus}"
            data-gramaza="${p.gramaza}">

            <img 
                src="${p.slika}" 
                class="mini-cart-img"
            >

            <div class="mini-info">

                <p class="mini-title">
                    ${p.naziv}
                </p>

                <p class="mini-variant">
                    ${p.okus} / ${p.gramaza}
                </p>

                <p class="mini-price">
                    ${p.kolicina} x ${p.cijena} KM
                </p>

            </div>
            <button class="remove-item"
            onclick="
            event.stopPropagation();
            obrisiProizvodIzKosarice(
            '${p.id}',
            '${p.okus}',
            '${p.gramaza}',)">❌</button>


        </li>

        `;
    });

    if (brojEl) {

        brojEl.innerText =
            "Broj proizvoda: " + broj;
    }

    if (ukupnoEl) {

        ukupnoEl.innerText =
            "Ukupno za platiti: " + ukupno + " KM";
    }
}

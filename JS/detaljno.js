function ucitajOpis(id, push = true) {
    console.log("DOBIJEN ID:", id);

    if (!id) {
        console.log("ID JE UNDEFINED");
        return;
    }

    if (push) {
        history.pushState(
            { page: "opis", id: id },
            "",
            `#opis-${id}`
        );
    }

    console.log("FETCHA:",
        `https://esh-beckend.onrender.com${id}`
    );

    fetch(`https://esh-beckend.onrender.com${id}`)
        .then(res => {

            console.log("STATUS:", res.status);

            return res.text();
        })
        .then(data => {

            console.log(data);

        });

    fetch(`https://esh-beckend.onrender.com${id}`)
        .then(res => res.json())
        .then(data => {

            const p = data[0];

            // jedinstveni okusi
            const okusi = [...new Set(data.map(x => x.okus))];

            document.getElementById("content").innerHTML = `
            <div class="main">

                <div class="product">

                    <h2 class="product-title">${p.naziv}</h2>

                    <div class="product-image">
                        <img src="http://localhost:3000${p.slika}">
                    </div>

                    <div class="product-info">

                        <p class="product-price" id="cijena">${p.cijena} KM</p>

                        <div class="rating">
                            ★★★★☆ <span>(24 recenzije)</span>
                        </div>

                        <div class="stock in-stock">
                            Na lageru
                        </div>

                        <div class="quantity">
                            <button class="minus">-</button>
                            <span class="count">1</span>
                            <button class="plus">+</button>
                        </div>

                        <div class="flavors">
                            <p>Okusi:</p>
                            ${okusi.map((o, i) => `
                                <button class="flavor ${i === 0 ? 'active' : ''}" 
                                        onclick="promijeniOkus('${o}', ${id})">
                                    ${o}
                                </button>
                            `).join("")}
                        </div>

                        <button class="add-to-cart" onclick="eshDodajUKosaricuIzDetalja(${id})">Dodaj u košaricu</button>

                    </div>

                </div>

                <div class="details">
                    <p>Opis proizvoda</p>
                    <button class="toggle">+</button>
                </div>

            </div>
            `;
        });
}
function eshDodajUKosaricuIzDetalja(id) {
    const naslovEl = document.querySelector(".product-title");
    const cijenaEl = document.getElementById("cijena");
    const kolicinaEl = document.querySelector(".quantity .count");
    const slikaEl = document.querySelector(".product-image img");
    const aktivniOkus = document.querySelector(".flavor.active");

    if (!naslovEl || !cijenaEl || !kolicinaEl || !slikaEl) return;

    const proizvod = {
        id: id,
        naziv: naslovEl.innerText,
        cijena: parseFloat(cijenaEl.innerText),
        kolicina: parseInt(kolicinaEl.innerText) || 1,
        okus: aktivniOkus ? aktivniOkus.innerText.trim() : "",
        gramaza: "",
        slika: slikaEl.src
    };

    dodajUKosaricu(proizvod);
    renderMiniKosarica();
    updateCartBadge();
    prikaziAlert("Dodano u košaricu", proizvod.naziv + " je dodan u tvoju košaricu.");
}

function promijeniOkus(okus, id) {
    fetch(`https://esh-beckend.onrender.com${id}`)
        .then(res => res.json())
        .then(data => {

            // nađi prvi matching variant
            const variant = data.find(v => v.okus === okus);

            document.getElementById("cijena").innerText = variant.cijena + " KM";

            // aktivni button
            document.querySelectorAll(".flavor").forEach(btn => {
                btn.classList.remove("active");
                if (btn.innerText === okus) {
                    btn.classList.add("active");
                }
            });
        });
}

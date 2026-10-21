function generisiGroupedProizvode(push = true) {

    if (push) {
        history.pushState(
            { page: "proizvodi" },
            "",
            "#proizvodi"
        );
    }

    document.getElementById("content").innerHTML = `
        <div class="generisaniHolder" id="generisaniHolder">
        </div>
    `;

    const holder = document.getElementById("generisaniHolder");

    fetch("https://esh-beckend.onrender.com")
        .then(res => res.json())
        .then(data => {

            const grupisani = {};

            data.forEach(p => {

                const key = p.protein_id + "-" + p.gramaza;

                if (!grupisani[key]) {
                    grupisani[key] = {
                        id: p.protein_id,
                        naziv: p.naziv,
                        slika: p.slika,
                        gramaza: p.gramaza,
                        cijena: p.cijena,
                        okusi: []
                    };
                }

                grupisani[key].okusi.push({
                    naziv: p.okus,
                    variant_id: p.variant_id
                });

            });

            holder.innerHTML = `
                <div class="produkti-stranica">
                    <div class="proizvodi-header">
                        <div class="proizvodi-naslov">
                            <h2>SVI PROIZVODI</h2>
                            <p>Pronađite proizvod za svoje potrebe</p>
                        </div>

                        <button class="sortiraj-btn">
                            SORTIRAJ
                            <span>▼</span>
                        </button>
                    </div>

                    <div class="proizvodi-sadrzaj">
                        <aside class="filteri">
                            <div class="filteri-header">
                                <h3>FILTERI</h3>
                                <button class="obrisi-filtere">
                                    OBRIŠI
                                </button>
                            </div>

                            <div class="filter-grupa">
                                <h4>KATEGORIJA</h4>

                                <label>
                                    <input type="checkbox">
                                    Proteini
                                </label>

                                <label>
                                    <input type="checkbox">
                                    Kreatin
                                </label>

                                <label>
                                    <input type="checkbox">
                                    Aminokiseline
                                </label>

                                <label>
                                    <input type="checkbox">
                                    Vitamini
                                </label>
                            </div>

                            <div class="filter-grupa">
                                <h4>CIJENA</h4>

                                <label>
                                    <input type="checkbox">
                                    Do 30 KM
                                </label>

                                <label>
                                    <input type="checkbox">
                                    30 - 60 KM
                                </label>

                                <label>
                                    <input type="checkbox">
                                    60 - 100 KM
                                </label>

                                <label>
                                    <input type="checkbox">
                                    Preko 100 KM
                                </label>
                            </div>
                        </aside>

                        <div class="proizvodi-grid" id="proizvodi-grid">
                            <!-- PROIZVODI -->
                        </div>
                    </div>
                </div>
            `;
            const proizvodiGrid = document.querySelector("#proizvodi-grid");


            Object.values(grupisani).forEach(p => {

                proizvodiGrid.innerHTML += `
                    <div class="produkti"
                        data-id="${p.id}"
                        data-naziv="${p.naziv}"
                        data-cijena="${p.cijena}"
                        data-gramaza="${p.gramaza}"
                        data-slika="http://localhost:3000${p.slika}">

                        <img
                            class="whey1"
                            onclick="ucitajOpis(${p.id})"
                            src="http://localhost:3000${p.slika}"
                            alt="${p.naziv}">

                        <div class="text-kontejner">
                            <p class="proizvod-naziv">${p.naziv}</p>
                            <p class="proizvod-gramaza">${p.gramaza}</p>

                            <select class="okus-select">
                                ${p.okusi.map(o => `
                                    <option value="${o.variant_id}">
                                        ${o.naziv}
                                    </option>
                                `).join("")}
                            </select>

                            <p class="proizvod-cijena">${p.cijena} KM</p>
                            <button class="dodajukosaricu">DODAJ</button>
                        </div>
                    </div>
                `;

            });

            // ✅ DODAJ U KOSARICU
            holder.onclick = function (e) {

                if (e.target.closest(".dodajukosaricu")) {

                    const el = e.target.closest(".produkti");
                    if (!el) return;

                    const select = el.querySelector(".okus-select");

                    const proizvod = {
                        id: el.dataset.id,
                        variant_id: select.value,
                        naziv: el.dataset.naziv,
                        cijena: parseFloat(el.dataset.cijena),
                        kolicina: 1,
                        okus: select.options[select.selectedIndex].text.trim(),
                        gramaza: el.dataset.gramaza,
                        slika: el.dataset.slika
                    };

                    dodajUKosaricu(proizvod);
                    renderMiniKosarica();
                    updateCartBadge();

                    console.log("Dodano:", proizvod);
                }
            };

        })
        .catch(err => console.log(err));

    window.scrollTo(0, 0);
}

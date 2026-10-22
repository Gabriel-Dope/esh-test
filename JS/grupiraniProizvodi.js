function generisiGroupedProizvode(push = true) {
    const API_URL = "https://esh-beckend.onrender.com";

    if (push) {
        history.pushState(
            { page: "proizvodi" },
            "",
            "#proizvodi"
        );
    }

    const content = document.getElementById("content");

    if (!content) return;

    content.innerHTML = `
        <div class="generisaniHolder" id="generisaniHolder">
            <p>Učitavanje proizvoda...</p>
        </div>
    `;

    const holder = document.getElementById("generisaniHolder");

    fetch(`${API_URL}/products`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Server je vratio HTTP ${res.status}`);
            }

            return res.json();
        })
        .then(data => {
            if (!holder.isConnected) return;

            if (!Array.isArray(data)) {
                throw new Error("Server nije vratio popis proizvoda");
            }

            const escapeHTML = value =>
                String(value ?? "").replace(/[&<>"']/g, znak => ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                }[znak]));

            const adresaSlike = slika => {
                if (!slika) return "";

                const putanja = String(slika).trim();

                const url = new URL(
                    /^https?:\/\//i.test(putanja)
                        ? putanja
                        : `/${putanja.replace(/^\/+/, "")}`,
                    API_URL
                );

                return ["http:", "https:"].includes(url.protocol)
                    ? url.href
                    : "";
            };

            const grupisani = {};

            data.forEach(p => {
                const key = p.protein_id + "-" + p.gramaza;

                if (!grupisani[key]) {
                    grupisani[key] = {
                        id: p.protein_id,
                        naziv: p.naziv,
                        slika: adresaSlike(p.slika),
                        gramaza: p.gramaza,
                        cijena: p.cijena,
                        okusi: []
                    };
                }

                grupisani[key].okusi.push({
                    naziv: p.okus,
                    variant_id: p.variant_id,
                    cijena: p.cijena
                });
            });

            holder.innerHTML = `
                <div class="produkti-stranica">
                    <div class="proizvodi-header">
                        <div class="proizvodi-naslov">
                            <h2>SVI PROIZVODI</h2>
                            <p>Pronađite proizvod za svoje potrebe</p>
                        </div>

                        <button class="sortiraj-btn" type="button">
                            SORTIRAJ
                            <span>▼</span>
                        </button>
                    </div>

                    <div class="proizvodi-sadrzaj">
                        <aside class="filteri">
                            <div class="filteri-header">
                                <h3>FILTERI</h3>
                                <button class="obrisi-filtere" type="button">
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
                        </div>
                    </div>
                </div>
            `;

            const proizvodiGrid = holder.querySelector("#proizvodi-grid");

            if (data.length === 0) {
                proizvodiGrid.textContent = "Trenutno nema proizvoda.";
                return;
            }

            proizvodiGrid.innerHTML = Object.values(grupisani)
                .map(p => `
                    <div class="produkti"
                        data-id="${escapeHTML(p.id)}"
                        data-naziv="${escapeHTML(p.naziv)}"
                        data-cijena="${escapeHTML(p.cijena)}"
                        data-gramaza="${escapeHTML(p.gramaza)}"
                        data-slika="${escapeHTML(p.slika)}">

                        <img
                            class="whey1"
                            src="${escapeHTML(p.slika)}"
                            alt="${escapeHTML(p.naziv)}">

                        <div class="text-kontejner">
                            <p class="proizvod-naziv">
                                ${escapeHTML(p.naziv)}
                            </p>

                            <p class="proizvod-gramaza">
                                ${escapeHTML(p.gramaza)}
                            </p>

                            <select class="okus-select">
                                ${p.okusi.map(o => `
                                    <option
                                        value="${escapeHTML(o.variant_id)}"
                                        data-cijena="${escapeHTML(o.cijena)}">
                                        ${escapeHTML(o.naziv)}
                                    </option>
                                `).join("")}
                            </select>

                            <p class="proizvod-cijena">
                                ${Number(p.cijena).toFixed(2)} KM
                            </p>

                            <button class="dodajukosaricu" type="button">
                                DODAJ
                            </button>
                        </div>
                    </div>
                `)
                .join("");

            // Promjena cijene ako različiti okusi imaju različite cijene.
            holder.onchange = function (e) {
                if (!e.target.matches(".okus-select")) return;

                const el = e.target.closest(".produkti");
                const opcija = e.target.selectedOptions[0];

                if (!el || !opcija) return;

                const cijena = Number(opcija.dataset.cijena);

                el.dataset.cijena = String(cijena);
                el.querySelector(".proizvod-cijena").textContent =
                    `${cijena.toFixed(2)} KM`;
            };

            holder.onclick = function (e) {
                const el = e.target.closest(".produkti");

                if (!el) return;

                // Otvaranje detalja proizvoda.
                if (e.target.closest(".whey1")) {
                    ucitajOpis(Number(el.dataset.id));
                    return;
                }

                // Dodavanje odabrane varijante u košaricu.
                if (e.target.closest(".dodajukosaricu")) {
                    const select = el.querySelector(".okus-select");
                    const opcija = select.selectedOptions[0];

                    if (!opcija) return;

                    const proizvod = {
                        id: el.dataset.id,
                        variant_id: select.value,
                        naziv: el.dataset.naziv,
                        cijena: Number(opcija.dataset.cijena),
                        kolicina: 1,
                        okus: opcija.textContent.trim(),
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
        .catch(err => {
            console.error("Greška kod učitavanja proizvoda:", err);

            if (holder.isConnected) {
                holder.textContent = "Greška kod učitavanja proizvoda.";
            }
        });

    window.scrollTo(0, 0);
}

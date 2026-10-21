function ucitajPonude() {

    fetch("https://esh-beckend.onrender.com")

        .then(res => res.json())

        .then(data => {

            const kontejner = document.getElementById("ponudeKontejner");

            kontejner.innerHTML = "";

            data.forEach(ponuda => {

                const div = document.createElement("div");

                div.classList.add("ponuda");

                div.innerHTML = `
                    <img src="https://esh-beckend.onrender.com${ponuda.slika}" alt="${ponuda.naziv}">

                    <div class="ponudaSadrzaj">

                        <h2>${ponuda.naziv}</h2>

                        <p>${ponuda.opis}</p>

                        <button onclick="prikaziPonudu(${ponuda.id})">
                            Dodaj u košaricu
                        </button>

                    </div>
                `;

                kontejner.appendChild(div);
            });
        })

        .catch(error => {
            console.error("Greška kod učitavanja ponuda:", error);
        });
}

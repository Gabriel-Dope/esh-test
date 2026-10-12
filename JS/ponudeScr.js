function ucitajPonude() {

    fetch("http://localhost:3000/ponude")

        .then(res => res.json())

        .then(data => {

            const kontejner = document.getElementById("ponudeKontejner");

            kontejner.innerHTML = "";

            data.forEach(ponuda => {

                const div = document.createElement("div");

                div.classList.add("ponuda");

                div.innerHTML = `
                    <img src="http://localhost:3000${ponuda.slika}" alt="${ponuda.naziv}">

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
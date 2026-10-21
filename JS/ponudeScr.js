async function ucitajPonude() {
    const kontejner = document.getElementById('ponudeKontejner');

    if (!kontejner) return;

    kontejner.textContent = 'Učitavanje ponuda...';

    const API_URL = 'https://esh-beckend.onrender.com';

    try {
        const res = await fetch(`${API_URL}/ponude`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`Server je vratio HTTP ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error('Server nije vratio popis ponuda');
        }

        kontejner.replaceChildren();

        if (data.length === 0) {
            kontejner.textContent = 'Trenutno nema aktivnih ponuda.';
            return;
        }

        data.forEach(ponuda => {
            const div = document.createElement('div');
            div.classList.add('ponuda');

            const img = document.createElement('img');

            if (ponuda.slika) {
                const putanja = String(ponuda.slika).trim();
                const url = new URL(
                    putanja.startsWith('http')
                        ? putanja
                        : `/${putanja.replace(/^\/+/, '')}`,
                    API_URL
                );

                if (['https:', 'http:'].includes(url.protocol)) {
                    img.src = url.href;
                }
            }

            img.alt = ponuda.naziv || '';
            img.loading = 'lazy';

            const sadrzaj = document.createElement('div');
            sadrzaj.classList.add('ponudaSadrzaj');

            const naslov = document.createElement('h2');
            naslov.textContent = ponuda.naziv || '';

            const opis = document.createElement('p');
            opis.textContent = ponuda.opis || '';

            const gumb = document.createElement('button');
            gumb.type = 'button';
            gumb.textContent = 'Dodaj u košaricu';
            gumb.addEventListener('click', () => {
                prikaziPonudu(ponuda.id);
            });

            sadrzaj.append(naslov, opis, gumb);
            div.append(img, sadrzaj);
            kontejner.appendChild(div);
        });
    } catch (error) {
        console.error('Greška kod učitavanja ponuda:', error);
        kontejner.textContent = 'Greška kod učitavanja ponuda.';
    }
}

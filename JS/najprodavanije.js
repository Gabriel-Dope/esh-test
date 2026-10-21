async function ucitajNajprodavanije() {
    const top5 = document.getElementById('top5');

    if (!top5) return;

    top5.textContent = 'Učitavanje...';

    const escapeHTML = (value) =>
        String(value ?? '').replace(/[&<>"']/g, (znak) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[znak]));

    try {
        const res = await fetch(
            'https://esh-beckend.onrender.com/najprodavaniji'
        );

        if (!res.ok) {
            throw new Error(`Server je vratio HTTP ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error('Server nije vratio popis proizvoda');
        }

        if (data.length === 0) {
            top5.textContent = 'Još nema prodanih proizvoda.';
            return;
        }

        const maxProdano = Math.max(
            ...data.map(p => Number(p.ukupno_prodano) || 0)
        );

        top5.innerHTML = data.map((p, i) => {
            const rank = String(i + 1).padStart(2, '0');
            const prodano = Number(p.ukupno_prodano) || 0;
            const prihod = Number(p.ukupan_prihod) || 0;

            const bar = maxProdano > 0
                ? Math.max(
                    0,
                    Math.min(100, Math.round((prodano / maxProdano) * 100))
                )
                : 0;

            return `
                <div class="t5-product-row ${i === 0 ? 't5-first' : ''}">
                    <div class="t5-rank">
                        <span class="t5-rank-num">${rank}</span>
                    </div>

                    <div class="t5-product-info">
                        <div class="t5-product-name">
                            ${escapeHTML(p.proizvod)}
                        </div>

                        <div class="t5-product-meta">
                            <span class="t5-tag">${escapeHTML(p.okus)}</span>
                            <span class="t5-tag">${escapeHTML(p.tezina)}</span>
                            ${i === 0
                                ? '<span class="t5-badge-first">★ Broj 1</span>'
                                : ''}
                        </div>
                    </div>

                    <div class="t5-product-stats">
                        <div class="t5-sold-count">${prodano}</div>
                        <div class="t5-sold-label">prodano</div>
                        <div class="t5-revenue">
                            ${prihod.toFixed(2)} KM
                        </div>

                        <div class="t5-bar-wrap">
                            <div
                                class="t5-bar-fill"
                                style="width:${bar}%"
                            ></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('NAJPRODAVANIJI ERROR:', err);
        top5.textContent = 'Greška kod učitavanja najprodavanijih proizvoda.';
    }
}

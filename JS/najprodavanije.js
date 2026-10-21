function ucitajNajprodavanije() {
 
    const top5 = document.getElementById('top5');
 
    fetch('https://esh-beckend.onrender.com/najprodavaniji')
        .then(res => res.json())
        .then(data => {
 
            const maxProdano = data[0].ukupno_prodano;
 
            data.forEach((p, i) => {
 
                const rank = String(i + 1).padStart(2, '0');
                const bar = Math.round((p.ukupno_prodano / maxProdano) * 100);
 
                top5.innerHTML += `
                <div class="t5-product-row ${i === 0 ? 't5-first' : ''}">
 
                    <div class="t5-rank">
                        <span class="t5-rank-num">${rank}</span>
                    </div>
 
                    <div class="t5-product-info">
                        <div class="t5-product-name">${p.proizvod}</div>
                        <div class="t5-product-meta">
                            <span class="t5-tag">${p.okus}</span>
                            <span class="t5-tag">${p.tezina}</span>
                            ${i === 0 ? '<span class="t5-badge-first">★ Broj 1</span>' : ''}
                        </div>
                    </div>
 
                    <div class="t5-product-stats">
                        <div class="t5-sold-count">${p.ukupno_prodano}</div>
                        <div class="t5-sold-label">prodano</div>
                        <div class="t5-revenue">${Number(p.ukupan_prihod).toFixed(2)} KM</div>
                        <div class="t5-bar-wrap">
                            <div class="t5-bar-fill" style="width:${bar}%"></div>
                        </div>
                    </div>
 
                </div>
                `;
            });
 
        })
        .catch(err => console.log("NAJPRODAVANIJI ERROR:", err));
}



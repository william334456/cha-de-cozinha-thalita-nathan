let gifts = [
    "Jogo de talheres", "Conjunto de pratos", "Jogo de copos", "Panela de pressão", "Frigideira antiaderente",
    "Assadeira de vidro", "Escorredor de arroz", "Conjunto de potes herméticos", "Tábua de cortar", "Abridor de garrafas",
    "Ralador", "Escorredor de louça", "Jarra de suco", "Peneira", "Forma de bolo", "Leiteira", "Colher de pau",
    "Concha de feijão", "Espátula de silicone", "Pegador de macarrão", "Jogo americano", "Toalha de mesa", "Cesta de pães",
    "Saleiro e pimenteiro", "Pano de prato", "Avental", "Luva térmica", "Lixeira de pia", "Dispenser de detergente",
    "Saboneteira", "Tapete de cozinha", "Relógio de parede", "Jogo de banheiro", "Porta-papel higiênico", "Cesto de roupa suja",
    "Cabides", "Escova sanitária", "Rodo", "Vassoura", "Pá de lixo", "Balde", "Panos de limpeza", "Esfregão", "Kit de pregadores",
    "Varal de chão", "Ferro de passar", "Tábua de passar roupa", "Extensão elétrica", "Adaptador de tomada", "Kit de ferramentas básico",
    "Jogo de facas", "Descascador de legumes", "Moedor de pimenta", "Açucareiro", "Porta-temperos", "Manteigueira",
    "Cortador de pizza", "Espremedor de alho", "Espremedor de frutas", "Garrafa térmica", "Saca-rolhas", "Conjunto de xícaras",
    "Fruteira", "Porta-guardanapo", "Pipoqueira", "Suporte para detergente", "Porta-sabonete líquido", "Sabonete líquido",
    "Difusor de ambiente", "Kit organizador de gavetas"
];

function loadList() {
    const list = document.getElementById('gift-list');
    const reserved = JSON.parse(localStorage.getItem('reservedGifts') || '{}');
    const mine = JSON.parse(localStorage.getItem('myGifts') || '[]');
    list.innerHTML = '';

    const allGifts = [...gifts, ...mine.filter(g => !gifts.includes(g))];

    allGifts.forEach((gift) => {
        const li = document.createElement('li');
        li.textContent = gift;

        if (reserved[gift]) {
            if (mine.includes(gift)) {
                li.classList.add('reserved');
                li.innerHTML = `${gift} <button onclick="unreserveGift('${gift}')">Cancelar reserva</button>`;
            } else {
                li.classList.add('reserved');
                li.innerHTML = `${gift} <button disabled>Reservado</button>`;
            }
        } else {
            const btn = document.createElement('button');
            btn.textContent = "Quero dar esse presente";
            btn.onclick = () => reserveGift(gift);
            li.appendChild(btn);
        }

        list.appendChild(li);
    });
}

function reserveGift(gift) {
    const reserved = JSON.parse(localStorage.getItem('reservedGifts') || '{}');
    const mine = JSON.parse(localStorage.getItem('myGifts') || '[]');

    reserved[gift] = true;
    mine.push(gift);

    localStorage.setItem('reservedGifts', JSON.stringify(reserved));
    localStorage.setItem('myGifts', JSON.stringify(mine));
    loadList();
}

function unreserveGift(gift) {
    const reserved = JSON.parse(localStorage.getItem('reservedGifts') || '{}');
    let mine = JSON.parse(localStorage.getItem('myGifts') || '[]');

    delete reserved[gift];
    mine = mine.filter(g => g !== gift);

    localStorage.setItem('reservedGifts', JSON.stringify(reserved));
    localStorage.setItem('myGifts', JSON.stringify(mine));
    loadList();
}

function addCustomGift() {
    const input = document.getElementById('customGiftInput');
    const gift = input.value.trim();
    if (gift === '') return;

    if (!gifts.includes(gift)) {
        gifts.push(gift);
    }

    reserveGift(gift);
    input.value = '';
}

window.onload = loadList;

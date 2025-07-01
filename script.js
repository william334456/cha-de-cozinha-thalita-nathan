
const firebaseConfig = {
    apiKey: "AIzaSyBBmxU6_SSaVM3vMIl0N2RslnzvGTEtJ8I",
    authDomain: "cha-de-cozinha-thalita-nathan.firebaseapp.com",
    databaseURL: "https://cha-de-cozinha-thalita-nathan-default-rtdb.firebaseio.com",
    projectId: "cha-de-cozinha-thalita-nathan",
    storageBucket: "cha-de-cozinha-thalita-nathan.firebasestorage.app",
    messagingSenderId: "92057390557",
    appId: "1:92057390557:web:86bb3db905e3a0f326ba34"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let userId = localStorage.getItem("userId");
if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("userId", userId);
}

const defaultGifts = [
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

let allGifts = [];

function loadList() {
    const list = document.getElementById("gift-list");
    db.ref("gifts").once("value", (snapshot) => {
        const data = snapshot.val() || {};
        allGifts = Object.keys(data).length ? Object.keys(data) : defaultGifts;

        list.innerHTML = "";
        allGifts.forEach((gift) => {
            const li = document.createElement("li");
            const info = data[gift] || {};
            li.textContent = gift;

            if (info.reservadoPor) {
                li.classList.add("reserved");
                if (info.reservadoPor === userId) {
                    li.innerHTML = gift + ' <button onclick="unreserveGift(\'' + gift + '\')">Cancelar reserva</button>';
                } else {
                    li.innerHTML = gift + ' <button disabled>Reservado</button>';
                }
            } else {
                const btn = document.createElement("button");
                btn.textContent = "Quero dar esse presente";
                btn.onclick = () => reserveGift(gift);
                li.appendChild(btn);
            }

            list.appendChild(li);
        });
    });
}

function reserveGift(gift) {
    db.ref("gifts/" + gift).set({ reservadoPor: userId }).then(loadList);
}

function unreserveGift(gift) {
    db.ref("gifts/" + gift).once("value", (snapshot) => {
        const info = snapshot.val();
        if (info.reservadoPor === userId) {
            db.ref("gifts/" + gift).remove().then(loadList);
        }
    });
}

function addCustomGift() {
    const input = document.getElementById("customGiftInput");
    const gift = input.value.trim();
    if (gift === "") return;
    db.ref("gifts/" + gift).set({ reservadoPor: userId }).then(() => {
        input.value = "";
        loadList();
    });
}

window.onload = loadList;

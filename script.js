const firebaseConfig = {
  apiKey: "AIzaSyBBmxU6_SSaVM3vMIl0N2RslnzvGTEtJ8I",
  authDomain: "cha-de-cozinha-thalita-nathan.firebaseapp.com",
  databaseURL: "https://cha-de-cozinha-thalita-nathan-default-rtdb.firebaseio.com",
  projectId: "cha-de-cozinha-thalita-nathan",
  storageBucket: "cha-de-cozinha-thalita-nathan.firebasestorage.app",
  messagingSenderId: "92057390557",
  appId: "1:92057390557:web:6e15ddb53ce4db3626ba34"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Identificação única do convidado
let guestId = localStorage.getItem('guestId');
if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem('guestId', guestId);
}

// Modo administrador (false por padrão)
let isAdmin = localStorage.getItem('isAdmin') === 'true';

// Ativador do modo admin (oculto)
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && e.key === "a") {
        const password = prompt("Digite a senha do administrador:");
        if (password === "nathan2025") {
            localStorage.setItem('isAdmin', 'true');
            alert("Modo administrador ativado.");
            isAdmin = true;
            loadGifts();
        } else {
            alert("Senha incorreta.");
        }
    }
});

function addCustomGift() {
    const input = document.getElementById('customGiftInput');
    const gift = input.value.trim();
    if (gift === '') return;

    const giftRef = db.ref('gifts').push();
    giftRef.set({
        name: gift,
        timestamp: Date.now(),
        owner: guestId
    });

    input.value = '';
}

function removeGift(key) {
    if (confirm("Tem certeza que deseja remover este presente?")) {
        db.ref('gifts/' + key).remove();
    }
}

function loadGifts() {
    const list = document.getElementById('gift-list');
    db.ref('gifts').on('value', (snapshot) => {
        list.innerHTML = '';
        const gifts = snapshot.val();
        if (gifts) {
            Object.entries(gifts).forEach(([key, gift]) => {
                const li = document.createElement('li');
                li.textContent = gift.name;
                li.classList.add('reserved');

                // Mostrar botão de cancelar se for dono ou se for admin
                if (gift.owner === guestId || isAdmin) {
                    const btn = document.createElement('button');
                    btn.textContent = "Cancelar presente";
                    btn.onclick = () => removeGift(key);
                    li.appendChild(btn);
                }

                list.appendChild(li);
            });
        }
    });
}

window.onload = loadGifts;

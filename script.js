
const firebaseConfig = {
  apiKey: "AIzaSyBBmxU6_SSaVM3vMIl0N2RslnzvGTEtJ8I",
  authDomain: "cha-de-cozinha-thalita-nathan.firebaseapp.com",
  databaseURL: "https://cha-de-cozinha-thalita-nathan-default-rtdb.firebaseio.com",
  projectId: "cha-de-cozinha-thalita-nathan",
  storageBucket: "cha-de-cozinha-thalita-nathan.appspot.com",
  messagingSenderId: "92057390557",
  appId: "1:92057390557:web:6e15ddb53ce4db3626ba34"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let isAdmin = false;
let currentUser = localStorage.getItem("userName") || "";

if (!currentUser) {
    currentUser = prompt("Digite seu nome para reservar presentes:\n(Não se preocupe, seu nome não será visível para os outros convidados)");
    localStorage.setItem("userName", currentUser);
}

function promptAdmin() {
    const senha = prompt("Digite a senha de administrador:");
    if (senha === "admin123") {
        isAdmin = true;
        alert("Modo administrador ativado!");
        loadGifts(); // recarrega com opções de cancelamento
    } else {
        alert("Senha incorreta!");
    }
}

function loadGifts() {
    const list = document.getElementById("gift-list");
    db.ref("gifts").on("value", (snapshot) => {
        list.innerHTML = "";
        const gifts = snapshot.val();
        if (gifts) {
            Object.entries(gifts).forEach(([key, gift]) => {
                const li = document.createElement("li");
                li.textContent = gift.name;
                li.classList.add(gift.reservedBy ? "reserved" : "available");

                if (!gift.reservedBy) {
                    const reserveBtn = document.createElement("button");
                    reserveBtn.textContent = "Reservar";
                    reserveBtn.onclick = () => reserveGift(key);
                    li.appendChild(reserveBtn);
                } else if (gift.reservedBy === currentUser || isAdmin) {
                    const cancelBtn = document.createElement("button");
                    cancelBtn.textContent = "Cancelar";
                    cancelBtn.onclick = () => cancelGift(key);
                    li.appendChild(cancelBtn);
                }

                list.appendChild(li);
            });
        }
    });
}

function reserveGift(key) {
    db.ref("gifts/" + key).update({
        reservedBy: currentUser
    });
}

function cancelGift(key) {
    db.ref("gifts/" + key).update({
        reservedBy: null
    });
}

function addCustomGift() {
    const input = document.getElementById("customGiftInput");
    const gift = input.value.trim();
    if (gift === "") return;

    const giftRef = db.ref("gifts").push();
    giftRef.set({
        name: gift,
        reservedBy: null,
        timestamp: Date.now()
    });

    input.value = "";
}

window.onload = () => {
    loadGifts();
    document.getElementById("adminModeBtn").onclick = promptAdmin;
};

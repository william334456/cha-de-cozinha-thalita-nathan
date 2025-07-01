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

function addCustomGift() {
    const input = document.getElementById('customGiftInput');
    const gift = input.value.trim();
    if (gift === '') return;

    const giftRef = db.ref('gifts').push();
    giftRef.set({
        name: gift,
        timestamp: Date.now()
    });

    input.value = '';
}

function loadGifts() {
    const list = document.getElementById('gift-list');
    db.ref('gifts').on('value', (snapshot) => {
        list.innerHTML = '';
        const gifts = snapshot.val();
        if (gifts) {
            Object.values(gifts).forEach(gift => {
                const li = document.createElement('li');
                li.textContent = gift.name;
                li.classList.add('reserved');
                list.appendChild(li);
            });
        }
    });
}

window.onload = loadGifts;

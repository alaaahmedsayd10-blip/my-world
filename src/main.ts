/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

console.info('Script started successfully');

let currentPopup: any = undefined;

// --- اعدادات Firebase بتاعتك ---
const firebaseConfig = {
  apiKey: "AIzaSyC7nexX-dwj_IhYC5EaS-DU_YQeE6-acDw",
  authDomain: "game-af286.firebaseapp.com",
  projectId: "game-af286",
  storageBucket: "game-af286.firebasestorage.app",
  messagingSenderId: "567693078252",
  appId: "1:567693078252:web:3b5d6475a583f1f7347fc9",
  measurementId: "G-JKFYDGCFML"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

WA.onInit().then(() => {
    console.info('Scripting API ready');
    console.info('Player tags: ',WA.player.tags)

    // --- نظام تسجيل الدخول ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            WA.chat.sendChatMessage(`أهلا ${user.displayName} 👋`, 'Firebase');
            console.info('Logged in as:', user.email);
        } else {
            // لو مش مسجل، اعمل زرار تسجيل
            WA.ui.actionBar.addButton({
                id: 'login-btn',
                type: 'action',
                imageSrc: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
                toolTip: 'سجل دخول بجوجل',
                callback: () => {
                    signInWithPopup(auth, provider).then((result) => {
                        WA.chat.sendChatMessage(`تم تسجيل الدخول: ${result.user.displayName} ✅`, 'System');
                    }).catch((e) => console.error(e));
                }
            });
        }
    });

    // --- الكود القديم بتاع الساعة - سيبته زي ما هو ---
    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    bootstrapExtra().then(() => {
        console.info('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};

/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.info('Script started successfully');
let currentPopup: any = undefined;

// Firebase via CDN - مش محتاج package.json
const firebaseConfig = {
  apiKey: "AIzaSyC7nexX-dwj_IhYC5EaS-DU_YQeE6-acDw",
  authDomain: "game-af286.firebaseapp.com",
  projectId: "game-af286",
  storageBucket: "game-af286.firebasestorage.app",
  messagingSenderId: "567693078252",
  appId: "1:567693078252:web:3b5d6475a583f1f7347fc9"
};

WA.onInit().then(() => {
    console.info('Scripting API ready');
    
    // زرار تسجيل دخول بسيط يفتح صفحة جوجل
    WA.ui.actionBar.addButton({
        id: 'login-btn',
        type: 'action',
        imageSrc: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
        toolTip: 'تسجيل دخول',
        callback: () => {
            WA.ui.modal.openModal({
                title: "تسجيل الدخول",
                src: `https://game-af286.firebaseapp.com/__/auth/handler?apiKey=${firebaseConfig.apiKey}`,
                allow: "fullscreen",
                allowApi: true,
                position: "center",
            });
            WA.chat.sendChatMessage('جاري فتح تسجيل الدخول...', 'System');
        }
    });

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

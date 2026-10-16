/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(() => {
    // لو مش مسجل قبل كده، افتح صفحة التسجيل أول ما اللعبة تفتح
    const logged = localStorage.getItem('wa_logged');
    
    if (!logged) {
        (WA.ui.modal.openModal as any)({
            title: 'تسجيل حساب',
            src: 'auth.html',
            allowApi: true,
            position: 'center',
            allowFullScreen: false,
        });
    } else {
        const name = localStorage.getItem('playerName') || 'لاعب';
        WA.chat.sendChatMessage(`أهلا بعودتك يا ${name} 👋`, 'النظام');
    }

    bootstrapExtra().catch(e => console.error(e));
}).catch(e => console.error(e));

export {};

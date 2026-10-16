/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(() => {
    const playerName = WA.player.name;
    const logged = localStorage.getItem('wa_logged');
    localStorage.setItem('playerName', playerName);

    // افتح التسجيل أول مرة (إيميل وباس بس - الاسم بيتاخد من اللعبة)
    if (!logged) {
        (WA.ui.modal.openModal as any)({
            title: 'إنشاء حساب',
            src: `auth.html?name=${encodeURIComponent(playerName)}`,
            allowApi: true,
            position: 'center',
        });
    }

    // 3 أزرار جدد فوق بعض
    WA.ui.actionBar.addButton({
        id: 'rules-btn',
        label: '📜 قوانين اللعبة',
        callback: () => {
            (WA.ui.modal.openModal as any)({
                title: 'قوانين اللعبة',
                src: 'rules.html',
                allowApi: true,
                position: 'center',
            });
        }
    });

    WA.ui.actionBar.addButton({
        id: 'shop-btn',
        label: '🛒 المتجر',
        callback: () => {
            (WA.ui.modal.openModal as any)({
                title: 'المتجر',
                src: 'shop.html',
                allowApi: true,
                position: 'center',
            });
        }
    });

    WA.ui.actionBar.addButton({
        id: 'support-btn',
        label: '🎧 الدعم',
        callback: () => {
            (WA.ui.modal.openModal as any)({
                title: 'الدعم والمساعدة',
                src: 'support.html',
                allowApi: true,
                position: 'center',
            });
        }
    });

    bootstrapExtra().catch(e => console.error(e));
}).catch(e => console.error(e));
export {};

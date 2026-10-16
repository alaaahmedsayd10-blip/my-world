/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(() => {
    console.log("WA Script Started - Menus Loading");

    // رسالة ترحيب عشان تعرف ان السكريبت شغال
    WA.chat.sendChatMessage('✅ السكريبت شغال - افتح القائمة الجانبية', 'النظام');

    // فتح التسجيل
    const last = localStorage.getItem('wa_last_login');
    const today = new Date().toDateString();
    if (last !== today && !localStorage.getItem('wa_email')) {
        WA.ui.modal.openModal({
            title: "",
            src: "auth.html?name=" + encodeURIComponent(WA.player.name),
            allowApi: true,
            position: "center",
        } as any);
        localStorage.setItem('wa_last_login', today);
    }

    // دول اللي مش ظاهرين عندك
    WA.ui.registerMenuCommand("📜 قوانين اللعبة", {
        callback: () => {
            WA.ui.modal.openModal({ title: "القوانين", src: "rules.html", allowApi: true, position: "center" } as any);
        }
    });

    WA.ui.registerMenuCommand("🛒 المتجر", {
        callback: () => {
            WA.ui.modal.openModal({ title: "المتجر", src: "shop.html", allowApi: true, position: "center" } as any);
        }
    });

    WA.ui.registerMenuCommand("🎧 الدعم", {
        callback: () => {
            WA.ui.modal.openModal({ title: "الدعم", src: "support.html", allowApi: true, position: "center" } as any);
        }
    });

    WA.ui.registerMenuCommand("🚪 تسجيل خروج", {
        callback: () => {
            localStorage.clear();
            WA.chat.sendChatMessage('تم تسجيل الخروج، اعمل ريفريش', 'النظام');
        }
    });

    // زرار القفل اللي تحت
    WA.ui.actionBar.addButton({
        id: "lock-btn",
        label: "🔒 قفل",
        callback: () => { WA.ui.modal.closeModal(); }
    });

    bootstrapExtra().then(() => {
        console.log("Menus Registered OK");
    }).catch(e => console.error(e));
});

export {};

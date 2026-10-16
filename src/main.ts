/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(() => {
    // افتح التسجيل مرة واحدة بس في اليوم
    const last = localStorage.getItem('wa_last_login');
    const today = new Date().toDateString();
    if (last !== today) {
        WA.ui.modal.openModal({
            title: "",
            src: "auth.html?name=" + encodeURIComponent(WA.player.name),
            allowApi: true,
            position: "center",
        } as any);
        localStorage.setItem('wa_last_login', today);
    }

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

    WA.ui.actionBar.addButton({
        id: "lock-btn",
        label: "🔒 قفل",
        callback: () => { WA.ui.modal.closeModal(); }
    });

    bootstrapExtra().catch(console.error);
});
export {};

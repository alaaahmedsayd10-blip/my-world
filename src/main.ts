/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(() => {
    const name = WA.player.name;
    if (!localStorage.getItem('wa_logged')) {
        WA.ui.modal.openModal({
            title: "حسابك",
            src: "auth.html?name=" + encodeURIComponent(name),
            allowApi: true,
            position: "center",
        } as any);
    }

    WA.ui.actionBar.addButton({
        id: "lock-btn",
        label: "🔒 قفل",
        callback: () => {
            WA.ui.modal.closeModal();
        }
    });

    WA.ui.registerMenuCommand("📜 قوانين اللعبة", {
        callback: () => {
            WA.ui.modal.openModal({
                title: "القوانين",
                src: "rules.html",
                allowApi: true,
                position: "center",
            } as any);
        }
    });

    WA.ui.registerMenuCommand("🛒 المتجر", {
        callback: () => {
            WA.ui.modal.openModal({
                title: "المتجر",
                src: "shop.html",
                allowApi: true,
                position: "center",
            } as any);
        }
    });

    WA.ui.registerMenuCommand("🎧 الدعم", {
        callback: () => {
            WA.ui.modal.openModal({
                title: "الدعم",
                src: "support.html",
                allowApi: true,
                position: "center",
            } as any);
        }
    });

    bootstrapExtra().then(() => {}).catch((e) => console.error(e));
});

export {};

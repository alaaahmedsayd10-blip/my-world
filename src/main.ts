/// <reference types="@workadventure/iframe-api-typings" />

WA.onInit().then(() => {
    WA.chat.sendChatMessage('✅ السكريبت اشتغل!', 'النظام');

    WA.ui.registerMenuCommand("📜 قوانين", {
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

    WA.ui.registerMenuCommand("🚪 خروج", {
        callback: () => {
            localStorage.clear();
            WA.chat.sendChatMessage('تم الخروج - اعمل ريفريش', 'النظام');
        }
    });
});
export {};

/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(() => {
    // اعرض مين اللي مسجل حاليا
    const savedEmail = localStorage.getItem('wa_email');
    if (savedEmail) {
        WA.chat.sendChatMessage(`✅ مسجل دخول بـ: ${savedEmail}`, 'النظام');
    } else {
        // أول مرة بس
        WA.ui.modal.openModal({
            title: "",
            src: "auth.html?name=" + encodeURIComponent(WA.player.name),
            allowApi: true,
            position: "center",
        } as any);
    }

    WA.ui.registerMenuCommand("📜 قوانين اللعبة", {
        callback: () => { WA.ui.modal.openModal({ title: "القوانين", src: "rules.html", allowApi: true, position: "center" } as any); }
    });
    WA.ui.registerMenuCommand("🛒 المتجر", {
        callback: () => { WA.ui.modal.openModal({ title: "المتجر", src: "shop.html", allowApi: true, position: "center" } as any); }
    });
    WA.ui.registerMenuCommand("🎧 الدعم", {
        callback: () => { WA.ui.modal.openModal({ title: "الدعم", src: "support.html", allowApi: true, position: "center" } as any); }
    });
    
    WA.ui.registerMenuCommand("🚪 تسجيل خروج", {
        callback: () => {
            localStorage.removeItem('wa_email');
            localStorage.removeItem('wa_logged');
            localStorage.removeItem('wa_last_login');
            WA.chat.sendChatMessage('تم تسجيل الخروج، اعمل ريفريش وسجل بحساب تاني', 'النظام');
        }
    });

    // زرار القفل في الشريط اللي تحت - ده مكانه تحت مش في القائمة الجانبية
    WA.ui.actionBar.addButton({
        id: "lock-btn",
        label: "قفل القوائم",
        callback: () => { WA.ui.modal.closeModal(); }
    });

    // اسمع لما صفحة التسجيل تبعت الإيميل
    WA.player.state.onVariableChange('email').subscribe((email) => {
        if (email) {
            localStorage.setItem('wa_email', email as string);
            WA.chat.sendChatMessage(`تم تسجيل الدخول: ${email}`, 'النظام');
        }
    });

    bootstrapExtra().catch(console.error);
});
export {};

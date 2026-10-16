/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
WA.onInit().then(() => {
    if (!localStorage.getItem('wa_logged')) {
        // @ts-ignore
        WA.ui.modal.openModal({ title: '', src: `auth.html?name=${encodeURIComponent(WA.player.name)}`, allowApi: true, position: 'center' });
    }
    // زرار قفل صغير على اليمين
    WA.ui.actionBar.addButton({
        id: 'lock-menu',
        label: '🔒',
        callback: () => {
            WA.chat.sendChatMessage('🔒 تم قفل القوائم', 'النظام');
            // @ts-ignore
            WA.ui.modal.closeModal();
        }
    });
    WA.ui.registerMenuCommand('📜 القوانين', { callback: () => { // @ts-ignore WA.ui.modal.openModal({ title: 'القوانين', src: 'rules.html', allowApi: true, position: 'center' }) } });
    WA.ui.registerMenuCommand('🛒 المتجر', { callback: () => { // @ts-ignore WA.ui.modal.openModal({ title: 'المتجر', src: 'shop.html', allowApi: true, position: 'center' }) } });
    WA.ui.registerMenuCommand('🎧 الدعم', { callback: () => { // @ts-ignore WA.ui.modal.openModal({ title: 'الدعم', src: 'support.html', allowApi: true, position: 'center' }) } });
    bootstrapExtra().catch(()=>{});
});
export {};

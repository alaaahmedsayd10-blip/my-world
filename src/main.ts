/// <reference types="@workadventure/iframe-api-typings" />

console.log('Script started - النظام ✅');

WA.onInit().then(() => {
    console.log('WA ready');

    // === 1. قوانين اللعبة اول ما حد يدخل ===
    WA.ui.modal.openModal({
        title: "قوانين اللعبة - اقراها مهم!",
        src: 'https://alaaahmedsayd10-blip.github.io/my-world/rules.html',
        allow: "fullscreen",
        allowApi: true,
        position: "center",
    });

    // رسالة نظام في الشات
    WA.chat.sendChatMessage('مرحبا بيك! ممنوع السب، احترم الكل. اكتب /rules عشان تشوف القوانين', 'النظام');

    // === 2. مين الادمن؟ انت بس ===
    // غيّر اسمك هنا لاسمك جوه اللعبة
    const ADMIN_NAME = "alaa"; // حط اسمك اللي بتدخل بيه
    const isAdmin = WA.player.name.toLowerCase().includes(ADMIN_NAME.toLowerCase()) || WA.player.tags.includes("admin");
    
    if(isAdmin){
        WA.chat.sendChatMessage('انت الادمن - لوحة التحكم شغالة ✅\nالاوامر: /broadcast كلام - /kick اسم - /rules', 'النظام');
    }

    // === 3. اوامر الادمن في الشات ===
    WA.chat.onChatMessage((message, event) => {
        const text = message.trim();

        // اي حد يكتب /rules
        if(text === "/rules" || text === "القوانين"){
            WA.ui.modal.openModal({
                title: "قوانين اللعبة",
                src: 'https://alaaahmedsayd10-blip.github.io/my-world/rules.html',
                allow: "fullscreen",
                allowApi: true,
                position: "center",
            });
        }

        if(!isAdmin) return; // اللي جاي كله للادمن بس

        // /broadcast رسالة للكل
        if(text.startsWith("/broadcast ")){
            const msg = text.replace("/broadcast ", "");
            WA.chat.sendChatMessage('📢 رسالة من الادارة: ' + msg, 'النظام');
        }

        // /kick
        if(text.startsWith("/kick ")){
            const target = text.replace("/kick ", "");
            WA.chat.sendChatMessage('تم طرد ' + target + ' بواسطة الادمن. يرجى احترام القوانين.', 'النظام');
            // الطرد الحقيقي بتدوس كليك يمين على الشخص > Kick / Ban في اللعبة
            WA.ui.displayActionMessage({
                message: "دوس كليك يمين على اللاعب " + target + " واختار Kick عشان تطرده فعليا",
                callback: () => {}
            });
        }

        // /ban
        if(text.startsWith("/ban ")){
            const target = text.replace("/ban ", "");
            WA.chat.sendChatMessage('🚫 تم حظر ' + target + ' نهائيا من العالم.', 'النظام');
        }
    });

    // === 4. منطقة القوانين لو حد دخلها ===
    WA.room.onEnterLayer("rulesZone").subscribe(() => {
        WA.ui.modal.openModal({
            title: "قوانين اللعبة",
            src: 'https://alaaahmedsayd10-blip.github.io/my-world/rules.html',
            allow: "fullscreen",
            allowApi: true,
            position: "center",
        });
    });
});

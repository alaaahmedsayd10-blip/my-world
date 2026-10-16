/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(() => {
    WA.chat.sendChatMessage('السكريبت اشتغل! ✅', 'النظام');

    WA.chat.onChatMessage((msg) => {
        if(msg === "/rules"){
            // @ts-ignore
            WA.ui.modal.openModal({
                title: "قوانين اللعبة",
                src: "https://alaaahmedsayd10-blip.github.io/my-world/rules.html",
                allow: "fullscreen"
            });
        }
        if(msg.startsWith("/broadcast ")){
            const t = msg.replace("/broadcast ", "");
            WA.chat.sendChatMessage("📢 " + t, "النظام");
        }
    });

    bootstrapExtra().catch(e => console.error(e));
});

/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started');

WA.onInit().then(() => {
    console.log('Scripting API ready');
    WA.chat.sendChatMessage('السكريبت اشتغل! ✅', 'النظام');

    // قوانين اللعبة لما حد يكتب /rules
    WA.chat.onChatMessage((msg) => {
        if(msg.toLowerCase() === "/rules" || msg === "القوانين"){
            WA.ui.modal.openModal({
                title: "قوانين اللعبة",
                src: "https://alaaahmedsayd10-blip.github.io/my-world/rules.html",
                allow: "fullscreen",
                allowApi: true,
                position: "center",
            });
        }
        // امر للادمن يبعت رسالة للكل
        if(msg.startsWith("/broadcast ")){
            const text = msg.replace("/broadcast ", "");
            WA.chat.sendChatMessage("📢 " + text, "النظام");
        }
    });

    bootstrapExtra().then(() => {
        console.log('Extra ready');
    }).catch(e => console.error(e));
});

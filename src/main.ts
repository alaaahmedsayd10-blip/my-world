import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started');

bootstrapExtra().then(() => {
    console.log('Extra loaded');
}).catch(e => console.error(e));

WA.onInit().then(() => {
    const ADMINS = ["alaaAhmed"]; // انت بس
    const myName = WA.player.name;
    const isAdmin = ADMINS.includes(myName);

    console.log("Player:", myName, "IsAdmin:", isAdmin);

    // لو مش انت، اخفي ازرار الادمن
    if (!isAdmin) {
        // امنع دخول منطقة الادمن لو عندك
        WA.room.area.onEnter("adminArea").subscribe(() => {
            WA.chat.sendChatMessage("⛔ المنطقة للمشرفين فقط", "Admin");
            WA.player.teleport(32, 32);
        });
    } else {
        WA.chat.sendChatMessage("✅ اهلا بالادمن Alaa", "System");
    }

    // زر القوانين والمنصة - يظهر للكل عادي
    WA.ui.actionBar.addButton({
        id: "rules-btn",
        type: "action",
        imageSrc: "https://cdn-icons-png.flaticon.com/512/813/813419.png",
        toolTip: "قوانين المؤتمر",
        callback: () => {
            WA.nav.openCoWebSite("https://alaaahmedsayd10-blip.github.io/my-world/rules.html");
        }
    });
});

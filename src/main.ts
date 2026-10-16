import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started');

bootstrapExtra().catch(e => console.error(e));

WA.onInit().then(() => {
    const ADMINS = ["alaaAhmed"];
    const myName = WA.player.name as string;
    const isAdmin = ADMINS.includes(myName);

    console.log("Player:", myName, "IsAdmin:", isAdmin);

    if (isAdmin) {
        WA.chat.sendChatMessage("✅ اهلا بالادمن Alaa", "System");
    }

    if (!isAdmin) {
        WA.room.area.onEnter("adminArea").subscribe(() => {
            WA.chat.sendChatMessage("⛔ المنطقة للمشرفين فقط", "Admin");
        });
    }

    WA.ui.actionBar.addButton({
        id: "rules-btn",
        label: "قوانين",
        imageSrc: "https://cdn-icons-png.flaticon.com/512/813/813419.png",
        callback: () => {
            WA.nav.openCoWebSite("https://alaaahmedsayd10-blip.github.io/my-world/rules.html");
        }
    });
});

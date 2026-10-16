/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

let currentPopup: any = undefined;

WA.onInit().then(() => {
    WA.ui.actionBar.addButton({
        id: 'login-btn',
        type: 'action',
        imageSrc: 'https://cdn-icons-png.flaticon.com/512/360/360946.png',
        toolTip: 'تسجيل دخول',
        callback: () => {
            WA.ui.modal.openModal({
                title: "دخول",
                src: "./auth.html",
                allow: "fullscreen",
                allowApi: true,
                position: "center",
            });
        }
    });

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        currentPopup = WA.ui.openPopup("clockPopup", "الساعة " + today.getHours() + ":" + today.getMinutes(), []);
    })
    WA.room.area.onLeave('clock').subscribe(() => {
        if (currentPopup) { currentPopup.close(); currentPopup = undefined; }
    })

    bootstrapExtra().then(()=>{}).catch(e=>console.error(e));
}).catch(e=>console.error(e));

export {};

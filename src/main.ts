/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(() => {
    WA.ui.actionBar.addButton({
        id: 'login-btn',
        label: 'دخول',
        imageSrc: 'https://cdn-icons-png.flaticon.com/512/360/360946.png',
        toolTip: 'تسجيل دخول',
        callback: () => {
            WA.ui.modal.openModal({
                title: 'دخول',
                src: 'auth.html',
                allowApi: true,
                position: 'center',
            });
        }
    });

    bootstrapExtra().catch(e => console.error(e));
}).catch(e => console.error(e));

export {};

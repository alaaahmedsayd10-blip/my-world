/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

// Yalla City: keep the map and player movement intact; remove account, Firebase,
// coins, profile, pets, and shop features. The only custom shortcut is game help.
WA.onInit().then(async () => {
  await bootstrapExtra().catch((error) =>
    console.warn("Scripting API Extra could not start:", error)
  );

  const openHelp = () => {
    WA.ui.openPopup(
      "yalla-game-help",
      "🎮 قواعد وشرح اللعبة\n\n• تحرّك باستخدام لوحة المفاتيح على الكمبيوتر أو عناصر التحكم على الهاتف.\n• اقترب من الأبواب ومناطق الانتقال للانتقال إلى أماكن أخرى في الخريطة.\n• استخدم الدردشة للتواصل باحترام مع اللاعبين.\n• احترم الآخرين وتجنب الإساءة أو الإزعاج.",
      [
        {
          label: "إغلاق",
          className: "primary",
          callback: (popup) => popup.close(),
        },
      ]
    );
  };

  try {
    WA.ui.actionBar.addButton({
      id: "yalla-game-help",
      label: "📜 قواعد اللعبة",
      callback: openHelp,
    });
  } catch (error) {
    console.warn("Could not add game rules shortcut:", error);
  }
}).catch((error) => console.error("WorkAdventure API initialization failed:", error));

export {};

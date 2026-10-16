/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, getFirestore, onSnapshot, runTransaction } from "firebase/firestore";
import { firebaseConfig } from "./firebase-config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const LOGIN_URL = "https://alaaahmedsayd10-blip.github.io/my-world/login.html";
const USER_UID_KEY = "yalla_user_uid";
const RULES_KEY_PREFIX = "yalla_rules_accepted_";

const ANIMALS = [
  { id: "cat", label: "قطة", price: 2, emoji: "🐱" },
  { id: "dog", label: "كلب", price: 3, emoji: "🐶" },
  { id: "horse", label: "حصان", price: 10, emoji: "🐴" },
  { id: "lion", label: "أسد", price: 20, emoji: "🦁" },
] as const;

type AnimalId = (typeof ANIMALS)[number]["id"];
let currentUser: User | null = null;
let currentCoins = 0;
let currentPopup: { close: () => void } | undefined;
let goldUnsubscribe: (() => void) | undefined;
let loginModalOpen = false;
let rulesPopupShown = false;
let shopPopupOpen = false;

console.info("Yalla1 Firebase game script starting");

WA.onInit().then(async () => {
  await bootstrapExtra().catch((error) => console.warn("Scripting API Extra could not start:", error));

  // A modal login gate is used because WorkAdventure map scripts run in a sandboxed iframe.
  const openLogin = () => {
    if (loginModalOpen || currentUser) return;
    loginModalOpen = true;
    WA.ui.modal.openModal({
      title: "Yalla City Login",
      src: LOGIN_URL,
      position: "center",
      allowApi: true,
      allowFullScreen: false,
    });
  };

  const showRulesIfNeeded = () => {
    if (!currentUser || rulesPopupShown) return;
    const key = RULES_KEY_PREFIX + currentUser.uid;
    if (localStorage.getItem(key) === "yes") return;
    rulesPopupShown = true;
    currentPopup = WA.ui.openPopup("rulesPopup", "قوانين Yalla City\n\n1. احترم باقي اللاعبين.\n2. لا تشارك كلمة المرور مع أي شخص.\n3. تبدأ حسابات اللاعبين الجدد بـ 5 كوينز فقط.\n4. عمليات الشراء تخصم الكوينز من حسابك.\n5. استخدم المتجر داخل المنطقة المحددة فقط.", [
      {
        label: "موافق",
        className: "success",
        callback: (popup) => {
          localStorage.setItem(key, "yes");
          popup.close();
          currentPopup = undefined;
        },
      },
    ]);
  };

  const openRules = () => {
    WA.ui.openPopup("yalla-rules-menu", "📜 قوانين Yalla City\n\n1. احترم جميع اللاعبين.\n2. ممنوع الإزعاج أو الإساءة.\n3. لا تشارك بيانات حسابك أو كلمة المرور.\n4. لا تستخدم الثغرات أو تحاول تعطيل اللعبة.\n5. تعامل باحترام مع الجميع.", [
      { label: "إغلاق", className: "primary", callback: (popup) => popup.close() },
    ]);
  };

  const openHelp = () => {
    WA.ui.openPopup("yalla-help-menu", "🎮 شرح اللعبه\n\n• استخدم أزرار الحركة على الهاتف أو لوحة المفاتيح على الكمبيوتر للتحرك.\n• اقترب من الأبواب واتبع منطقة الانتقال للدخول إلى الخريطة الأخرى.\n• استخدم الدردشة للتواصل مع اللاعبين.\n• سجّل الدخول لمتابعة رصيد الكوينز.\n• اقترب من منطقة المتجر لشراء الحيوانات بالكوينز.", [
      { label: "إغلاق", className: "primary", callback: (popup) => popup.close() },
    ]);
  };

  const openYallaMenu = () => {
    const buttons = [
      {
        label: "🪙 رصيد الكوينز",
        className: "primary" as const,
        callback: (popup: { close: () => void }) => {
          popup.close();
          WA.ui.openPopup("yalla-coins-info", `🪙 رصيدك الحالي: ${currentCoins} كوينز`, [
            { label: "إغلاق", className: "primary", callback: (p) => p.close() },
          ]);
        },
      },
      {
        label: "👤 ملفي الشخصي",
        className: "primary" as const,
        callback: (popup: { close: () => void }) => {
          popup.close();
          if (!currentUser) {
            openLogin();
            return;
          }
          void getDoc(doc(db, "users", currentUser.uid)).then((profile) => {
            const data = profile.exists() ? profile.data() : {};
            const owned = Array.isArray(data.animals) ? data.animals : [];
            const animalNames = ANIMALS.filter((animal) => owned.includes(animal.id)).map((animal) => animal.emoji + " " + animal.label);
            WA.ui.openPopup("yalla-profile-info", `👤 ملفك الشخصي\n\nرقم الحساب: ${data.phone ?? "غير مسجل"}\nرصيد الكوينز: ${Number(data.gold ?? currentCoins)}\nحيواناتك: ${animalNames.join("، ") || "لسه ما اشتريتش حيوانات"}`, [
              { label: "إغلاق", className: "primary", callback: (p) => p.close() },
            ]);
          }).catch(() => WA.chat.sendChatMessage("تعذر تحميل ملفك الشخصي. تحقق من اتصال قاعدة البيانات.", { scope: "local" }));
        },
      },
      {
        label: "🐾 حيواناتي / المتجر",
        className: "primary" as const,
        callback: (popup: { close: () => void }) => {
          popup.close();
          if (!currentUser) { openLogin(); return; }
          void getDoc(doc(db, "users", currentUser.uid)).then((profile) => {
            const owned = profile.exists() && Array.isArray(profile.data().animals) ? profile.data().animals : [];
            const names = ANIMALS.filter((animal) => owned.includes(animal.id)).map((animal) => animal.emoji + " " + animal.label);
            WA.ui.openPopup("yalla-animals-info", `🐾 حيواناتك الحالية: ${names.join("، ") || "لا توجد حيوانات بعد"}\n\nأسعار المتجر: قطة 2، كلب 3، حصان 10، أسد 20 كوينز. اقترب من منطقة المتجر للشراء.`, [
              { label: "إغلاق", className: "primary", callback: (p) => p.close() },
            ]);
          }).catch(() => WA.chat.sendChatMessage("تعذر تحميل الحيوانات من قاعدة البيانات.", { scope: "local" }));
        },
      },
      {
        label: "📜 قوانين اللعبة",
        className: "primary" as const,
        callback: (popup: { close: () => void }) => { popup.close(); openRules(); },
      },
      {
        label: "🎮 شرح اللعبة",
        className: "primary" as const,
        callback: (popup: { close: () => void }) => { popup.close(); openHelp(); },
      },
      { label: "إغلاق", className: "primary" as const, callback: (popup: { close: () => void }) => popup.close() },
    ];
    WA.ui.openPopup("yalla-city-main-menu", "🌆 Yalla City — اختر خدمة:", buttons);
  };

  // Add player-facing shortcuts. The native moderation window is owned by WorkAdventure
  // and cannot be covered or replaced by a map script.
  try {
    WA.ui.actionBar.addButton({
      id: "yalla-city-menu",
      label: "🌆 Yalla City",
      callback: openYallaMenu,
    });
    WA.ui.actionBar.addButton({
      id: "yalla-game-rules",
      label: "📜 قوانين اللعبة",
      callback: openRules,
    });
    WA.ui.actionBar.addButton({
      id: "yalla-game-help",
      label: "🎮 شرح اللعبة",
      callback: openHelp,
    });
  } catch (error) {
    console.warn("Could not add Yalla City help buttons to action bar:", error);
  }

  const updateGoldBanner = (gold: number) => {
    currentCoins = gold;
    WA.ui.banner.openBanner({
      id: "yalla-gold-banner",
      text: `🪙 رصيد الكوينز: ${gold}`,
      bgColor: "#202b45",
      textColor: "#ffffff",
      closable: false,
      timeToClose: 0,
    });
  };

  const purchaseAnimal = async (animalId: AnimalId) => {
    if (!currentUser) {
      openLogin();
      return;
    }
    const animal = ANIMALS.find((item) => item.id === animalId);
    if (!animal) return;
    const userRef = doc(db, "users", currentUser.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(userRef);
        if (!snapshot.exists()) throw new Error("ملف اللاعب غير موجود. سجل الخروج ثم الدخول مرة أخرى.");
        const data = snapshot.data();
        const gold = Number(data.gold ?? 0);
        const animals = Array.isArray(data.animals) ? data.animals : [];
        if (gold < animal.price) throw new Error(`رصيد الكوينز غير كافٍ. تحتاج ${animal.price} كوينز لشراء ${animal.label}.`);
        transaction.update(userRef, { gold: gold - animal.price, animals: [...animals, animal.id] });
      });
      WA.chat.sendChatMessage(`تم شراء ${animal.label} بنجاح!`, { scope: "local" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "حصل خطأ أثناء الشراء.";
      WA.chat.sendChatMessage(message, { scope: "local" });
    }
  };

  const openShop = () => {
    // The meeting-table/chair area is also the shop interaction point.
    // If the visitor is not authenticated, open the account screen instead of silently doing nothing.
    if (!currentUser) {
      openLogin();
      return;
    }
    if (shopPopupOpen) return;
    shopPopupOpen = true;
    const buttons = ANIMALS.map((animal) => ({
      label: `${animal.emoji} ${animal.label} — ${animal.price} كوينز`,
      className: "primary" as const,
      callback: (popup: { close: () => void }) => {
        popup.close();
        shopPopupOpen = false;
        void purchaseAnimal(animal.id);
      },
    }));
    buttons.push({
      label: "إغلاق المتجر",
      className: "primary" as const,
      callback: (popup: { close: () => void }) => {
        popup.close();
        shopPopupOpen = false;
      },
    });
    currentPopup = WA.ui.openPopup("shopPopup", `🛍️ متجر الحيوانات\nرصيدك الحالي: ${currentCoins} كوينز\nاختر الحيوان الذي تريد شراءه:`, buttons);
  };

  const onSignedIn = async (user: User) => {
    if (goldUnsubscribe) {
      goldUnsubscribe();
      goldUnsubscribe = undefined;
    }
    const userRef = doc(db, "users", user.uid);
    try {
      const snapshot = await getDoc(userRef);
      // Auth can fire before login.html finishes creating a missing Firestore profile.
      // Do not sign out or switch users during this race; subscribe and wait for the profile.
      currentUser = user;
      localStorage.setItem(USER_UID_KEY, user.uid);
      if (snapshot.exists()) {
        updateGoldBanner(Number(snapshot.data().gold ?? 0));
      }
      goldUnsubscribe = onSnapshot(userRef, (updated) => {
        if (updated.exists()) {
          updateGoldBanner(Number(updated.data().gold ?? 0));
          loginModalOpen = false;
          showRulesIfNeeded();
        } else {
          WA.chat.sendChatMessage("جاري تجهيز ملف حسابك...", { scope: "local" });
        }
      }, (error) => {
        console.error("Player profile listener error:", error);
        WA.chat.sendChatMessage("تعذر قراءة ملف حسابك. راجع إعدادات Firestore.", { scope: "local" });
      });
    } catch (error) {
      console.error("Could not load player profile:", error);
      WA.chat.sendChatMessage("تعذر تحميل حسابك. تأكد من إعداد Firestore Rules.", { scope: "local" });
    }
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      void onSignedIn(user);
    } else {
      currentUser = null;
      if (goldUnsubscribe) {
        goldUnsubscribe();
        goldUnsubscribe = undefined;
      }
      localStorage.removeItem(USER_UID_KEY);
      openLogin();
    }
  });

  // The login iframe and this map script share the GitHub Pages origin.
  window.addEventListener("storage", (event) => {
    if (event.key === USER_UID_KEY && event.newValue) {
      // Firebase Auth's persisted state will trigger onAuthStateChanged as well.
      loginModalOpen = false;
    }
  });

  WA.room.area.onEnter("shop").subscribe(() => openShop());
  WA.room.area.onLeave("shop").subscribe(() => {
    if (currentPopup) {
      currentPopup.close();
      currentPopup = undefined;
    }
    shopPopupOpen = false;
  });

  // Refresh profile on focus so the banner stays correct after returning from the login modal.
  window.addEventListener("focus", async () => {
    if (!currentUser) return;
    try {
      const snapshot = await getDoc(doc(db, "users", currentUser.uid));
      if (snapshot.exists()) updateGoldBanner(Number(snapshot.data().gold ?? 0));
    } catch (error) {
      console.warn("Could not refresh gold:", error);
    }
  });
}).catch((error) => console.error("WorkAdventure API initialization failed:", error));

export {};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, addDoc, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7nexX-dwj_IhYC5EaS-DU_YQeE6-acDw",
  authDomain: "game-af286.firebaseapp.com",
  projectId: "game-af286",
  storageBucket: "game-af286.firebasestorage.app",
  messagingSenderId: "567693078252",
  appId: "1:567693078252:web:3b5d6475a583f1f7347fc9",
  measurementId: "G-JKFYDGCFML"
};
const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app);
const $ = id => document.getElementById(id), canvas = $("world"), ctx = canvas.getContext("2d");
let x=0,y=0, user=null, playerUnsub=null, chatUnsub=null, peers={}, moveTimer=null, lastWrite=0;
const colors=["#e99a62","#7db4ef","#e9d86f","#db91cb","#91d6c1"];
function message(text){$("auth-message").textContent=text}
function fit(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);draw()}
function draw(){
 const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);ctx.fillStyle="#4f966f";ctx.fillRect(0,0,w,h);const t=42;
 for(let yy=0;yy<h;yy+=t)for(let xx=0;xx<w;xx+=t){ctx.fillStyle=((xx/t+yy/t)%4===0)?"#579e78":"#4f966f";ctx.fillRect(xx,yy,t-1,t-1)}
 ctx.fillStyle="#d5c99e";ctx.fillRect(0,h*.43,w,h*.15);ctx.fillRect(w*.43,0,w*.15,h);
 const buildings=[{x:.1,y:.12,w:.23,h:.22,c:"#e7a66d",n:"مقهى المدينة"},{x:.68,y:.12,w:.22,h:.22,c:"#8eb9df",n:"متجر"},{x:.1,y:.68,w:.23,h:.2,c:"#d78c9a",n:"بيوت"},{x:.68,y:.68,w:.22,h:.2,c:"#b3c77c",n:"حديقة"}];
 for(const b of buildings){let bx=w*b.x,by=h*b.y,bw=w*b.w,bh=h*b.h;ctx.fillStyle="#315e51";ctx.fillRect(bx+5,by+7,bw,bh);ctx.fillStyle=b.c;ctx.fillRect(bx,by,bw,bh);ctx.fillStyle="#fff1d1";ctx.fillRect(bx+bw*.12,by+bh*.15,bw*.2,bh*.22);ctx.fillRect(bx+bw*.65,by+bh*.15,bw*.2,bh*.22);ctx.fillStyle="#79513e";ctx.fillRect(bx+bw*.4,by+bh*.55,bw*.22,bh*.45);ctx.fillStyle="#183d35";ctx.font="bold 12px system-ui";ctx.textAlign="center";ctx.fillText(b.n,bx+bw/2,by+bh+17)}
 for(const [tx,ty] of [[.05,.4],[.95,.4],[.05,.62],[.95,.62],[.39,.1],[.61,.9],[.39,.9],[.61,.1]]){ctx.fillStyle="#275f45";ctx.beginPath();ctx.arc(w*tx,h*ty,13,0,7);ctx.fill();ctx.fillStyle="#79bd76";ctx.beginPath();ctx.arc(w*tx-3,h*ty-4,9,0,7);ctx.fill()}
 const all=Object.entries(peers);if(user&&!peers[user.uid])all.push([user.uid,{name:user.displayName||user.email?.split("@")[0]||"أنت",x,y,color:colors[0]}]);
 for(const [id,p] of all){const px=w/2+(Number(p.x)||0),py=h/2+(Number(p.y)||0);ctx.fillStyle="#1d4c48";ctx.beginPath();ctx.ellipse(px,py+9,11,5,0,0,7);ctx.fill();ctx.fillStyle=p.color||colors[1];ctx.fillRect(px-7,py-13,14,20);ctx.fillStyle="#f2c9a5";ctx.beginPath();ctx.arc(px,py-18,8,0,7);ctx.fill();ctx.fillStyle="#10262b";ctx.font="12px system-ui";ctx.fillText(p.name||"لاعب",px,py-31)}
}
async function publishPosition(){if(!user)return;try{await setDoc(doc(db,"players",user.uid),{uid:user.uid,name:user.displayName||user.email.split("@")[0],x,y,color:colors[Math.abs(user.uid.charCodeAt(0))%colors.length],updatedAt:serverTimestamp()},{merge:true})}catch(e){console.error(e)}}
function startLive(){
 if(playerUnsub)playerUnsub();if(chatUnsub)chatUnsub();
 playerUnsub=onSnapshot(collection(db,"players"),snap=>{peers={};snap.forEach(d=>{const p=d.data();if(p.uid!==user?.uid)peers[p.uid]=p});const list=$("players");list.replaceChildren();const own=document.createElement("div");own.textContent="🟢 "+(user.displayName||user.email.split("@")[0])+" (أنت)";list.append(own);Object.values(peers).forEach(p=>{const el=document.createElement("div");el.textContent="🟢 "+(p.name||"لاعب");list.append(el)});if(!Object.keys(peers).length){const el=document.createElement("small");el.textContent="أنت أول لاعب متصل الآن";list.append(el)}draw()},e=>message("خطأ في اتصال اللاعبين: "+e.message));
 const q=query(collection(db,"messages"),orderBy("createdAt","desc"),limit(60));
 chatUnsub=onSnapshot(q,snap=>{const box=$("messages");box.replaceChildren();snap.docs.reverse().forEach(d=>{const m=d.data(),item=document.createElement("div");item.className="msg";const name=document.createElement("b"),body=document.createElement("span");name.textContent=(m.name||"لاعب")+" : ";body.textContent=m.text||"";item.append(name,body);box.append(item)});box.scrollTop=box.scrollHeight},e=>message("الشات يحتاج تفعيل Cloud Firestore وقواعده: "+e.message));
 publishPosition();
}
$("signup").onclick=async()=>{const email=$("email").value.trim(),password=$("password").value;if(!email||password.length<6)return message("اكتب البريد وكلمة مرور من 6 أحرف على الأقل.");try{const cred=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(cred.user,{displayName:email.split("@")[0]});message("تم إنشاء الحساب.");}catch(e){message(authError(e))}};
$("signin").onclick=async()=>{try{await signInWithEmailAndPassword(auth,$("email").value.trim(),$("password").value);message("تم تسجيل الدخول.");}catch(e){message(authError(e))}};
function authError(e){return ({ "auth/email-already-in-use":"البريد مسجل بالفعل. جرّب تسجيل الدخول.","auth/invalid-credential":"البريد أو كلمة المرور غير صحيحة.","auth/weak-password":"كلمة المرور ضعيفة، استخدم 6 أحرف على الأقل.","auth/invalid-email":"صيغة البريد الإلكتروني غير صحيحة.","auth/operation-not-allowed":"فعّل Email/Password من إعدادات Authentication في Firebase."})[e.code]||"تعذر تسجيل الدخول: "+e.message}
$("logout").onclick=async()=>{if(user)try{await deleteDoc(doc(db,"players",user.uid))}catch{}await signOut(auth)};
onAuthStateChanged(auth,async u=>{user=u;$("auth").hidden=!!u;$("logout").hidden=!u;$("status").textContent=u?"متصل أونلاين":"سجّل الدخول";if(u){startLive()}else{if(playerUnsub)playerUnsub();if(chatUnsub)chatUnsub();peers={};$("players").textContent="سجّل الدخول للعب أونلاين";$("messages").replaceChildren();draw()}});
$("chat-form").onsubmit=async e=>{e.preventDefault();const input=$("chat-input"),text=input.value.trim();if(!user)return message("سجّل الدخول أولًا.");if(!text)return;input.value="";try{await addDoc(collection(db,"messages"),{uid:user.uid,name:user.displayName||user.email.split("@")[0],text:text.slice(0,300),createdAt:serverTimestamp()})}catch(err){message("تعذر إرسال الرسالة. تأكد من إعداد Firestore: "+err.message);input.value=text}};
function move(d){if(d==="up")y=Math.max(-canvas.clientHeight/2+30,y-12);if(d==="down")y=Math.min(canvas.clientHeight/2-30,y+12);if(d==="left")x=Math.max(-canvas.clientWidth/2+30,x-12);if(d==="right")x=Math.min(canvas.clientWidth/2-30,x+12);draw();if(user&&Date.now()-lastWrite>250){lastWrite=Date.now();publishPosition()}}
const keys={ArrowUp:"up",w:"up",ArrowDown:"down",s:"down",ArrowLeft:"left",a:"left",ArrowRight:"right",d:"right"};
window.addEventListener("keydown",e=>{if(keys[e.key]&&!/INPUT/.test(document.activeElement.tagName)){e.preventDefault();move(keys[e.key])}});
document.querySelectorAll("[data-move]").forEach(b=>{b.addEventListener("click",()=>move(b.dataset.move));b.addEventListener("pointerdown",()=>{b.repeatTimer=setInterval(()=>move(b.dataset.move),160)});["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>clearInterval(b.repeatTimer)))});
window.addEventListener("resize",fit);window.addEventListener("beforeunload",()=>{if(user)deleteDoc(doc(db,"players",user.uid)).catch(()=>{})});fit();

const $ = id => document.getElementById(id);
const scene=$('scene'), guide=$('guide'), bubble=$('bubble'), hint=$('hint'), door=$('door'), party=$('party'), guests=$('guests'), villain=$('villain'), splinter=$('splinter'), cake=$('cake'), music=$('music'), musicControl=$('musicControl'), phone=$('phone'), phoneScreen=$('phoneScreen'), fullscreenVideo=$('fullscreenVideo'), mainVideo=$('mainVideo');
let guestDanceCount=0, firstDanceStarted=false, mainVideoStarted=false, stageTimers=[], wishSaved=false;
const guestImgs=['assets/cutouts/guest-1.png','assets/cutouts/guest-2.png','assets/cutouts/guest-3.png','assets/cutouts/new-guest-1.png','assets/cutouts/new-guest-2.png','assets/cutouts/new-guest-3.png'];
const danceAssets=[{type:'video',src:'assets/dance-1-transparent.webm'},{type:'video',src:'assets/dance-2-transparent.webm'},{type:'image',src:'assets/dance-3-transparent.webp'},{type:'image',src:'assets/dance-4-transparent.webp'}];
function later(fn,ms){const t=setTimeout(fn,ms);stageTimers.push(t);return t}
function say(text){bubble.textContent=text;bubble.classList.remove('hidden')}
function hideBubble(){bubble.classList.add('hidden')}
function showHint(text){hint.textContent=text;hint.classList.remove('hidden')}
function hideHint(){hint.classList.add('hidden')}
function clearTimers(){stageTimers.forEach(clearTimeout);stageTimers=[]}
function wait(ms){return new Promise(r=>later(r,ms))}
function setupGuests(){
 guests.innerHTML='';
 const imgs=guestImgs;
 imgs.forEach((src,i)=>{const el=document.createElement('div');el.className='guest';el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','رقصاندن مهمان '+(i+1));const im=document.createElement('img');im.src=src;im.alt='مهمان جشن';el.appendChild(im);el.addEventListener('click',()=>danceGuest(el));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();danceGuest(el)}});guests.appendChild(el)});
}
function start(){
 clearTimers();guestDanceCount=0;firstDanceStarted=false;mainVideoStarted=false;wishSaved=false;
 scene.className='scene opening';guide.classList.add('hidden');guide.classList.remove('intro-position');bubble.classList.add('hidden');hideHint();door.classList.add('hidden');door.classList.remove('open');door.style.left='';door.style.right='';party.classList.add('hidden');villain.classList.add('hidden');splinter.classList.add('hidden');cake.classList.add('hidden');musicControl.classList.add('hidden');phone.classList.add('hidden');fullscreenVideo.classList.add('hidden');$('letterModal').classList.add('hidden');$('restart').classList.add('hidden');music.pause();music.currentTime=0;music.src='';mainVideo.pause();mainVideo.currentTime=0;
 later(()=>{guide.classList.remove('hidden');say('بانو فاطیما، تولد پر سعادت شما رو از طرف تمام گوربه‌های کهکشان شماره 040528 تبریک عرض می‌کنیم. برای این مجلس فرخنده تدارکاتی دیدیم؛ ممنون می‌شویم که حوصله کنید و همراهمون باشید.');},700);
 later(()=>say('بانو، برای این جشن تعدادی از گوربه‌های شهر رو دعوت کردیم. لطفاً درب رو باز کنید تا وارد مهمانی بشن.'),12700);
 later(()=>{guide.classList.add('intro-position');door.classList.remove('hidden');hideBubble();showHint('لطفاً روی درب کلیک کنید تا باز شود');},18700);
}
async function openDoor(){
 if(door.classList.contains('hidden')||door.classList.contains('open'))return;
 door.classList.add('open');hideHint();await wait(1100);door.classList.add('hidden');guide.classList.add('intro-position');party.classList.remove('hidden');setupGuests();
 // The characters enter from the door in a short staggered procession.
 const all=[...guests.children];all.forEach((el,i)=>{el.style.opacity='0';el.style.transform='translate(35vw,-18vh) scale(.6)';later(()=>{el.style.transition='all 1.1s ease';el.style.opacity='1';el.style.transform='translate(0,0) scale(1)'},i*420)});
 later(()=>{$('djGroup').classList.add('arrived');musicControl.classList.remove('hidden');say('بانو لطفا آهنگی که مایلید برای جشن تولدتون پخش بشه رو انتخاب کنید');},3200);
 later(()=>say('بانو لطفا با کلیک کردن روی مهمان‌ها آنها را برقصانید!'),6200);
}
door.addEventListener('click',openDoor);door.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDoor()}});
$('songSelect').addEventListener('change',async e=>{if(!e.target.value)return;music.src=e.target.value;try{await music.play()}catch(err){say('برای پخش آهنگ، یک بار دیگر روی نام آهنگ بزنید.')}});
function danceGuest(el){
 if(el.classList.contains('dancing')){el.classList.remove('dancing');const v=el.querySelector('video, .dance-image');if(v)v.remove();const im=el.querySelector(':scope > img:not(.dance-image)');if(im)im.style.display='';return}
 guestDanceCount++;el.classList.add('dancing');
 const im=el.querySelector('img');if(im)im.style.display='none';
 const danceIndex=(guestDanceCount-1)%danceAssets.length;const asset=danceAssets[danceIndex];
 if(asset.type==='video'){const v=document.createElement('video');v.src=asset.src;v.autoplay=true;v.loop=true;v.muted=true;v.playsInline=true;v.preload='auto';v.setAttribute('aria-label','فیلم رقص مهمان '+(danceIndex+1));el.appendChild(v)}
 else{const img=document.createElement('img');img.className='dance-image';img.src=asset.src;img.alt='فیلم رقص مهمان '+(danceIndex+1);el.appendChild(img)}
 if(!firstDanceStarted){firstDanceStarted=true;later(playMainDance,35000)}
}
function playMainDance(){
 if(mainVideoStarted)return;mainVideoStarted=true;hideBubble();hideHint();music.pause();fullscreenVideo.classList.remove('hidden');mainVideo.src='assets/main-dance.mp4';mainVideo.currentTime=0;mainVideo.muted=false;mainVideo.play().catch(()=>{mainVideo.muted=true;mainVideo.play().catch(()=>{})});
 const end=()=>{if(end.done)return;end.done=true;fullscreenVideo.classList.add('hidden');mainVideo.pause();mainVideo.removeEventListener('timeupdate',cutAt40);party.classList.add('party-dance');[...guests.children].forEach(el=>el.classList.add('dancing'));later(()=>{party.classList.remove('party-dance');[...guests.children].forEach(el=>{el.classList.remove('dancing');const v=el.querySelector('video, .dance-image');if(v)v.remove();const im=el.querySelector(':scope > img:not(.dance-image)');if(im)im.style.display=''}) ;villain.classList.remove('hidden');music.pause();say('بانو مجلس تولد شما توسط یه گربه شرور مورد حمله قرار گرفت. لطفا با استاد اسپلینتر تماس بگیرید تا آرامش و شادی رو به مجلس برگردونند.');later(startPhoneSequence,20000)},5000)};
 function cutAt40(){if(mainVideo.currentTime>=40)end()}
 mainVideo.addEventListener('timeupdate',cutAt40);$('skipVideo').onclick=end;
 mainVideo.onended=end;
}
async function startPhoneSequence(){
 hideBubble();phone.classList.remove('hidden');phoneScreen.innerHTML='<div class="phone-header">گوشی همراه</div><div style="padding:25px;text-align:center;color:#444">در حال روشن شدن...</div>';
 await wait(2000);
 phoneScreen.innerHTML='<div class="phone-header">مخاطبین</div><div class="contact" id="splinterContact"><img class="contact-avatar" src="assets/splinter.webp"><div><strong>استاد اسپلینتر</strong><div style="font-size:11px;color:#777;margin-top:4px">مخاطب</div></div></div>';
 showHint('لطفاً مخاطب مورد نظر را انتخاب کنید');
 $('splinterContact').onclick=callSplinter;
}
async function callSplinter(){
 hideHint();phoneScreen.innerHTML='<div class="call-screen"><img src="assets/splinter.webp"><div class="call-name">استاد اسپلینتر</div><div class="call-state">در حال تماس...</div><button class="hangup">☎</button></div>';
 await wait(5000);
 const lines=[['left','استاد: سلام.'],['right','فاطیما: سلام.'],['left','استاد: بفرمایید چطور می‌تونم کمکتون کنم؟'],['right','فاطیما: استاد به مجلس تولد بنده حمله صورت گرفته و باعث آزرده‌خاطری بنده شده. ممنون می‌شم کمکم کنید.'],['left','استاد: باشه میام، فقط یه موردی، ماشینم خراب شده گذاشتم تعمیرگاه. برام اسنپ بگیر تا بیام.'],['right','فاطیما: چشم استاد، همین الان براتون اسنپ می‌گیرم.']];
 phoneScreen.innerHTML='<div class="phone-header">تماس با استاد اسپلینتر</div><div class="chat-area" id="chat"></div>';
 for(const [side,line] of lines){const b=document.createElement('div');b.className='chat-bubble '+side;b.textContent=line;$('chat').appendChild(b);await wait(3000)}
 await wait(700);showRideLogo();
}
async function showRideLogo(){
 phoneScreen.innerHTML='<div class="ride-logo">اسنپ<small>در حال باز شدن برنامه...</small></div>';await wait(2000);showMap();
}
async function animateRideAlongRoute(){
 const path=$('tripPath'),svg=path.ownerSVGElement,rider=$('rider'),map=$('phoneScreen').querySelector('.map-screen');
 const total=path.getTotalLength(),rect=svg.getBoundingClientRect(),view=svg.viewBox.baseVal;
 rider.style.transition='none';rider.style.left='0';rider.style.right='auto';rider.style.top='0';
 const started=performance.now();
 await new Promise(resolve=>{function step(now){const progress=Math.min(1,(now-started)/5000);const point=path.getPointAtLength(total*progress);const next=path.getPointAtLength(Math.min(total,total*progress+2));const x=point.x/view.width*rect.width;const y=point.y/view.height*rect.height;const angle=Math.atan2((next.y-point.y)/view.height*rect.height,(next.x-point.x)/view.width*rect.width)*180/Math.PI;rider.style.transform=`translate(${x-12}px,${y-12}px) rotate(${angle}deg)`;rider.style.left='0';rider.style.top='0';if(progress<1)requestAnimationFrame(step);else resolve()}requestAnimationFrame(step)});
}
function showMap(){
 phoneScreen.innerHTML='<div class="map-screen"><div class="map-title" id="mapTitle">لطفاً مبدأ خود را انتخاب کنید</div><svg class="road-map" viewBox="0 0 300 500" preserveAspectRatio="none" aria-hidden="true"><path class="roads" d="M-20 80 L90 80 L90 145 L165 145 L165 225 L250 225 L250 300 L195 300 L195 365 L90 365 L90 430 L320 430 M20 0 L20 115 L60 160 L60 260 L120 300 L120 500 M220 -10 L220 95 L265 130 L265 180 M-10 200 L45 200 L90 245 L150 245 L195 190 L310 190"/><path id="tripPath" class="trip-path" d="M245 135 L245 225 L195 225 L195 300 L195 365 L90 365 L90 430 L40 430"/></svg><div class="map-place sewer" id="sewer">چاه فاضلاب<br>استاد اسپلینتر</div><div class="map-place hall" id="hall">تالار تولد</div><div id="rider" class="map-rider">🚕</div><div class="map-status" id="mapStatus">مبدأ سفر را انتخاب کنید</div></div>'; 
 $('hall').style.opacity='.55';$('hall').style.animation='none';
 $('sewer').onclick=()=>{if($('mapTitle').dataset.step==='dest')return;$('mapTitle').dataset.step='dest';$('mapTitle').textContent='لطفاً مقصد را انتخاب کنید';$('mapStatus').textContent='مبدأ: چاه فاضلاب استاد اسپلینتر';$('sewer').style.borderColor='#999';$('hall').style.opacity='1';$('hall').style.animation='pulse 1s infinite';};
 $('hall').onclick=async()=>{if($('mapTitle').dataset.step!=='dest'){showHint('اول چاه فاضلاب استاد اسپلینتر را انتخاب کنید');later(hideHint,1800);return}
 $('mapTitle').textContent='استاد اسپلینتر تو راهه!';$('mapStatus').textContent='سفر در حال انجام است...';$('sewer').style.opacity='.5';$('hall').style.animation='none';await animateRideAlongRoute();phone.classList.add('hidden');hideHint();await splinterArrival();};
}
async function splinterArrival(){
 splinter.classList.remove('hidden');splinter.style.left='-30%';splinter.style.transition='left 1.4s ease-out';await wait(50);splinter.style.left='4%';
 villain.classList.add('battle');splinter.classList.add('battle');party.classList.add('fight-scene');await wait(10000);party.classList.remove('fight-scene');villain.classList.remove('hidden');villain.classList.add('hidden');villain.classList.remove('battle');splinter.classList.remove('battle');await wait(2000);splinter.classList.add('hidden');say('بانو خطر رفع شد. حالا نوبت کیک تولدتونه.');await wait(2500);hideBubble();await cakeSequence();
}
async function cakeSequence(){
 [...guests.children].forEach(g=>g.classList.add('hidden'));door.classList.remove('hidden');door.classList.remove('open');door.style.right='auto';door.style.left='4%';showHint('در حال ورود مهمان‌ها با کیک...');
 await wait(1200);door.classList.add('open');await wait(800);door.classList.add('hidden');await wait(2000);
 // Two guests escort a tall cake into the middle of the hall.
 const extra=document.createElement('div');extra.className='character';extra.style.cssText='z-index:6;left:2%;bottom:12%;width:90px;height:130px;';extra.innerHTML='<img src="assets/cutouts/guest-1.png" alt="مهمان همراه کیک">';party.appendChild(extra);
 [...guests.children].forEach(g=>g.classList.remove('hidden'));cake.classList.remove('hidden');showHint('لطفاً روی شمع‌ها کلیک کنید تا خاموش شوند');say('بانو لطفا شمع‌های تولدتون رو فوت کنید.');
 cake.onclick=async()=>{if(!wishSaved){say('بانو چیزی رو فراموش نکردین؟ هنوز آرزو نکردین بانو.');showHint('لطفاً آرزوی خود را بنویسید');$('letterModal').classList.remove('hidden');return}
 cake.classList.add('blown');hideHint();say('');party.classList.add('party-dance');await wait(10000);party.classList.remove('party-dance');say('بانو، ممنونم که ما را در اجرای این مراسم همراهی کردین. آرزوی شخص بنده برای شما حال خوب و دل خوش برای تمام لحظات زندگی شما هستش. دوست‌دار شما، گربه راهنما، آبان ماه ۱۴۰۵. سلامت و تن‌درست و شاد باشید. خدانگهدار شما.');later(()=>{$('restart').classList.remove('hidden')},10000)};
}
$('sendWish').onclick=()=>{if(!$('wishText').value.trim()){ $('wishText').focus();return}wishSaved=true;$('letterModal').classList.add('hidden');hideHint();say('بانو آرزوی شما با موفقیت دریافت شد و در اسرع وقت برآورده میشه. حالا باید شمع‌هاتون رو فوت کنید.');later(()=>{hideBubble();showHint('لطفاً روی شمع‌ها کلیک کنید تا خاموش شوند');cake.classList.remove('blown')},3500)};
$('restart').onclick=()=>{ // remove temporary character if replaying
 const temp=party.querySelector('.character:not(#villain):not(#splinter)');if(temp)temp.remove();door.style.left='';door.style.right='';cake.onclick=null;start();
};
function pulse(){}
start();
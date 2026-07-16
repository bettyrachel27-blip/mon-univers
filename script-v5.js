const pages=[...document.querySelectorAll('.page')];
const navs=[...document.querySelectorAll('[data-page]')];
function showPage(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));navs.forEach(n=>n.classList.toggle('active',n.dataset.page===id));window.scrollTo({top:0,behavior:'smooth'});} 
navs.forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.page)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.go)));
const date=new Date();document.getElementById('todayDate').textContent=date.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}).toUpperCase();
function addItem(inputId,listId,check=false){const input=document.getElementById(inputId);const val=input.value.trim();if(!val)return;const li=document.createElement('li');if(check){const cb=document.createElement('input');cb.type='checkbox';li.appendChild(cb);const span=document.createElement('span');span.textContent=val;li.appendChild(span);}else{li.textContent=val;}document.getElementById(listId).prepend(li);input.value='';saveState();}
function saveNote(){const box=document.getElementById('noteBox');const val=box.value.trim();if(!val)return;const div=document.createElement('div');div.textContent=val;document.getElementById('savedNotes').prepend(div);box.value='';saveState();}
function saveState(){localStorage.setItem('monUniversV2',JSON.stringify({events:html('eventList'),tasks:html('taskList'),expenses:html('expenseList'),notes:document.getElementById('savedNotes').innerHTML}));}
function html(id){return document.getElementById(id).innerHTML}
(function load(){const raw=localStorage.getItem('monUniversV2');if(!raw)return;try{const s=JSON.parse(raw);document.getElementById('eventList').innerHTML=s.events||'';document.getElementById('taskList').innerHTML=s.tasks||'';document.getElementById('expenseList').innerHTML=s.expenses||'';document.getElementById('savedNotes').innerHTML=s.notes||'';}catch(e){}})();
document.addEventListener('change',saveState);



// Centre de notifications
const DEFAULT_NOTIFICATIONS = [
  {id:'agenda-1', icon:'📅', title:'Agenda', text:'Réunion d’équipe aujourd’hui à 14 h 30.', time:'Aujourd’hui', read:false, page:'agenda'},
  {id:'work-1', icon:'💼', title:'Travail', text:'Il te reste 2 priorités professionnelles à terminer.', time:'Il y a 10 min', read:false, page:'tasks'},
  {id:'budget-1', icon:'💰', title:'Budget', text:'Il te reste 560 € sur ton budget mensuel prévu.', time:'Ce matin', read:false, page:'budget'},
  {id:'universe-1', icon:'✨', title:'Message du jour', text:'Avance doucement, mais avance avec confiance.', time:'Aujourd’hui', read:true, page:'home'}
];

function getNotifications(){
  try { return JSON.parse(localStorage.getItem('monUniversNotifications')) || DEFAULT_NOTIFICATIONS; }
  catch(e){ return DEFAULT_NOTIFICATIONS; }
}
function saveNotifications(items){ localStorage.setItem('monUniversNotifications', JSON.stringify(items)); }
function renderNotifications(){
  const list=document.getElementById('notificationList');
  const count=document.getElementById('notificationCount');
  const summary=document.getElementById('notificationSummary');
  if(!list||!count||!summary)return;
  const items=getNotifications();
  const unread=items.filter(n=>!n.read).length;
  count.textContent=unread;
  count.style.display=unread ? 'block' : 'none';
  summary.textContent=unread ? `${unread} nouvelle${unread>1?'s':''} alerte${unread>1?'s':''}` : 'Tout est à jour';
  list.innerHTML=items.length ? items.map(n=>`<article class="notification-item ${n.read?'':'unread'}" data-id="${n.id}" data-target="${n.page||''}"><div class="notification-icon">${n.icon}</div><div><h4>${n.title}</h4><p>${n.text}</p><time>${n.time}</time></div></article>`).join('') : '<div class="empty-notifications">Aucune notification pour le moment ✨</div>';
  list.querySelectorAll('.notification-item').forEach(card=>card.addEventListener('click',()=>{
    const items=getNotifications().map(n=>n.id===card.dataset.id?{...n,read:true}:n);
    saveNotifications(items); renderNotifications(); closeNotifications();
    if(card.dataset.target) showPage(card.dataset.target);
  }));
}
function openNotifications(){
  const overlay=document.getElementById('notificationOverlay');
  overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; renderNotifications();
}
function closeNotifications(){
  const overlay=document.getElementById('notificationOverlay');
  overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); document.body.style.overflow='';
}

document.addEventListener('DOMContentLoaded',()=>{
  renderNotifications();
  document.getElementById('notificationBtn')?.addEventListener('click',openNotifications);
  document.querySelectorAll('[data-close-notifications]').forEach(el=>el.addEventListener('click',closeNotifications));
  document.getElementById('markAllRead')?.addEventListener('click',()=>{
    saveNotifications(getNotifications().map(n=>({...n,read:true}))); renderNotifications();
  });
  document.getElementById('installHelpBtn')?.addEventListener('click',()=>alert('Sur iPhone : ouvre ce site dans Safari, touche Partager, puis « Ajouter à l’écran d’accueil ».'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNotifications();});
});

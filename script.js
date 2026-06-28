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

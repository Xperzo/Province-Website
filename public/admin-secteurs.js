document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnPublier').addEventListener('click', publier);
  chargerSecteurs();
});

function slugify(text){
  return text.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');
}

async function publier(){
  alert('🟢 Publication en cours');

  const titre = document.getElementById('ext_titre').value.trim();
  if(!titre){
    alert('❌ Titre obligatoire');
    return;
  }

  const secteur = {
    slug: slugify(titre),
    exterieur:{
      titre,
      image:document.getElementById('ext_image').value,
      resume:document.getElementById('ext_resume').value
    },
    interieur:{
      hero:document.getElementById('int_hero').value,
      presentation:document.getElementById('int_presentation').value,
      video:document.getElementById('int_video').value
    }
  };

  const res = await fetch('/api/secteurs',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(secteur)
  });

  if(res.ok){
    alert('✅ Secteur publié avec succès');
    chargerSecteurs();
  }else{
    alert('❌ Erreur serveur');
  }
}

async function chargerSecteurs(){
  const r = await fetch('/api/secteurs');
  if(!r.ok) return;
  const data = await r.json();
  const tbody=document.getElementById('listeSecteurs');
  tbody.innerHTML='';
  Object.values(data).forEach(s=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${s.exterieur.titre}</td><td>${s.slug}</td>`;
    tbody.appendChild(tr);
  });
}

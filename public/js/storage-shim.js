// public/js/storage-shim.js
window.StorageShim = (function(){
  const KEY='local_actualites_queue';
  function load(){ try{ const r=localStorage.getItem(KEY); return r?JSON.parse(r):[] }catch(e){return[]} }
  function save(arr){ localStorage.setItem(KEY, JSON.stringify(arr)) }
  async function sync(API){
    const items = load();
    if (!items.length) return [];
    const res = [];
    for(const it of items){
      try {
        const r = await API.createActualite(it);
        res.push({ id: it.id, ok: true });
        const remaining = load().filter(i => i.id !== it.id);
        save(remaining);
      } catch(e){
        res.push({ id: it.id, ok: false, error: e });
      }
    }
    return res;
  }
  function enqueue(item){ const arr=load(); arr.push(item); save(arr); }
  return { sync, enqueue, load };
})();

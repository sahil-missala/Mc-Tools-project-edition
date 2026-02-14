// chunkbase
function openChunkbase(){
  let seed=document.getElementById("seed").value;
  if(!seed) return alert("Enter seed");
  window.open(`https://www.chunkbase.com/apps/seed-map#${seed}`,"_blank");
}


// server status
async function checkServer(){
  let ip=document.getElementById("ip").value;
  let out=document.getElementById("status");

  if(!ip) return alert("Enter IP");

  out.innerText="Checking...";

  try{
    let res=await fetch(`https://api.mcsrvstat.us/2/${ip}`);
    let data=await res.json();

    if(data.online){
      out.innerText=`🟢 Online | ${data.players.online}/${data.players.max} players`;
    }else{
      out.innerText="🔴 Offline";
    }
  }catch{
    out.innerText="Error";
  }
}


// uuid finder
async function getUUID(){
  let user=document.getElementById("username").value.trim();
  let cracked=document.getElementById("cracked").checked;
  let out=document.getElementById("uuid");

  if(!user){
    alert("Enter username");
    return;
  }

  // 🟡 CRACKED MODE
  if(cracked){
    let uuid=generateOfflineUUID(user);
    out.innerText="Offline UUID: "+uuid;
    return;
  }

  // 🟢 OFFICIAL ACCOUNT MODE
  out.innerText="Fetching...";

  try{
    let res=await fetch("https://playerdb.co/api/player/minecraft/"+user);
    let data=await res.json();

    if(data.success){
      let uuid=data.data.player.raw_id;

      // format with dashes
      uuid=uuid.replace(
        /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/,
        "$1-$2-$3-$4-$5"
      );

      out.innerText="Official UUID: "+uuid;
    }else{
      out.innerText="Official account not found";
    }

  }catch(err){
    out.innerText="API Error";
    console.log(err);
  }
}



// format uuid with dashes
function formatUUID(uuid){
  return uuid.replace(
    /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/,
    "$1-$2-$3-$4-$5"
  );
}


// offline uuid generator (REAL method used by servers)
function generateOfflineUUID(username){
  let base = "OfflinePlayer:" + username;
  let hash = md5(base);
  return formatUUID(hash);
}


// simple md5 implementation
function md5(str){
  return CryptoJS.MD5(str).toString();
}



// offline uuid generator
function offlineUUID(name){
  let base="OfflinePlayer:"+name;
  let hash=0;

  for(let i=0;i<base.length;i++){
    hash=((hash<<5)-hash)+base.charCodeAt(i);
    hash|=0;
  }

  return (hash>>>0).toString(16).padStart(32,"0");
}


// coord converter
function convert(){
  let x=document.getElementById("x").value;
  let z=document.getElementById("z").value;

  if(!x||!z) return alert("Enter coords");

  let nx=(x/8).toFixed(1);
  let nz=(z/8).toFixed(1);

  document.getElementById("coords").innerText=`Nether: ${nx}, ${nz}`;
}

document.addEventListener("DOMContentLoaded", async function() {

function wrapEmojis(input) {
/*
im going to be so god damn fr when i tell you i used chatgpt for this emoji shit.
i searched fucking endlessly for any way to possibly do this shit
and all i got were regex that matches specific emoji
twemoji (something not being updated for other devs to use)
and to do the thing i did which was have the emoji font after the normal font (fun fact that didnt fucking work???)
i imported noto fonts directly i specified character codes in css
i got the setofont ttf file and used that
i did all the research i could for my damn self and i found fucking nothing.
this rant is over and stupid and im so fucking mad
*/

  const emojiRegex = /^\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*$/u;
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

  const container = document.createElement("div");
  container.innerHTML = input;

  function wrapTextNode(node) {
    const parent = node.parentNode;
    const segments = Array.from(segmenter.segment(node.textContent));

    segments.forEach(({ segment }) => {
      if (!segment) return;

      if (emojiRegex.test(segment)) {
        const span = document.createElement("span");
        span.className = "emoji";
        span.textContent = segment;
        parent.insertBefore(span, node);
      } else {
        parent.insertBefore(document.createTextNode(segment), node);
      }
    });

    parent.removeChild(node);
  }

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      wrapTextNode(node);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName !== "SCRIPT" &&
      node.tagName !== "STYLE"
    ) {
      Array.from(node.childNodes).forEach(walk);
    }
  }

  walk(container);
  return container.innerHTML;
}

async function grabdiscord() {
const response = await fetch('/.netlify/functions/discord');
// const response = await fetch('/discord.json');

let data = await response.json();

var now = new Date().getTime();


const nickname = data.global_name;
const username = data.username;

const userid = data.id;
const avatarid = data.avatar;
const bannerid = data.banner;
const onlinestatus = data.status;
const accent = data.accentColor;



const activitylist = document.getElementById("activities");
activitylist.innerHTML = "";

document.getElementById("username").innerHTML = wrapEmojis(nickname);
document.getElementById("username").title = `${username} on discord`;



var coverimage = document.getElementById("pfp");
coverimage.src = `https://cdn.discordapp.com/avatars/${userid}/${avatarid}.webp?size=512`;

coverimage.onerror = function () {
coverimage.src = '/media/pfp.png';
};

if(accent) {
coverimage.style.backgroundColor = "#"+accent.toString(16).padStart(6, "0");
}

coverimage.style.border = "5px solid var(--bg0)";

const top = document.getElementsByClassName("top")[0];

// top.style.backgroundImage = `url(https://cdn.discordapp.com/banners/${userid}/${bannerid}.webp?size=1024)`;
// top.style.backgroundPosition = "center";
// top.style.backgroundRepeat = "no-repeat";
// top.style.backgroundSize = "100% 100%";
// grrr...
// im not paying for a banner idc

var onlineimg = document.getElementById("onlineimg");
var onlinetext = document.getElementById("online");

onlineimg.className = "sprite";


if (onlinestatus == "online") {
onlineimg.className += " online";
onlinetext.innerHTML = "Online";
coverimage.style.borderColor = "var(--green)";
} else if (onlinestatus == "idle") {
onlineimg.className += " idle";
onlinetext.innerHTML = "Idle";
coverimage.style.borderColor = "var(--yellow)";
} else if (onlinestatus == "dnd") {
onlineimg.className += " dnd";
onlinetext.innerHTML = "Do Not Disturb";
coverimage.style.borderColor = "var(--red)";
} else {
onlineimg.className += " offline";
onlinetext.innerHTML = "Offline";
}

// document.getElementById("addfriend").href = `https://discord.com/users/${userid}`;
document.getElementById("addfriend").href = `/discord/user#${userid}`;


document.title = nickname;
}


await grabdiscord();
});

let current = new Audio();
let songs = [];
let next;
let previous;
let auto = true;
let shuffle = false;
function secondsToMinutesSeconds(seconds) {
  //convert the seconds To Minutes
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
function Shuffle() {
  //shuffle the songs and play the random songs
  let i = Math.floor(Math.random() * songs.length);
  change(songs[i]);
  pass(songs[i]);
}
function pass(e) {
  //pass the songs to playsongs function
  previous = e.previousSibling;
  next = e.nextSibling;
  playsongs(e.firstElementChild.firstElementChild.nextSibling.innerHTML);
}
function playsongs(track) {
  //play the songs
  document.querySelector(".name").innerHTML = track;
  current.src = "/songs/playlist/" + track;
  current.play();
}
function change(e) {
  //change the apearance of the current song
  Array.from(document.getElementsByClassName("songname")).forEach((e) => {
    e.style.color = "white";
  });
  e.firstElementChild.firstElementChild.nextSibling.style.color = "#1ed760";
}
async function getallsongs() {
  //fetch all the songs from the playlists
  let get = await fetch(`songs/playlist`);
  let response = await get.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let a = div.getElementsByTagName("a");
  let as = [];
  for (let index = 0; index < a.length; index++) {
    const element = a[index];
    if (element.href.endsWith(".mp3")) {
      as.push(element);
    }
  }
  let songame = document.querySelector(".main2");
  songame.innerHTML = "";
  for (let index = 0; index < as.length; index++) {
    const song = as[index];
    songame.innerHTML =
      songame.innerHTML +
      `<div class="song2">
    <div class="card2 flex">
    <img src="svgs/music.svg" alt=""/><h4 class="songname">${
      song.href.replaceAll("%20", " ").split("/").slice(4)[1]
    }</h4>
    </div>
    </div>`;
  }
  songs = Array.from(document.getElementsByClassName("song2"));
  songs.forEach((e) => {
    e.addEventListener("click", () => {
      document.querySelector(".playb").src = "svgs/pause.svg";
      document.querySelector(".time").innerHTML = "00:00/00:00";
      change(e);
      pass(e);
      document.querySelector(".playbar").style.width = "70vw";
      document.querySelector(".playbar").style.transition = "ease-in-out 0.5s";
      document.querySelector(".right1").style.height = "87vh";
    });
  });
}
async function getplaylist() {
  //fetch the playlists from the directry
  let get = await fetch(`songs/all_playlists`);
  let response = await get.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let a = div.getElementsByTagName("a");
  //display the playlists on home page
  Array.from(a).forEach(async (e) => {
    if (e.href.includes("songs")) {
      let folder = e.href;
      let get = await fetch(`${folder}/info.json`);
      let response = await get.json();
      document.querySelector(".albums").innerHTML =
        document.querySelector(".albums").innerHTML +
        `<div data-folder="${folder}" class="hov">
          <div class="card flex">
            <img
              class="cover"
              src="${folder}/cover.png"
              alt=""
            />
            <h3>${response.title}</h3>
            <p>${response.description}</p>
          </div>
          <span class="playbutton flex">
            <div class="play-button"></div>
            </span>
            </div>`;
      document.querySelector(".main").innerHTML =
        document.querySelector(".main").innerHTML +
        `<div data-folder="${folder}" class="hv">
              <div class="card2 flex">
                <img src="${folder}/cover.png" alt=""/>
                <h4>${response.title}</h4>
              </div>
            </div>`;
    }
    Array.from(document.getElementsByClassName("hov")).forEach((e) => {
      e.addEventListener("click", async (item) => {
        getsongs(`${item.currentTarget.dataset.folder}`);
        document.querySelector(".right1").style.width = 0;
        document.querySelector(".right2").style.width = "72vw";
        document.querySelector(".main2").style.width = 0;
        document.querySelector(".main").style.width = "26vw";
      });
    });
    Array.from(document.getElementsByClassName("hv")).forEach((e) => {
      e.addEventListener("click", async (item) => {
        getsongs(`${item.currentTarget.dataset.folder}`);
        document.querySelector(".right1").style.width = 0;
        document.querySelector(".right2").style.width = "72vw";
      });
    });
  });
}
async function getsongs(playlist) {
  //fetch songs from the playlists
  let get = await fetch(`${playlist}`);
  let response = await get.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let a = div.getElementsByTagName("a");
  let as = [];
  for (let index = 0; index < a.length; index++) {
    const element = a[index];
    if (element.href.endsWith(".mp3")) {
      as.push(element);
    }
  }
  let get2 = await fetch(`${playlist}/info.json`);
  let response2 = await get2.json();
  document.querySelector(".top").innerHTML = `<div class="box1 flex">
  <img src="${playlist}/cover.png" alt="" />
  <div class="heading flex">
  <h3>Playlist</h3>
  <p>${response2.title}</p>
  <h4>${response2.description}</h4>
  <div>
  <h3>${as.length} ${as.length < 2 ? "song" : "songs"}</h3>
  </div>
  </div>
  </div>`;
  //display the songs on song page
  let songame = document.querySelector(".songs");
  songame.innerHTML = "";
  for (let index = 0; index < as.length; index++) {
    const song = as[index];
    songame.innerHTML =
      songame.innerHTML +
      `<div class="song">
      <div class="flex li">
      <img class="photo" src="svgs/music.svg" alt="" /><div class="songname">${song.href
        .split("/")
        .slice(5)[1]
        .replaceAll("%20", " ")}</div>
      </div>
      </div>`;
  }
  document.querySelector(
    ".background"
  ).style.background = `linear-gradient(${response2.color}, #121212 100%, #121212 100%)`;
  songs = Array.from(document.getElementsByClassName("song"));
  songs.forEach((e) => {
    e.addEventListener("click", () => {
      document.querySelector(".playb").src = "svgs/pause.svg";
      document.querySelector(".time").innerHTML = "00:00/00:00";
      change(e);
      pass(e);
      document.querySelector(".playbar").style.width = "70vw";
      document.querySelector(".playbar").style.transition = "ease-in-out 0.5s";
      document.querySelector(".right1").style.height = "87vh";
    });
  });
}
async function main() {
  getallsongs();
  await getplaylist();
  //play the previous song
  document.querySelector(".previous").addEventListener("click", () => {
    document.querySelector(".playb").src = "svgs/pause.svg";
    if (shuffle == true) {
      Shuffle();
    } else {
      change(previous);
      pass(previous);
    }
  });
  //play the next song
  document.querySelector(".next").addEventListener("click", () => {
    document.querySelector(".playb").src = "svgs/pause.svg";
    if (shuffle == true) {
      Shuffle();
    } else {
      change(next);
      pass(next);
    }
  });
  //play and pause the current song
  document.querySelector(".playb").addEventListener("click", () => {
    if (current.paused) {
      current.play();
      document.querySelector(".playb").src = "svgs/pause.svg";
    } else {
      current.pause();
      document.querySelector(".playb").src = "svgs/play.svg";
    }
  });
  //update the time of the songs
  current.addEventListener("timeupdate", () => {
    document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(
      current.currentTime
    )} / ${secondsToMinutesSeconds(current.duration)}`;
    document.querySelector(".circle").style.margin =
      (current.currentTime / current.duration) * 70 + "%";
    if (current.currentTime == current.duration) {
      //call the shuffle function
      document.querySelector(".playb").src = "svgs/play.svg";
      if (shuffle == true) {
        document.querySelector(".playb").src = "svgs/pause.svg";
        Shuffle();
      }
      //automatically play the next song
      if (auto == true) {
        document.querySelector(".playb").src = "svgs/pause.svg";
        if (next == null) {
          document.querySelector(".playb").src = "svgs/play.svg";
        } else {
          change(next);
          pass(next);
        }
      }
    }
  });
  //adjust the range of the volume
  document.querySelector(".range").addEventListener("change", (e) => {
    current.volume = e.target.value / 100;
    if (current.volume == 0) {
      document.querySelector(".volume").src = "svgs/mute.svg";
    } else {
      document.querySelector(".volume").src = "svgs/volume.svg";
    }
  });
  document.querySelector(".volume").addEventListener("click", () => {
    if (current.volume == 0) {
      current.volume = 0.5;
      document.querySelector(".volume").src = "svgs/volume.svg";
    } else {
      current.volume = 0;
      document.querySelector(".volume").src = "svgs/mute.svg";
    }
  });
  //adjust the seekbar
  document.querySelector(".seek").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 70;
    document.querySelector(".circle").style.margin = percent + "%";
    current.currentTime = (current.duration * percent) / 70;
  });
  //change the appearance while autoplay
  document.getElementById("auto").addEventListener("click", () => {
    if (auto == true) {
      auto = false;
      document.getElementById("auto").src = "svgs/auto.svg";
    } else {
      auto = true;
      shuffle = false;
      document.getElementById("shuffle").src = "svgs/shuffle.svg";
      document.getElementById("auto").src = "svgs/auto2.svg";
    }
  });
  //change the appeareance while shuffle
  document.getElementById("shuffle").addEventListener("click", () => {
    if (shuffle == true) {
      shuffle = false;
      document.getElementById("shuffle").src = "svgs/shuffle.svg";
    } else {
      shuffle = true;
      auto = false;
      document.getElementById("auto").src = "svgs/auto.svg";
      document.getElementById("shuffle").src = "svgs/shuffle2.svg";
    }
  });
  //display the home page
  document
    .querySelector(".link2")
    .firstElementChild.addEventListener("click", () => {
      document.querySelector(".right1").style.width = "72vw";
      document.querySelector(".main").style.width = 0;
      document.querySelector(".main2").style.width = "26vw";
      document.querySelector(".right2").style.width = 0;
    });
  //dislay the home page
  document.getElementById("home").addEventListener("click", () => {
    document.querySelector(".right1").style.width = "72vw";
    document.querySelector(".right2").style.width = 0;
    document.querySelector(".main2").style.width = "26vw";
    document.querySelector(".main").style.width = 0;
  });
  //display the song page
  document
    .querySelector(".link")
    .lastElementChild.addEventListener("click", () => {
      document.querySelector(".right1").style.width = 0;
      document.querySelector(".right2").style.width = "72vw";
      document.querySelector(".main2").style.width = 0;
      document.querySelector(".main").style.width = "26vw";
    });
  //play the first song of the playlist whenever the button is clicked on song page
  document.querySelector(".playbutton1").addEventListener("click", () => {
    document.querySelector(".playbar").style.width = "70vw";
    document.querySelector(".playbar").style.transition = "ease-in-out 0.5s";
    document.querySelector(".playb").src = "svgs/pause.svg";
    change(songs[0]);
    pass(songs[0]);
  });
}
main();

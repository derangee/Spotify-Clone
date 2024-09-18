const songCoverMap = {
    "http://127.0.0.1:3000/Songs/Alag%20Aasman.mp3": "http://127.0.0.1:3000/Cover/alag%20aasman.jpg",
    "http://127.0.0.1:3000/Songs/Charkha.mp3": "http://127.0.0.1:3000/Cover/Charka.webp",
    "http://127.0.0.1:3000/Songs/Choo%20Lo.mp3": "http://127.0.0.1:3000/Cover/Choo%20Lo.jpg",
    "http://127.0.0.1:3000/Songs/Co2.mp3": "http://127.0.0.1:3000/Cover/Co2.jpg",
    "http://127.0.0.1:3000/Songs/Euphoria.mp3": "http://127.0.0.1:3000/Cover/Euphoria.jpg",
    "http://127.0.0.1:3000/Songs/I%20Wonder.mp3": "http://127.0.0.1:3000/Cover/I%20wonder.jpg",
    "http://127.0.0.1:3000/Songs/MY%20EYES.mp3": "http://127.0.0.1:3000/Cover/My%20Eyes.jpg",
    "http://127.0.0.1:3000/Songs/Runaway.mp3": "http://127.0.0.1:3000/Cover/Runaway.jpg",
    "http://127.0.0.1:3000/Songs/Starboy.mp3": "http://127.0.0.1:3000/Cover/Starboy.jpg",
    "http://127.0.0.1:3000/Songs/Tum%20Hi%20Ho.mp3": "http://127.0.0.1:3000/Cover/Tum%20hi%20ho.jpg"
};

const songArtistMap = {
    "http://127.0.0.1:3000/Songs/Alag%20Aasman.mp3": "Anuv Jain",
    "http://127.0.0.1:3000/Songs/Charkha.mp3": "Mukhtar Sahota",
    "http://127.0.0.1:3000/Songs/Choo%20Lo.mp3": "The Local Train",
    "http://127.0.0.1:3000/Songs/Co2.mp3": "Prateek Kuhad",
    "http://127.0.0.1:3000/Songs/Euphoria.mp3": "Kendrick Lamar",
    "http://127.0.0.1:3000/Songs/I%20Wonder.mp3": "Kanye West",
    "http://127.0.0.1:3000/Songs/MY%20EYES.mp3": "Travis Scott", 
    "http://127.0.0.1:3000/Songs/Runaway.mp3": "Kanye West",
    "http://127.0.0.1:3000/Songs/Starboy.mp3": "The Weeknd",
    "http://127.0.0.1:3000/Songs/Tum%20Hi%20Ho.mp3": "Mithoon, Arijit Singh"
};

let songindex = 0;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00"; // Handle invalid or negative input

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad minutes and seconds with leading zeros if needed
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function fetchsongs() {
    let a = await fetch("../Songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}


let audio

const playmusic = (track, pause = false) => {

    if (audio) {
        audio.pause()
    }

    audio = new Audio(track);

    if (!pause) {
        audio.play();
        play.src = "../SVG/pause.svg";

    }

    document.querySelector(".info").innerHTML = track.split("/").pop().replace(".mp3", "").replaceAll("%20", " ") + " - " + songArtistMap[track]
    document.querySelector(".duration").innerHTML = "00:00 / 00:00"
    document.querySelector(".cov").innerHTML = `<img src="${songCoverMap[track]}" alt=""></img>`

    audio.addEventListener("timeupdate", () => {
        console.log(audio.currentTime, audio.duration)
        document.querySelector(".duration").innerHTML = `${formatTime(audio.currentTime)}/${formatTime(audio.duration)}`
        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 50 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 50
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 50 + "%"
        audio.currentTime = (audio.duration * percent) / 50
    })




    next.addEventListener("click", () => {
        console.log("prev was clicked")
    })

}






async function main() {
    let songs = await fetchsongs();
    playmusic(songs[5], true)
    songindex = 5;

    let songcard = document.querySelector(".songs")
    console.log(songcard)




    for (const song of songs) {
        const songName = song.split("/").pop().replaceAll("%20", " ").replace(".mp3", "");
        const coverImage = songCoverMap[song]
        const artist = songArtistMap[song]
        songcard.innerHTML = songcard.innerHTML +
            `<div class="card">
                    <img class="songimg" src="${coverImage}" alt="">
                    <h3>&nbsp&nbsp${songName}</h3>
                    <h4>&nbsp;&nbsp${artist}</h4>
            </div>`
    }



    Array.from(document.querySelectorAll(".card")).forEach((e, index) => {
        e.addEventListener("click", () => {
            const songName = e.getElementsByTagName("h3")[0].textContent.trim()
            const encode = encodeURIComponent(songName)
            const track = songs.find((song) => song.includes(encode));
            if (track) {
                playmusic(track)
                songindex = index;
            }
        })
    });


    prev.addEventListener("click", () => {
        if (songindex > 0) {
            songindex--;
            playmusic(songs[songindex]);
        }
    });

    next.addEventListener("click", () => {
        if (songindex < songs.length -1) {
            songindex++;
            playmusic(songs[songindex])
        }
    })


    let play = document.querySelector("#play")
    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play()
            play.src = "../SVG/pause.svg";

        }

        else {
            audio.pause()
            play.src = "../SVG/play.svg";

        }
    })



}

main();

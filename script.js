let CurrentSong=new Audio();
async function getSongs(){

    let a=await fetch("http://127.0.0.1:5500/songs")
    let responce=await a.text()
    // console.log(responce)
    let div=document.createElement("div")
    div.innerHTML=responce
    let as=div.getElementsByTagName("a")
    // console.log(as)

    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
        
    }
    return songs
}
getSongs()

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/" +track)
    CurrentSong.src="/songs/"+track
    if(!pause){

        CurrentSong.play()
        play.src="pause.svg"
        
    }

    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"

}

async function main(){

   

    let songs= await getSongs()
    // console.log(songs)
    playMusic(songs[0],true)

    let songUl=document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML + `<li>
         <img class="invert" src="music.svg" alt="">
                      <div class="info">
                        <div>${song.replaceAll("%20"," ")} </div>
                        <div>Arjit Singh</div>
                      </div>
                      <div class="playnow">
                        <span>Play Now</span>

                        <img class="invert" src="play.svg" alt="">
                      </div>
                
        
        </li>`
        
    }
    
    //Ataach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",()=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    //Attach event listener to next and previous song
    play.addEventListener("click",()=>{
        if(CurrentSong.paused){
            CurrentSong.play()
            play.src="pause.svg"
        }
        else{
            CurrentSong.pause()
            play.src="play.svg"
        }
    })

    // // play first song
    // var audio = new Audio(songs[1])
    // audio.play()

    // audio.addEventListener("loadeddata",() => { 
       
    //     console.log(audio.duration,audio.currentSrc,audio.currentTime)
    //  })


    //listen for timeupdate event
    CurrentSong.addEventListener("timeupdate",()=>{
        console.log(CurrentSong.currentTime,CurrentSong.duration)
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(CurrentSong.currentTime)}/${secondsToMinutesSeconds(CurrentSong.duration)}`

        document.querySelector(".circle").style.left=(CurrentSong.currentTime/CurrentSong.duration)*100+"%";
    })

    //Add eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width/2) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        CurrentSong.currentTime = ((CurrentSong.duration) * percent) / 100
    })

}
main()

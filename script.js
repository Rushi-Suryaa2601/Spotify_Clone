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

const playMusic=(track)=>{
    // let audio=new Audio("/songs/" +track)
    CurrentSong.src="/songs/"+track

    CurrentSong.play()
    play.src="pause.svg"
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00:00/00:00"

}

async function main(){

   

    let songs= await getSongs()
    console.log(songs)

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

}
main()

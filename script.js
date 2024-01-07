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

    // play first song
    var audio = new Audio(songs[1])
    audio.play()

    audio.addEventListener("loadeddata",() => { 
       
        console.log(audio.duration,audio.currentSrc,audio.currentTime)
     })
}
main()

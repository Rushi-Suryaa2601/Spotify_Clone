let CurrentSong=new Audio();
let songs;
let currFolder;
if (document.body.clientWidth < 1920) {
    viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=device-width, initial-scale=0.67, user-scalable=0');
  }
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

async function getSongs(folder){
    currFolder=folder;
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`)
    let responce=await a.text()
    // console.log(responce)
    let div=document.createElement("div")
    div.innerHTML=responce
    let as=div.getElementsByTagName("a")
    // console.log(as)

    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
    

    //show all songs in playlist
    let songUl=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML=""
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
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs
}
// getSongs()


const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/" +track)
    CurrentSong.src=`/${currFolder}/`+track
    if(!pause){

        CurrentSong.play()
        play.src="pause.svg"
        
    }

    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"

}

async function displayAlbum(){
    let a=await fetch(`http://127.0.0.1:5500/songs/`)
   let responce=await a.text()
   let div=document.createElement("div")
//    console.log(div)
   div.innerHTML=responce
   let anchors= div.getElementsByTagName("a")
   let cardcontainer=document.querySelector(".cardcontainer")
   let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
    // console.log(e.href)
    if(e.href.includes("/songs/")){
        let folder=(e.href.split("/").slice(-2)[1])

        //get the metadata of folder
        let a=await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
        let responce=await a.json()
        console.log(responce)
        cardcontainer.innerHTML=cardcontainer.innerHTML + ` <div data-folder="${folder}"  class="card">
        <div class="play">
            <button class="circular-button">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.1531 12.3948C15.0016 13.0215 14.2857 13.4644 12.8539 14.3502C11.4697 15.2064 10.7777 15.6346 10.2199 15.4625C9.98931 15.3913 9.77931 15.2562 9.60982 15.07C9.2 14.6198 9.2 13.7465 9.2 12C9.2 10.2535 9.2 9.38018 9.60982 8.92995C9.77931 8.74381 9.98931 8.60868 10.2199 8.53753C10.7777 8.36544 11.4697 8.79357 12.8539 9.64983C14.2857 10.5356 15.0016 10.9785 15.1531 11.6052C15.2156 11.8639 15.2156 12.1361 15.1531 12.3948Z" fill="black" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                 
              </button>
                
        </div>
         <img src="/songs/${folder}/cover.jpg" alt="">
         <h2>${responce.title}</h2>
         <p>${responce.description}</p>
     </div>`
    }
    
   
   }
     //when the card is clicked it load the folder
     Array.from(document.getElementsByClassName("card")).forEach(e => {
            
        e.addEventListener("click", async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        })
        
    })
  
}

async function main(){

   //display all album on the page
   displayAlbum()

     await getSongs("songs/ncs")
    // console.log(songs)
    playMusic(songs[0],true)

  

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
        // console.log(CurrentSong.currentTime,CurrentSong.duration)
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(CurrentSong.currentTime)}/${secondsToMinutesSeconds(CurrentSong.duration)}`

        document.querySelector(".circle").style.left=(CurrentSong.currentTime/CurrentSong.duration)*100+"%";
    })

    //Add eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width/2) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        CurrentSong.currentTime = ((CurrentSong.duration) * percent) / 100
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",() => { 
        document.querySelector(".left").style.left="0"
     })
    
     //Add an event listener for hamburger
     document.querySelector(".Close").addEventListener("click",() => { 
        document.querySelector(".left").style.left="-250%"
      })
    
      //Add an event listener for previus and next
      previous.addEventListener("click",() => { 
        //   console.log("previous clicked")
          let index=songs.indexOf(CurrentSong.src.split("/").slice(-1)[0])
        
        // console.log(songs,index)
        if((index-1)>=0){
            playMusic(songs[index-1])
    
        }
        
        })
    
        //Add an event listener for previus and next
      next.addEventListener("click",() => { 
        // console.log(CurrentSong.src)
        CurrentSong.pause()
        // console.log("next clicked")
        let index=songs.indexOf(CurrentSong.src.split("/").slice(-1)[0])
        
        // console.log(songs,index)
        if((index+1)<songs.length){
            playMusic(songs[index+1])
    
        }
       })

       //Add an Event to Volume
       document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e) => {
        // console.log(e,e.target.value)     
        CurrentSong.volume=parseInt(e.target.value)/100
        })

        //add eventlistener to mute the tag
        document.querySelector(".volume>img").addEventListener("click",(e) => { 
            if(e.target.src.includes("volume.svg"))
            {
                e.target.src=e.target.src.replace("volume.svg","mute.svg")
                CurrentSong.volume=0
                document.querySelector(".range").getElementsByTagName("input")[0].value=0
            }
            else{
                e.target.src=e.target.src.replace("mute.svg","volume.svg")
                CurrentSong.volume=.10
                document.querySelector(".range").getElementsByTagName("input")[0].value=10
            }
         })
        
      

}
main()




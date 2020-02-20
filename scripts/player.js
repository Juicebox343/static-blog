var supportsAudio = !!document.createElement('audio').canPlayType;

const feedUrl = "https://tandemlegends.libsyn.com/rss";

let epCount = 0;
const episodeData = [];

fetch(feedUrl).then((res) => {
    res.text().then((xmlTxt) => {
        const domParser = new DOMParser()
        const doc = domParser.parseFromString(xmlTxt, 'text/xml')
        doc.querySelectorAll('item').forEach((item) => {
            titleEpisode = item.querySelector('title').textContent;
            urlEpisode = item.querySelector('link').textContent;
            descEpisode = item.querySelector('description').textContent;
            episodeData[epCount] = {title: titleEpisode, url: urlEpisode, desc: descEpisode};
            epCount++;
          
        })
        appendPlayer(episodeData);
    })
})

function appendPlayer(episode){
    const playerHTML = `      <figure id="player">
                                <div id="player-controls" class="controls player-controls" data-state="hidden">
                                    
                                    <button id="playpause" class="play-pause" type="button" data-state="play"></button>
                                    
                                    <p class="episode-title">${episode[0].title}</p>
                                    
                                    <div class="player-progress">
                                        <progress id="progress-data" class="progress-data"value="0" min="0" max="">
                                            <span id="progress-bar" class="progress-bar"></span>
                                        </progress>
                                    </div>
                                   
                                    <div class="timing">
                                        <span id="currentTime">00:00:00</span>
                                        <span id="totalTime">00:00:00</span>
                                    </div>

                                    <div class="playback-modifiers">
                                        <button type="button" id="back15"></button>
                                        <button type="button" class="speedChange" data-state="1.0">x1.0</button>
                                        <button type="button" class="speedChange" data-state="1.25">x1.25</button>
                                        <button type="button" class="speedChange" data-state="1.50">x1.5</button>
                                        <button type="button" id="forward15"></button>
                                    </div>
                                    
                                    <div class="volume-controls">
                                        <span id="volume-bar" class="volume-bar">
                                            <span id="volume-fill" class="volume-fill" value="80" min="0" max="100"></span>
                                        </span>
                                        <button id="muteUnmute" class="muteUnmute type="button" data-state="unMute"></button>
                                    </div>

                                </div> 
                                
                                <audio id="audio" preload='metadata' src="${episode[0].url}">Your browser does not support the <code>audio</code> element this player depends on.</code></audio>
                            
                            </figure>`
                        
        const episodeWrapper = document.createElement('div');
        episodeWrapper.setAttribute('class', 'audioPlayer');
        episodeWrapper.innerHTML = playerHTML;
        document.body.querySelector('.player').appendChild(episodeWrapper);
        
        audioInit();

    }

function audioInit(){
    const audio = document.querySelector('#audio');

    const playpause = document.querySelector('#playpause')
    const playerControls = document.querySelector('#player-controls');
    const progress = document.querySelector('#progress-data');
    const progressBar = document.querySelector('#progress-bar');
    const mute = document.querySelector('#muteUnmute');
    const currentTime = document.querySelector('#currentTime');
    const totalTime = document.querySelector('#totalTime');
    const volumeBar = document.querySelector('#volume-bar');
    const volumeFill = document.querySelector('#volume-fill');
    const back15 = document.querySelector('#back15');
    const forward15 = document.querySelector('#forward15');
    const speedButtons = document.querySelectorAll('.speedChange');

    if (supportsAudio) {
        playerControls.setAttribute('data-state', 'visible');
        if(!isNaN(audio.duration)){ //firefox and chrome seem to have different expectations on when to load metadata
            durationCalc(audio.duration, totalTime);
            totalTime.innerText = newTime;
        }
    }
    
    const supportsProgress = (document.createElement('progress').max !== undefined);
    
    if (!supportsProgress) progress.setAttribute('data-state', 'fake');
        audio.addEventListener('loadedmetadata', function() {
        progress.setAttribute('max', audio.duration);
        if(!isNaN(audio.duration)){//firefox and chrome seem to have different expectations on when to load metadata
            durationCalc(audio.duration, totalTime);
            totalTime.innerText = newTime;
        }
    });

    audio.addEventListener('play', function(){
        changeButtonState('playpause');
    }, false);
    
    audio.addEventListener('pause', function(){
        changeButtonState('playpause');
    }, false);
    
    mute.addEventListener('click', function(e){
        audio.muted = !audio.muted;
        changeButtonState('mute');
    });
    
    playpause.addEventListener('click', function(e) {
        if (audio.paused || audio.ended) audio.play();
        else audio.pause();
     });

    back15.addEventListener('click', function(){
        audio.currentTime = audio.currentTime - 15;
    });

    forward15.addEventListener('click', function(){
        audio.currentTime = audio.currentTime + 15;
    });
    
     progress.addEventListener('click', function(e) {
        let pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
        audio.currentTime = pos * audio.duration;
     });
    
     audio.addEventListener('timeupdate', function() {
        let hour = Math.floor(audio.currentTime/3600);
        let minute = Math.floor(audio.currentTime % 3600 / 60);
        let second = Math.floor(audio.currentTime % 3600 % 60);
        
        progress.value = audio.currentTime;
        progressBar.style.width = Math.floor((audio.currentTime / audio.duration) * 100) + '%';
        
        if(hour < 10){
            hour = '0' + hour;
        }
        
        if (minute < 10){
            minute = '0' + minute;
        } 
        
        if (second < 10){
            second = '0' + second;
        }
        currentTime.textContent = hour + ':' + minute + ':' + second;
     });
    
     audio.addEventListener('timeupdate', function() {
        if (!progress.getAttribute('max')) progress.setAttribute('max', audio.duration);
        progress.value = audio.currentTime;
        progressBar.style.width = Math.floor((audio.currentTime / audio.duration) * 100) + '%';
     });
    
     volumeBar.addEventListener('click', function(e) {
        let pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
        audio.volume = pos;
        volumeFill.style.width = Math.floor(audio.volume * 100) + '%';
        volumeFill.setAttribute('value',  Math.floor(audio.volume * 100))
     });

     speedButtons.forEach(function(element){
         element.addEventListener('click', setSpeed);
     });
    
     const changeButtonState = function(type){
        //play/pause
        if(type == 'playpause'){
            if(audio.paused || audio.ended){
                playpause.setAttribute('data-state', 'play');
            } else {
                playpause.setAttribute('data-state', 'pause');
            }
        }
        //mute/unmute
        else if(type =='mute'){
            if(audio.muted){
                mute.setAttribute('data-state', 'mute');
                volumeFill.style.width = 0 + '%';
            } else {
                mute.setAttribute('data-state', 'unMute');
                volumeFill.style.width = Math.floor(audio.volume * 100) + '%';
            }
        }
    }
}

function setSpeed(){
    const whichBtn = this.getAttribute('data-state');
    switch(whichBtn){
        case '1.0': 
            audio.playbackRate = 1.0;
        break;
        case '1.25':
            audio.playbackRate = 1.25;
        break;
        case '1.50':
            audio.playbackRate = 1.50;
        break;
        default:
            console.log('oh fuck');
    }
}
        
function durationCalc(duration){
    let hourTotal = Math.floor(duration/3600);
    let minuteTotal = Math.floor(duration % 3600 / 60);
    let secondTotal = Math.floor(duration % 3600 % 60);

    if(hourTotal < 10){
        hourTotal = '0' + hourTotal;
    }
    
    if (minuteTotal < 10){
        minuteTotal = '0' + minuteTotal;
    } 
    
    if (secondTotal < 10){
        secondTotal = '0' + secondTotal;
    }
    return newTime = hourTotal + ':' + minuteTotal + ':' + secondTotal;
}


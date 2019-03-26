$(function(){
    let id = parseInt(location.search.match(/\bid=([^&]*)/)[1])

    $.get('./songs.json').then((response)=>{
        let songs = response
        let song = songs.filter(s => s.id === id)[0]
        let {url, name, lyric} = song
        initPlayer.call(undefined, url)
        initText(name, lyric)
    })

    function parseLyric(lyric){
        let array = lyric.split('\n')
        let regex = /^\[(.+)\](.*)$/
        array = array.map(function(string){
            let matches = string.match(regex)
            if(matches){
                if(matches[2] === '') 
                  return
                else
                  return {time: matches[1], words:matches[2]}
            }
        })
        array.map((object)=>{
            let $p = $('<p/>')
            if(!object)return
            $p.attr('data-time', object.time).text(object.words).appendTo('.lines')
        })
    }
    function initText(name, lyric){
        $('.song-description > h1').text(name)
        parseLyric(lyric)
    }
    function initPlayer(url){
        let audio = document.createElement('audio')
        audio.src = url
        audio.oncanplay = function(){
            audio.play()
        }
        $('img.cover').on('click', ()=>{
            audio.pause()
            $('.disc-container').removeClass('playing')   
            $('.disc-container .light').addClass('pause') 
            $('.disc-container .cover').addClass('pause') 
        })
        $('.icon-wrapper').on('click', ()=>{
            audio.play()
            $('.disc-container').addClass('playing')    
            $('.disc-container .light').removeClass('pause') 
            $('.disc-container .cover').removeClass('pause') 
        })

        setInterval(()=>{
            let seconds = audio.currentTime 
            let minutes = ~~(seconds / 60)
            let left = seconds - minutes * 60
            let time = `${pad(minutes)}:${pad(left)}`
            let $lines = $('.lines > p')
            let $whichLine
            for(let i=0; i<$lines.length; i++){
                if($lines.eq(i+1).length !== 0 && $lines.eq(i).attr('data-time') < time && $lines.eq(i+1).attr('data-time') > time){
                    $whichLine = $lines.eq(i)
                    break
                }
            }
            if($whichLine){
                $whichLine.addClass('active').prev().removeClass('active')
                let top = $whichLine.next().offset().top
                let linesTop = $('.lines').offset().top
                let delta = top - linesTop - $('.lyric').height()/2
                $('.lines').css('transform', `translateY(-${delta}px)`)
            }
        },100)
    }
    function pad(number){
        return number>=10 ? number+'' :'0'+number
    }
})
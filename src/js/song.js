$(function(){
    let id = parseInt(location.search.match(/\bid=([^&]*)/)[1])

    $.get('./songs.json').then((response)=>{
        let songs = response
        let song = songs.filter(s => s.id === id)[0]
        let {url} = song
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
    })
    $.get('./lyric/xiaochou.json').then(function(object){
        let {lyric} = object
        let array = lyric.split('\n')

        let regex = /^\[(.+)\](.*)$/
        array = array.map(function(string){
            let matches = string.match(regex)
            if(matches){
                return {time: matches[1], words:matches[2]}
            }
        })
        array.map((object)=>{
            let $p = $('<p/>')
            if(!object)return
            $p.attr('data-time', object.time).text(object.words).appendTo('.lines')
        })
    })
})
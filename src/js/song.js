$(function(){
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

    let audio = document.createElement('audio')
    audio.src = "http://isure.stream.qqmusic.qq.com/C400001luHbo2nQT1Y.m4a?guid=8559318062&vkey=7561EC0BE0FE9F8EC2D4C3D312B1ECB1FAC7E8D521B465461FE852D48A986DF525B65700E35B7012D77E1FFECFF557F6DE6D418C0811BDA2&uin=0&fromtag=66"
    setTimeout(() => {
        $('.icon-wrapper').addClass('active')
    }, 1000);
    audio.oncanplay = function(){
        audio.play()
        $('.disc-container').addClass('playing')
    }
    $('.icon-pause').on('click', ()=>{
        audio.pause()
        $('.disc-container').removeClass('playing')   
        $('.disc-container .light').addClass('pause') 
        $('.disc-container .cover').addClass('pause') 
    })
    $('.icon-play').on('click', ()=>{
        audio.play()
        $('.disc-container').addClass('playing')    
        $('.disc-container .light').removeClass('pause') 
        $('.disc-container .cover').removeClass('pause') 
    })
})
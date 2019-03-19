$(function(){
    $.get('./lyric/xiaochou.json').then(function(object){
        let {lyric} = object
        
        console.log(lyric.split('\n'))
    })
})
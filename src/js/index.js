$(function () {
    $.get('./songs.json').then((response) => {
        let items = response
        items.map((i) => {
            let $li = $(`
                <li>
                    <a href="./song.html?id=${i.id}">
                        <h3>${i.name}</h3>
                        <p><i class="sq-img"></i>${i.singer}-${i.Album}</p>
                        <svg class="icon" aria-hidden="true">
                            <use xlink: href='#icon-play-circle-outline'>
                            </use>
                        </svg>
                     </a>
                </li>
                `)
            $('#latestMusic').append($li)
        })
        $('#latestMusic-loading').remove()
    })

    $('.siteNav').on('click', 'ol.tabItems>li', function (e) {
        let $li = $(e.currentTarget).addClass('active')
        $li.siblings().removeClass('active')
        let index = $li.index()
        $li.trigger('tabChange', index)
        $('.tabContent > li').eq(index).addClass('active').siblings().removeClass('active')

    })

    $('.siteNav').on('tabChange', function (e, index) {
        let $li = $('.tabContent > li').eq(index)
        if ($li.attr('data-downloaded') === 'yes') {
            return
        }
        if (index === 1) {
            $.get('./page2.json').then((response) => {
                $('#tab2-loading').remove()
                $li.text(response.content)
                $li.attr('data-downloaded', 'yes')
            })
        }else{
            $li.attr('data-downloaded', 'yes')
            $('#tab3-loading').remove()    
            $('#tab2-loading').remove()        
        }
    })

    let timer =undefined
    $('input#searchSong').on('input', (e)=>{
        let $input = $(e.currentTarget)
        let value = $input.val().trim()
        if(value === ''){return}
        if(timer){clearTimeout(timer)}
        timer = setTimeout(()=>{
            search(value).then((result)=>{
                timer = undefined
                console.log(result)
                if(result.length !== 0){
                    $('#output').text(result.map((item)=>item.name).join(','))
                }else{
                    $('#output').text('没有结果')                
                }
            })
        },300)
      
    })

    function search(keyword) {
        return new Promise((resolve, reject)=>{
            var database = [
                {
                    "id": 1,
                    "name": "绿色"
                },
                {
                    "id": 2,
                    "name": "全球变冷"
                },
                {
                    "id": 3,
                    "name": "手写的从前"
                },
                {
                    "id": 4,
                    "name": "告白气球"
                },
                {
                    "id": 5,
                    "name": "发如雪"
                }
            ]
            let result = database.filter(function(item){
                return item.name.indexOf(keyword)>=0
            })
            resolve(result)/*  返回的promise里必须写resolve，外面的then才会链式调用   */
        })
    }
})


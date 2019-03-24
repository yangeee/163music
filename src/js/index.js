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
})


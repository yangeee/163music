{
    let view = {
        el: 'aside > .songList',
        template: `
        <div class="songList-wrapper">
         </div>
        `,
        render(data) {
            $(this.el).html(this.template)
            let { songs } = data
            let liList = songs.map((songs) =>
                $('<li></li>').text(songs.name).attr('data-id', songs.id)
            )
            $(this.el).find('div.songList-wrapper').empty()
            liList.map((domLi) => {
                $(this.el).find('div.songList-wrapper').append(domLi)
            })
        },
        clearActive() {
            $(this.el).find(".active").removeClass('active')
        },
        activeItem(target) {
            let $li = $(target)
            $li.addClass('active').siblings('.active').removeClass('active')
        }

    }
    let model = {
        data: {
            songs: [

            ]
        },
        find() {
            var query = new AV.Query('PlayList')
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
                })
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-id')
                let data = {}
                let songs = this.model.data.songs
                for(let i=0; i<songs.length; i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                        break
                    }
                }
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventHub() {
            window.eventHub.on('new', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (data) => {
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('update', (song)=>{
                let songs = this.model.data.songs
                for(let i=0; i<songs.length; i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })
        },
        getAllSongs() {
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}
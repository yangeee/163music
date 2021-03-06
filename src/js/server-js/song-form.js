{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form action="" class="form">
                <div class="row">
                    <label for="">
                        歌名                       
                    </label>
                    <input type="text" name="name" value="__name__">
                </div>
                <div class="row">
                    <label for="">
                        歌手   
                    </label>
                    <input type="text" name="singer" value="__singer__">
                </div>   
                <div class="row">
                    <label for="">
                        外链
                    </label>
                    <input type="text" name="url" value="__url__">
                </div>  
                <div class="row actions">
                        <button type='submit'>保存</button>
                </div>
            </form>
        `,
        render(data = {}) {
            let placeHolders = ['name', 'singer', 'url', 'id']
            let html = this.template
            placeHolders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', id: ''
        },
        create(data) {
            var Song = AV.Object.extend('PlayList');
            var song = new Song();
            return song.save({
                name: data.name,
                singer: data.singer,
                url: data.url,
                id: data.id
            }).then((newSong) => {
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })
            })
        },
        update(data){
            let song = AV.Object.createWithoutData('PlayList', this.data.id)
            song.set('name', data.name)
            song.set('url', data.url)
            song.set('singer', data.singer)
            return song.save().then((response)=>{
                Object.assign(this.data, data)
                return response
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.bindEventHub()
            this.view.render(this.model.data)

        },
        create(){
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(() => {
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create', object)
                })
        },
        update(){
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)
              .then(()=>{
                  window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
              })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                if(this.model.data.id){
                    this.update()
                }else{
                    this.create()
                }
            })
        },
        bindEventHub() {
            window.eventHub.on('new', (data) => {
                if(this.model.data.id){
                    this.model.data = {
                        name: '', url: '', singer: '', id: ''
                    }
                }else{
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)

            })
        }
    }
    controller.init(view, model)
}
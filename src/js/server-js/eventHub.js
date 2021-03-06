window.eventHub = {
    events: {

    },
    emit(eventname, data) { //发布
        for (let key in this.events) {
            if (key === eventname) {
                this.events[key].map((fn) => {
                    fn.call(undefined, data)
                })
            }
        }
    },
    on(eventname, fn) { //订阅,创建一个事件，并且准备处理
        if (this.events[eventname] === undefined) {
            this.events[eventname] = []
        }
        this.events[eventname].push(fn)
    },
    off() {

    }
}
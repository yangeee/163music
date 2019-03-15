{   
    let view = {
        el: '.uploadArea',
        find(selector){
            return $(this.el).find(selector)[0]
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.qiniuInit()
        },
        qiniuInit(){
            return uploader = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: this.view.find('.pickfiles'),       //上传选择的点选按钮，**必需**
                uptoken_url: "http://localhost:8888/uptoken",            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                // uptoken : '', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                domain: 'poapwo9ks.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需** http://qiniu-plupload.qiniudn.com/
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '100mb',           //最大文件体积限制
                max_retries: 3,                   //上传失败最大重试次数
                dragdrop: true,                   //开启可拖曳上传
                drop_element: this.view.find('#yyy'),        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情
                        $(".status").text('上传中')
                    },
                    'FileUploaded': function (up, file, info) {
                        $(".status").text('上传完毕')
                        setTimeout(() => {
                            $(".status").text('准备上传')
                        }, 2000);

                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = 'http://' + domain + + '/' + encodeURIComponent(response.key); //获取上传成功后的文件的Url
                        window.eventHub.emit('upload', {
                            link: sourceLink,
                            key: response.key
                        })

                    },
                    'Error': function (up, err, errTip) {
                        console.log(err)
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
                    }

                }
            });
        }
    }
    controller.init(view, model)
}
require.undef('yyz_widgets');

define('yyz_widgets', ["@jupyter-widgets/base"], function(widgets) {

    return {
        FileBrowser: widgets.DOMWidgetView.extend({
            // Render the view.
            render: function() {
                this.select = document.createElement("select")
                this.select.style = 'width: 300px; height: 178px;'
                this.select.size = 10
                this.el.appendChild(this.select)
                
                this.base_path = '/api/contents' // Jupyter API base path
                this.sync_options(this.base_path)
                
                let that = this
                
                this.select.ondblclick = function(){
                    //console.log(this.selectedIndex)
                    let option_dict = that.content[this.selectedIndex]
                    if (option_dict['type'] == 'directory'){
                        let path
                        if (option_dict['name'] == '..'){
                            let sl = that.current_path.split('/')
                            sl.pop()
                            path = sl.join('/')
                            //console.log(sl, path)
                        }else{
                            path = that.base_path + '/' + option_dict['path']
                        }
                        that.sync_options(path)
                    } else{
                        that.file_dblclick_handler(this.selectedIndex)
                    }
                }
            },
            
            sync_options: async function (path){
                // console.log("fetch", path)
                this.current_path = path
                
                let resp = await fetch(path)
                let resp_json = await resp.json()
                
                resp_json['content'].sort(this.sort_compare)
                this.content = resp_json['content']
                
                //console.log(this.current_path, this.base_path)
                if (this.current_path != this.base_path){
                    this.content.unshift({type: 'directory', name: '..'})
                }
                
                this.select.innerHTML = ''
                for (let option_dict of this.content){
                    let option = document.createElement("option")
                    name = option_dict['name']
                    console.log(option_dict)
                    if (option_dict['type'] == "directory"){
                        name = "📁" + name
                    }
                    option.innerHTML = name
                    this.select.appendChild(option)
                }
            },
            
            sort_compare: function(x, y){
                if ((x['type'] == 'directory') & (y['type'] != 'directory')){
                    return -1
                }else if ((x['type'] != 'directory') & (y['type'] == 'directory')){
                    return 1
                }
                
                if (x['name'] == y['name']){
                    return 0;
                }
                return x['name'] > y['name'] ? 1 : -1;
            },
            
            get_option_dict: function(){
                return this.select[this.selectedIndex]
            },
            
            file_dblclick_handler: function(selectedIndex){
                let option_dict = this.content[selectedIndex]
                console.log("file_dblclick_handler:", option_dict)
                
                this.model.set('path', option_dict['path'])
                this.model.save_changes()
            }
        })
    };
});

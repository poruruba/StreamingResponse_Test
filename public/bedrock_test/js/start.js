'use strict';

//const vConsole = new VConsole();
//const remoteConsole = new RemoteConsole("http://[remote server]/logio-post");
//window.datgui = new dat.GUI();

const base_url = "";

var vue_options = {
    el: "#top",
    mixins: [mixins_bootstrap],
    store: vue_store,
    router: vue_router,
    data: {
        response: '',
    },
    computed: {
    },
    methods: {
        bedrock_generate: async function(){
            this.response = '';
            var input = {
                url: base_url + "/bedrock-generate",
                response_type: "reader",
                method: "GET"
            };
            var reader = await do_http(input);
            console.log(reader);

            const decoder = new TextDecoder();
            let buffer = '';

            const readChunk = ({ done, value } ) =>{
                if( done ){
                    this.toast_show("読み込み完了");
                    return;
                }
                console.log(decoder.decode(value));

                buffer += decoder.decode(value, { stream: true });
                let lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    try{
                        if (line.trim()){
                            const obj = JSON.parse(line);
                            if( obj.contentBlockDelta )
                                this.response += obj.contentBlockDelta?.delta.text;
                        }
                    }catch(e){}
                }
                reader.read().then(readChunk);            
            };
            reader.read().then(readChunk);            
        },
    },
    created: function(){
    },
    mounted: function(){
        proc_load();
    }
};
vue_add_data(vue_options, { progress_title: '' }); // for progress-dialog
vue_add_global_components(components_bootstrap);
vue_add_global_components(components_utils);

/* add additional components */
  
window.vue = new Vue( vue_options );

Vue.use(editable,{
    css: {
        input: "form-control vue-editable-input-width",
        hidden: "vue-editable-hidden",
        editable: "vue-editable-can-edit" 
    }
});
app = new Vue({
    el: '.vue',
    data: {
        message: 'You can change this value',
        frank: 1000,
        susanne: 1000,
        number: 244,
        nested:{
            obj:{
                message: 'nested Information'
            }
        },
        table: [
            500,
            600
        ],
        staff: [
            {
                "name":"Frank",
                "income":1000,
                "car":true
            },{
                "name":"Susanne",
                "income":1000,
                "car":false
            }
        ]
    }
});
app.$on("editable-changed",function(e){
    console.log(e);
});

app.$on("editable-opened",function(e){
    console.log(e);
});

app.$on("editable-aborted",function(e){
    console.log(e);
});

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
                "income":1000
            },{
                "name":"Susanne",
                "income":1000
            }
        ]
    }
});
editable.parent = app;
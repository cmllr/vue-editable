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
        }
    }
});
editable.parent = app;
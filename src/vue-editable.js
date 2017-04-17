const editable = {
    openInput: null,
    parent: null,
    install: function(vue,options){
        var _t = this;
        console.log("vue-editable loaded");
        Vue.directive('editable', {
            inserted: function (el, binding, vnode, oldVnod) {
                var property = binding.expression;   
                var type = el.getAttribute("data-type") === null ? 'text' : el.getAttribute("data-type");
                var attributes = {};
                if (el.attributes.length > 0){
                    for (var attr in Object.keys(el.attributes)){                        
                        var attrName = el.attributes[attr].name;
                        if (attrName.indexOf("data-") !== -1){
                            var attrValue = el.attributes[attr].value;
                            attributes[attrName.replace("data-","")] = attrValue;
                        }
                    }
                }
                el.onclick= function(){
                   _t.getInput(el,property,attributes);
                }
                el.setAttribute("class",el.getAttribute("class") !== null ?  + el.getAttribute("class") + "vue-editable-can-edit" : "vue-editable-can-edit");
            }
        });
    },
    getInput: function(el,property,attributes){
        if (editable.openInput === null){
            editable.openInput = el;

            var c = el.getAttribute("class") !== null ? el.getAttribute("class") : "";
            c += " vue-editable-hidden";

            el.setAttribute("class",c);

            var input =  document.createElement("input");
            for(var attr in attributes){                
                input.setAttribute(attr,attributes[attr]);
            }
            input.setAttribute("class","vue-editable-input");
            input.setAttribute("id","jfksafjlasjl");
            input.setAttribute("v-editable-target",property);
            if (el.getAttribute("data-index") !== null){
                input.setAttribute("data-index",el.getAttribute("data-index"));
            }  
            var value = this.getPropertyValue(property,el.getAttribute("data-index"));            
            if (el.getAttribute("data-property") !== null){
                input.setAttribute("data-property",el.getAttribute("data-property"));
                input.value = value[el.getAttribute("data-property")];
            }else{
                input.value = value;
            }
          
            input.onkeydown = this.rebind;
            el.appendChild(input);
            input.focus();
        }        
    },
    getPropertyValue: function(path,index){
        var response = null;
        if (path.indexOf(".") !== -1){
            var lastObj = this.parent;
            var parts = path.split(".");
            for(var i =0;i< parts.length;i++){
                var part = parts[i];
                if (typeof lastObj[part] !== 'object'){
                   response =  lastObj[part];
                   break;
                }                         
                lastObj =  lastObj[part];    
            }
        }else{
            response = this.parent[path];
        }
        if (index !== null){
            return response[index];
        }
        return response;
    },
    getIndex: function(element){
        return element.getAttribute("data-index") === null ? -1 : parseInt(element.getAttribute("data-index"));
    },
    rebind: function(event){  
        var child = document.getElementById("jfksafjlasjl"); 
        var index = editable.getIndex(event.srcElement);
        if (event.which === 13){          
            var value = child.value;
            var target = child.getAttribute("v-editable-target");
            editable.openInput.removeChild(child);
            if (target.indexOf(".") !== -1){
                var lastObj = editable.parent;
                var parts = target.split(".");
                for(var i =0;i< parts.length;i++){
                    var part = parts[i];
                    if (typeof lastObj[part] !== 'object'){                      
                        lastObj[part] = value;
                        break;
                    }                         
                    lastObj =  lastObj[part];    
                }
            }else{
                if (index !== -1){
                    //An index was forwarded -> the target is an array, maybe iterated via v-for
                    if (child.getAttribute("data-property") !== null){
                        //it is not only an array -> complex objects where iterated
                        var obj = editable.parent[target][index];
                        var prop = child.getAttribute("data-property");
                        //update the affected property only
                        obj[prop] = value;
                        //reinsert the value
                        Vue.set(editable.parent[target],index,obj);
                    }else{
                        //the value is value of an array, but there are no complex members -> update complete value
                        Vue.set(editable.parent[target],index,value);
                    }
                }else{
                    editable.parent[target] = value;
                }               
            }
            editable.openInput.setAttribute("class",editable.openInput.getAttribute("class").replace("vue-editable-hidden","").trim());
            editable.openInput = null;
        }
        if (event.which === 27){
            editable.openInput.removeChild(child);          
        }
    }
};


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(editable)
}
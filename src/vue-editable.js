editable = {
    created: function(){
        console.log(this);
    },
    css:{
        input: "form-control vue-editable-input",
        hidden: "vue-editable-hidden",
        editable: "vue-editable-can-edit" 
    },
    id: "_vue_editable_",
    openInput: null,
    parent: null,
    install: function(vue,options){
        if (typeof options !== 'undefined' && options !== null && typeof options.css !== 'undefined' && options.css !== null){
            this.css = options.css;
        }
        Vue.mixin({
            created: function () {
                // reference the calling vue-instance
                editable.parent = this;
            }
        });
        var _t = this;
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
                el.setAttribute("class",el.getAttribute("class") !== null ?  + el.getAttribute("class") + editable.css.editable : editable.css.editable);                
            }
        });
    },
    getInput: function(el,property,attributes){
        if (editable.openInput === null){
            editable.openInput = el;

            var c = el.getAttribute("class") !== null ? el.getAttribute("class") : "";
            c += " " + editable.css.hidden;

            el.setAttribute("class",c);

            var input =  document.createElement("input");
            for(var attr in attributes){                
                input.setAttribute(attr,attributes[attr]);
            }
            input.setAttribute("class",editable.css.input);
            input.setAttribute("id",this.id);
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
            editable.emitOpenedEvent(el);
            input.focus();
        }        
    },
    convertType: function(oldValue,newValue){
        var isObject = typeof oldValue === 'object';
        if (isObject){
            return newValue;
        }
        var isInt =  Number(oldValue) === oldValue && oldValue % 1 === 0;
        var isFloat =  Number(oldValue) === oldValue && oldValue % 1 !== 0;
        var isBool = oldValue === true || oldValue === false;
        if (isBool){
            return newValue === "true" || newValue === true;
        }
        return isInt ? parseInt(newValue) : (isFloat ? parseFloat(newValue) :newValue);
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
        var child = document.getElementById(this.id); 
        var index = editable.getIndex(event.srcElement);
        if (event.which === 13){          
            var value = child.value;
            var target = child.getAttribute("v-editable-target");
            var oldValue = null;
            var newValue = null;
            var reason = null;
            editable.openInput.removeChild(child);
            if (target.indexOf(".") !== -1){
                var lastObj = editable.parent;
                var parts = target.split(".");
                for(var i =0;i< parts.length;i++){
                    var part = parts[i];
                    if (typeof lastObj[part] !== 'object'){                      
                        oldValue = editable.deref(lastObj);
                        lastObj[part] = editable.convertType(lastObj[part],value);
                        newValue = editable.deref(lastObj);
                        break;
                    }                         
                    lastObj =  lastObj[part];    
                }
                reason = "deep-property";
            }else{
                if (index !== -1){
                    //An index was forwarded -> the target is an array, maybe iterated via v-for
                    if (child.getAttribute("data-property") !== null){
                        //it is not only an array -> complex objects where iterated
                        var obj = editable.parent[target][index];
                        var prop = child.getAttribute("data-property");
                        //update the affected property only
                        oldValue = editable.deref(obj)
                        obj[prop] = editable.convertType(obj[prop],value);
                        newValue = editable.deref(obj);
                        reason = "property-in-array";
                        //reinsert the value
                        Vue.set(editable.parent[target],index,obj);
                    }else{
                        //the value is value of an array, but there are no complex members -> update complete value
                        var oldValue = editable.deref(editable.parent[target][index]);
                        newValue = editable.convertType(oldValue,value);
                        reason = "element-in-array";
                        Vue.set(editable.parent[target],index,newValue);                        
                    }
                }else{
                    oldValue = editable.parent[target];
                    newValue = editable.convertType(editable.parent[target],value);
                    reason = "property";
                    editable.parent[target] = newValue;
                }               
            }
            editable.emitChangedEvent(oldValue,newValue,reason);
            editable.openInput.setAttribute("class",editable.openInput.getAttribute("class").replace(editable.css.hidden,"").trim());
            editable.openInput = null;
        }
        if (event.which === 27){
            editable.openInput.removeChild(child);  
            editable.emitAbortedEvent(child);
            editable.openInput.setAttribute("class",editable.openInput.getAttribute("class").replace(editable.css.hidden,"").trim());
            editable.openInput = null;      

        }
    },
    emitChangedEvent: function(oldValue,newValue,changeReason){
        editable.parent.$emit('editable-changed',{
            oldValue: editable.deref(oldValue),
            newValue: editable.deref(newValue),
            changeReason: changeReason
        });
    },
    emitAbortedEvent: function(el){
        editable.parent.$emit('editable-aborted',{
            element: el
        });
    },
    emitOpenedEvent: function(el){
        editable.parent.$emit('editable-opened',{
            element: el
        });
    },
    deref: function(value){
        return JSON.parse(JSON.stringify(value));
    }
};


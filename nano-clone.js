(function(){'use strict';
    /**
     * @version v1.1.0-alpha
     * @author  Alex Shvets
     * @see     www.github.com/quadroid/clonejs-nano
     */
    function clone(/** !Object|Function */proto, /** !ObjLiteral= */ownProperties,
                   /** {Object.propertyDescriptor}= */ownPropertiesDescriptors,
                   /** function=(clone.byProto||clone.byObjectCreate||clone.byConstructor) */cloneBy
    ){
        if('function' === typeof proto){
            proto = proto.prototype;
        }
        if( ownProperties === undefined){
            ownProperties = {};
        }
        if( cloneBy === undefined){
            if('function' === typeof ownPropertiesDescriptors){
                cloneBy = ownPropertiesDescriptors;
            }else{
                cloneBy = _cloneMode;
            }
        }
        //<//arguments>

        if('function' === typeof proto.$clone){
            var newObj = proto.$clone( ownProperties );
        }else{
            newObj = cloneBy( proto, ownProperties, ownPropertiesDescriptors );
        }
        
        if(ownPropertiesDescriptors){
            if(cloneBy !== clone.byObjectCreate && Object.defineProperties){
                Object.defineProperties(newObj, ownPropertiesDescriptors);
            }
        }
        
        return newObj;

    }

    /// clone modes:

    function byProto(/** !Object */obj, /** !ObjLiteral */ownProperties){
        ownProperties.__proto__ = obj;
        return ownProperties;
    }

    function byObjectCreate(/** Object */obj, /** !ObjLiteral */ownProperties, /** propertyDescriptors= */ownPropertiesDescriptors){
        var newObj = Object.create(obj, ownPropertiesDescriptors);
        for(var key in ownProperties) newObj[key] = ownProperties[key];
        return newObj;
    }

    function byConstructor(/** !Object */proto, /** ObjLiteral= */ownProperties){

        function _Clone(ownProperties){
            for(var key in ownProperties) this[key] = ownProperties[key];
        }
        _Clone.prototype = proto;

        // Save custom constructor for public
        if(!proto.hasOwnProperty('constructor') ){
            proto.constructor = _Clone;
        }
        /**
         * Save custom constructor in closure of $clone method.
         * The $clone method - is the object factory.
         * @override */
        proto.$clone = function(ownProperties){
            return new _Clone(ownProperties);
        }

        return new _Clone(ownProperties);
    }

    /// Select clone mode

    if('__proto__' in {}){
        clone.byProto = byProto;
    }
    
    if( typeof Object.create === 'function' ){
        clone.byObjectCreate = byObjectCreate;
    }
    
    clone.byConstructor = byConstructor;

    var _cloneMode = clone.byProto || clone.byObjectCreate || clone.byConstructor;

    // // // // // // // // // // // // // // // // // // // // // // // // // // // //

    // CommonJS modules (node.js)
    if(typeof module === 'object' && 'exports' in module){

        module.exports = clone;

    // AMD (require.js)
    }if(typeof define === 'function'){

        define(function(){return clone});

    // Browser
    }else{
        var _oldClone = window.clone;
        window.clone = clone;
        /**
         * Replaces `window.clone` by previous value.
         * @returns {clone} function */
        clone.noConflict = function(){
            window.clone = _oldClone;
            return clone;
        }
    }
})();
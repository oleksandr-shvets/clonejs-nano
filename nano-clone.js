(function(){'use strict';

    /**
     * @version v1.0.0-alpha
     * @author  Alex Shvets
     * @see     www.github.com/quadroid/clonejs-nano
     */
    function clone(/** !Object|Function */proto, /** !ObjLiteral= */ownProperties,
                   /** function=(clone.byProto||clone.byObjectCreate||clone.byConstructor) */cloneBy
        ){
        if('function' === typeof proto){
            proto = proto.prototype;
        }
        if( ownProperties === undefined){
            ownProperties = {};
        }
        if( cloneBy === undefined){
            cloneBy = _cloneMode;
        }
        //<//arguments>

        if('function' === typeof proto.$clone){
            return proto.$clone( ownProperties );
        }else{
            return cloneBy( proto, ownProperties);
        }
    }

    /// clone modes:

    function byProto(/** !Object */obj, /** !ObjLiteral */ownProperties){
        ownProperties.__proto__ = obj;
        return ownProperties;
    }

    function byObjectCreate(/** !Object */obj, /** !ObjLiteral */ownProperties){
        var newObj = Object.create(obj);
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
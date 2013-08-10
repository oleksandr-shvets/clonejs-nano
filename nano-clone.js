/** Creates clone of proto.
 * @see www.github.com/quadroid/nano-clonejs */
function clone(/** Object */proto, /** object.literalOnly! */properdies){
    properdies.__proto__ = proto;
    return properdies;
}
/** @name object.literalOnly
 * @define {Object} */

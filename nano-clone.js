/** Creates clone of proto.
 * @see www.github.com/quadroid/nano-clone */
function clone(/** Object */proto, /** object.literalOnly! */properdies){
    properdies.__proto__ = proto;
    return properdies;
}
/** @typedef {Object} object.literalOnly */

function clone(/** Object */proto, /** ObjectLiteralOnly */properdies){
    properdies.__proto__ = proto;
    return properdies;
}

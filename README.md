clone.js Nano
=====

The [true prototype-based⠙](http://en.wikipedia.org/wiki/Prototype-based_programming) nano-framework.
This is all sources:
```php
function clone(/** Object */proto, /** object.literalOnly! */properdies){
    properdies.__proto__ = proto;
    return properdies;
}
```
### It really fast!

It faster than any other framework, even VanillaJS! Yes, it creates class-objects faster than JS core creates class-functions!  
See http://jsperf.com/clonejs-nano-vs-vanillajs
[![CloneJS Nano vs VanillaJS](http://habrastorage.org/storage2/a87/6e3/31d/a876e331d1f3caaa2d4002b958456d3a.png)](http://jsperf.com/clonejs-nano-vs-vanillajs)

### What is the clone?

`clone` function produces new objects — clones.  
**Clone — this is the lazy shallow copy**, i.e., it is actually not a copy, it's just a reference to the object,
with one difference: if you will add/replace any of its properties, it would not affect the cloned object (prototype).  
All JavaScript objects are clones of `Object.prototype` (except itself and objects, created by `Object.create(null)`). 

[Read more⠙](http://www.2ality.com/2011/11/javascript-classes.html)

### How to use

Forget about classes (function-constructors).    
Instead of creating class (function), create prototype (object):
```javascript
var duck$ = {// $ postfix means prototype: duck$ === Duck.prototype
    name:  "Duck",
    color: "",
    canFly: true,
    quack: function(){
        console.log( this.name +": Quack-quack!");
    }
};
```
*The classic way:*
```javascript
var Duck = function(name, color, canFly){
    this.name  = name  || "Duck";
    this.color = color || "";
    this.canFly= canFly === undefined ? true : canFly;  
}
Duck.prototype.quack = function(){
    console.log(this.name +": Quack-quack!");
}
```
Inheritance is simple (talkingDuck prototype extends duck prototype):
```javascript
var talkingDuck$ = clone(duck$, {
    firstName: "",
    lastName: "Duck",
    
    quack: function(){
        duck$.quack.call(this);
        console.log("My name is "+ this.name +"!");
    },
    // backward compability with duck$ interface:
    get name(){
        return (this.firstName +" "+ this.lastName).trim();
    },
    set name(newName){
        var names = newName.split(" ");
        this.firstName = names[0];
        if(names.length > 1){
            this.lastName = names[1];
        }
    }    
});
```
*The classic way:*
```javascript
var TalkingDuck = function(firstName, lastName, color, canFly){
    this.firstName = firstName;
    this.lastName = lastName || "Duck";
    this.color = color || "";
    this.canFly= canFly === undefined ? true : canFly;
}
var TmpSafeProto = function(){};
TmpSafeProto.prototype = Duck.prototype;
TalkingDuck.prototype = new TmpSafeProto;
TalkingDuck.prototype.constructor = TalkingDuck;
TalkingDuck.prototype.quack = function(){
    Duck.prototype.quack.call(this);
    console.log("My name is "+ this.name +"!");
}
// backward compability with Duck interface:
Object.defineProperty(TalkingDuck.prototype, 'name', {
    get: function(){
        return (this.firstName +" "+ this.lastName).trim();
    },
    set: function(newName){
        var names = newName.split(" ");
        this.firstName = names[0];
        if(names.length > 1){
            this.lastName = names[1];
        }
    }
});
```
Forget about the `new` operator, use `clone` to create instances:
```javascript
var donald = clone(talkingDuck$, {firstName: "Donald", color: "White", canFly: false});
donald.quack();// Donald Duck: Quack-quack! 
               // My name is Donald!
```
*The classic way:*
```javascript
var daffy = new TalkingDuck("Daffy", undefined, "Black", false);
daffy.quack();// Daffy Duck: Quack-quack! 
               // My name is Daffy!
```
Forget about the `instanceof` operator, use JS native `.isPrototypeOf()` method instead:
```javascript
duck$.isPrototypeOf(donald);// true
```
*The classic way:*
```javascript
daffy instanceof Duck;// true
```

#### How to initialize object by calculated value?  
1st way — use constructor:
```javascript
var obj$ = {
    base: 1000,
    constructor: function(num){
        this.num = this.base + num;
    }
}
obj$.constructor.prototype = obj$;

var obj = new obj$.constructor(777);
```
The second, more interesting way — [lazy initialization](//github.com/quadroid/clonejs#lazy-initialization)

----
If you like the idea, plese look at the extended version of this framework http://clonejs.org/symbols/clone.html

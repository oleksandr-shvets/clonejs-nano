clone.js nano
=====

The [true prototype-based⠙](http://en.wikipedia.org/wiki/Prototype-based_programming) 3-lines "framework".
This is it:
```php
function clone(/** Object */proto, /** object.literalOnly! */ownProperties){
    ownProperties.__proto__ = proto;
    return ownProperties;
}
```
The `__proto__` is a part of [upcoming ECMA Script 6⠙](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-B.2.2.1) standart.
Currently, all major browsers have `__proto__` support, except Internet Explorer.  
**This clone function can be also implemented through Object.create or function-constructors (JavaScript 1.0 / IE3.0)**.  

### What is the Clone?

`clone(obj, {})` function produces new<sup>1</sup> objects — Clones.  
**Clone object — this is the lazy shallow copy**, i.e., it is actually not a copy, it's just a reference to the object,
with one difference: if you will add/replace any of its properties, it would not affect the cloned object (prototype).  
All JavaScript objects are clones of `Object.prototype` (except itself and objects, created by `Object.create(null)`). 

<sup>1</sup> To make it true, you need to follow one rule:   
**The second argument of the `clone(obj, {})` function should not be a variable. Only object literal ({}) allowed.**

#### Why not Object.create?

1) Because its second argument isn't usable:
```javascript
var talkingDuck = Object.create(duck, {
    firstName: {value:"", enumerable:true, writable:true},
    lastName: {value:"Duck", enumerable:true, writable:true},

    quack: {value: function(){
        duck.quack.call(this);
        console.log("My name is "+ this.name +"!");
    }}
});
```
2) It's slow.

### Try the true prototype-based OOP!

With this "framework" you can easilly create and manipulate objects without constructors, instead of classic js way,
where you should define a constructor for every object (that you want to use as prototype), even if you didn't need it.
It's possible to build and maintain extremely **large numbers of "classes" with comparatively little code**.

**It's trivial to create new "classes"** - just clone the object and change a couple of properties and voila... new "class".

**It's really class-free**: `clone()` produces objects (prototypes), not function-constructors, unlike all other class-producing tools (`Ext.define`, `dojo.declare` etc).

Read more:

- [Advantages of prototype-based OOP⠙](http://programmers.stackexchange.com/questions/110936/what-are-the-advantages-of-prototype-based-oop-over-class-based-oop#answers-header)
by Mike Anderson
- [Does JavaScript need classes? (in russian)⠙](http://habrahabr.ru/post/175029/) [(robot translation)⠙](http://translate.google.com/translate?hl=&sl=ru&tl=en&u=http%3A%2F%2Fhabrahabr.ru%2Fpost%2F175029%2F)
by Me (Alexander Shvets)
- [Myth: JavaScript needs classes⠙](http://www.2ality.com/2011/11/javascript-classes.html)
by [Dr. Axel Rauschmayer (University of Munich)⠙](http://rauschma.de)
- [JS Objects: De”construct”ion⠙](http://davidwalsh.name/javascript-objects-deconstruction)
by Kyle Simpson
- [Stop Using Constructor Functions In JavaScript⠙](http://ericleads.com/2012/09/stop-using-constructor-functions-in-javascript/)
by [Eric Elliott (Adobe)⠙](http://ericleads.com/about/)
- [Constructors Are Bad For JavaScript⠙](http://tareksherif.ca/blog/2013/08/constructors-are-bad-for-javascript/)
by Tarek Sherif

### It really fast!

It faster than any other framework, even VanillaJS! Yes, it creates class-objects faster than JS core creates class-functions!  
See http://jsperf.com/fw-class-creation/3 and http://jsperf.com/clonejs-nano-vs-vanillajs/5
[![CloneJS Nano vs VanillaJS](http://quadroid.github.io/clonejs-nano/frameworks-class-creation-bench.png)](http://jsperf.com/fw-class-creation/3)

### How to use

Forget about classes (function-constructors).    
Instead of **creating class** (function), create prototype (object):
```javascript
var duck = {
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
**Inheritance** is simple (talkingDuck prototype extends duck prototype):
```javascript
var talkingDuck = clone(duck, {
    firstName: "",
    lastName: "Duck",
    
    quack: function(){
        duck.quack.call(this);
        console.log("My name is "+ this.name +"!");
    },
    // backward compatibility with duck interface:
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
var TalkingDuckPrototype = function(){};
TalkingDuckPrototype.prototype = Duck.prototype;
TalkingDuck.prototype = new TalkingDuckPrototype;
TalkingDuck.prototype.constructor = TalkingDuck;
TalkingDuck.prototype.quack = function(){
    Duck.prototype.quack.call(this);
    console.log("My name is "+ this.name +"!");
}
// backward compatibility with Duck interface:
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
Forget about **the `new` operator**, use `clone` to create instances:
```javascript
var donald = clone(talkingDuck, {firstName: "Donald", color: "White", canFly: false});
donald.quack();// Donald Duck: Quack-quack! 
               // My name is Donald!
```
*The classic way:*
```javascript
var daffy = new TalkingDuck("Daffy", undefined, "Black", false);
daffy.quack();// Daffy Duck: Quack-quack! 
               // My name is Daffy!
```
Forget about **the `instanceof` operator**, use JS native `.isPrototypeOf()` method instead:
```javascript
duck.isPrototypeOf(donald);// true
```
*The classic way:*
```javascript
daffy instanceof Duck;// true
```

#### Object-oriented notation

Create the root prototype for all your objects:
```javascript
var object = {
    clone: function(/** object.literalOnly! */ownProperties){
        ownProperties.__proto__ = this;
        return ownProperties;
    }
}
```
After that, you can clone it:
```javascript
var duck = object.clone({
    name: "Duck",
    quack: function(){
        console.log(this.name +": Quack-quack!");
    }
});

var donald = duck.clone({name: "Donald Duck"});
```
or just copy its `clone` method to your prototype: 
```javascript
var duck = {
    name: "Duck",
    quack: function(){
        console.log(this.name +": Quack-quack!");
    },
    clone: object.clone
};

var donald = duck.clone({name: "Donald Duck"});
```

#### How to initialize object by calculated value?  
**1st, classic way** — use constructor:
```javascript
var obj = {
    base: 1000,
    constructor: function(num){
        this.num = this.base + num;
    }
}
obj.constructor.prototype = obj;

var obj = new obj.constructor(777);
```
**The second, more interesting way — [lazy initialization](//github.com/quadroid/clonejs#lazy-initialization)**

----
If you like the idea, plese look at the extended version of this framework www.github.com/quadroid/clonejs

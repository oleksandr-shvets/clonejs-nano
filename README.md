clone.js Nano
=====

The [true prototype-based⠙](http://en.wikipedia.org/wiki/Prototype-based_programming) nano-framework.
This is the main function of the framework:
```php
function clone(/** Object */proto, /** object.literalOnly! */ownProperties){
    ownProperties.__proto__ = proto;
    return ownProperties;
}
```
The `__proto__` is a part of [upcoming ECMA Script 6⠙](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-B.2.2.1) standart. It should be [relased by December 2013⠙](http://ecma-international.org/memento/TC39-M.htm).  
Currently, all major browsers have `__proto__` support, except Internet Explorer.  
**This** `clone` **function can be also implemented through** `Object.create` **or function-constructors (JavaScript 1.0 / IE3.0)**.  

#### Try the true prototype-based OOP

In this framework you can easilly create and manipulate objects without constructors, instead of classic js way,
where you should define a constructor for every object (that you want to use as prototype), even if you didn't need it.
It's possible to build and maintain extremely **large numbers of "classes" with comparatively little code**.

**It's trivial to create new "classes"** - just clone the object and change a couple of properties and voila... new "class".

**It's really class-free**: `clone()` produces objects (prototypes), not function-constructors, unlike all other class-producing tools (`Ext.define`, `dojo.declare` etc).

Read more:

- [Advantages of prototype-based OOP⠙](http://programmers.stackexchange.com/questions/110936/what-are-the-advantages-of-prototype-based-oop-over-class-based-oop#answers-header)
- [Does JavaScript need classes? (in russian)⠙](http://habrahabr.ru/post/175029/) [(robot translation)](http://translate.google.com/translate?hl=&sl=ru&tl=en&u=http%3A%2F%2Fhabrahabr.ru%2Fpost%2F175029%2F)
- [Myth: JavaScript needs classes⠙](http://www.2ality.com/2011/11/javascript-classes.html)
- [JS Objects: De”construct”ion⠙](http://davidwalsh.name/javascript-objects-deconstruction)
- [Stop Using Constructor Functions In JavaScript⠙](http://ericleads.com/2012/09/stop-using-constructor-functions-in-javascript/)
- [Constructors Are Bad For JavaScript⠙](http://tareksherif.ca/blog/2013/08/constructors-are-bad-for-javascript/)

### It really fast!

It faster than any other framework, even VanillaJS! Yes, it creates class-objects faster than JS core creates class-functions!  
See http://jsperf.com/clonejs-nano-vs-vanillajs
[![CloneJS Nano vs VanillaJS](http://habrastorage.org/storage2/a87/6e3/31d/a876e331d1f3caaa2d4002b958456d3a.png)](http://jsperf.com/clonejs-nano-vs-vanillajs)

### What is the Clone?

`clone` function produces new objects — Clones.  
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
    // backward compatibility with duck$ interface:
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

#### Why not Object.create?
1) Because its second argument isn't usable:
```javascript
var talkingDuck$ = Object.create(duck$, {
    firstName: {value:"", enumerable:true, writable:true},
    lastName: {value:"Duck", enumerable:true, writable:true},

    quack: {value: function(){
        duck$.quack.call(this);
        console.log("My name is "+ this.name +"!");
    }}
});
```
2) It's very slow.

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
If you like the idea, plese look at the extended version of this framework www.github.com/quadroid/clonejs

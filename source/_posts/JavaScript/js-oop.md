---
title: Javascript 中的继承
date: 2019-04-07 16:03:12
comment: true
categories:
- Front-Back
tags:
- JavaScript
---

### js 中的继承

1. 原型链
利用原型让一个引用类型继承另一个引用类型的属性和方法
```js
function SuperType() {
  this.property = true
}

SuperType.prototype.getSuperValue = function() {
  return this.prototype
}

function SubType() {
  this.subproperty = false
}

// 继承了 SuperType
SubType.prototype = new SuperType() // 这里重写了SubType的原型
// 注意 getSubValue 一定要在SubType.prototype下面
SubType.prototype.getSubValue = function() {
  return this.subproperty
}

// 重写父类的方法
SubType.prototype.getSuperValue = function() {
  return false
}

const instance = new SubType()
console.log(instance.getSubValue()) // false
console.log(instance.getSuperValue()) // false

// 重写原型，这样子类就拥有了父类的属性和方法， 并且后面在原型上定义的方法是属于自己的。
// 不能使用字面量定义新的方法，这样会使得之前的失效
```

**问题：**
- 每个实例都能对引用类型的值进行修改
- 不能向父类中传递参数

所以这种方式很少单独使用

<!-- more -->

2. 借用构造函数
在子类型构造函数的内部调用超类型构造函数
```js
function SuperType(name) {
  this.arr = [1, 2, 3]
  this.name = name
}

SuperType.prototype.getName = function() {
  return this.name
}

function SubType() {
  SuperType.call(this, 'len') // 可以向父类进行传参
  this.age = 18
}

const instance1 = new SubType()
instance1.arr.push(4)
console.log(instance1.arr) // [1, 2, 3, 4]
console.log(instance1.name) // len
console.log(instance1.age) // 18

const instance2 = new SubType()
console.log(instance2.arr) // [1, 2, 3]
console.log(instance2.name) // len
console.log(instance2.age) // 18
```

**问题**
- 方法都在构造函数中定义，因此函数复用就无从谈起了。
- 父类原型上定义的方法对子类是不可见的。
```
...
SuperType.prototype.getName = function() {
  return this.name
}
...
console.log(instance1.getName()) // TypeError: instance1.getName is not a function
```

所以这种技术很少单独使用

3. 组合继承（构造函数 + 原型链）
使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承
```js
function SuperType(name) {
  this.arr = [1, 2, 3]
  this.name = name
}

SuperType.prototype.getName = function() {
  return this.name
}

function SubType() {
  SuperType.call(this, 'len') // 调用父类的构造函数
  this.age = 18
}

SubType.prototype = new SuperType() // 将原型指向父类的实例
console.log(SubType.prototype.constructor) // [Function: SuperType]
SubType.prototype.constructor = SubType // 上面直接修改了子类的原型，也间接修改了构造器，这里需要修改回来
SubType.prototype.getAge = function() {
  return this.age
}

const instance = new SubType()

console.log(instance.getName()) // len
console.log(instance.getAge()) // 18
```

**优势**：融合了原型和构造的优势，并且避免了原型和构造的缺陷。**缺点**： 会调用两次父类的构造函数

4. 原型式的继承
借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型
```js
function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}

const person = {
  name: 'len',
  arr: [1, 2, 3]
}

const anotherPerson = object(person) // 等价于 Object.create()
anotherPerson.name = 'lance'
anotherPerson.arr.push(4)

const yetAnotherPerson = object(person)
anotherPerson.name = 'Amily'
anotherPerson.arr.push(5)

console.log(person.arr) // [1, 2, 3, 4, 5]
```
**问题**： 
- 得先有一个对象
- 引用类型的值始终都是共享的
- 好处是如果提前有一个对象的话，而只是想让一个对象和另一个对象保持一致的情况下，原型式继承完全可以胜任

5. 寄生式继承
寄生式继承是与原型式继承紧密相关的一种思路，思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。
```js
function object(o) {
  function F() {}
  F.prototype = 0
  return new F()
}

function createAnother(original) {
  let clone = object(original)
  clone.sayHi = function() {
    console.log('hi')
  }
  return clone
}

const person = {
  name: 'len',
  arr: [1, 2, 3]
}

const anotherPerson = createAnother(person)
anotherPerson.sayHi() // hi
```
这个例子中的代码基于person返回了一个新对象-anotherPerson，改对象不仅具有person的所有属性和方法，而且还有自己的sayHi() 方法。

在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。`object`不是必须的，任何能够返回新对象的函数都适用于此模式。

6. 寄生组合式继承
通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。

其背后的基本思路是：不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。
```js
function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}
function inheritPrototype(subType, superType) {
  const prototype = object(superType.prototype) // 创建对象, object返回一个新的对象
  prototype.constructor = subType // 增强对象
  subType.prototype = prototype // 指定对象
}

function SuperType(name) {
  this.name = name
  this.arr = [1, 2, 3]
}

SuperType.prototype.getName = function() {
  return this.name
}

function SubType() {
  SuperType.call(this, 'len')
  this.age = 18
}

inheritPrototype(SubType, SuperType)

SubType.prototype.getAge = function() {
  return this.age
}

const sub = new SubType()
console.log(sub.getName()) // len
console.log(sub.getAge()) // 18
```
开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式

7. ES6 中的继承
```js
class Human {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }
}

class Man extends Human {
  constructor(...args) {
    super(...args)
    // 如果在子类中想使用 this 关键字， 必须要先调用 super
  }

  eat(thing) {
    return this.name + ' eat: ' + thing
  }

  // 重写父类的方法
  getName() {

  }
}

const man = new Man('len')

console.log(man.name) // len
console.log(man.getName()) // len
console.log(man.eat('rice')) // len eat: rice
```

8. 混入方式继承对个对象
通过`Object.assign()` 来 “拷贝” 原型链
```js
function MyClass() {
  SuperClass.call(this)
  OtherSuperClass.call(this)
}
// 继承一个累
MyClass.prototype = Object.create(SuperClass.prototype)
// 混合其他
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新制定构造函数
MyClass.prototype.constructor = MyClass

MyClass.prototype.myMethod = function() {
  // do something...
}
```


### 总结
1. 原型链继承： 任何实例都能对引用类型进行修改
2. 构造函数： 方法都写在构造函数中，不利于代码复用。
3. 组合继承： 避免了前两者的缺点，融合了前两者的优点。 但是会调用两次父类的构造函数
4. 原型式继承： 前提要有一个对象
5. 寄生式继承： 对自定义和构造函数不适用
6. 寄生组合式继承： **最完美的解决方案**
7. ES6 主要是通过`extends`来实现继承的
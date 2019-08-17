---
title: Javascript Design Pattern
date: 2019-04-22 09:46:21
comment: true
categories:
- Front-Back
tags:
- JavaScript
---

### 单例模式
顾名思义: 单例模式就是一个类只有一个实例, 实例是否存在 ? '直接返回' : '创建再返回'

优点: 
  1) 使用单体模式可以使代码组织的更为一致，使代码容易阅读和维护。
  2) 使用单体模式可以使代码组织的更为一致，使代码容易阅读和维护。
  3) 可以被实例化，且实例化一次。

```js
// 对象字面量
var Singleton = {
    attr1: 1,
    attr2: 2,
    method1: function(){
        return this.attr1;
    },
    method2: function(){
        return this.attr2;
    }
};
```
如上面只是简单的字面量结构，上面的所有成员变量都是通过Singleton来访问的，但是它并不是单体模式；因为单体模式还有一个更重要的特点，就是可以仅被实例化一次，上面的只是不能被实例化的一个类，因此不是单体模式；

<!-- more -->

单体模式:
```js
// 单体模式
const Singleton = function(name){
  this.name = name;
  this.instance = null;
};
Singleton.prototype.getName = function(){
  return this.name;
}
// 获取实例对象
function getInstance(name) {
  if(!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance;
}
// 测试单体模式的实例
const a = getInstance("aa");
const b = getInstance("bb");

console.log(a === b) // 只实例化一次, 所以 a === b

console.log(a.getName());// aa

console.log(b.getName());// aa 返回的永远是第一次实例化对象

// 如果先实例化 b, 打印就是两个 bb 了
```

另一种写法
```js
const Singleton = function(name){
  this.name = name;
};
Singleton.prototype.getName = function(){
  return this.name;
}
// 获取实例对象

const getInstance = (function() {
  let instance

  return function(name) {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()
```

### 构造函数模式
```js
function Car(model, year, miles) {
  this.model = model
  this.year = year
  this.miles = miles

  this.output = function() {
    return this.model + ' runs ' + this.miles + ' kilometre'
  }
}

const tom = new Car('Tom', 2009, 20000)
const len = new Car('len', 2010, 5000)

console.log(tom.output()) // Tom runs 20000 kilometre
console.log(len.output()) // len runs 5000 kilometre
```
上面的例子是一个非常简单的构造函数模式. 我们都知道构造函数在继承的时候表现不是太好, 方法都定义在构造函数内部, 每次实例化的时候都会重写, 复用性差.
```js
function Car(model, year, miles) {
  this.model = model
  this.year = year
  this.miles = miles

  this.output = formatCar
}
function formatCar() {
  return this.model + ' runs ' + this.miles + ' kilometre'
}
```
提取出一个公共方法, 这样我们就实现了代码的复用, 但这不是最好的.
```js
Car.prototype.output = function() {
  return this.model + ' runs ' + this.miles + ' kilometre'
}
```
定义在原型上, prefect!

### 建造者模式
将一个复杂的对象的构建与其相分离, 使得同样的构建过程可以创建不同的表示. 也就是说如果我们用了建造者模式, 那么用户就需要指定需要建造的类型就可以得到它们, 而具体建造过程和细节就不需要知道了.
```js
function getBeerById(id, callback) {
  // 使用ID来请求数据，然后返回数据.
  asyncRequest('GET', 'beer.uri?id=' + id, function (resp) {
    // callback调用 response
    callback(resp.responseText);
  });
}

const el = document.querySelector('#test');
el.addEventListener('click', getBeerByIdBridge, false);

function getBeerByIdBridge(e) {
  getBeerById(this.id, function (beer) {
    console.log('Requested Beer: ' + beer);
  });
}
```
根据建造者的定义，表相即是回调，也就是说获取数据以后如何显示和处理取决于回调函数，相应地回调函数在处理数据的时候不需要关注是如何获取数据的，同样的例子也可以在jquery的ajax方法里看到，有很多回调函数（比如success, error回调等），主要目的就是职责分离。

同样再来一个jQuery的例子：
`$('<div class= "foo"> bar </div>');`
我们只需要传入要生成的HTML字符，而不需要关系具体的HTML对象是如何生产的。

### 工厂模式
工厂模式定义一个用于创建对象的接口, 这个接口由子类决定实例化那一个类. 该模式使一个类的实例化延迟到了子类。而子类可以重写接口方法以便创建的时候指定自己的对象类型。

这个模式十分有用，尤其是创建对象的流程赋值的时候，比如依赖于很多设置文件等。并且，你会经常在程序里看到工厂方法，用于让子类类定义需要创建的对象类型。

优点: 能解决多个相似的问题

缺点: 不能正确识别对象的类型, 都是Object类型

```js
function CreatePerson(name,age,sex) {
  var obj = new Object();
  obj.name = name;
  obj.age = age;
  obj.sex = sex;
  obj.sayName = function(){
    return this.name;
  }
  return obj;
}
var p1 = new CreatePerson("len",'28','男');
var p2 = new CreatePerson("lance",'27','女');
console.log(p1.name); // len
console.log(p1.age);  // 28
console.log(p1.sex);  // 男
console.log(p1.sayName()); // len

console.log(p2.name);  // lance
console.log(p2.age);   // 27
console.log(p2.sex);   // 女
console.log(p2.sayName()); // lance

// 返回都是object 无法识别对象的类型 不知道他们是哪个对象的实列, 因为我们在构造函数中new了一个对象.
console.log(p1 instanceof Object); // true
```

### 发布订阅(观察者)
就好比微信公众号, 很多人都订阅了公众号, 然后当公众号发布一个消息的时候,所有订阅的人都可以收到消息.
```js
class Events {
  constructor() {
    this.topics = {}
  }

  // 订阅
  subscribe(topic, callback) {
    if (!this.topics[topic]) {
      this.topics[topic] = []
    }
    this.topics[topic].push(callback)
  }

  unSubscribe(topic, callback) {
    if (!this.topics[topic]) {
      return false
    }

    if (!callback) {
      this.topics[topic].length = []
    } else {
      for (let i = 0; i < this.topics[topic].length; i++) {
        const cb = this.topics[topic][i]
        if (cb.toString() === callback.toString()) {
          this.topics[topic].splice(i, 1)
        }
      }
    }
  }

  // 发布
  publish() {
    const topic = Array.prototype.shift.call(arguments)
    const topicCallbacks = this.topics[topic]

    if (!topicCallbacks || topicCallbacks.length === 0) {
      return 
    }

    for (let i = 0; i < topicCallbacks.length; i++) {
      topicCallbacks[i].apply(this, arguments)
    }
  }
}

const len = new Events()
len.subscribe('red', (size) => {
  console.log('size: ' + size)
})

len.subscribe('red', (haha) => {
  console.log('haha: ' + haha)
})

len.subscribe('black', (size) => {
  console.log('size: ' + size)
})

len.unSubscribe('red', (size) => {
  console.log('size: ' + size)
})

len.publish('red', 21)

len.publish('black', 22)

```
上面是一个简单的发布订阅模式



### 参考资料
[1](https://juejin.im/entry/58c280b1da2f600d8725b887)
[2](http://www.cnblogs.com/TomXu/archive/2011/12/15/2288411.html)
[3](https://able.bio/drenther/javascript-design-patterns--89mv2af)
[4](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript)
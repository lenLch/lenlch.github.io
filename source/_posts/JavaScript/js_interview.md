---
title: Javascript Interview
date: 2019-04-01 11:12:00
comment: true
categories:
- Front-Back
tags:
- JavaScript
---

### 实现一个`new`
首先我们要明白`构造函数(Foo)` `实例(a)` `原型(Foo.prototype)` 三者之间的关系

`Foo.prototype === Foo.prototype` Foo的 prototype 指向原型
`Foo.__proto__ === Function.prototype` Foo的 \__proto\__ 指向 Function.prototype(所有函数的原型)
`a.__proto__ === Foo.prototype` 实例a的 \__proto\__ 指向原型
`Foo.prototype.constructor === Foo` 原型的 constructor 指向构造函数
`Foo.prototype._proto__ === Object.prototype` 原型的 \_proto\__ 指向 Object.prototype(所有对象的原型)

如下图
![prototype.png](/images/js_interview/prototype.png)

明白了三者之间的关系，现在让我们来实现`new`关键字
```js
function New() {
  const obj = new Object() // 创建一个全新的对象
  const target = Array.prototype.shift.call(arguments) // 这里为什么call，因为arguments是一个类数组的对象，同时shift会该变原数组
  obj.__proto__ = target.prototype // 实例对象的 __proto__ 指向构造函数的原型，使得新生成的对象可以使用target原型上的方法和属性
  const res = target.apply(obj, arguments) // 改变target的this指向
  return typeof res === 'object' ? res : obj // 有可能target里面返回的不是object
}

function test(name, age) {
  this.name = name
  this.age = age
  return this // return 'test' // 这里也可能会返回一个字符串
}

const res = New(test, 'xiaoming', 20)
console.log(res) // {name: 'xiaoming', age: 20}
```

<!-- more -->

### 实现一个`JSON.stringify`
1. Boolean | Number | String 会自动转换成对应的原始值
2. undefined、任意函数以及 symbol，会被忽略，或者被转换成 null。
3. 不可枚举的属性会被忽略
4. 如果一个对象的属性通过某种间接的方式指回该对象本身，即循环引用，属性也会被忽略

```js
function jsonStringify(obj) {
  let type = typeof obj

  if (type !== 'object') {
    // string, undefined, function 直接加 ““ 返回
    if (/string|undefined|function/.test(type)) {
      obj = '"' + obj + '"'
    }
    return String(obj)
  } else {
    // 如果 obj 为 object， 循环遍历对象
    // 如果值为 string， undefined， function， 加 ”“ 返回
    // 如果值为 object， 递归调用自身。
    let json = []
    let arr = (obj && obj.constructor === Array)
    for (let k in obj) {
      let v = obj[k]
      let type = typeof v
      // 直接返回
      if (/string|undefined|function/.test(type)) {
        v = '"' + v + '"'
      } else if (type === 'object') {
        // 递归调用
        v = jsonStringify(v)
      }
      // "key": "value"
      json.push((arr ? "" : '"' + k + '":') + String(v))
    }
    // 判断是array还是object
    // tips: String([1, 2, 3]) ==> "1, 2, 3" 隐士类型转换
    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}")
  }
}

jsonStringify({x : 5}) // "{"x":5}"
jsonStringify([1, "false", false]) // "[1,"false",false]"
jsonStringify({b: undefined}) // "{"b":"undefined"}"
```




### 实现一个`JSON.parse`
1. 直接使用eval
2. 使用function
```js
function jsonParse1(str) {
  return eval('(' + str + ')') 
}

function jsonParse2(str) {
  return new Function('return ' + str)()
}

let str = '{ "age": 20, "name": "jack" }'

jsonParse1(str)  // {age: 20, name: 'jack'}
jsonParse2(str) // {age: 20, name: 'jack'}
```

### 浅拷贝、深拷贝
拷贝都是对引用类型而言的

1. 赋值
  - 原始数据： 存储在栈中。
  - 引用类型： 栈中存放的是堆中数据的引用。
  - 赋值的是栈中的地址，而不是堆中的数据。你改我也改

2. 浅拷贝
  会在堆中赋值一份新的数据地址，你改我不会改。**但是**，浅拷贝只会拷贝一层，如果key的value又是一个对象，这样他两执行的还是同一份堆中的数据，所以你改我也会改
3. 深拷贝
  深拷贝就是完全赋值，两个引用对象在堆中的数据不会相互影响，不管你有嵌套几层。你改我永远也不会改

说明
```js
const obj1 = {
  name: 'len',
  age: 20,
  test: [1, [2, 3], 4]
}

const obj2 = obj1 // 赋值

obj2.name = 'lance'
console.log(obj1.name) // lance

obj2.age = 18
console.log(obj1.name) // 18

obj2.test[1] = [7, 8]
console.log(obj1.test[1]) // [7, 8]

function shallowCopy(src) {
  const dst = {}
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      dst[prop] = src[prop]
    }
  }
  return dst
}

const obj3 = shallowCopy(obj1)

obj3.name = 'test'
obj3.test[1] = ['78', '89']

console.log(obj1.name) // lance
console.log(obj3.name) // test
console.log(obj1.test[1]) // ['78', '89']
console.log(obj3.test[1]) // ['78', '89']
```

**浅拷贝的实现方式**
1. Object.assign()
```js
// assign
let obj = {
  name: 'len',
  a: {
    a: 'len',
    b: 20
  }
}
let copyObj = Object.assign({}, obj)
copyObj.a.a = 'lance'
copyObj.a.b = 21
copyObj.name = 'lance'

// 浅拷贝只拷贝一层，所以 obj.name 不会被更改
console.log(copyObj) // { name: 'lance', a: { a: 'lence', age: 21 } }
console.log(obj) // { name: 'len', a: { a: 'lence', age: 21 } }

// 当obj只有一层的时候，是深拷贝 (**********)
let obj = {
  name: 'len'
}

let copyObj = Object.assign({}, obj)
copyObj.name = 'lance'

console.log(copyObj) // {name: "lance"}
console.log(obj) // {name: "len"}
```

2. Array.prototype.concat()
```js
let arr = [1, 2, {
  name: 'len'
}]

let arr2 = arr.concat()
arr2[2].name = 'lance'
arr2[0] = '11111'
console.log(arr) // [1, 2, { name: 'lance' }]
console.log(arr2) // ['11111', 2, { name: 'lance' }]
```

3. Array.prototype.slice()
```js
let arr = [1, 2, {
  name: 'len'
}]

let arr2 = arr.slice()
arr2[2].name = 'lance'
arr2[0] = '11111'
console.log(arr) // [1, 2, { name: 'lance' }]
console.log(arr2) // ['11111', 2, { name: 'lance' }]
```

4. 手动实现
```js
function shallowCopy(src) {
  const dst = {}
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      dst[prop] = src[prop]
    }
  }
  return dst
}
```

**深拷贝实现的方法**
1. JSON.parse(JSON.stringify())
前面实现 `JSON.stringify()` 的时候有说道，函会被处理成 null， 所以这种方法不适合函数
```js
let arr = [1, 2, {
  name: 'len'
}]

let arr2 = JSON.parse(JSON.stringify(arr))

arr2[2].name = 'lance'

console.log(arr) // [1, 2, { name: 'len' }]
console.log(arr2) // [1, 2, { name: 'lance' }]
```

2. 手动实现
```js
function checkType(target) {
  return Object.prototype.toString.call(target).slice(8, -1)
}

function clone(target) {
  let result,
    type = checkType(target)

  if (type === 'Object') {
    result = {}
  } else if (type === 'Array') {
    result = []
  } else {
    return target
  }

  for (let i in target) {
    let value = target[i]

    if (checkType(value) === 'Object' ||
      checkType(value) === 'Array') {
        result[i] = clone(value)
    } else {
      result[i] = value
    }
  }
  return result
}

let arr = [1, 2, {
  name: 'len'
}]

let arr2 = clone(arr)
arr2[0] = '1111'
arr2[2].name = 'lance'

console.log(arr) // [1, 2, { name: "len" }]
console.log(arr2) // ['1111', 2, { name: 'lance' }]
```

3. 手动实现
```js

function isObject(obj) {
  return typeof obj === 'object' && obj != null
}

function deepCopy(src) {

  if (!isObject(src)) return src

  const dst = Array.isArray(src) ? [] : {}
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      if (typeof src[prop] === 'object') {
        dst[prop] = deepCopy(src[prop])
      } else {
        dst[prop] = src[prop]
      }
    }
  }
  return dst
}
```

关于浅拷贝和深拷贝，上面的代码多多少少还是有些问题的，有兴趣的可以进行深入


### 实现一个`call`
思路：
```js

let obj = {
  name: 'len'
}

function print() {
  console.log(this.name)
}

print.call(obj) // len

// =====>

let obj = {
  name: 'len',
  print: function() {
    console.log(this.name)
  }
}

obj.name // len
```

call改变调用者`this`的指向，传参方式：一个一个传。
```js
Function.prototype.call1 = function(ctx = window) {
  ctx.fn = this
  let args = [...arguments].slice(1)
  let res = ctx.fn(...args)
  delete ctx.fn
  return res
}
```

### 实现一个`apply`
apply改变调用者的`this`指向，传参方式： 数组。
```js
Function.prototype.apply1 = function(ctx = window) {
  ctx.fn = this
  let args = arguments[1]
  let res

  args.length > 0 ? res = ctx.fn(...args) : res = ctx.fn()

  delete ctx.fn
  return res
}
```

### 实现一个`bind`
bind是将一个函数绑定至另一个函数上，返回一个函数
```js
Function.prototype.bind1 = function(ctx) {
  // 必须是函数调用call
  if (typeof this !== 'function') {
    throw Error('call target should be a function')
  }

  let self = this
  let binArgs = [...arguments].slice(1)
  let resFn = function() {
    // 返回的函数也有可能会传参， 所以这里需要concat一下
    // 返回的函数也有可能使用 new 关键字，所以这里需要判断下
    self.apply(this instanceof resFn ? this : ctx, bindArgs.contact([...arguments]))
  }

  function temp() {}
  // 保存对原型链的引用
  temp.prototype = this.prototype // 将原型保存在temp.prototype上
  resFn.prototype = new temp() // new temp().__proto__ === temp.prototype

  return resFn
}
```


### 当你刷新网页的时候，怎么知道用户在“看”
1. `document.hidden` 来判断
2. `focus` 和 `blur` 来判断
3. `mouseover` 和 `mouseout` 来判断

### for...in 和 for...of 的区别
for...in 只能获得对象的键名
for...of 允许遍历获得键值
for...of 循环只返回具有数字索引的属性，也就是必须具有iterable特性，普通对象遍历不了。类对象`arguments`可以

### window 的 onload 事件和 documentContentLoaded 谁先谁后
documentContentLoaded 先

window.onload 是等到页面的所有资源（html，js，css，图片，音频，视频）都加载完毕后才会执行

documentContentLoaded 是`dom树`构建完毕之后就执行的

### 实现数组扁平化
```js
// 第一种方式，循环遍历，递归调用。so esay
function flatten1(arr) {
  let res = []

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      res = res.concat(flatten1(arr[i]))
    } else {
      res.push(arr[i])
    }
  }
  return res
}

// 利用reduce的特性，只是第一种方法的 装逼写法而已 O(∩_∩)O哈哈~
function flatten2(arr) {
  return arr.reduce((prev, item) => {
    return prev.concat(Array.isArray(item) ? flatten2(item) : item)
  }, [])
}

// 利用some特性，加es6的扩展运算符
function flatten3(arr) {
  // 如果 arr 中一直有数组，那就一直循环下去
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

// 这个利用类型隐士转换，然后利用map将字符串转换成数字
function flatten4(arr) {
  const arrStr = arr.toString()
  return arrStr.split(',').map(Number)
}

let arr = [ 10, [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]]]

console.log(flatten1(arr)) // [ 10, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 11, 12, 12, 13, 14 ]
console.log(flatten2(arr)) // [ 10, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 11, 12, 12, 13, 14 ]
console.log(flatten3(arr)) // [ 10, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 11, 12, 12, 13, 14 ]
console.log(flatten4(arr)) // [ 10, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 11, 12, 12, 13, 14 ]
```


### 实现一个`防抖`
防抖的原理：在事件停止触发的n秒后执行

定时器实现
```js
function debounce(func, wait = 50, immediate) {
  let timeout

  return function() {
    if (immediate) {
      fn.apply(this, arguments)
    }
    if (timeout) clearTimeout(timeout)
  
    timeout = setTimeout(() => {
      timeout = null
      func.apply(this, arguments)
    }, wait)
  }
}
```
结合实例： 滚动防抖
```js
// 滚动函数
function realFunc() {
  console.log('success')
}

// 采用防抖
window.addEventListener('scroll', debounce(realFunc, 500))
// 不采用防抖
window.addEventListener('scroll', realFunc)
```

### 实现一个`节流`
节流的原理：每隔n秒执行一次事件

定时器和时间戳实现
```js
// 定时器
function throttle1(func, wait = 50) {
  let timeout
  return function() {
    let args = [...arguments]

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, args)
      }, wait)
    }
  }
}

// 时间戳
function throttle2(func, wait = 50) {
  let prev = 0
  return function() {
    let now = +new Date()
    let args = arguments
    if (now - prev > wait) {
      func.apply(this, args)
      prev = now
    }
  }
}
```


### 实现一个`instanceof`
```js
// 左边是对象，右边是构造函数
function instanceOf(left, right) {
  // 对象的 __proto__ 指向原型
  let proto = left.__proto__
  // 构造函数的 prototype 指向原型
  let prototype = right.prototype

  while (true) {
    if (proto === null) return false
    // 相等，即为true
    if (proto === prototype) return true
    // 这里处理继承的情况
    proto = proto.__proto__
  }
} 
```


### 下面代码输出什么, 为什么？
```js
let obj = {
  '2': 2,
  '3': 3,
  'splice': Array.prototype.splice,
  'push': Array.prototype.push
}

obj.push(0)
obj.push(1)
console.log(obj) // { 0 : 0, 1: 1, 2: 2, 3: 3, length: 2, splice: f, push: f }
obj.splice(0, 1)
console.log(obj) // { 0: 1, 2: 2, 3: 3 length: 1, splice: f, push: f }

// 调用pbj.push的时候，会将obj转换成类数组对象，所以会添加length属性。
```

### 下面代码输出什么 ?
```js
for (var a = 0; a < 5; a++) {
  a = 'hello'
  console.log(a)
}
// 上面输出一个Hello

for (let b = 0; b < 5; b++) {
  let b = 'hello'
  console.log(b)
}
// 上面输出 5 个hello
```

### 下面代码输出什么？
```js
var a = { n: 1 }
var b = a
a.x = a = { n: 2 }

console.log(a.x) // undefined
console.log(b.x) // { n: 2 }
console.log(b.x === a) // true

-------------

var a = { n: 1 }
var b = a
a = a.x = { n: 2 }

console.log(a.x) // undefined
console.log(b.x) // { n: 2 }
console.log(b.x === a) // true

----------

var a = { n: 1 }
var b = a 
a.x = (a = { n: 2 })

console.log(a.x) // undefined
console.log(b.x) // { n: 2 }
console.log(b.x === a) // true
```
优先级: () > . > =

对于 1 和 2， 这样的结果是没问题的，如图。
![1.png](/images/js_interview/1.jpg)

对于第三个，大家可能有些疑问，如何按照优先级来的话，结果应该是:`a = {n: 2, x: {n: 2}}, b = {n: 1}`

这里其实和运算符有限级没有关系。求值操作是从左到至右的。所以还是会先求 a.x 的值。

不知道大家能不能理解，多多体会应该就理解了。(*^__^*) 嘻嘻……



### 实现下面这道题中的 machine 函数功能
```js
function machine() {}

machine('len').execute() // start len
machine('len').do('eat').execute() // start len, len eat
machine('len').wait(5).do('eat').execute() // start len, wait s5, len eat
machine('len').waitFirst(5).do('eat').execute() // wait 5s, start len, len eat.
``` 
分析：
1. 默认 `execute` 是第一个执行的， `waitFirst` 例外。
2. 链式调用，在每个函数里面返回this
3. 默认都写成异步，然后在一个队列里面处理，同步直接执行，异步，使用`promise`来处理

```js
function machine(name) {
  // 新生成一个类来进行处理
  return new Action(name)
}

// 处理异步回调
function defer(time, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 执行callback回调
      resolve(callback())
    }, time * 1000)
  })
}

// 事件队列
class QueueItem {
  constructor(time, callback) {
    this.time = time
    this.callback = callback
  }
}

class Action {
  constructor(name) {
    this.name = name
    // 事件队列， 默认有一个，也就是执行 execute 时候打印的
    this.queue = [
      new QueueItem(0, () => console.log(`start ${this.name}`))
    ]
  }

  // do 函数是同步的
  do(what) {
    this.queue.push(
      new QueueItem(0, () => console.log(`${this.name} ${what}`))
    )
    return this
  }

  // wait 函数是异步的
  wait(time) {
    this.queue.push(
      new QueueItem(time, () => console.log(`wait ${time}s`))
    )
    return this
  }

  // waitFirst 函数是异步的，默认是第一个
  waitFirst(time) {
    // unshift 来添加到队列的最前面
    this.queue.unshift(
      new QueueItem(time, () => console.log(`wait ${time}s`))
    )
    return this
  }

  // execute 是最后执行的
  async execute() {
    while (this.queue.length > 0) {
      // 去除队列最前面的，也就是数组中的第一个，同时改变数组
      const cur = this.queue.shift()
      // 如果是同步的，就直接执行callback
      if (!cur.time) {
        cur.callback()
        continue
      }
      // 异步执行 callback
      await defer(cur.time, cur.callback)
    }
  }
}

```

### 实现一个compose
- `compose`的参数是函数，返回值也是一个函数
- 除了第一个函数的接受参数，其他函数的接受参数都是上一个函数的返回值
- compose可以接受任意的参数，所有参数都是函数

[reduce API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

```js
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  // 这个可能有点难理解
  // return funcs.reduce((a, b) => (...args) => a(b(...args)))

  // 写成这样能好理解点
  return funcs.reduce((a, b) => {
    return (...args) => {
      return a(b(...args))
    }
  })

  /* 
    第一次: 
    a = fn1
    b = fn2

    return (...args) => {
      return fn1(fn2(...args))
    }

    第二次计算的时候，fn3是作为第一次返回函数的参数传入的。

    第二次：
    a = (...args) => {
      return fn1(fn2(...args))
    }
    b = fn3

    ==>

    ...args === fn3(...args)
    (fn3(...args)) => {
      return fn1(fn2(fn3(...args)))
    }

    return (...args) => {
      return fn1(fn2(fn3(...args)))
    }

    以此类推
    .
    .
    .
  */
}

const fn1 = val => 'fn1-' + val
const fn2 = val => 'fn2-' + val
const fn3 = val => 'fn3-' + val

compose(fn1, fn2, fn3)('test') // fn1-fn2-fn3-test
```

### 实现如下函数，可以批量请求数据，所有 URL 地址在 urls 参数中，同时可以通过 max 参数控制请求的并发度，当所有的请求结束后，需要执行 callback 回调函数
```js
function sendRequest(urls: string[], max: number, callback: () => void) {

}
```
主线程先执行,然后再执行fetch().finally的微任务.

```js
// 版本一
function limitConcurrency(fn, max) {
  const pendingTasks = new Set()
  return async function(...args) {
    while (pendingTasks.size > max) {
      await Promise.race(pendingTasks)
    }

    const promise = fn.apply(this, args)
    // promise all 只要有出错,callback会提前执行.
    const res = promise.catch(() => {})
    pendingTasks.add(res)
    await res
    pendingTasks.delete(res)
    return promise
  }
}

function sendRequest(urls, max, callback) {
  const limitFetch = limitConcurrency(fetch, max)
  await Promise.all(urls.map(limitFetch)) // 一开始先往队列里面塞max个,然后剩下的,谁快谁执行
  callback()
}

// 版本二
function sendRequest(urls, max, callback) {
  const len = urls.length
  let idx = 0 
  let counter = 0

  function _request() {
    // while 会一直执行,直到counter === len
    while (idx < len && max > 0) {
      fetch(urls[idx++]).finally(() => {
        max++
        counter++
        if (counter === len) {
          return callback()
        } else {
          _request()
        }
      })
    }
  }

  _request()
}
```

### 如何使 `a === 1 && a === 2 && a === 3` 为 `true`
这题主要设计到隐士类型转换
```js
const a = {
  i: 1,
  toString() {
    return a.i++
  },
  // valueOf() {
  //   return a.i++
  // }
}

// 注意: 这里不是 ===, a.i是引用类型的值
if (a == 1 && a == 2 && a == 3) {
  console.log('whoa!')
}

// a == 1 的时候, js引擎会尝试将a转换成数字, 首先调用a的valueOf() 来判断, 不行则继续调用toString()
```

### 实现快排
```js
// 版本1, 新创建两个数组, 会增加空间开销
function quickSort(arr) {
  // 递归结束条件
  if (arr.length <= 1) return arr
  let mid = Math.floor(arr.length / 2)
  let left = []
  let right = []

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < arr[mid]) {
      left.push(arr[i])
    }
    if (arr[i] > arr[mid]) {
      right.push(arr[i])
    }
  }

  return quickSort(left).concat(arr[mid], quickSort(right))
}

let arr = [5, 4, 6, 2, 3, 1]
console.log(quickSort(arr)) // [1, 2, 3, 4, 5, 6]

// 版本2, 用时间换空间
function quickSort(arr, start, end) {
  // 递归结束条件
  if (start >= end) return 

  // 左指针
  let left = start

  // 右指针
  let right = end

  // 基准值
  let basicValue = arr[start] // 默认为数组中第一个值

  while (left < right) {
    // 先从右往左比较, 直到找到比基准值小的
    while (left < right && arr[right] >= basicValue) {
      right--
    }
    // 将右边的值比基准值小的值付给arr[left],注意,这时候arr[right]还是之前那个值
    arr[left] = arr[right]
    // 
    while (left < right && arr[left] < basicValue) {
      left++
    }
    // 将
    arr[right] = arr[left]
  }
  // 这也就是为什么要将坐指针赋值给 基准值
  arr[left] = basicValue
  quickSort(arr, start, left-1)
  quickSort(arr, right+1, end)
}

let arr = [5, 4, 6, 2, 3, 1]
quickSort(arr, 0, arr.length - 1)
console.log(arr) // [1, 2, 3, 4, 5, 6]
```
分析: ↓
![2.png](/images/js_interview/2.jpg)
剩余未推导的可以自行推导下

题外话, js中数组中的两个数进行交换的额时候,可以这么操作 ↓
![3.png](/images/js_interview/3.png)

### 实现栈
栈: 先进后出 (生活中的杯子)
```js
class Stack {
  constructor() {
    this.items = []
  }

  isEmpty() {
    return this.items.length === 0
  }

  size() {
    return this.items.length
  }

  // 往栈里 push 数据
  push(value) {
    this.items.push(value)
  }

  // 删除栈顶的元素
  pop() {
    return this.items.pop()
  }

  // 查询栈顶的元素
  peek() {
    return this.items[this.items.length - 1]
  }
}
```
栈的应用: 单纯的括号匹配问题
(()) ==> true
{())} ==> false
```js
function parCheckerSingle(string) {
  const s = new Stack()
  let isMatch = true
  let index = 0

  while (index < string.length && isMatch) {
    let cur = string[index]

    if (cur === '(') {
      s.push(cur)
    } else {
      if (s.isEmpty()) {
        isMatch = false
      } else {
        s.pop()
      }
    }
    index++
  }

  if (s.isEmpty() && isMatch) {
    return true
  } else {
    return false
  }
}

console.log(parCheckerSingle('(())')) // true
console.log(parCheckerSingle('(()')) // false
```

**[{(**的匹配
```js
function parChecker(str) {
  let s = new Stack()
  let isMatch = true
  let index = 0

  while (index < str.length && isMatch) {
    const cur = str[index]

    if ('([{'.includes(cur)) {
      s.push(cur)
    } else {
      if (s.isEmpty()) {
        isMatch = false
      } else {
        let top = s.pop()
        if (!matches(top, cur)) {
          isMatch = false
        }
      }
    }

    index++
  }

  if (isMatch && s.isEmpty()) {
    return true
  } else {
    return false
  }
}

function matches(open, close) {
  const opens = '([{'
  const closes = ')]}'

  return opens.indexOf(open) === closes.indexOf(close)
}

console.log(parChecker('({[([])]})')) // true
console.log(parChecker('({[([]]})')) // false
```

### 实现队列
队列: 先进先出 (生活中的管道)
```js
class Queue {
  constructor() {
    this.items = []
  }

  isEmpty() {
    return this.items.length === 0
  }

  size() {
    return this.items.length
  }

  // 入队, 末尾 push
  enqueue(value) {
    this.items.push(value)
  }

  // 出队, shift 取出数组中的第一个, 第一个是最先入队的
  dequeue() {
    return this.items.shift()
  }
}
```

队列的应用: 约瑟夫环
就像小时候玩的"点点点zhi", 点到那个那个淘汰, 最后留下来的人胜出
```js
function yueSeFu(list, num) {
  let q = new Queue()
  for (let i = 0; i < list.length; i++) {
    q.enqueue(list[i])
  }

  while (q.size() > 1) {
    // 循环到num, 找到点到的那个人, 先出队,然后入队, 对列的长度还是不变的
    // 这个循环是为了将被点到的那个人防止队列的最前端
    for (let j = 0; j < num; j++) {
      q.enqueue(q.dequeue())
    }
    // 删除当前的人
    q.dequeue()
  }
  return q.dequeue()
}

console.log(yueSeFu([1, 2, 3, 4, 5], 7)) // 1
// 第一次是从 2 开始数数的
// 第一次: 淘汰 3  / [4, 5, 1, 2]
// 第二次: 淘汰 2  / [4, 5, 1]
// 第三次: 淘汰 5  / [1, 4]
// 第四次: 淘汰 4  / [1]
```




###





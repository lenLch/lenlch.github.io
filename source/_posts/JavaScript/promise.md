---
title: 手动实现一个promise
date: 2019-04-04 15:34:00
comment: true
categories:
- Front-Back
tags:
- JavaScript
---

### 如何手动实现一个`Promise`？
在实现之前，我们需要知道以下几点：
1. promise的三种状态（pending，fulfilled， rejected），一旦状态更改就不能再进行更改
2. promise的then可以进行链式调用。then里面都是异步调用的
3. 默认在第一个then里面返回一个promise
4. then里面返回值的情况：
  - 普通值
  - promise（function， promise）
  - 出错

具体可以参考 [promiseA+规范](https://promisesaplus.com/)

<!-- more -->

### 实现Promise类
```js
class Promise {
  constructor(execution) {
    this.state = 'pending' // 状态
    this.value = undefined // 成功的值
    this.reason = undefined // 失败的理由

    // 异步的时候，使用发布订阅的模式，也就是我先存起来，等触发了，我就挨个执行
    this.onResolvedCallbacks = [] // 成功的回调
    this.onRejectedCallbacks = [] // 失败的回调

    // promise 参数 resolve
    let resolve = value => {
      // 状态一旦更改不就能再改了
      if (this.state === 'pending') {
        this.value = value
        this.state = 'fulfilled' // 状态更改为 成功
        this.onResolvedCallbacks.forEach(fn => fn()) // 挨个执行
      }
    }

    // promise 参数 reject
    let reject = reason => {
      // 同上
      if (this.state === 'pending') {
        this.reason = reason
        this.state = 'rejected' // 状态更改为 失败
        this.onRejectedCallbacks.forEach(fn => fn()) // 执行失败的回调
      }
    }

    try {
      // 执行
      execution(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    // 根据规范，onFulfilled 和 onRejected 都是可选的，如果不是函数，必须被忽略
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err } // 这里如果 value => value， 这样会走到下一个then的onFulfilled中，这就不对了，所以我们在这里直接返回抛出一个错误

    // then 里面返回一个promise，这里为什么要返回一个新的promise，是因为promise的状态一旦更改就不能再改的原因
    let promise2 = return new Promise((resolve, reject) => {
      // 现在这个promise会有三种情况， pending、fulfilled、rejected

      // 初始状态，就往callback数组里面push数据
      if (this.state === 'pending') {
        // push的是一个函数
        this.onResolvedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            // 可能会出错
            try {
              // 成功
              let x = onFulfilled(this.value)
              // 这里 去处理then里面的返回值的情况
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              // 出错直接reject
              reject(err)
            }
          }, 0)
        })

        this.onRejectedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            // 可能会出错
            try {
              // 成功
              let x = onRejected(this.reason)
              // 这里 去处理then里面的返回值的情况
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              // 出错直接reject
              reject(err)
            }
          }, 0)
        })
      }

      // 成功
      if (this.state === 'fulfilled') {
        // 直接去处理返回值的情况
        setTimeout(() => {
          // 可能会出错
          try {
            // 成功
            let x = onFulfilled(this.value)
            // 这里 去处理then里面的返回值的情况
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            // 出错直接reject
            reject(err)
          }
        }, 0)
      }

      if (this.state === 'rejected') {
        setTimeout(() => {
          // 可能会出错
          try {
            // 成功
            let x = onRejected(this.reason)
            // 这里 去处理then里面的返回值的情况
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            // 出错直接reject
            reject(err)
          }
        }, 0)
      }
    })
    return promise2
  }

  // catch
  /* 
    Promise.reject('err').catch(e => {
      cosnole.log(e)
    })
    ==> 等价于
    Promise.reject('err').then(null, e => {
      console.log(e)
    })
  */
  catch(fn) {
    // 所以这里我们直接调用 then， 然后成功的回调为null， 失败的回调为 fn
    this.then(null, fn)
  }
}

// 判断 then 的返回值函数
function resolvePromise(promise2, x, resolve, reject) {
  // 循环调用
  /* 
    let promise2 = promise.then(() => {
      return promise2
    })
    promise2的成功或失败取决于promise.then的返回结果，而返回的确实promise2自己，这样就陷入了死循环
  */
 if (promise2 === x) {
   return reject(new TypeError('cycle call'))
 }

  // 防止多次调用
 let called

 if (x != null && (typeof x === 'function' || typeof x === 'object')) {
   try {
     // 拿then的时候，有可能会没有，所以这 try
     let then = x.then

     if (typeof then === 'function') {
       // 这里为什么用call，是因为作用域的问题 当我们这样 let then = x.then / 这时候再用then，this可能会指向window。 如果是 x.then() 这样this就指向x了，所以这里我们需要用call让this指向x
       then.call(x, y => {
         // y 也有可能会是 promise 或者 普通值，递归调用
         // 失败或成功只能调用一个，所以这里我们用called来做牵制
         if (called) return 
         called = true
         resolvePromise(promise2, y, resolve, reject)
       }, err => {
         if (called) return
         called = true
         reject(err)
       })
     } else {
       // 普通值直接resolve
       resolve(x)
     }
   } catch (e) {
     if (called) return 
     called = true
     reject(e)
   }
 } else {
   // 普通值直接resolve
   resolve(x)
 }
}
```
这样，我们基本上就完成了Promise的定义

### 实现一些Promise的API
1. Promise.resolve
```js
Promise.resolve = function(value) {
  return new Promise((resolve, reject) => {
    resolve(value)
  })
}
```

2. Promise.reject
```js
Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}
```

3. Promise.race
赛跑，那个跑的快，那个返回
```js
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}
```
4. Promise.all
全部按顺序返回
```js
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    // 追后返回的数组
    let arr = []
    let i = 0 

    function processData(index, data) {
      arr[index] = data
      // 这里为什么不能使用arr.length呢？
      // 假设第二个先执行，arr[2] = 'hello'， 这时候arr.length = 3， 这是不对的，所以我们用i来控制
      if (++i === promises.length) {
        resolve(arr)
      }
    }

    for (let i = 0; i < promises.length; i++) {
      promises[i].then(data => {
        processData(i, data)
      }, reject) // 失败直接返回了就
    }
  })
}
```

5. Promise.deferred
语法糖，可以少写一层 new Promise
```js
Promise.defer = Promise.deferred = function() {
  let def = {}
  def.promise = new Promise((resolve, reject) => {
    def.resolve = resolve
    def.reject = reject
  })
  return def
}
```

### 验证
`npm install -g promises-aplus-tests`

```
module.exports = Promise
```

```
promises-aplus-tests mypromise.js
```

如果全部通过那就说明 totally 实现了一个 Promise，并且符合 PromiseA+ 规范
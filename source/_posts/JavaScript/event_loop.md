---
title: Event Loop
date: 2019-03-30 18:00:00
comment: true
categories:
- Front-Back
tags:
- Nodejs
---

## 浏览器中的事件循环和Nodejs中的事件循环

### 前言
我们都知道 js 是单线程。

好处：同一时间只能做一件事

坏处：也正是因为同一时间只能做一件事导致遇到阻塞任务的时候，只能进行等待，这样会浪费CPU资源

同步和异步关注的是**消息通信机制**
同步：在发出一个调用的时候，没有得到结果，该调用就不返回。但是一旦调用返回，就得到返回值了

异步：调用在发出之后，这个调用就直接返回了，所以没有返回结果。

举个通俗的例子：你打电话问书店老板有没有《分布式系统》这本书，如果是同步通信机制，书店老板会说，你稍等，”我查一下"，然后开始查啊查，等查好了（可能是5秒，也可能是一天）告诉你结果（返回结果）。而异步通信机制，书店老板直接告诉你我查一下啊，查好了打电话给你，然后直接挂电话了（不返回结果）。然后查好了，他会主动打电话给你。在这里老板通过“回电”这种方式来回调。

阻塞和非阻塞关注的是**程序在等待调用结果（消息，返回值）时的状态**
阻塞：调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才会返回

非阻塞：在不能立刻得到结果之前，该调用不会阻塞当前线程

还是上面的例子，你打电话问书店老板有没有《分布式系统》这本书，你如果是阻塞式调用，你会一直把自己“挂起”，直到得到这本书有没有的结果，如果是非阻塞式调用，你不管老板有没有告诉你，你自己先一边去玩了， 当然你也要偶尔过几分钟check一下老板有没有返回结果。在这里阻塞与非阻塞与是否同步异步无关。跟老板通过什么方式回答你结果无关。


同步/异步： 一个有结果，一个没结果

阻塞/非阻塞： 一个线程被挂起，一个不被挂起

<!-- more -->

#### 浏览器中的事件循环
> js代码运行的宿主环境是浏览器。浏览器内部会有不同的线程来处理不同的任务，比如：渲染引擎负责渲染，js引擎执行js代码，http线程负责http请求等。

所以，虽然说js是单线程，但是浏览器提供了多线程的环境。

那浏览器中的事件循环是怎么回事呢？

js 代码在浏览器中运行的时候，会存在一个执行栈和一个事件队列。 同步任务在执行栈上运行，异步任务的回调被放置在事件队列中。当执行栈为空是，就会去事件队列中读取异步任务的回调，放到主执行栈中执行。读取事件队列中的事件这一过程是循环执行的，所以就形成了*事件循环*

事件分为两种： 微任务(micro-task)、宏任务(macro-task)

宏任务： setTimeout, setInterval, js 代码
微任务：Promise.then()中的then

执行顺序：
先执行宏任务，然后执行微任务(任务队列中的所有微任务)

代码说明
```js
console.log('start')
setTimeout(() => {
  console.log('time1')
  Promise.resolve().then(() => {
    console.log('promise1')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('promise2')

  setTimeout(() => {
    console.log('time2')
  }, 0)
})
console.log('end')
```
上面的执行结果为： start -> end -> promise2 -> time1 -> promise1 -> time2

解析：

一开始执行栈为空，任务队列也为空，执行js代码(宏任务)

同步任务先执行， 打印 start，setTimeout(宏任务)被加入事件队列，promise(微任务)被加入事件队列，打印end。 

执行栈为空，因为刚才已经执行了宏任务，现在去读取任务队列中的微任务， 打印promise2，并把 time2(宏任务)加入任务队列。队列中没有微任务

执行栈为空，读取任务队列中的宏任务， 打印 time1， 并把 promise1(微任务) 加入任务队列， 这时候队列中还有微任务promise1，打印 promise1 

最后读取 time2， 打印 time2

原则就是： 先执行宏任务，再执行微任务。因为第一次执行js代码的时候，也是执行了宏任务，所以再去任务队列读取的时候，就会先读取微任务，在这个过程中，只要还有微任务被加入任务队列，就会再去执行微任务，直到所有的微任务执行完成之后。

将上面的代码改成下面这样。
```js
console.log('start')
setTimeout(() => {
  console.log('time1')
  Promise.resolve().then(() => {
    console.log('promise1')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('promise2')

  Promise.resolve().then(() => {
    console.log('promise3')
  })

  setTimeout(() => {
    console.log('time2')
  }, 0)
})
console.log('end')
```
执行结果为： start -> end -> promise2 -> promise3 -> time1 -> promise1 -> time2

#### Nodejs中的事件循环
nodejs是用chrome的V8引擎来执行js代码，但是在处理异步 I/O 的地方，使用了libuv库。所以nodejs中的事件循环和浏览器中的会有所不同

事件循环的六个阶段：
1. timers (setTimeout， setInterval)
2. pending callbacks (执行延迟到下一个循环迭代的 I/O 回调)
3. idle, prepare (内部使用)
4. poll (轮询，检索新的 I/O 事件;执行与 I/O 相关的回调，一般情况node将在此处阻塞)
5. check (setImmediate)
6. close callbacks (关闭I/O的回调函数)


代码解释：
```js
console.log('start')
setTimeout(() => {
  console.log('time1')
  Promise.resolve().then(() => {
    console.log('promise1')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('promise2')

  setTimeout(() => {
    console.log('time2')
  }, 0)
})
console.log('end')
```
执行结果： start -> end -> promise2 -> time1 -> time2 -> promise1

解析：

同步任务先执行： 执行 js 代码(宏任务)，打印 start end。将time1放入宏队列，then放入微队列。 然后执行微任务，打印promise2，将time2放入宏队列。(这一点和浏览器一样)
然后进入timers阶段， 打印time1, 将then放入微队。再去执行time2，打印time2。 最后执行promise1， 打印promise1。
**timers 阶段有几个 setTimeout/setInterval 都会依次执行。这一点和浏览器是不一样的。


补充： setTimeout 和 setImmediate 的执行先后顺序是不一定的。但如果是在同一个I/O操作下的话，setImmediate 总是比 setTimeout 先执行，因为poll的下一个阶段就是check。

process.nextTick() 和 setImmediate， nextTick 先执行，这是历史遗留问题。nextTick总是在进入下一个阶段之前执行。
nextTick会在各个事件阶段之间执行，一旦执行，要直到nextTick队列被清空，才会进入到下一个事件阶段，如果递归调用，会导致 I/O 饥饿问题。



#### 总结
在浏览器环境下，microtask的任务队列是每个macrotask执行完之后执行。
在Node环境下，microtask会在事件循环的各个阶段执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务


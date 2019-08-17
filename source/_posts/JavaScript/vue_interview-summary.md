---
title: interview-summary
date: 2019-04-29 11:02:17
tags:
- Vue Interview
categories:
- Interview 
---

> 关于vue的

1. 如何解决跨域?
本地的话: 在 `webpack`的配置文件中配置`proxyTable`. 当打包上线的时候, 可能会失效, 可以用`Nginx`设置反向代理或者在后端配置`cors`

2. vue的生命周期
所有的生命周期钩子自动绑定 `this` 上下文到实例中, 这意味着你不能使用`箭头函数`来定义一个生命周期方法

> 创建阶段
创建前: 
beforeCreate: 在实例初始化之后, 数据观测和 event/watcher 事件配置之前被调用.

创建:
created: 在实例创建完成后被立即调用. 观测数据, 属性和方法的运算, event/watcher 事件回调. 然而, 挂载阶段还没开始, `$el` 属性目前不可见

> 挂载阶段
挂载前:
beforeMount: 在挂载开始之前被调用: 相关的 `render` 函数首次被调用. **该钩子在服务端渲染期间不被调用.**

挂载:
mounted: `el` 被新创建的 `vm.$el` 替换, 并挂载到实例上去之后调用该钩子. **该钩子在服务端渲染期间不被调用.**

> 更新阶段
更新前:
beforeUpdate: 数据更新时调用, 发生在虚拟 DOM 打补丁之前. **该钩子在服务端渲染期间不被调用.**

更新:
updated: 由于数据更改导致的虚拟 DOM 重新渲染和打补丁, 在这之后会调用该钩子. 

> keep-alive 阶段
activated: `keep-alive` 组件激活时调用.

deactivated: `keep-alive` 组件停用时调用.

> 销毁阶段
销毁前:
beforeDestory: 实例销毁之前调用. 在这一步, 实例仍然完全可用. **该钩子在服务端渲染期间不被调用.**

destoryed: Vue 实例销毁后调用. 调用后, Vue 实例指示的所有东西都会解绑定, 所有的事件监听器会被移除, 所有的子实例也会被销毁.

> 2.5 新增
errorCaptured: 当捕获一个来自子孙组件的错误时被调用.

3. 组件之间的传值
  - 通过路由传递:
    A组件: `this.$router.push({path: '/componentB', query: { orderId: 123 }})`
    B组件: `this.$route.query.orderId`
  - props: 父 -> 子
  ```js
  // Parent
  <Children msg='hello world' />
  <Children v-bind:msg='msg' />

  import Children from 'Children'
  export default {
    data() {
      return {
        msg: 'hello world'
      }
    }
  }

  // Children
  <h1>{ msg }</h1>

  export default {
    props: ['msg],
    // or 
    props: {
      msg: String
    }
  }
  ```
  - $emit 子 -> 父
  ```js
  // Children
  <button v-on:click="passParToPar">向父组件传递参数</button>
  export default {
    data() {
      return {
        data: [1, 2, 3]
      }
    },
    methods: {
      passParToPar() {
        this.$emit('passPar', this.data)
      }
    }
  }
  // Parent
  {{msg}}
  <Children v-on:passPar="recePar"/>
  export default {
    data() {
      return {
        msg: 'hello world!'
      }
    },
    methods: {
      recePar(data) {
        this.msg = data
      }
    }
  }
  ```
  // 当点击按钮的时候, 页面的 hello world -> [1, 2, 3]

  - 兄弟组件之间的通信: event bus
  ```js
  // 创建eventBus / eventBus.js
  const eventBus = new vue()

  export { eventBus }

  // Children1
  <button @click="putDataIntoEventBus">put data into event bus</button>

  import { eventBus } from 'eventBus'

  export default {
    methods: {
      putDataIntoEventBus() {
        evevntBus.$emit('putData', 'put data into event bus...')
      }
    }
  }

  // Children2
  <h1>{{ msg }}</h1>

  import { eventBus } from 'eventBus'

  export default {
    data() {
      return {
        msg: ''
      }
    },
    created() {
      eventBus.$on('putData', data => {
        this.msg = data
      })
    }
  }
  ```

  - vuex

4. 解释下 `Vuex`
vuex 是一个专为 Vue.js 应用程序开发的`状态管理模式`, 它采用集中式存储管理应用的所有组件的状态, 并以相应的规则保证状态以一种可预测的方式发生变化.
vuex 包括 5部分, 分别为: State, Getter, Mutation, Action, Module

store的声明: 
```js
Vue.use(Vuex)
new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})

// modules
new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
```

state: 单一状态树, state是数据的唯一来源, 每个应用仅包含一个Store实例.
```js
const initialState = {
  todos: []
}
```

getter: store 的计算属性. 和组件的计算属性是一样的.
```js
completedTodos: state => {
  return state.todos.filter(todo => todo.completed)
}
```

mutation: 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation. 
```js
['ADD_TODO']({todos}, todo) {
  // 第一个参数就是 store.state
  todos.push(todo)
}

// 使用: store.commit('ADD_TODO', todo)
// or store.commit({ type: 'ADD_TODO', todo }
```
**Mutation 必须是同步函数**
mutation 设计的原则就是状态是可追踪的, 但是任何在回调函数中进行的状态的改变都是不可追踪的.

在组件中提交 Mutation
```js
// 如果有多个mutation的时候, 这样很方便
import { mapMutations } from 'vuex'

methods: {
  ...mapMutations({
    add: 'ADD_TODO',
    update: 'UPDATE_TODO'
  })
}
// or
methods: {
  // 名字必须一样
  ...mapMutations(['add', 'update'])
}
```

action: action 类似于 mutation, 不同在于: action 1) 提交的是 mutation, 而不是直接变更状态. 2) action 可以包含任意异步操作.
```js
export default {
  addTodo({commit}, todo) {
    setTimeout(() => {
      commit('ADD_TODO', todo)
    }, 1000)
  },
  updateTodo({commit}, id) {
    commit('UPDATE_TODO', id)
  }
}
```

在组件中使用
```js
import { mapActions } from 'vuex'

methods: {
  ...mapActions({
    add: 'addTodo',
    update: 'updateTodo'
  })
  // or
  ...mapActions(['add', 'update'])
}
```

module: 由于使用单一状态树, 应用的所有状态都会集中到一个比较大的对象. 当应用变得复杂时, store 对象就有可能变得相当臃肿, module就是为了解决这个问题的. 每个module都有自己的state, mutation, getters, actions
```js
const moduleA = {
  state,
  mutations,
  getters,
  actions,
}

const moduleB = {
  state,
  mutations,
  getters,
  actions,
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB,
  }
})
```
模块内部的 mutation, getters, actions
```js
mutations: {
  add(state) {

  }
}

getters: {
  doneTodos(state, getters, rootState) {

  }
}

actions: {
  add({ state, commit, rootState }) {
    commit()
  }
}
```


5. $router 和 $route 的区别
$router 是 VueRouter的实例, 主要是实现路由跳转使用, 想要导航到不同的 URL, 则视同 router.push({path: '/home'}), push方法和`<router-link to='/home'/>` 是等价的. 
$route 是 路由信息对象, 表示当前激活的路由的状态信息, 包含了完整路径, 当前 URL 解析得到的信息, 还有 URL 匹配到的 route records(路由记录), route 对象是不可变的, 每次成功的导航后都会生成一个新的对象

**下面输出什么?**

```js
var foo = 'window'
var myObject = {
	foo: "bar",
	func: function () {
		var self = this;
		console.log("outer func:  this.foo = " + this.foo); // bar
		console.log("outer func:  self.foo = " + self.foo); // bar
		(function () {
			console.log("inner func:  this.foo = " + this.foo); // undefined
			console.log("inner func:  self.foo = " + self.foo); // bar
		}());
	}
};
myObject.func();  // 这样调用 在 func() 里面 this就指向myObject, 里面的this指向window


// 输出
// outer func:  this.foo = bar
// outer func:  self.foo = bar
// inner func:  this.foo = window // 浏览器模式下
// inner func:  self.foo = bar
```

**下面输出什么?**
```js
var a = 1

function test() {
  console.log(a)
  setTimeout(() => {
    console.log(a, 'timeout')
  }, 0)
  new Promise((resolve, reject) => {
    console.log(a, 'promise')
    resolve()
    console.log(2)
  }).then(() => {
    console.log(a, 'then')
  })
  var a = 'hello'
  console.log(a)
}

test()

// 1. undefined 变量声明提升
// 2. undefined promise　new Promise 是同步执行的
// 3. 2  resolve() 之后还是会执行的
// 4. hello 
// 5. hello then // 在浏览器中, 每次宏任务执行完毕之后, 会先去事件队列中执行所有的微任务
// 6. hello timeout // 执行宏任务
```

下面输出什么?
```js
console.log(1&&2) // 2
console.log(0&&2) // 0
console.log(1||2) // 1
console.log(0||2) // 2

// && 如果第一个值为true，返回第二个值。如果第一个值为false，返回false。 
// || 如果第一个值为false，返回第二个值。如果第一个值为true，返回第一个值。
```

**实现一个sleep**
```js
function sleep(ms) {
  const now = Date.now()
  const expir = now + ms

  while (Date.now() < expir) ;

  return;
}
```

**实现一个异步reducer**
```js
// 异步加函数
function asyncAdd(a, b) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(a + b)
    }, 1000)
  })
}

function asyncReduce(cb) {
  return funtion(arr) {
    return arr.reduce((value, item) => {
      return Promise.resolve(value).then(data => {
        return cb.call(null, data, item)
      })
    })
  }
}

const arr = [1, 2, 3, 4, 5]

asyncReduce(asyncAdd)(arr).then(data => {
  console.log(data) // wait 5s print 15
})
```
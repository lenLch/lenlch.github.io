---
title: interview-summary
date: 2019-04-30 14:17:17
tags:
- React Interview
categories:
- Interview 
---

// 

### 组件中的通信
1. props 父 -> 子
```js
// Parent
import React from 'react';
import Child from './Child'

const App = () => {
  return (
    <Child name="lance"/>
  )
}
export default App

// Child
import React from 'react'

const Child = props => (
  <div>
    <h1>parameter from parent: {props.name}</h1>
  </div>
)

export default Child
```

2. 回调 子 -> 父
```js
// Parent
import React, { Fragment, useState } from 'react';
import Child from './Child'

const App = () => {

  const [data, setData] = useState(null)

  const passHandler = data => {
    setData(data)
  }
  return (
    <Fragment>
      {data && (<h1>This param is come from Child: {data}</h1>)}
      <Child
        name="lance"
        pass={passHandler}
      />
    </Fragment>
  )
}

export default App

// Child
import React from 'react'

const Child = props => {
  const passParamToParent = () => {
    props.pass('Hello world!')
  }

  return (
    <div>
      <h1>parameter from parent: {props.name}</h1>
      <button onClick={passParamToParent}>向父组件传递参数</button>
    </div>
  )
}

export default Child
```
点击按钮就能在页面上看到子组件传递过来的参数了.

3. Context
```js
// Parent 
import React, { useState, createContext } from 'react';
import './App.css';
import Child from './Child'
import Child2 from './Child2'

const App = () => {
  const StateContext = createContext()
  
  const [number, setNumber] = useState(0)

  const changeHandler = (number) => {
    setNumber(number)
  }

  return (
    <StateContext.Provider
      // 这个很重要
      value={{
        number,
        change: changeHandler,
      }}
    >
      <Child />
      <Child2 />
    </StateContext.Provider>
  )
}

export default App

// Child1
import React from 'react'
import StateContext from './Context'

const Child = props => {

  return (
    <StateContext.Consumer>
      {({ number, change }) => (
        <div>
          <h1>Child1: {number}</h1>
          <button onClick={() => change(0)}>Child1 change the number to zero.</button>
        </div>
      )}
    </StateContext.Consumer>
  )
}

export default Child

// Child2
import React from 'react'
import StateContext from './Context'

const Child2 = props => {
  return (
    <StateContext.Consumer>
      {({ number, change }) => (
        <div>
          <h2>Child2: {number}</h2>
          <button onClick={() => change(20)}>Child2 change the number to twenty</button>
        </div>
      )}
    </StateContext.Consumer>
  )
}

export default Child2
```

或者你也可以使用 `useConext` 这个 hook
```js
// Parent
import React, { useState, useContext } from 'react';
import Child from './Child'
import Child2 from './Child2'
import StateContext from './Context'


const App = () => {
  const { number } = useContext(StateContext)
  const [num, setNum] = useState(number)

  const changeHandler = (number) => {
    setNum(number)
  }

  return (
    <div>
      <Child num={num} change={changeHandler} />
      <Child2 num={num} change={changeHandler} />
    </div>
  )
}

export default App

// Child1
import React from 'react'
const Child = props => {
  return (
    <div>
      <h1>Child1: {props.num}</h1>
      <button onClick={() => props.change(0)}>Child1 change the number to zero.</button>
    </div>
  )
}

export default Child

// Child2
import React from 'react'
const Child2 = props => {
  return (
    <div>
      <h1>Child1: {props.num}</h1>
      <button onClick={() => props.change(20)}>Child1 change the number to twenty.</button>
    </div>
  )
}

export default Child2
```

4. Redux
三大原则: 
  1. 单一数据源
    整个应用的 state 存储在一个 store 中
  2. state 是只读的
    唯一改变 state 的方法是触发 action, action 是一个用于描述已发生事件的普通对象
  3. 使用纯函数(Reducer)来执行修改
    为了描述 action 如何改变 state tree, 你需要编写 reducers, 当应用越来越大的时候, 可以拆分 reducer, 然后使用 combineReducers 合并成一个reducer
    reducer 接受先前的 state 和 actio, 并返回*新*的 state, 注意这里是新的 state

    immutable 是一个可实现持久化数据结构的 js 库, 每次操作都会但会一个新的值, 所以他能很好的和 redux 结合, 而不用每次在 reducer的 case里面写 `...` 什么的了.

  



store: 

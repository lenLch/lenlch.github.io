---
title: virtualDom
date: 2019-03-27 13:54:49
comment: true
categories:
- Front-Back
tags:
- JavaScript
---

## This part, let's talk about how to implement a virtual dom

#### What is Virtual Dom?
Virtual DOMs usually refer to **plain objects** representing the actual DOMs

> The Document Object Model (DOM) is a programming interface for HTML documents

For instance, when you do this:
```
const $app = document.getElementById('app')
```

You will get the DOM for `<div id="app"></div>` on the page. This DOM will have some programming interface for you to control it. For instance:
```
$app.innerHTML = 'Hello World!'
```

To make a plain object to represent `$app`, we can write something like this:
```
const vApp = {
  type: 'div',
  props: {
    id: 'app'
  },
  children: []
}
```

<!-- more -->

> There is no strict rulf of how the virtual dom should look like. You can call it `tagName` instead of `type`, or `attrs` instead of `props`, As soon as it represents the DOM, it's a **Virtual Dom**

> Virtual Dom will not have any of those programming interface. This is what makes them **lightweight** comparing to actual DOMs.

OK, now, let's implement our Virtual dom.

<!-- more -->

#### Implement
```Shell
mkdir vdom
cd vdom/
git init && npm init -y
npm install parcel-bundler --save // parcel-bunder is a bundler code tool, it supports all kinds of file format.
touch index.html
mkdir src
```

**index.html**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Implement Virtual Dom</title>
</head>
<body>
  <div id="app"></div>
  <script src="./src/index.js"></script>
</body>
</html>
```

**src/index**
```js
const virtualDom = {
  type: 'div',
  props: {
    class: 'test'
  },
  children: []
}

console.log(virtualDom)
```

**package.json**
```json
"scripts": {
  "dev": "parcel index.html"
},
```

**start server**
```bash
npm run dev
```

if you see the console.log in the browser, it means the server has been started.

Now, we have to think of three things.
1. create virtual dom
2. convert virtual dom to real dom
3. put the real dom into page
4. compare two virtual doms, and find the difference.


Let's do it step by step

#### create virtual dom

**src/element.js**
```js

class Element {
  constructor(type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}

function CreateElement(type, props, children) {
  return new Element(type, props, children)
}

export {
  CreateElement
}
```

**src/index**
```js
...
...
import { CreateElement } from './element'
const virtualDom = CreateElement('div', { class: 'test' }, ['this is my first virtual'])

console.log(virtualDom)
```

Then, you will see something like this...

![1.png](/images/virtualDom/1.png)

ok, let's continue

#### real dom

now, you will write the `render` function convert the virtual dom to real dom

**src/element.js**
```js
...
function render(node) {
  const $node = document.createElement(node.type)

  for (const key in node.props) {
    $node.setAttr($node, key, node.props[key])
  }

  for (let child of node.children) {
    child = (child instanceof Element) ? render(child) : document.createTextNode(child)
    $node.appendChild(child)
  }
}

function setAttr(node, key, value) {
  switch (key) {
    case 'value':
      if (node.type.toLowerCase() === 'input' ||
        node.type.toLowerCase() === 'textarea') {
          node.value = value
        }
      break
    case 'style':
      node.style.cssText = value
      break
    default:
      node.setAttribute(key, value)
  }
  return $node
}

export {
  render
}
```

now, we can call this function

**src/index.js**
```js
...
...
import { render } from './element'
const realDom = render(virtualDom)
console.log(realDom)
```

then, you will see the console log like this...
![2.png](/images/virtualDom/2.png)

#### render real dom

now, let's put the real dom into page
**src/element.js**
```js
function renderDom(node, target) {
  target.appendChild(node)
}

export {
  renderDom
}
```

**src/index.js**
```js
...
import { renderDom } from './element'
renderDom(realDom, document.getElementById('app'))
```

now, you can see the "this is my first virtual" on your page!!!

------------

The most important part is coming

#### Diff
```bash
cd src/
mkdir diff.js
```

**src/diff.js**

> before we start diif, let's talk about what we are gonna do.
target: compare two virtual doms

How to compare ???

we have to know one thing --- the virtual dom looks like a tree
so, we are gonna use **Priority Depth-First Traversa**

I drew a so ugly pic, I hope it will help you to understand...
![3.png](/images/virtualDom/3.png)

*conclusion:*

some rules:
1. if the new child node just changed the text, we will remake 'text'
2. if the new child add a dom, we will remake 'add'
3. if the new child remove a dom, we will remake 'remove'
4. if the new child changed the dom type ('div' --> 'ul'), we will remake 'replace'
5. if the new child changed the dom's attrs, we will remake 'attr'

and, every time, we have to remember which part have to change, we will depend on the index to update the dom.
so, index is important.


let's code...

here's the rule
**src/rule.js**
```js

const ADD = 'ADD'
const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'
const TEXT = 'TEXT'
const ATTR = 'ATTR'

export {
  ADD,
  REMOVE,
  REPLACE,
  TEXT,
  ATTR
}
```

**src/diff.js**
```js
function diff(oldTree, newTree) {
  // it will store all the changes.
  const patches = {}
  // we are start at 0
  let index = 0

  // using the depth-first traversa
  walk(oldTree, newTree, index, patches)

  return patches
}

import { ADD, REMOVE, REPLACE, TEXT, ATTR } from './rule'

function walk(oldNode, newNode, index, patches) {
  // store current compare's difference
  let current = []

  // if newnode is null
  if (!newNode) {
    current.push({
      type: REMOVE,
      index
    })
  }
  // if old and new tree are string
  else if (isString(oldNode) && isString(newNode)) {
    // if the are same, it shows they are not change
    // so we just need to determine they are not same
    if (oldNode !== newNode) {
      current.push({
        type: TEXT,
        text: newNode
      })
    }
  }
  // if the dom type is same (div --> ul)
  else if (oldNode.type === newNode.type) {
    // first of all, we have to know the attr is change?
    // two, we have to know the child is change?
    const attr = diffAttr(oldNode.props, newNode.props)
    // show there is have change
    if (Object.keys(attr).length > 0) {
      current.push({
        type: ATTR,
        attr
      })
    }

    // now, we have to compare the children
    // why is there can not use this index
    // just think about it, if use this index, when the come back, it will return to the original value
    // so, we have to maintain another index
    // diffChild(oldNode.children, newNode.children, index, patches) 
    diffChild(oldNode.children, newNode.children, patches)

  }
  // changed the dom type
  else {
    current.push({
      type: REPLACE,
      newNode
    })
    // there is why you have to call getLength
    // I explained in the addWalk function.
    // when you replace the dom. you have to figure out how many children the node have.
    getLength(oldNode.children)
  }
}

// judge the node is a string
function isString(node) {
  return Object.prototype.toString.call(node) === '[object String]'
}

// compare attrs
function diffAttr(oldAttrs, newAttrs) {
  // store the change
  let patch = {}

  // put all old attrs into patch
  for (const key in oldAttrs) {
    // if the key is same, update the value into new value
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key]
    }
  }

  for (const key in newAttrs) {
    // if newAttrs have some additional attrs, you have to push into patches.
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key]
    }
  }

  return patch
}

// this index is the correct index
let Index = 0
function diffChild(oldChildren, newChildren, patches) {
  // there are some cases we should know
  // 1. what if the new children add dom
  // 2. what if the new children cut off some dom
  // 3. we have to know the parent, so we can add or remove the dom in the right place.

  // this case the children length are same
  // all we need do just compare every child
  if (oldChildren.length === newChildren.length) {
    oldChildren.forEach((child, idx) => {
      // every time we compared, we have to add the Index value, and that's why we can use the same index.
      walk(child, newChildren[idx], ++Index, patches)
    })
  } 
  // this case is new children cut off some doms
  else if (oldChildren.length > newChildren.length) {
    newChildren.forEach((child, idx) => {
      walk(oldChildren[idx], child, ++Index, patches)
    })

    // we have to remove the rest of the old children's dom
    oldChildren.slice(newChildren.length).forEach(child => {
      removeWalk(++Index, patches)
    }) 
  } else {
    // tips: firs, we need to find the additional dom in the new, so, we can put them in the right parent's place
    // otherwise, the index it will be wrong
    newChildren.slice(oldChildren.length).forEach(child => {
      addWalk(child, Index, patches)
    })
    oldChildren.forEach((child, idx) => {
      walk(child, newChildren[idx], ++Index, patches)
    })
  }
}

function addWalk(node, index, patches) {
  // this function is simple, sometimes, if is the first time compare, it will be null
  // there is something you should be pay attention
  // add dom, you don't have to add the index, but remove, you have to figure out there are how many children have. then add into index
  if (patches[index]) {
    patches[index].push({
      type: ADD,
      addNode: node
    })
  } else {
    patches[index] = [{
      type: ADD,
      addNode: node
    }]
  }
}

function removeWalk(index, patches) {
  if (patches[index]) {
    patches[index].push({
      type: 'REMOVE',
      index
    })
  } else {
    patches[index] = [{
      type: 'REMOVE',
      index
    }]
  }
  ++Index
}

function getLength(node) {
  node.forEach(child => {
    Index++
    // Recursive call 
    getLen(child)
  })
}

function getLen(node) {
  if (!node) return 
  if (node.children && node.children.length > 0) {
    node.children.forEach(item => {
      Index++
      getLen(item)
    })
  }
}

export default diff
```

now, you can call the diff function, can see what you get

**src/index.js**
```js
...
import diff from './diff'
// now, you need two virtual dom, and compare the difference
const virtualDom1 = CreateElement('ul', {class: 'test'}, [
  CreateElement('li', { class: 'test' }, [
    CreateElement('li', { class: 'test' }, ['a1']),
    CreateElement('li', { class: 'test' }, ['a2']),
    CreateElement('li', { class: 'test' }, ['a3'])
  ]),
  CreateElement('li', { class: 'test' }, [
    CreateElement('p', { class: 'test' }, [
      CreateElement('li', { class: 'test' }, [
        CreateElement('li', { class: 'test' }, [
          CreateElement('li', { class: 'test' }, [
            CreateElement('li', { class: 'test' }, ['neinei'])
          ])
        ])
      ]),
      CreateElement('li', { class: 'test' }, ['heihei']),
    ]),
  ]),
  CreateElement('li', { class: 'test' }, ['c']),
  CreateElement('li', { class: 'test' }, ['d'])
])

const virtualDom2 = CreateElement('ul', {class: 'test'}, [
  CreateElement('li', { class: 'test' }, [
    CreateElement('li', { class: 'test' }, ['1']),
    CreateElement('li', { class: 'test' }, ['2']),
    CreateElement('li', { class: 'test' }, ['333']),
    CreateElement('li', { class: 'test' }, ['444'])
  ]),
  CreateElement('div', { }, [
    CreateElement('p', { class: 'test' }, ['this is p1']),
    CreateElement('p', { class: 'test' }, ['this is p2']),
    CreateElement('p', { class: 'test' }, ['this is p3']),
    CreateElement('p', { class: 'test' }, ['this is p4']),
    CreateElement('p', { class: 'test' }, ['this is p5']),
    CreateElement('p', { class: 'test' }, ['this is p6']),
    CreateElement('p', { class: 'test' }, ['this is p7']),
    CreateElement('p', { class: 'test' }, ['this is p8']),
    CreateElement('p', { class: 'test' }, ['this is p9']),
    CreateElement('p', { class: 'test' }, ['this is p10']),
    CreateElement('p', { class: 'test' }, ['this is p11']),
  ]),
  CreateElement('div', { class: 'haha' }, [
    CreateElement('span', { class: 'test' }, ['this is span1']),
    CreateElement('span', { class: 'test' }, ['this is span2'])
  ]),
  CreateElement('div', { class: 'heihei' }, ['dd']),
  CreateElement('div', { }, [
    CreateElement('h1', { class: 'test' }, ['this is h1']),
    CreateElement('h2', { class: 'test' }, ['this is h2'])
  ])
])

const patches = diff(virtualDom1, virtualDom2)
  
console.log(patches)
```

now, you will see this:
![4.png](/images/virtualDom/4.png)

if you don't understand, you can draw pic on you page. you will know it.

next step, update the diff into page

#### Patch
```bash
cd src
touch patch.js
```

**src/patch.js**
```js
import { render, setAttr, Element } from './element'
import { ATTR, REPLACE, REMOVE, ADD, TEXT } from './rule'

let allPatches
let index = 0

function patch(node, patches) {
  allPatches = patches
  walk(node)  
}

function walk(node) {
  let current = allPatches[index++]
  let childNodes = node.childNodes
  // find the deepest dom, and do the patch(update the difference, if they have).
  childNodes.forEach(child => walk(child))

  if (current) {
    doPatch(node, current)
  }
}

function doPatch(node, patches) {
  patches.forEach(patch => {
    switch (patch.type) {
      case ATTR:
        // set the new attr
        for (let key in patch.props) {
          let value = patch.props[key]
          if (value) {
            setAttr(node, key, value)
          } else {
            node.removeAttribute(key)
          }
        }
        break
      case TEXT:
        // just change the text
        node.textContent = patch.text
        break
      case REPLACE:
        let newNode = patch.newNode
        newNode = (newNode instanceof Element) ? render(newNode) : document.createTextNode(newNode)
        // find current node's father, and replace the children.
        node.parentNode.replaceChild(newNode, node)
        break
      case REMOVE:
        // find the current node's father, and remove the children
        node.parentNode.removeChild(node)
        break
      case ADD:
        let addNode = patch.addNode
        addNode = (addNode instanceof Element) ? render(addNode) : document.createTextNode(addNode)
        // just add the children base on current node
        node.appendChild(addNode)
        break
      default:
        break
    }
  })
}

export default patch
```

now, you can finally achieve them...

**src/index.js**
```js
...
import patch from './patch'
patch(realDom, patches)
```

now, you will see the change on the page.

#### The end
There is still have some problem we have to resolve.

Just think about it, if they just changed the localtion on the page. You have to compare them, do remove them, add them again.

If there have the best way to resolve this problem. Maybe you will know, they is have a **key** in react or vue. Yes.

But unfortunately, I don't know how to achieve it so far. If I know it, I will update this article.

Thanks for you reading...If there is have anything wrong with you, you can add my wechat, we can talk about it, my wechat number is "tears145"

Thanks, see ya!
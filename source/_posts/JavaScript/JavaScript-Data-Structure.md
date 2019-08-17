---
title: JavaScript Data Structure
date: 2019-04-22 14:24:24
comment: true
categories:
- Front-Back
tags:
- JavaScript
---

**Javascript中的数据结构**

### 列表
```js
class List {
  constructor() {
    this.listSize = 0
    this.pos = 0 // 指针
    this.dataStore = []
  }

  length() {
    return this.listSize
  }

  // 清除列表
  clear() {
    this.dataStore = []
    this.listSize = this.pos = 0
  }

  // 判断给定值是否在列表中
  contains(value) {
    if (this.find(value) > -1) {
      return true
    }
    return false
  }

  toString() {
    return this.dataStore.toString()
  }

  // 获取当前指针的元素
  getElement() {
    return this.dataStore[this.pos]
  }

  // 插入到某元素之后
  insert(value, after) {
    const idx = this.find(after)
    if (idx > -1) {
      this.dataStore.splice(idx+1, 0, value)
      ++this.listSize
      return true
    }

    return false
  }

  // 添加元素到列表末尾
  append(value) {
    this.dataStore[this.listSize++] = value
  }


  find(value) {
    // return this.dataStore.indexOf(value)
    for (let i = 0; i < this.dataStore.length; i++) {
      if (this.dataStore[i] === value) {
        return i
      }
    }
    return -1
  }

  // 移除元素
  remove(value) {
    const idx = this.find(value)
    if (idx > -1) {
      this.dataStore.splice(idx, 1)
      --this.listSize
      return true
    }
    return false
  }

  // 指针头
  front() {
    this.pos = 0
  }

  // 指针尾
  end() {
    this.pos = this.listSize - 1
  }

  // 前移指针
  prev() {
    if (this.pos > 0) {
      --this.pos
    }
  }

  // 后移指针
  next() {
    if (this.pos < this.listSize - 1) {
      ++this.pos
    }
  }

  // 当前指针
  currPos() {
    return this.pos
  }

  moveTo(position) {
    this.pos = position
  }
}

const names = new List();
names.append("Clayton");
names.append("Raymond");
names.append("Cynthia");
names.append("Jennifer");
names.append("Bryan");
names.append("Danny");
names.front();
console.log(names.getElement()); //  Clayton
names.next();
console.log(names.getElement()); //  Raymond
names.next();
names.next();
names.prev();
console.log(names.getElement()); //  Cynthia

for(names.front(); names.currPos() < names.length(); names.next()) {
  console.log(names.getElement());
}
```
<!-- more -->
### 栈
栈是一种`先进后出的数据结构`

```js
class Stack {
  constructor() {
    this.dataStore = []
    this.top = 0
  }

  // 往栈顶添加元素
  push(value) {
    this.dataStore[this.top++] = value
  }

  pop() {
    return this.dataStore[--this.top]
  }

  // 返回栈顶元素
  peek() {
    return this.dataStore[this.top - 1]
  }

  length() {
    return this.top
  }

  // 清空栈
  clear() {
    this.top = 0
  }
}

const s = new Stack();
s.push("David");
s.push("Raymond");
s.push("Bryan");
console.log("length: " + s.length()); // length: 3
console.log(s.peek()); // Bryan
var popped = s.pop();
console.log("The popped element is: " + popped); // The popped element is Bryan
console.log(s.peek()); // Raymond
s.push("Cynthia");
console.log(s.peek()); // Cynthia
s.clear();
console.log("length: " + s.length()); // length: 0
console.log(s.peek()); // undefined
s.push("Clayton");
console.log(s.peek()) // Clayton
```
**栈的应用**
1. 进制转换
```js
function mulBase(num, base) {
  const s = new Stack()
  while (num > 0) {
    s.push(num % base)
    num = Math.floor(num / base)
  }

  let res = ''

  while(s.length() > 0) {
    res += s.pop()
  }

  return res
}
```
2. 回文字符串
```js
function isPalindrome(word) {
  const s = new Stack()
  for (let i = 0; i < word.length; i++) {
    s.push(word[i])
  }

  let newWord = ''

  while (s.length() > 0) {
    newWord += s.pop()
  }

  if (newWord === word) {
    return true
  }
  return false
}
```

### 队列
队列是一种先进先出的数据结构
```js
class Queue {
  constructor() {
    this.dataStore = []
  }

  // 入队
  enqueue(element) {
    this.dataStore.push(element)
  }

  // 出队
  dequeue() {
    return this.dataStore.shift()
  }

  front() {
    return this.dataStore[0]
  }

  back() {
    return this.dataStore[this.dataStore.length - 1]
  }

  toString() {
    return this.dataStore.toString()
  }

  empty() {
    return this.dataStore.length === 0
  }
}

var q = new Queue();
q.enqueue("Meredith");
q.enqueue("Cynthia");
q.enqueue("Jennifer");
console.log(q.toString());
q.dequeue();
console.log(q.toString());
console.log("Front of queue: " + q.front());
console.log("Back of queue: " + q.back());
```

**双端队列**
```js
class Deque {
  /** 
   * 这是双端队列  (即两个端部：首部和尾部)
   */
  constructor() {
    this.items = new Array()
  }

  isEmpty() {
    return this.items.length === 0
  }

  size() {
    return this.items.length
  }

  // 在后面添加
  addRear(newdata) {
    this.items.push(newdata)
  }

  // 在前面添加
  addFront(newdata) {
    this.items.unshift(newdata)
  }

  // 在后面删除
  removeRear() {
    return this.items.pop()
  }

  // 在前面删除
  removeFront() {
    return this.items.shift()
  }
}
```

**应用**
1. 回文检查
```js
function palChecker(str) {
  let deque = new Deque()
  for (let i = 0; i < str.length; i++) {
      deque.addRear(str[i])
  }
  
  while (deque.size() > 1) {
      let rear = deque.removeRear()
      let front = deque.removeFront()
      
      if (rear !== front) {
          return false
      }
  }
  return true
}

console.log(palChecker('ababcbaba'))
```

### 链表
1. 单向链表
```js
class Node {
  constructor(element) {
    this.element = element
    this.next = null
  }
}

class LList {
  constructor() {
    this.head = new Node('head')
  }

  find(item) {
    let currNode = this.head
    while (currNode.element !== item) {
      currNode = currNode.next
    }
    return currNode
  }

  insert(newElement, item) {
    const newNode = new Node(newElement)
    const current = this.find(item)
    newNode.next = current.next
    current.next = newNode
  }

  findPrevious(item) {
    let currNode = this.head
    while (currNode.next != null && currNode.next.element !== item) {
      currNode = currNode.next
    }
    return currNode
  }

  remove(item) {
    const prevNode = this.findPrevious(item)
    if (prevNode != null) {
      prevNode.next = prevNode.next.next
    }
  }

  display() {
    let currNode = this.head
    while (currNode.next != null) {
      console.log(currNode)
      currNode = currNode.next
    }
  }
}

var cities = new LList();
cities.insert("Conway", "head");
cities.insert("Russellville", "Conway");
cities.insert("Carlisle", "Russellville");
cities.insert("Alma", "Carlisle");
cities.display();
console.log('===========');
cities.remove("Carlisle");
cities.display();
```

2. 双向链表
```js
class Node {
  constructor(element) {
    this.element = element
    this.next = null
    this.prev = null
  }
}

class LList {
  constructor() {
    this.head = new Node('head')
  }

  findLast() {
    let currNode = this.head
    while (currNode.next != null) {
      currNode = currNode.next
    }
    return currNode
  }

  dispReverse() {
    let currNode = this.findLast()
    while (currNode.prev != null) {
      console.log(currNode.element)
      currNode = currNode.prev
    }
  }

  find(item) {
    let currNode = this.head
    while (currNode.element !== item) {
      currNode = currNode.next
    }
    return currNode
  }

  remove(item) {
    let currNode = this.find(item)
    if (currNode.next != null) {
      currNode.prev.next = currNode.next
      currNode.next.prev = currNode.prev
      currNode.next = null
      currNode.prev = null
    }
  }

  display() {
    let currNode = this.head
    while (currNode.next != null) {
      console.log(currNode.next.element)
      currNode = currNode.next
    }
  }

  // 每次都是在末尾插入
  insert(newElement, item) {
    let currentNode = this.find(item)
    const newNode = new Node(newElement)
    newNode.next = currentNode.next
    newNode.prev = currentNode
    currentNode.next = newNode
  }
}

var cities = new LList();
cities.insert("Conway", "head");
cities.insert("Russellville", "Conway");
cities.insert("Carlisle", "Russellville");
cities.insert("Alma", "Carlisle");
cities.display();
console.log('======');
cities.remove("Carlisle");
cities.display();
console.log('======');
cities.dispReverse();
```

3. 循环链表
```js
// 和单链表不同之处
class LList {
  constructor() {
    this.head = new Node('head')
    this.head.next = head
  }
  // ... 
  display() {
    let currNode = this.head
    while (currNode.next != null && currNode.next.element !== 'head') {
      console.log(currNode.next.element)
      currNode = currNode.next
    }
  }
  // ...
}
```

4. 双向循环链表
和循环链表一样, 尾的下一个指向头一个, 可以自己实现一下

### 字典
```js
class Dictionary {
  constructor() {
    this.dataStore = new Array()
  }

  add(key, value) {
    this.dataStore[key] = value
  }

  find(key) {
    return this.dataStore[key]
  }

  remove(key) {
    delete this.dataStore[key]
  }

  showAll() {
    for (let key of Object.keys(this.dataStore)) {
      console.log(`${key} -> ${this.dataStore[key]}`)
    }
  }

  count() {
    let n = 0
    for (let key of Object.keys(this.dataStore)) {
      ++n
    }
    return n
  }

  clear() {
    for (let key of Object.keys(this.dataStore)) {
      delete this.dataStore[key]
    }
  }
}

var pbook = new Dictionary();
pbook.add("Mike","123");
pbook.add("David", "345");
pbook.add("Cynthia", "456");
console.log("David's extension: " + pbook.find("David"));
pbook.remove("David");
pbook.showAll();
console.log(pbook.count())
```

### 散列
散列后的数据可以快速地插入或取用.
散列使用的数据结构叫散列表.
在散列表上插入, 删除和取用数据都非常快, 但是对于查找操作来说却效率低下.
```js
class HashTable {
  constructor() {
    this.table = new Array(137);
  }

  put(data) {
		const pos = this.betterHash(data);
    this.table[pos] = data;
	}
	
	get(key) {
		return this.table[this.betterHash(key)]
	}

  simpleHash(data) {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data.charCodeAt(i);
    }
    return total % this.table.length;
  }

  showDistro() {
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i] != null) {
        console.log(i + ": " + this.table[i]);
      }
    }
  }

  betterHash(data) {
    const H = 31;
    var total = 0;
    for (var i = 0; i < data.length; ++i) {
      total += H * total + data.charCodeAt(i);
    }
    return total % this.table.length;
	}
	
	buildChains() {
		for (let i = 0; i < this.table.length; i++) {
			this.table[i] = new Array()
		}
	}
}

const someNames = ["David", "Jennifer", "Donnie", "Raymond", "Cynthia", "Mike", "Clayton", "Danny", "Jonathan"]

const hTable = new HashTable()

for (let i = 0; i < someNames.length; i++) {
	hTable.put(someNames[i])
}

hTable.showDistro()
```

### 集合
集合是一种无序的并且不重复的数据结构
```js
class Set {
	constructor() {
		this.dataStore = []
	}

	add(data) {
		if (this.dataStore.indexOf(data) < 0) {
			this.dataStore.push(data)
			return true
		} else {
			return false
		}
	}

	remove(data) {
		const pos = this.dataStore.indexOf(data)
		if (pos > -1) {
			this.dataStore.splice(pos, 1)
			return true
		} else {
			return false
		}
	}

	show() {
		return this.dataStore
	}

	size() {
		return this.dataStore.length
	}

	contains(data) {
		if (this.dataStore.indexOf(data) > -1) {
			return true
		} else {
			return false
		}
	}

	// 并集
	union(set) {
		const tempSet = new Set()
		for (let i = 0; i < this.dataStore.length; i++) {
			tempSet.add(this.dataStore[i])
		}

		for (let i = 0; i < set.dataStore.length; i++) {
			if (!tempSet.contains(set.dataStore[i])) {
				tempSet.dataStore.push(set.dataStore[i])
			}
		}
		return tempSet
	}

	// 交集
	intersect(set) {
		let tempSet = new Set()
		for (let i = 0; i < this.dataStore.length; i++) {
			if (set.contains(this.dataStore[i])) {
				tempSet.add(this.dataStore[i])
			}
		}
		return tempSet
	}

	// 是否是 set 的子集
	subset(set) {
		if (this.size() > set.size()) {
			return false
		} else {
			for (let member of this.dataStore) {
				if (!set.contains(member)) {
					return false
				}
			} 
		}
		return true
	}

	// 差集
	difference(set) {
		let tempSet = new Set()
		for (let i = 0; i < this.dataStore.length; i++) {
			if (!set.contains(this.dataStore[i])) {
				tempSet.add(this.dataStore[i])
			}
		}
		return tempSet
	}
}

const names = new Set()
names.add("David");
names.add("Jennifer");
names.add("Cynthia");
names.add("Mike");
names.add("Raymond");
if (names.add('Mike')) {
	console.log('Mike added')
} else {
	console.log('Can not add Mike, must already be in set')
}

console.log(names.show())
```

### 二叉树和二叉查找树
树是一种非线性数据结构
在二叉树上进行查找非常快(而在链表上查找则不是这样), 为二叉树添加或删除元素也非常快(而对数组执行添加或删除操作则不是这样)

```js
class Node {
	constructor(data, left, right) {
		this.data = data
		this.left = left
		this.right = right
	}

	show() {
		return this.data
	}
}

// 二叉查找树
class BST {
	constructor() {
		this.root = null
	}

	// 插入
	insert(data) {
		const n = new Node(data, null, null)
		if (this.root == null) {
			this.root = n
		} else {
			let current = this.root
			let parent
			while (true) {
				parent = current
				if (data < current.data) {
					// 左子树
					current = current.left
					if (current == null) {
						parent.left = n
						break
					}
				} else {
					// 右子树
					current = current.right
					if (current == null) {
						parent.right = n
						break
					}
				}
			}
		}
	}

	// 前序遍历 根->左->右
	preOrder(node) {
		if (node != null) {
			console.log(node.show() + ' ')
			this.preOrder(node.left)
			this.preOrder(node.right)
		}
	}

	// 中序遍历 左->根->右
	inOrder(node) {
		if (node != null) {
			this.inOrder(node.left)
			console.log(node.show() + ' ')
			this.inOrder(node.right)
		}
	}

	// 后序遍历 左->右->根
	postOrder(node) {
		if (node != null) {
			this.postOrder(node.left)
			this.postOrder(node.right)
			console.log(node.show() + '')
		}
	}

	// 查找最小值
	getMin() {
		let current = this.root
		while (current.left != null) {
			current = current.left
		}

		return current.data
	}

	// 查找最大值
	getMax() {
		let current = this.root
		while (current.right != null) {
			current = current.right
		}
		return current.data
	}

	// 查找给定值的节点
	find(data) {
		let current = this.root
		while (current != null) {
			if (current.data === data) {
				return current
			} else if (data < current.data) {
				current = current.left
			} else {
				current = current.right
			}
		}
		return null
	}
	
	// 删除节点
	// 分几种情况
	// 1. 删除的节点没有子节点
	// 2. 删除的节点有一个子节点
	// 3. 删除的节点有两个子节点
	remove(data) {
		this.root = this.removeNode(this.root, data)
	}

	// remove node
	removeNode(node, data) {
		if (node == null) {
			return null
		}
		if (data === node.data) {
			if (node.left == null && node.right == null) {
				return null
			}

			if (node.left == null) {
				return node.right
			}

			if (node.right == null) {
				return node.left
			}
			// 有两个子节点, 因为左节点都是比他本身小的, 所以我们只需要找到右节点中最小的那个
			let tempNode = this.getSmallest(node.right)
			node.data = tempNode.data // 改变要删除的node的值为右子树中最小的那个值
			node.right = this.removeNode(node.right, tempNode.data) // 将node的右子树重新赋值为 node.right, 并且node.right 中去执行删除开始找出的那个最小的值的节点, 也就是 tempNode
			return node
		} else if (data < node.data) {
			// 如果当前要移除的节点的值比 node节点的值小的, 就据需往左做深度遍历
			node.left = this.removeNode(node.left, data)
			return node
		} else {
			// 如果当前要移除的节点的值比 node节点的值大的, 就据需往右做深度遍历
			node.right = this.removeNode(node.right, data)
			return node
		}
	}

	getSmallest(node) {
		if (node) {
			// 找最小的话, 最节点的最下面一层就是最小的
			while (node && node.left != null) {
				node = node.left
			}
			return node
		}
		return null
	}

}

const nums = new BST();
nums.insert(23);
nums.insert(45);
nums.insert(16);
nums.insert(37);
nums.insert(3);
nums.insert(99);
nums.insert(22);
nums.insert(88);
nums.insert(77);

nums.remove(45)

console.log(nums.find(77))
```

**应用:** 比如说计算学生的成绩, 如果成绩不存在则加入 BST, 存在, 则 `count + 1`
```js
class Node {
  constructor() {
    ...
    this.count = 1
  }
}
class BST {

  insert(data) {
    const node = this.find(data)
    if (node) {
      // 如果node节点已经存在的话, count + 1
      node.count++
      return
    }
    ...
  }
}

const nums = new BST();
nums.insert(23);
nums.insert(23);
nums.insert(16);

console.log(nums) // 可以看到count = 2
/* BST {
  root:
   Node {
     data: 23,
     left: Node { data: 16, left: null, right: null, count: 1 },
     right: null,
     count: 2 } } */
```

### 图

```js
class Graph {
  constructor(vertices) {
    this.vertices = vertices;
    this.adj = new Map(); // adjacent list 邻近的点
  }

  // 添加顶点
  addVertex(v) {
    this.adj.set(v, []);
  }

  // 添加顶点之间的关联 / 边
  addEdge(v, w) {
    // 你中有我, 我中有你
    this.adj.get(v).push(w);
    this.adj.get(w).push(v);
  }

  // 打印图
  printGraph() {
    const get_keys = this.adj.keys();

    for (const key of get_keys) {
      const get_values = this.adj.get(key);
      let conc = "";

      for (const value of get_values) {
        conc += value + " ";
      }
      console.log(key + " -> " + conc);
    }
  }

  // 深度优先搜索 Depth First Search
  dfs(s) {
		// create a this.visited array 创建一个顶点访问列表
		let visited = [];
    for (let i = 0; i < this.vertices; i++) {
      visited[i] = false; // 默认为false
    }
		this.dfsUtil(s, visited)    
	}
	
	dfsUtil(vert, visited) {
		visited[vert] = true;
    console.log(vert);
    const get_neighbours = this.adj.get(vert); // 获取关联点

    for (const i in get_neighbours) {
      const value = get_neighbours[i];

      if (!visited[value]) {
        // 递归调用
        this.dfsUtil(value, visited);
      }
    }
	}

  // 广度优先搜索 Breadth First Search
  bfs(s) {

		let visited = [];
    for (let i = 0; i < this.vertices; i++) {
      visited[i] = false; // 默认为false
		}
    let q = [];
    
    visited[s] = true;
    q.push(s); // 入队

    while (q.length > 0) {
      const getQueueElement = q.shift(); // 出队
      console.log(getQueueElement);

      const get_list = this.adj.get(getQueueElement); // 获取关联点 A: B D E, B: A C, C: B E F, D: A E, E: A D F, F: E C
      for (let i in get_list) {
        const neigh = get_list[i];
        // 未访问
        if (!visited[neigh]) {
          // 入队, 并标记为访问
          visited[neigh] = true;
          q.push(neigh);
        }
      }
    }
  }

  // 最短路径?
  shortestPath(s, t) {
    // ? 虽说知道使用广度优先遍历去实现, 但是还没想好怎么去实现
  }
}

const g = new Graph(6);
const vertices = ["A", "B", "C", "D", "E", "F", "G", "H"];

// adding vertices 添加顶点
for (var i = 0; i < vertices.length; i++) {
  g.addVertex(vertices[i]);
}

// adding edges 添加点与点之间的关联
g.addEdge("A", "B");
g.addEdge("A", "D");
g.addEdge("A", "E");

g.addEdge("B", "C");

g.addEdge("D", "E");

g.addEdge("E", "F");
g.addEdge("E", "C");

g.addEdge("G", "F");
g.addEdge("G", "H");
g.addEdge("H", "C");

g.printGraph()

// console.log(g.shortestPath('A', 'H'))
```

### 排序
1. 冒泡排序
思想: 前一个和后一个比, 前一个 > 后一个数 ? 两数交换 : 两数位置不动
```js
function bubbleSort(arr) {
  for (let i = arr.length - 1; i > 1 ; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
      }
    }
  }
  return arr
}

const arr = [1, 10, 2, 3, 5, 4, 8, 0, 7, 6]

console.log(bubbleSort(arr))
```

2. 选择排序
思想: 将第一个数和剩下的数进行比对,检查完所有的元素后, 最小的元素会被放置在第一个位置, 然后从第二个开始重复之前的操作
```js
// 第一种, 先找出最小值
function selectSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min_index = i // 默认第一个最小, 第二次就是第二个最小, 所以 min_index = i

    // 找出最小值的index
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min_index] > arr[j]) {
        min_index = j
      }
    }
    // 将最小值放置第一个
    [arr[min_index], arr[i]] = [arr[i], arr[min_index]]
    console.log('每次比较的arr为:', arr) // 可以看到每次将剩下的没有进行比较的最小值放置在未比较的最前端
  }
  return arr
}

const arr = [1, 10, 2, 3, 5, 4, 8, 0, 7, 6]

console.log(selectSort(arr))

// 第二种, 先找出最大值
function selectSort(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let max = 0
    // 找出最大值的index
    for (let j = 1; j < i + 1; j++) {
      if (arr[j] > arr[max]) {
        max = j
      }
    }
    // 交换
    [arr[i], arr[max]] = [arr[max], arr[i]]
    console.log('每次比较的arr为:', arr) // 可以看到每次将剩下的没有进行比较的最大值放置在未比较的最末端
  }

  return arr
}
```
*冒牌排序和选择排序比较的次数是一样的. 不同在于选择排序交换的次数大大减少了, 每次循环只交换一次, 而冒泡排序每次循环交换 (length - 1) 次*

3. 插入排序
思想: Imagine你正在排序一副打乱的牌, 在排序下一张之前, 你会先看一下这张牌的值面是多少, 然后插入到相应的位置, 这个位置前面的值比它小, 后面的值比它大. 这就是插入排序.
```js
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let currVal = arr[i] // 默认第一个已经排好序
    let pos = i

    // 将下一个要排序的值和当前值比较, 下一个要排序的值比当前值小, 则交换
    while (pos > 0 && arr[pos - 1] > currVal) {
      arr[pos] = arr[pos - 1]
      pos--
    }

    // 找到了正确的位置之后, 进行赋值
    arr[pos] = currVal
  }
  return arr
}

const arr = [1, 10, 2, 3, 5, 4, 8, 0, 7, 6]

console.log(insertSort(arr))
```
*运行时间比较*
冒泡排序 > 选择排序 > 插入排序

4. 希尔排序
是插入排序一种更高效的改进版本
思想: 通过定义一个间隔序列来表示在排序过程中进行比较的元素之间有多远的间隔。我们可以动态定义间隔序列
```js
function shellSort(arr) {
  let gap = Math.floor(arr.length / 2) // 定义间隔
  while (gap > 0) {
    // 间隔 gap 个 进行比较
    for (let i = gap; i < arr.length; i++) {
      let j = i
      // 比如length为10, 那就是0和5比, 1和6比, 2和7比, 依次类推
      // 如果0位置上的数比5位置上的数大, 两者进行交换
      while (j >= gap && arr[j - gap] > arr[j]) {
        [arr[j-gap], arr[j]] = [arr[j], arr[j-gap]]
        // 这个减的意思是: 假如 gap = 2, 一开始 0和2 比较了,没交换, 我在2和4比较的时候,发生了交换. 这时候你需要再回过头去比较 0和2, 因为当2和4交换之后, 有可能现在的0和2需要进行交换了.
        // 总结就是, 每次交换之后, 你的保证前面的顺序是正确的, 不然下次就不对了
        j -= gap
      }
    }
    // 将间隔缩小
    gap = Math.floor(gap / 2)
  }
  return arr
}
// 当间隔缩小的时候, 比较的次数就多了, 但是是基于前面一部分已排好序的基础上进行的. 这也是为什么比插入排序高效所在

const arr = [1, 10, 2, 3, 5, 4, 8, 0, 7, 6]

console.log(shellSort(arr))
```

5. 归并排序
思想: 把一系列排好序的子序列合并成一个大的完整有序序列.
```js
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr
  }
  // 不断的将数组进行二等分, 直至最小(也就是一个元素)
  let mid = Math.floor(arr.length / 2)
  let left = mergeSort(arr.slice(0, mid))
  let right = mergeSort(arr.slice(mid))

  return merge(left, right)
}

function merge(left, right) {
  let result = []
  while (left.length && right.length) {
    // 每次比较左边第一个和右边第一个, 每次往result里面push小的那一个
    if (left[0] < right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }

  return result.concat(left, right)
}


const arr = [1, 10, 2, 3, 5, 4, 8, 0, 7, 6]

console.log(mergeSort(arr))
```

6. 快速排序
快速排序是处理大数据集最快的排序算法之一.
思想: 它是一种分而治之的算法, 通过递归的方式将数据依次分解为包含较小元素和较大元素的不同子序列.

```js
// 简单的版本
// 这个会浪费空间
function quickSort(arr) {
  // 递归结束条件
  if (arr.length <= 1) return arr
  // 基准值
  let midValue = arr.splice(0, 1)[0]
  let left = []
  let right = []

  for (let i = 0; i < arr.length; i++) {
    // 比基准值大放右边, 小放左边
    if (arr[i] > midValue) {
      right.push(arr[i])
    } else {
      left.push(arr[i])
    }
  }

  return quickSort(left).concat(midValue, quickSort(right))
}

// 第二版本
function quickSort(arr, start=0, end=arr.length-1) {
  // 递归结束条件
  if (start > end) return 
  let midValue = arr[start] // 基准值
  let low = start // 低位指针
  let high = end // 高位指针

  while (low < high) {
    // 先从高位开始, 当高位的值大于基准值, 高位指针往左移
    while (low < high && arr[high] >= midValue) {
      high--
    }
    // 高位的值小于基准值, 将低位的值赋值为高位的值
    arr[low] = arr[high]

    // 当低位的值小于基准值, 低位指针往右移
    while (low < high && arr[low] < midValue) {
      low++
    }
    // 低位的值大于基准值, 将改为的值赋值为低位的值
    arr[high] = arr[low]
  }

  // 当while循环结束的时候, 低指针指向的数我们赋值为基准值
  // 这时候是 low === high 的情况
  // arr[high] = midValue 
  arr[low] = midValue
  // 递归调用, 每完成一次递归, 左边的值都会比基准值小, 右边的值都会比基准值大.
  quickSort(arr, start, low - 1)
  quickSort(arr, low + 1, end)
}

const arr = [1, 10, 2, 3, 5, 4, 8, 0, 7, 6]

quickSort(arr)

console.log(arr)

// 注意: 选start为基准值, 必须从右边开始遍历. 选end为基准值, 必须从左边开始遍历
```
思考: 为什么要从对面开始呢???
假设我们的数组为: [6, 1, 2, 7, 9], 选start的为基准值, 当从左边开始的时候, 当 low === high 的时候, low和基准值进行交换, 这时候基准值是6, low === high 的时候, low和high都停留在7那个位置, 当6和7进行交换的时候, 这时候数组=[7, 1, 2, 6, 9], 你会发现,左边的值有比基准值6小的了. 所以这是为什么要从对面开始找的原因.

### 检索算法
在列表中查找数据有两种方式: 顺序查找和二分查找. 顺序查找适用于元素随机排列的列表, 二分查找适用于元素已排序的列表. 二分查找效率更高, 但是你必须在进行找之前花费额外的时间将列表中的元素排序.

*顺序查找:*
```js
// 这个就是 Array.prototype.indexOf() 方法
function seqSearch(arr, data) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === data) {
      return i
    }
  }
  return -1
}

const arr = [1, 10, 2, 3, 5, 4, 8, 0, 7, 6]

console.log(seqSearch(arr, 9))
```

*查找最小(大)值:*
```js
// Math.min.apply(null, [1, 10, 2, 3, 5, 4, 8, 0, 7, 6])
function findMin(arr) {
  let min = arr[0]

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i]
    }
  }
  return min
}

const arr = [1, 10, 2, 3, 5, 4, 8, 0, 7, 6]

console.log(findMin(arr))

// Math.max.apply(null, [1, 10, 2, 3, 5, 4, 8, 0, 7, 6])
function findMax(arr) {
  let max = arr[0]

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return max
}

const arr = [1, 10, 2, 3, 5, 4, 8, 0, 7, 6]

console.log(findMax(arr))
```

*二分法查找*
如果你要查找的数据是有序的, 二分法查找算法比顺序查找算法更高效.
```js
function binSearch(arr, data) {
  let high = arr.length - 1
  let low = 0

  while (low <= high) {
    let mid = Math.floor((low + high) / 2)
    if (arr[mid] < data) {
      low = mid + 1
    } else if (arr[mid] > data) {
      high = mid - 1
    } else {
      return mid
    }
  }
  return -1
}

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

console.log(binSearch(arr, 8))
```

### 高级算法
*动态规划*
动态规划有时被认为是一种与递归相反的技术。 递归是从顶部开始将问题分解， 通过解决掉所有分解出小问题的方式， 来解决整个问题。 动态规划解决方案从底部开始解决问题， 将所有小问题解决掉， 然后合并成一个整体解决方案， 从而解决掉整个大问题。 本章与本书其他多数章节的不同在于， 这里没有讨论除数组以外其他形式的数据结构。 有时， 如果使用的算法足够强大， 那么一个简单的数据结构就足以解决问题。

斐波那契数列

使用递归
```js
function fib(n) {
  if (n < 2) return n
  return fib(n-1) + fib(n-2)
}

fib(10) // 55

// 递归的最大问题所在就是有太多的重复计算

// 优化下
function fib(n) {
  if (n < 2) return n

  // 使用map保存之前已经存储的值
  const arr = new Map()

  if (arr.has(n)) {
    return arr[n]
  } else {
    arr.set(n, fib(n-1) + fib(n-2))
    return arr.get(n)
  }
}
```

使用动态规划
```js
function dynFib(n) {
  let val = []
  for (let i = 0; i <= n; i++) {
    val[i] = 0
  }

  if (n === 0 || n === 1) {
    return n
  } else {
    val[1] = 1
    val[2] = 2

    for (var i = 3; i <= n; i++) {
      val[i] = val[i - 1] + val[i - 2]
    }
    return val[n - 1]
  }
}

console.log(dynFib(10))

console.time('dynFib running time')
dynFib(10)
console.timeEnd('dynFib running time')

// 你可以自己去用 console.time 和 conslole.timeEnd 去测试下程序运算耗时. 动态规划比递归的耗时要小的多


// 另一种
function iterFib(n) {
  let last = 1
  let nextLast = 1
  let result = 1

  if (n === 0) {
    return 0
  }

  for (let i = 2; i < n; i++) {
    result = last + nextLast
    nextLast = last
    last = result
  }
  return last
}
```

动态规划
[1](https://segmentfault.com/a/1190000012864957)
[2](https://segmentfault.com/a/1190000007963594)

*贪心算法*
贪心算法是一种以寻找“ 优质解” 为手段从而达成整体解决方案的算法。 这些优质的解决方案称为局部最优解， 将有希望得到正确的最终解决方案， 也称为全局最优解。“ 贪心”这个术语来自于这些算法无论如何总是选择当前的最优解这个事实。 通常， 贪心算法会用于那些看起来近乎无法找到完整解决方案的问题， 然而， 出于时间和空间的考虑， 次优解也是可以接受的。


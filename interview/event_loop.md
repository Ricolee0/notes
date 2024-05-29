# 事件循环

js 是单线程的， 为了高效运行就需要通过事件循环和任务队列机制，高效地处理异步事件。

## 事件循环机制

在事件循环中，当主线程执行完同步任务后，会检查事件队列中是否有待处理事件， 如果有会取出事件并执行，这个过程就是事件循环， 由主线程和任务队列两部分组成，主线程处理同步任务，任务队列负责处理异步任务。

常见的异步任务为：

* 回调函数 callback
* Promise/async await
* Generator
* 事件监听
* 发布/订阅
* 计时器
* requestAnimationFrame
* MutationObserver
* process.nextTick
* I/O操作

在事件循环的过程中，每次主线程的同步任务执行完毕后，就开始执行任务队列中的异步任务

## 任务队列

异步任务分为宏任务和微任务

***宏任务***

* script(整体代码)
* setTimeout
* setInterval
* setImmediate
* I/O
* UI render

***微任务***

* process.nextTick
* Promise
* Async/Await(实际就是promise)
* MutationObserver(html5新特性)

任务队列的执行顺序为：
执行宏任务，然后执行宏任务产生的为任务，如果微任务产生了新的微任务，就继续执行微任务。微任务执行玩在回到宏任务进行下一轮循环。

## async/await执行顺序

await 后面的函数执行完毕后会产生一个 promise.then 的为任务。执行完await之后，分两种情况：

1. 如果 await 后面跟的是一个同步任务时，会把下面的代码注册成微任务（类似于用 promise.then 包裹）直接跳出async函数，执行其他代码 。
2. 如果 await 后面跟的是异步任务时， 会先跳出 async 函数，执行其他宏任务，然后再把 await 下面的逻辑注册为微任务执行。

```js
console.log('1')

async function async1() {
await async2()
console.log('2')
}
async function async2() {
console.log('3')
}
async1()

new Promise(resolve => {
    console.log('4')
    resolve()
})
.then(function() {
    console.log('5')
})
.then(function() {
    console.log('6')
})

console.log('7')

```

await 后面是同步任务时， 执行完 await 后面的任务时， 直接把下面的任务注册成微任务。执行顺序为 1、 3 、 4 、 7 、 2 、 5 、 6

```js
console.log('1')

async function async1() {
    await async2()
    console.log('2')
}
async function async2() {
    console.log('3')
    return Promise.resolve().then(()=>{
        console.log('8')
    })
}
async1()

new Promise(resolve => {
    console.log('4')
    resolve()
})
.then(function() {
    console.log('5')
})
.then(function() {
    console.log('6')
})

console.log('7')

```

await 后面是异步任务时， 执行完 await 后面的任务时， 先跳出 async 函数执行其他任务，再把 await 下面的代码包装成微任务执行 s。执行顺序为 1、 3 、 4、 7 、 8 、 5 、 6 、 2

## node 中的事件循环

在 node环境中， V8 引擎作为 js 代码的解析器，V8 引擎将代码解析后调用对应的 node api, 而这些 api 底层使用 libv 引擎驱动，执行对应的任务，并把不同的任务放到不同的任务队列中，等待执行。因此**node 中的时间循环存在于 libv 中**

### node 的事件循环模型

   ![1710841200023.png](https://neptune-ipc.oss-cn-shenzhen.aliyuncs.com/utools/1710841200023.png)

流程：
libv 在接收到外部的任务时

1. timer: 定时器检测阶段， 这个阶段执行 setTimeout(callback) 和 setInterval(callback) 预定的 callback;
2. I/O callback: I/O 事件回调阶段， 此阶段执行某些系统操作的回调，例如TCP错误的类型。 例如，如果TCP套接字在尝试连接时收到 ECONNREFUSED，则某些* nix系统希望等待报告错误。 这将操作将等待在==I/O回调阶段==执行;
3. idel prepare: 闲置阶段, 仅在内部使用， 阶段: 仅node内部使用;
4. poll: 轮询阶段
5. check: 检查阶段， setImmediate() 的回调会在这个阶段执行
6. close: callback 关闭回调阶段, 比如关闭 socket 等

poll 是一个至关重要的阶段，系统会做两件事：

1. 执行下限时间已经达到的timers的回调
2. 执行 I/O 操作
   并且在进入该阶段如果没有设置 timer 的话，会发生以下两件事

   1. 如果 poll 队列不为空，会遍历回调队列并同步执行，知道 poll 队列为空或者打到系统限制
   2. 如果队列为空会发生两件事：
      1. 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进行到 check 阶段执行回调。
      2. 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有一个超时设置防止一直等待下去。

当设定了 timer 并且 poll 队列为空，会判断是否有 timer 超时，如果有会到 timer 阶段执行回调。

### process.nextTick

这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行。

整个过程自己的理解：

1. timer 执行执行时间， 这个时候并不执行回调， 只是放入到 timer 的队列
2. 执行 I/O 操作， 把回调放入 I/O callbacks 阶段的队列
3. poll 开始分配， 轮询监听事件
4. 执行 setImmediate 的回调
5. 执行 callback 关闭回调

每个队列都可能包含自己的微任务，在每个队列执行为任务前，会先执行 process.nextTick

## Node与浏览器的 Event Loop 差异

浏览器环境下，microtask的任务队列是每个macrotask执行完之后执行。
而在Node.js中，microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务。

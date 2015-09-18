title: js&node
speaker: 李杰
transition: moveIn
files: /js/demo.js,/css/demo.css,/js/zoom.js
theme: blue

[slide]

#Node.js 入门
## 目的：普及一下Node.js相关知识
<small>演讲者：李杰</small>

[slide]
# 讲座内容 
---
1. Javascript简介
2. Node.js简介**
3. express简介*
4. 一个Node服务器实例*

[slide]
#Javascript简介
---
Javascript是一门脚本语言...
![什么是Javascript](/img/Javascript.png "什么是Javascript")

[slide]
#基本语法简介
---
```Javascript
function Person(name, age){
    //存在判断与类型检测
    this.name = name;//定义的时候并不知道它的类型
    this.age = age;
    this.male = ture;//or false
    this.cars = ['benchi','posche'];
    this.sayHello = function(afterSaying){//参数可以是一个函数
        console.log("Hello, I am " + this.name);
        afterSaying && afterSaying(); //如果传了函数做为第一个参数，执行它
    }
}
Person.prototype.dream = function(){//原型链上的方法，属性在内存中只有一份拷贝
    console.log("I am " + this.age + ", I want to fly.");
}
var bill = new Person('bill',12);//用new关键字，如果不用，你可以试试。。
bill.sayHello(function(){
    console.log('I want to sleep..!');
});//Hello, I am bill. I want to sleep..
bill.sayHello();//Hello, I am bill.
bill.dream();

```

Javascript 好灵活~ 可是, 不像C/C++/Java那样有确定的类型{:&.moveIn}

[slide]
#基本语法简介
---
常用语句,跟其他语言类似:
- if
- while
- for(遍历数组)
- **for-in**(遍历对象)
- break
- ...

[slide]
#JSON
- Javascript的一个子集
- 结构简单,轻量级
- 常用来做数据交换(服务器与客户端数据传输)

```
{
    "success": true,
    "msg": "get success!",
    "data":{
        "cars": ["bmw","benchi","mazida"]
    }
}
```

[slide]
#Node简介
---
Ryan Dahl是一名资深C/C++程序员,在Node诞生之前，主要工作都是围绕高性能Web服务器的。他的最初目标是写一个基于**事件驱动、非阻塞I/O**的Web服务器。经过他的深思熟虑，选择了Javascript语言而不是其他语言。经过两个月, 09年5月Node诞生了。之后，由于Node的优秀, Node的社区也越来越壮大，很多人都开始关注Node, 使用Node。

[slide]

#Node概览
![chromevsnode](/img/chromevsnode.png "chromevsnode")

<p style="font-size:18px;text-align: left;">Node.js采用C++编写而成，是一个Javascript的运行环境</p>

<p style="font-size:18px;text-align: left;">[V8](https://github.com/nodejs/node/tree/master/deps/v8)为Node.js带来了一套优秀的语言解释方案,让Javascript跑的飞快。</p>

<p style="font-size:18px;text-align: left;">[libuv](https://github.com/libuv/libuv)是一个高性能事件驱动的程序库，封装了 Windows 和 Unix、OSX、Android平台一些底层特性，为开发者提供了统一的 API.</p>

[slide]
#Node的几个概念
---
- 跨平台
- 单线程
- 异步 I/O 
- 事件与回调函数
- 模块机制
- 适合I/O密集型

[slide]
#跨平台(libuv)
###libuv is a multi-platform support library with a focus on **asynchronous I/O**. 

- Full-featured event loop backed by epoll, kqueue, IOCP, event ports.
- Asynchronous TCP and UDP sockets
- Asynchronous DNS resolution
- Asynchronous file and file system operations
- Signal handling
- Thread pool
- ...
[slide]
#单线程
##传统单线程
1. 在 Java 和 PHP 这类语言中，每个连接都会生成一个新线程，每个新线程可能需要 2 MB 的配套内存。消耗太大。
2. 线程的同步、死锁、切换, 会使逻辑变得相当复杂。

[slide]
#Node单线程
##Node中的**Javascript**代码跑在单线程环境中！
<p style="text-align:left">优点:</p>
<p style="text-align:left">1. 不用在意状态的同步问题，没有死锁，资源的竞争交给底层，对程序员屏蔽。</p>
<p style="text-align:left">2. 没有线程上下文切换的开销。</p>

<p style="text-align:left">缺点:</p>
<p style="text-align:left">1. 无法直接利用多核CPU(有解决方案)。</p>
<p style="text-align:left">2. 健壮性，错误会引起整个应用退出。</p>

---
那么问题来了：单线程怎么处理并发啊？？？ {:&.moveIn}

[slide]
#两个概念
---
- 异步I/O
- 事件与回调


[slide]
#I/O是昂贵的
---
![io-cost](/img/io-cost.png "I/O代价")


[slide]
#同步？异步？
---
##同步
```
getData('from_db');//消费时间M
getData('from_remote_api');//消费时间N
//共消费M+N
```
##异步
```
getData('from_db',function(result){
    //消费时间M
});
getData('from_remote_api',function(result){
    //消费时间N
});
//共消费max(M,N);
```
随着应用的复杂性增加，异步的优势会越来越明显。


[slide]
#异步I/O与回调
---
##前端中的异步，以Ajax请求为例
```
$.post('/url',{title:'1301'},function(data){
    console.log('收到响应');
})//对服务器发送POST请求，收到响应后再调用**回调函数**。
console.log('发送ajax');
//先输出'发送ajax'等收到服务器的响应，再输出'收到响应'。
```
##Node中的异步，大多数是异步I/O，以读取文件为例
```
var fs = require('fs');//file system 相关api
fs.readFile('/path',function(err,file){
    console.log('读取文件完成');
});//回调函数并不是由开发者调用
console.log('发起读取文件');
//先输出'发起读取文件',读完输出'读取文件完成'
```
代码的编写顺序与执行顺序无关，可能会造成阅读上的困难！
在流程控制方面，与常规的同步方式相比，不那么一步了然了。
[note]
阻塞I/O造成CPU等待I/O，浪费等待时间，CPU的处理能力不能得到充分利用。非阻塞I/O的特点就是调用之后会立即返回，返回后CPU的时间片可以用来处理其他事务。由于完整的I/O并没有完成，立即返回的并不是业务层期待的数据，而仅仅是当前调用的状态。当I/O结束时，回调函数被调用。
[/note]

[slide]
#Node的异步I/O
---
![nodeloop](/img/node-loop.png "nodeloop")
[note]
##Node底层调了libuv里面的线程池，这与Apache之类的创建多线程有何区别？？
在node.js内部，仍然是依靠线程和进程来进行数据访问、处理其他任务执行。然而，这些都没有明确地对你的代码暴露出来，所以你不需要额外担心内部如何处理I/O之间的交互。对比Apache的模型，它少去了很多线程以及线程开销，因为对每个连接来讲单独的线程不是必须的。仅仅是当你绝对需要让某个操作并发执行才会需要线程，但即便如此线程也是node.js自己管理的。所以说Node最擅长I/0密集型的场景。

[/note]

重点：在Node中,无论是什么平台，内部完成I/O任务的另有线程池。Javascript线程不会被I/O阻塞。 {:&.moveIn}

[slide]
#整个异步I/O的流程(win)
---
![async_call](/img/async_call.jpg "async_call")
[note]
上层使用单线程，避免多线程死锁，状态同步等问题；利用底层的多线程实现异步 I/O，充分利用了硬件资源以提升性能。
[/note]

[slide]
#事件机制
---
类似于浏览器中鼠标事件，Node也有事件机制。
事件一般与回调一起使用。回调不都是异步调用的，也有普通的回调。

[slide]
#回调
---
Don't call me, I will call you!

Node中的回调函数一般形式
```
function(err[,data]){
   //错误先行！ 
}
```

[slide]
#模块机制--搭起Node生态圈
---
1. CommonJS规范
2. Node的模块实现
3. 核心模块
4. C/C++扩展模块
5. 模块调用栈
6. 包与NPM

[slide]
#CommonJS规范
---
由于Javascript本身没有模块系统。没有原生的支持密闭作用域或依赖管理。JavaScript没有包管理系统。不能自动加载和安装依赖。于是便有了[CommonJS](http://www.commonjs.org)规范的出现。Node自身实现了require方法作为其引入模块的方法，同时NPM也基于CommonJS定义了包规范，实现了依赖管理和模块自动安装等功能。

CommonJS规范的提出，让Javascript具有开发大型应用的基础能力，而不是停留在小脚本程序阶段。

[slide]
#CommonJS模块规范
---
##定义circle.js:
```
var PI = Math.PI;
exports.area = function (r) {
    return PI * r * r;
};//导出模块
```
##使用
```
var circle = require('./circle.js');
console.log(circle.area(4));
```
在require了这个文件之后，定义在exports对象上的方法便可以随意调用。

[slide]
#Node的模块机制实现
---
模块引入过程：
1. 路径分析
2. 文件定位
3. 编译执行(??)
[note]
在Node中，模块分为两类：
- 核心模块
    
    >在Node源码编译的过程中，编译进了二进制文件，在Node启动时，直接加载进内存，加载速度快。
- 文件模块
    
    >文件模块在运行时动态加载，需要完整的引入过程。

Node的模块加载优先从缓存加载！
[/note]

[slide]
#模块编译
---
在Node中，每个文件模块都是一个对象，它的定义如下：
```
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (parent && parent.children) {
    parent.children.push(this);
  }

  this.filename = null;
  this.loaded = false;
  this.children = [];
}
```
编译和执行是引入文件模块的最后一个阶段。定位到具体的文件后，Node会新建一个模块对象，然后根据路径载入并编译。对于不同的文件扩展名，其载入方法也有所不同。

[slide]
#Javascript模块的编译
```
(function(exports,require,module,__filename,__dirname){//对Javascript进行了头尾的包装
    var PI = Math.PI;
    exports.area = function (r) {
        return PI * r * r;
    };
})
```
每个模块之间进行了隔离，包装之后经过Node原生模块的处理，给它加上上面的参数执行后，exports对象上的属性暴露出来了。
[note]
小坑：exports VS module.exports
[/note]

[slide]
#C/C++模块的编译和JSON文件的编译
---
- Node调用process.dlopen()方法加载和执行.node文件，实际上.node的模块文件是已经编译好的文件。
- JSON文件利用fs模块读取，常用在配置文件中。

[slide]
#核心模块
---
1. C/C++编写的模块(src下)
2. Javascript编写的模块(lib下)

纯C/C++模块编写的部分称为内建模块
>文件模块<--核心模块(JS)<--内建模块(C/C++)

[slide]
#写Node扩展模块(C++)
---
在需要一些性能要求比较高的场合(位运算，编码转码)，或者一些特定的场合使用
```c++
#include <node.h>
#include <v8.h>
using namespace v8;  
Handle<Value> Method(const Arguments& args) {
  HandleScope scope;
  return scope.Close(String::New("Hello world!"));
}

void init(Handle<Object> target) {
  target->Set(String::NewSymbol("sayHello"),
      FunctionTemplate::New(Method)->GetFunction());
}
NODE_MODULE(hello, init)
```
编译之后等价于:
```
exports.sayHello = function(){
    return 'Hello world!'
}
```
对用户来说，用require就能使用模块。

[slide]
#模块之间的调用关系
---
![Node模块间调用关系](/img/Node_module_call.jpg)

[slide]
#包与npm
---
包的出现，在模块的基础上进一步组织Javascript代码。
![package](/img/package.jpg "package")

[slide]
#包描述文件package.json
---
```
{
  "name": "TechNode",
  "version": "1.0.0",
  "description": "socket.io+Angular",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "author": "liz",
  "license": "ISC",
  "dependencies": {
    "connect": "^2.27.6",
    "express": "^3.18.6",
    "mongoose": "^3.8.21",
    "socket.io": "^1.2.1",
  }
}
```
使用npm install 就能安装依赖的包了！

[slide]
#npm-> Node 包管理工具(Node自带)
---
常用命令:
* npm install 
* npm uninstall
* npm update
* npm publish

[slide]
#常用第三方Node模块/包
---
##尽在[npm](https://www.npmjs.com/)
* http-server(简单的web服务器)
* express(服务器搭建)
* socket.io(服务器推送)
* node-inspector(调试工具)
* mocha(测试工具)
* sqlite
* 大量用于前端的工具(glup,bower,browserify..)
* ...

[slide]
#express简介
---
- Fast, unopinionated, minimalist web framework.
- 非常流行的一个用来快速搭建Web服务器的框架
- 基于原生的http，做了很多扩展

[slide]
#中间件
---
简单说，中间件（middleware）就是处理HTTP请求的函数。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。按照注册顺序将req,res给每个中间件处理。流式处理。
```
var app = express();
app.use(function(request, response, next) {//use()方法注册中间件。
  console.log("In comes a " + request.method + " to " + request.url);
  next();//传递给下一个中间件
});
app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello world!\n");
});
```
[slide]
#路由
---
在express中提供了一些rest风格的方法
get、post、put、delete等，它们都是use的别名。
```
app.get("/hello/:who", function(req, res) {
  res.end("Hello, " + req.params.who + ".");
});
//get方法则是只有GET动词的HTTP请求通过该中间件，它的第一个参数是请求的路径。
//由于get方法的回调函数没有调用next方法，所以只要有一个中间件被调用了，
//后面的中间件就不会再被调用了。
```
mapbox-studio里面的一段代码
```
app.get('/source/:z(\\d+)/:x(\\d+)/:y(\\d+):scale(@\\d+x).:format([\\w\\.]+)',
 middleware.source, cors(), tile);
app.get('/style/:z(\\d+)/:x(\\d+)/:y(\\d+).:format([\\w\\.]+)',
 middleware.style, cors(), tile);
```
[slide]
#一个完整的服务器实例

[slide]
#学习参考
---
- 《深入浅出Node.js》,朴灵
- [express学习](http://javascript.ruanyifeng.com/nodejs/express.html)

[slide]
#谢谢
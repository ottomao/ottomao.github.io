## 代理服务器的新轮子：anyproxy

是的，我们又写了一个代理服务器，基于nodeJS，取名 **anyproxy**（[项目主页](https://github.com/alibaba/anyproxy)）。

![anyproxy](https://i.alipayobjects.com/i/ecmng/png/201409/3NKRCRk2Uf.png_250x.png)


业界的代理工具已经不少了，windows有fiddler，mac有charles，跨平台的有腾讯alloy team出品的liver pool。满足特定功能的民间产品更是层出不穷，如代理线上combo文件的[flex-combo](https://github.com/wayfind/flex-combo)，clam中的[doji](https://github.com/mo-tools/doji)等等。

如此之多的产品，仍无法满足前端攻城师们奇葩的需求。举几个调试场景的栗子：

* 调试线上页面，需要在页面里注入某个脚本，或是替换一些html数据。
* 向同一个URL发送post，需要根据post body来mock数据。
* 服务器不支持跨域头Access-Control-Allow-*，调试时却需要发送跨域请求。
* 需要模拟个别接口超时。
* 不改url，把请求发送到另一个地址，移动端的dns结果又有缓存，改host效率太低。
* 替换cookie，模拟多账户/越过登录过程。

anyproxy的诞生，就是为了提供一个大底层，让类似的工具不再遥远，分分钟提升我们的调试效率。


代理服务器的战略价值
--------------
代理服务器是个中间人，站在了客户端和服务端中间，双方通信的每个比特，都会滴水不漏地经过它。
从http协议的角度来看，它控制了完整的请求头、请求体、响应头、响应体，可以在客户端与服务端都无感知的情况下介入处理所有的流程，是通信过程中的战略要塞。


AnyProxy的开放式代理服务器设计
---------------

### 可编程的API接口(rule)

面对纷繁的调试需求，传统的“配置文件”遭遇了灵活性瓶颈，因此我们决定开放接口，由攻城师们自己来编写各类代理规则。

类似obj-c中的delegate机制，我们把http请求的每个过程都进行分拆，用户可以根据需求对网络请求的任一环节进行干预。在这里，用户编写的规则文件被称为 **rule**。

### 接口流程

具体来说，我们允许用户干预的接口：

* 收到用户请求之后
	* **shouldUseLocalResponse** ，是否在本地直接发送响应（不再向服务器发出请求）
	* **dealLocalResponse** 如果shouldUseLocalResponse返回true，会调用这个函数来获取本地响应内容（异步接口）
* 向服务端发出请求之前
	* **replaceRequestProtocol**  替换向服务器发出的请求协议，支持http和https的替换
	* **replaceRequestOption** 替换向服务器发出的请求参数，即nodeJS中的 [request option](http://nodejs.org/api/http.html#http_http_request_options_callback)
	* **replaceRequestData** 替换请求的body
* 向用户返回服务端的响应之前
	* **replaceResponseStatusCode** 替换服务器响应的http状态码
	* **replaceResponseHeader** 替换服务器响应的http头
	* **replaceServerResDataAsync** 替换服务器响应的数据（异步接口）
	* **pauseBeforeSendingResponse** 在请求返回给用户前的延迟时间

### 清晰易懂的图解
右侧加粗气泡里即是anyproxy的接口。

![](http://gtms01.alicdn.com/tps/i1/TB1YuKDGXXXXXX_XXXXrAlkZpXX-852-1080.png_640x640.jpg)


实践和sample
---------------

为了帮助你更快地编写规则（rule）文件，我们提供了些sample：

* **[rule__blank.js](https://github.com/alibaba/anyproxy/blob/master/rule_sample/rule__blank.js)**,
    * 空白的规则文件模板，和一些注释
* **[rule_adjust_response_time.js](https://github.com/alibaba/anyproxy/blob/master/rule_sample/rule_adjust_response_time.js)**
    * 把所有的响应延迟1500毫秒
* **[rule_allow_CORS.js](https://github.com/alibaba/anyproxy/blob/master/rule_sample/rule_allow_CORS.js)**
    * 为ajax请求增加跨域头
* **[rule_intercept_some_https_requests.js](https://github.com/alibaba/anyproxy/blob/master/rule_sample/rule_intercept_some_https_requests.js)**
    * 截获github.com的https请求，再在最后加点文字
* **[rule_remove_cache_header.js](https://github.com/alibaba/anyproxy/blob/master/rule_sample/rule_remove_cache_header.js)**
    * 去除响应头里缓存相关的头
* **[rule_replace_request_option.js](https://github.com/alibaba/anyproxy/blob/master/rule_sample/rule_replace_request_option.js)**
    * 在请求发送到服务端前对参数做一些调整
* **[rule_replace_response_data.js](https://github.com/alibaba/anyproxy/blob/master/rule_sample/rule_replace_response_data.js)**
    * 修改响应数据
* **[rule_replace_response_status_code.js](https://github.com/alibaba/anyproxy/blob/master/rule_sample/rule_replace_response_status_code.js)**
    * 改变服务端响应的http状态码
* **[rule_use_local_data.js](https://github.com/alibaba/anyproxy/blob/master/rule_sample/rule_use_local_data.js)**
    * 把响应映射到本地


界面
--------------
可视化查看流量的利器。界面中的数据通信用websocket完成，保证了传输的实时性。

![](http://gtms03.alicdn.com/tps/i3/TB1ddyqGXXXXXbXXpXXihxC1pXX-1000-549.jpg_640x640q90.jpg)

Https的中间人（man-in-the-middle）代理
-----------------
Charles和fiddler有https的代理，可以做https的明文解码，anyProxy也做到了。

配合openSSL，制作一个根证书并在宿主机信任，anyproxy可以实时签发任意域名的二级证书，来协助https明文代理。

![](http://gtms03.alicdn.com/tps/i3/TB10.lRGXXXXXcCXXXXnLlk2VXX-962-514.png_400x400q90.jpg)

其他特性
------------------
* 网速模拟，弱网络环境优化必备，你懂的！

跃跃欲试？
--------------
* 完整的文档和介绍：[https://github.com/alibaba/anyproxy](https://github.com/alibaba/anyproxy), 记得给我们加个star。
* 有任何问题，请直接提issue，或者加入anyproxy用户旺旺群：1203077233。
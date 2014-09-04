## 新时代的响应式图片

### 响应式图片

　　响应式图片（responsive image）是一个老话题了，传统的响应式图片一般关注layout层面的问题，如css布局策略、media query等。    
　　而在实践中，我们发现图片不只是简单视觉的元素，除了排版功能，它在网络流量上的消耗也不可小觑。既然它能在排版时做到自适应，那能不能根据不同的终端环境做流量的自适应？让“响应式”的概念从排版扩展到性能，这正是我们所关注的内容。
    

### 策略：图片格式——png,jpg,webp

　　当前，我们网站页面上图片的来源往往千奇百怪，图片的尺寸、格式基本处于不可控的状态。商家和用户会为了保证展示效果而上传超高分辨率的照片，也有店铺会为了装修而引入一些“极其精致”的png图片。这些大尺寸的图片难免会成为移动端的噩梦，解开噩梦的第一步就是调整图片格式。

#### png
　　png格式的图片支持透明效果，采用无损压缩，多次编辑、保存之后不会产生质量问题，往往是设计师所偏爱的格式。

　　无损压缩算法是png品质的保证，同时也是它的一大软肋，它会为了质量提升而在体积上付出巨大的代价。对于商品图、用户照片等大尺寸素材，png的图片体积往往会大得离谱。
	
![png和JPG的对比](http://gtms04.alicdn.com/tps/i4/TB1MH_PFFXXXXXTaXXXhc3tFpXX-454-716.png_200x200.jpg)

图： png和jpg的图片视觉对比，来自wikipedia

#### jpg
　　和高贵冷艳的png相比，jpg显得亲民了不少，它的有损压缩算法在色彩丰富的图片上尤为由有效，往往是照片类图片的首选。它的压缩率控制也是我们的一大利器。

　　jpg自然也有它的劣势，不支持透明背景是个不可逾越的障碍。考虑到页面上的主图大都没有此类需求，jpg的应用场景还是非常广泛的。
		
![从左至右不一样的jpg压缩比](http://gtms04.alicdn.com/tps/i4/TB1aD7_FFXXXXasXVXX6Ma2NVXX-504-628.png_250x250.jpg)

图： 从左至右不一样的jpg压缩比，来自wikipedia


#### webp
　　相比于png和jpg，webp简直就是个神器了，当然，除了它糟糕的兼容性。

　　webp是google推出的一种图片格式，利用了VP8中的压缩技术，同时支持有损和无损压缩，官方标称可以比同质量的jpg减少30%的流量（[ref](https://developers.google.com/speed/webp/faq#which_web_browsers_natively_support_webp)）。

　　webp的浏览器支持范围是chrome desktop 23+，只用有损格式的话可以降到chrome desktop 17+。需要注意，360极速浏览器使用的是chrome 21内核，选用webp时只能引入有损格式(lossy)。（或者推动360君升个级？）

　　目前webp的移动端支持非常弱，只有部分原生的Android浏览器能够提供。作为一项面向未来的技术，我们不妨静观它在移动端的表现。

![天猫几个业务线的图片格式测试数据](http://gtms01.alicdn.com/tps/i1/TB17vtXFVXXXXakXpXXmWCX6XXX-1008-340.png_480x480.jpg)

上图是一组数据对比，对比默认图片与webp的流量差。表格数据来源是2014年5月13日的天猫各垂直业务首页&淘宝首页。从数据可见webp带来的流量收益能在保持在30%以上，甚至逼近50%，整体效果还是非常可观的。

### 策略：图片压缩
　　关于图片压缩，我们主要考虑jpg和webp的有损压缩。定性来讲，压缩率越高，文件越小，视觉体验越差，因此，压缩问题一般是在视觉体验和文件体积间折中。

一些压缩方案：　　

* 正常情况下，90%的质量参数可以基本保证用户无法用感知质量的下降，同时能利用有损压缩把一些奇大无比的图片体积用进行大幅度缩减。
* 在retina屏幕下采用2x图时，较高的压缩率（即较低的质量）可以被精致的屏幕显示给弥补回来，所以这时候做一些高比率的压缩也并不为过。
* 如果能控制图片来源（比如从运营同学端获得），可以请负责来源的同学不要对图片进行高比率压缩，以免线上二次压缩后影响视觉效果。


### 策略：网络环境
　　当无线成为主战场之后，图片往往就成了流量的瓶颈，尤其在低速网络下，满屏的图片简直就是用户端的灾难。幸好，当前我们的客户端提供了一些js接口，可以获知用户所在的网络环境，进而为图片优化提供支持。

　　低速网络下，我们的优化策略是：用质量的妥协来换取流量，优先保证页面可用性。

　　调整质量的方法即控制压缩率，比如按阿里CDN的压缩策略，retina屏下2x图配合q30的参数，图片的质量尚在可接受的范围内，用它来换取流量也未尝不可。

　　进一步的，将来可以考虑在retina + 2G网络下采用低分辨率的图（比如放弃2x而改用1.5x）、2G/3G网络下逐步修改质量参数等，来为图片流量做极致优化。

附天猫喵鲜生和食品的流量测试数据，2G下采用q=30的图片：

* 喵鲜生，wifi-1.1M，2G-902k，减少18%的流量
* 天猫食品，wifi-1.6M ，2G-1.2M，减少25%的流量

　
### 策略：屏幕参数（ppi,device pixel ratio）
　　retina出现之后，我们需要对不同ppi适配不同的图片。这里并没有什么奇特的策略，只是工程实现的成本区别，所以不再多讨论了。
　　

### 总结一些响应策略

* 不透明、不求无损的图片，不要用png
* 支持webp的浏览器里应尽量用webp图片
* jpg的质量参数应该根据不同的环境来调整
* 高ppi的屏幕下，图片可以适当增加压缩率
* 低速网络环境下，可以降低一部分的视觉体验来换取图片的可用性和速度
	
### 这么多策略是想整死人？有现成方案不？
#### CrossImage
　　有兴趣的阿里同学可以参考[CrossImage](http://gitlab.alibaba-inc.com/cross/crossimage/tree/master)方案，它是基于阿里CDN的一些图片缩放策略开发的前端图片JS适配方案，来自动寻找图片的最优解。
　　
#### 同步输出的图片
　　对于同步输出的图片，需要服务端根据UA来处理url，JS方案不适合。
　　
#### 非阿里用户？服务端没有这么多功能？
　　上传前用自动工具处理一下？欢迎相关人士来拍板指导  ^_^

	
Ref:

* [Choosing A Responsive Image Solution](http://www.smashingmagazine.com/2013/07/08/choosing-a-responsive-image-solution/)
* Wikipedia : [Portable Network Graphics](http://en.wikipedia.org/wiki/Portable_Network_Graphics) [jpeg](http://en.wikipedia.org/wiki/JPEG#Typical_usage)，部分图片摘自其中
* [Google Developerse : using webp](https://developers.google.com/speed/webp/docs/using)
* [月飞 - "感应式图片加载"方案后的总结](http://www.atatech.org/articles/18314)

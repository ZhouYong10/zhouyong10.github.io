---
layout: post
title: 'jQuery构造函数'
date: 2015-06-02 08:12
categories: jquery
---

jQuery对象是一个`类数组对象`,含有连续的整型属性,length属性和大量的jQuery工具方法.jQuery对象由jQuery构造函数创建,
`$()`是jQuery的缩写(或者说是简写形式).

jQuery构造函数有7种用法,调用构造函数时传入不同的参数,创建jQuery对象的罗辑也会随之不同.jQuery的构造函数如下图所示:
(可通过下图对本节内容进行导航阅读)
<img src="/resources/images/jquery/jQueryConstructor.png" usemap="#jQueryConstructor" title="jQuery构造函数"/>
<map id="jQueryConstructor" name="jQueryConstructor">
    <area shape="rect" coords="146,42,296,80" href="#" title="封装普通对象为jQuery对象"/>
    <area shape="rect" coords="480,60,728,116" href="#selector" title="通过选择器查找相应的元素,并封装为jQuery对象"/>
    <area shape="rect" coords="8,103,260,142" href="#" title="绑定ready事件监听函数,当DOM加载完成时立即执行"/>
    <area shape="rect" coords="28,164,260,203" href="#" title="接受一个jQuery对象,返回该对象的拷贝副本"/>
    <area shape="rect" coords="158,225,296,264" href="#" title="创建一个空的jQuery对象"/>
    <area shape="rect" coords="500,138,784,177" href="#html" title="使用HTML代码创建DOM元素的jQuery对象"/>
    <area shape="rect" coords="480,200,698,238" href="#" title="封装DOM元素为jQuery对象"/>
</map>


###<a id="selector" name="selector">jQuery(selector[,context])</a>

向jQuery构造函数传入一个字符串参数时,jQuery会检查这个字符串是选择器表达式,还是HTML代码.如果是选择器表达式,则遍历
文档,查找与之匹配的DOM元素,并将其封装成jQuery对象返回;如果没有对应的匹配元素,则创建一个空的jQuery对象返回.

默认情况下,查找是从文档根对象(document)开始的,即查找范围是整个文档树.不过可以通过传入第二个参数`context`
(查找上下文)来限定查找范围,例如在一个事件监听函数中,可以像下面这样限定查找范围:

    $('clickMe').click(function(){
        var spanText = $('span',this).text();
        console.log(spanText);
    });

上面的例子中,选择器`'span'`的查找范围被限制在了`this`的范围内,即只能获取被点击元素内的span元素的内容.

如果选择器是简单的`#id`,且没有指定查找上下文,则调用浏览器原生的`document.getElementById()`方法查找属性id等于
指定值的元素;如果是比`#id`更复杂的选择器或者指定了查找上下文,则通过jQuery的find()方法查找,因此`$('span',this)`
等价于`$(this).find('span')`.


###<a id="html" name="html">jQuery(html[,ownerDocument]),jQuery(html,properties)</a>

如果传入构造函数的是html代码,jQuery就会根据这些html代码创建对应的DOM元素,并封装成jQuery对象返回.例如下面的代码
将创建一个div对象,并插入到body的结尾:

    $('<div id="test"><p>我是<em>div</em>的子元素</p></div>').appendTo('body');

如果html代码是一个简单的标签,例如`$('<img>')`或`$('<a></a>')`,jQuery会使用浏览器原生的方法
`document.createElement()`创建DOM元素.如果是比较复杂的html代码,例如上面的例子,则利用浏览器的`innerHTML`
机制创建DOM元素.

第二个参数ownerDocument用于指定创建新元素的文档对象,如果没有指定,则默认为当前文档.如果html代码是一个单独标签,
第二参数还可以是`properties`,properties是一个包含属性,事件的JSON对象,jQuery在调用document.createElement()
创建DOM元素后,参数properties会被传给attr()方法,由attr()方法负责把properties中的属性和事件设置到新创建的DOM元素上.

参数`properties`的属性可以是任意的html元素属性和事件类型,当属性对应事件使,此时属性值应该是事件监听函数,这个监听函数
将被绑定到新创建的DOM元素上.properties可以含有一下特殊属性: `val`,`css`,`html`,`text`,`data`,`width`,`height`,
`offset`,相应的jQuery方法为:`val()`,`css()`,`html()`,`text()`,`data`,`width()`,`height()`,
`offset()`.


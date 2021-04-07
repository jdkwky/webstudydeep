- escape

  > 简单来说，escape是对字符串(string)进行编码(而另外两种是对URL)，作用是让它们在所有电脑上可读。
  >
  > 编码之后的效果是%XX或者%uXXXX这种形式。
  > 其中 ASCII字母 数字 @*/+ 这几个字符***不会***被编码，其余的都会。
  > 最关键的是，当你需要对URL编码时，请忘记这个方法，这个方法是针对字符串使用的，不适用于URL。

- 对uri编码

  - encodeURI

    > encodeURI方法***不会***对下列字符编码 **ASCII字母 数字 ~!@#$&\*()=:/,;?+'**

  - encodeURIComponent

    > encodeURIComponent方法***不会***对下列字符编码 **ASCII字母 数字 ~!\*()'**

- 什么场合使用什么方法

  **1、如果只是编码字符串，不和URL有半毛钱关系，那么用escape。**

  **2、如果你需要编码整个URL，然后需要使用这个URL，那么用encodeURI。**

  比如

  ```js
  encodeURI("http://www.cnblogs.com/season-huang/some other thing");
  ```

  编码后会变为

  ```js
  "http://www.cnblogs.com/season-huang/some%20other%20thing";
  ```

  其中，空格被编码成了%20。但是如果你用了encodeURIComponent，那么结果变为

  ```js
  "http%3A%2F%2Fwww.cnblogs.com%2Fseason-huang%2Fsome%20other%20thing"
  ```

  看到了区别吗，连 "/" 都被编码了，整个URL已经没法用了。

  **3、当你需要编码URL中的参数的时候，那么encodeURIComponent是最好方法。**

  ```js
  var param = "http://www.cnblogs.com/season-huang/"; //param为参数
  param = encodeURIComponent(param);
  var url = "http://www.cnblogs.com?next=" + param;
  console.log(url) //"http://www.cnblogs.com?next=http%3A%2F%2Fwww.cnblogs.com%2Fseason-huang%2F"
  ```

  看到了把，参数中的 "/" 可以编码，如果用encodeURI肯定要出问题，因为后面的/是需要编码的。
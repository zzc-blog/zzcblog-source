---
title: String字符串
categories:
  - Java
tags:
  - String
abbrlink: ffb663c0
date: 2026-07-07 11:02:37
---

## 1. 什么是 String

表示一串字符序列，实现 Serializable, Comparable 接口，jdk9 以前底层是 final char [] value 存储 , jdk9 以后使用 final byte [] value

> Motivation
>
> 当前的 String 类实现将字符存储在 char 数组中，每个字符使用 2 个字节（16 位）。从许多不同应用程序收集的数据表明，字符串是堆内存使用的主要组成部分，而且大多数 String 对象仅包含 Latin-1 字符。这类字符只需一个字节的存储空间，因此此类 String 对象内部 char 数组中的一半空间被浪费了。
>
> Description
>
> 我们建议将 String 类的内部表示方式从 UTF-16 字符数组改为字节数组加上一个编码标志字段。新的 String 类将根据字符串内容，以 ISO-8859-1/Latin-1（每个字符一个字节）或 UTF-16（每个字符两个字节）的方式进行字符编码。编码标志将指示所使用的编码类型。

## 2. String 的不可变性

**String: 代表不可变的字符序列。简称：`不可变性`**

1. 当对字符串重新赋值时，需要重写指定内存区域赋值，不能使用原有的 value 进行赋值。
2. 当对现有的字符串进行连接操作时，也需要重新指定内存区域赋值，不能使用原有的 value 进行赋值。
3. 当调用 String 的 replace()方法修改指定字符或字符串时，也需要重新指定内存区域赋值，不能使用原有的 value 进行赋值。

> 通过字面量的方式（区别于 new)给一个字符串赋值，此时的字符串值声明在字符串常量池中。 

## 3. Intern() 方法

new String("hello").intern() 

**jdk6**

- 字符串常量池在永久代（方法区），存在则返回“hello”的地址，不存在则创建一个 "hello" 对象，返回地址

**jdk7 以后**

- 字符串常量池在堆区，jdk8 以后方法区改为元空间，可以使用本地内存，若存在，则返回 "hello" 地址，若不存在，先看堆中是否有 Sting("hello")对象，如果有，

  则常量池中 "hello" 存储堆中 Stirng("hello")对象的引用

面试题：

1. new Stirng("hello") 创建了几个对象？

> 对象 1：字符串常量池中 "hello" 对象
>
> 对象 2：堆中 new 的 String 对象

2. new Stirng("hello") + new String("world") 创建了几个对象？

> 对象 1：字符串拼接会 new 一个 StringBuilder 对象
>
> 对象 2：字符串常量池中 "hello" 对象
>
> 对象 3：堆中 new 的 String 对象
>
> 对象 4：字符串常量池中 "world" 对象
>
> 对象 5：堆中 new 的 String 对象
>
> 对象 6：StringBuilder 的 toString()方法会 new 一个 String 对象 

**注： 字符串常量池中不会生成 "helloworld" 对象**

3. intern()面试题

```java
Stirng s1 = new String("hello");
String s2 = "hello";
System.out.println(s1 == s2); // false
```

![image-20260707113535201](https://img-proxy.zzc.dpdns.org/images/901741d3ca3cb3c3be813d3a3f66d120.png)

```java
String s1 = new String("hello");
String s3 = s1.intern();
String s2 = "hello";
System.out.println(s1 == s2); // false
System.out.println(s2 == s3); // true
```

这里的 s1.intern() ，因为 "hello" 已经在常量池中，直接返回地址

![image-20260707114057472](https://img-proxy.zzc.dpdns.org/images/743e5bf675b1e06293c7b807830db8d6.png)

```java
String s1 = new String("hello") + new String("world"); // 字符串常量池中不会生成 "helloworld" 对象
String s2 = "helloworld";
System.out.println(s1 == s2); // false
```

```java
// s1 变量记录的地址为: new String("helloworld");
String s1 = new String("hello") + new String("world");
// 执行完上一行代码后，字符串常量池中没有 "helloworld"
s1.intern(); // s1 变量记录的 "helloworld" 字符串对象，会放入字符串常量池中
// 如何理解 s1.intern()
// 在 jdk6 中，s1.intern()创建了一个新的对象 "helloworld", 并放入字符串常量池中
// 在 jdk7 中，s1.intern()并没有创建 "helloworld" 对象, 而是创建一个指向堆空间 new String("helloworld")的引用
String s2 = "helloworld"; // 使用的是上一行代码放入的字符串对象 "helloworld"
System.out.println(s1 == s2); // jdk6: false // jdk7，8: true
```

![image-20260707120832653](https://img-proxy.zzc.dpdns.org/images/91d7531616271ed4bf02433221bef2f4.png)

**总结 String 的 intern()的使用：**

- jdk1.6 中，将这个字符串对象尝试放入串池。如果串池中有，则并不会放入。返回已有的串池中的对象的地址
如果没有，会把此对象复制一份，放入串池，并返回串池中的对象地址
- Jdk1.7 起，将这个字符串对象尝试放入串池。如果串池中有，则并不会放入。返回已有的串池中的对象的地址
如果没有，则会把对象的引用地址复制一份，放入串池，并返回串池中的引用地址

只对于 `String s1 = new String("hello") + new String("world")` 这种情况




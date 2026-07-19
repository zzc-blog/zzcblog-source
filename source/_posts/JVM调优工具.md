---
title: JVM调优工具
date: 2026-07-15 12:17:34
categories:
  - JVM
  - 工具
tags:
  - JVM调优
---

## 一、JVM 调优（命令行工具）

### 1. jps

显示指定系统内所有的 HotSpot 虚拟机进程（查看虚拟机进程信息），可用于查询正在运行的虚拟机进程。

> 说明：对于本地虚拟机进程来说，进程的本地虚拟机 ID 与操作系统的进程 ID 是一致的，是唯一的。

**options 参数**

-q ：仅仅显示 LVMID（local virtual machine id），即本地虚拟机唯一 id。不显示主类的名称等

-l：输出应用程序主类的全类名或如果进程执行的是 jar 包，则输出 jar 完整路径

-m：输出虚拟机进程启动时传递给主类 main()的参数

-V：列出虚拟机进程启动时的 JVM 参数。比如：-Xms20m-Xmx50m 是启动程序指定的 jvm 参数。

说明：以上参数可以综合使用。

> 补充：
> 如果某 Java 进程关闭了默认开启的 UsePerfData 参数（即使用参数-XX：-UsePerfData），那么 jps 命令（以及下面介绍的 jstat）将无法探知该 Java 进程。

### 2. jstat

jstat(JVM Statistics Monitoring Tool）：**用于监视虚拟机各种运行状态信息的命令行工具**。它可以显示本地或者远程虚拟机进程中的类装载、内存、垃圾收集、 JIT 编译等运行数据。

在没有 GUI 图形界面，只提供了纯文本控制台环境的服务器上，它将是运行期定位虚拟机性能问题的首选工具。常用于检测垃圾回收问题以及内存泄漏问题。

它的基本使用语法为：

jstat -<option> [-t] [-h <lines>] <vmid> [<interval> [<count>]] 

查看命令相关参数：

jstat -h 或 jstat -help

<vmid> 进程号

**option 参数**

1. **JIT 相关的：**

- -compiler：显示 JIT 编译器编译过的方法、耗时等信息
- -printcompilation：输出已经被 jiT 编译的方法

2. **垃圾回收相关的：**

- -gc：显示与 GC 相关的堆信息。包括 Eden 区、两个 Survivor 区、老年代、永久代等的容量、已用空间、GC 时间合计等信息。
- -gccapacity：显示内容与-gc 基本相同，但输出主要关注 Java 堆各个区域使用到的最大、最小空间。
- -gcutil：显示内容与-gc 基本相同，但输出主要关注已使用空间占总空间的百分比。
- -gccause：与-gcutil 功能一样，但是会额外输出导致最后一次或当前正在发生的 Gc 产生的原因。
- -gcnew：显示新生代 Gc 状况
- -gcnewcapacity：显示内容与-gcnew 基本相同，输出主要关注使用到的最大、最小空间
- -geold：显示老年代 Gc 状况
- -gcoldcapacity：显示内容与-gcold 基本相同，输出主要关注使用到的最大、最小空间
- -gcpermcapacity：显示永久代使用到的最大、最小空间。

3. **类加载相关的**

- -class：显示 classLoader 的相关信息：类的装载、卸载数量、总空间、类装载所消耗的时间等

---

1. interval 参数 用于指定输出统计数据的周期，单位为毫秒。即：查询间隔
2. count 参数 用于指定查询的总次数
3. -t 参数 可以在输出信息前加上一个 Timestamp 列，显示程序的运行时间。单位：秒

> 经验：我们可以比较 Java 进程的启动时间以及总 GC 时间（GCT 列），或者两次测量的间隔时间以及总 GC 时间的增量，来得出 GC 时间占运行时间的比例。
> 如果该比例超过 20%，则说明目前堆的压力较大：如果该比例超过 90%，则说明堆里几乎没有可用空间，随时都可能抛出 OOM 异常。

1. -h 参数 可以在周期性数据输出时，输出多少行数据后输出一个表头信息

```bash
jstat -class -t -h3 9000 1000 10
```

> jstat 还可以用来判断是否出现内存泄漏。
>
> 第 1 步：
> 在长时间运行的 Java 程序中，我们可以运行 istat 命令连续获取多行性能数据，并取这几行数据中 OU 列（即己占用的老年代内存）的最小值。
>
> 第 2 步：
> 然后，我们每隔一段较长的时间重复一次上述操作，来获得多组 OU 最小值。如果这些值呈上涨趋势，则说明该 Java 程序的老年代内存已使用量在不断上涨，这意味着无法回收的对象在不断增加，因此很有可能存在内存泄漏。

### 3. jinfo

jinfo(Configuration Info for Java）

查看虚拟机配置参数信息，也可用于调整虚拟机的配置参数。

在很多情况下，Java 应用程序不会指定所有的 Java 虚拟机参数。而此时，开发人员可能不知道某一个具体的 ava 虚拟机参数的默认值。在这种情况下，可能需要通过查找文档获取某个参数的默认值。这个查找过程可能是非常艰难的。但有了 info 工具，开发人员可以很方便地找到 Java 虚拟机参数的当前值。

查看
jinfo -sysprops PID 可以查看由 System.getProperties()取得的参数

jinfo -flags PID 查看曾经赋过值的一些参数

jinfo -flag 具体参数 PID 查看某个 java 进程的具体参数的值 

修改

针对 boolean 类型

jinfo -flag [+|-] 具体参数 PID

针对非 boolean 类型

jinfo -flag 具体参数 = 具体参数值 PID

#可以查看被标记为 manageable 的参数
java -Xx:+PrintFlagsFinal -version | grep manageable

![image-20260715130747907](https://img-proxy.zzc.dpdns.org/images/0abb09275a9702b622e62192c65988c9.webp)

### 4. jmap

jmap（JVM Memory Map）：作用一方面是获取 dump 文件（堆转储快照文件，二进制文件），它还可以获取自标 java 进程的内存相关信息，包括 ava 堆各区域的使用情况、堆中对象的统计信息、类加载信息等。

开发人员可以在控制台中输入命令“jmap-help”查阅 jmap 工具的具体使用方式和一些标准选项配置。

![image-20260715131133754](https://img-proxy.zzc.dpdns.org/images/d2cde74ff4085726672de870b8a63140.webp)

HeapDump 又叫做堆存储文件，指一个 Java 进程在某个时间点的内存快照。HeapDump 在触发内存快照的时候会保存此刻的信息如下：

1. **AllObjects**

class, fields, primitivevaluesandreferences

2. **AllClasses**

classLoader, name, super class, staticfields 

3. **Garbage Collection Roots**

objects defined to be reachable by the JvM 

4. **Thread Stacks and Local Variables**

The call-stacks of threads at the moment of the snapshot, and per-frame information about local objects

> 说明：
> 1． 通常在写 HeapDump 文件前会触发一次 Full GC，所以 heapdump 文件里保存的都是 Full GC 后留下的对象信息。
> 2． 由于生成 dump 文件比较耗时，因此大家需要耐心等待，尤其是大内存镜像生成 dump 文件则需要耗费更长的时间来完成。

1. **导出内存映射文件**

手动的方式

jmap -dump: format = b, file = <filename.hprof> <pid>
jmap -dump: live, format = b, file = <filename.hprof> <pid>

自动的方式

当程序发生 OOM 退出系统时，一些瞬时信息都随着程序的终止而消失，而重现 OOM 问题往往比较困难或者耗时。此时若能在 OOM 时，自动导出 dump 文件就显得非常迫切。这里介绍一种比较常用的取得推快照文件的方法，即使用：
-XX：+HeapDumponoutofMemoryError：在程序发生 ooM 时，导出应用程序的当前堆快照。
-XX：HeapDumpPath：可以指定堆快照的保存位置。比如：

-Xmx100m -XX:+HeapDumpOnOutofMemoryError -XX: HeapDumpPath = D:\m.hprof

2. **显示堆内存相关信息**

jmap -heap pid  输出整个堆空间的详细信息，包括 GC 的使用、堆配置信息，以及内存的使用信息等

> jmap -heap pid > filename.txt

jmap -histo pid 输出堆中对象的统计信息，包括类、实例数量和合计容量

> 特别的：-histo: live 只统计堆中的存活对象

总结：

由于 jmap 将访问堆中的所有对象，为了保证在此过程中不被应用线程干扰，jmap 需要借助安全点机制，让所有线程停留在不改变堆中数据的状态。也就是说，由 jmap 导出的堆快照必定是安全点位置的。这可能导致基于该堆快照的分析结果存在偏差。

举个例子，假设在编译生成的机器码中，某些对象的生命周期在两个安全点之间，那么: live 选项将无法探知到这些对象。

另外，如果某个线程长时间无法跑到安全点，jmap 将一直等下。与前面讲的 jstat 则不同，垃圾回收器会主动将 jstat 所需要的摘要数据保存至固定位置之中，而 jstat 只需直接读取即可。

### 5. jhat

jhat(JVM HeapAnalysis Tool)

SunJDK 提供的 jhat 命令与 jmap 命令搭配使用，用于分析 jmap 生成的 heapdump 文件（堆转储快照）。jhat 内置了一个微型的 HTTP/HTML 服务器，生成 dump 文件的分析结果后，用户可以在浏览器中查看分析结果（分析虚拟机转储快照信息）。

使用了 jhat 命令，就启动了一个 http 服务，端口是 7000，即 http：//localhost：7000/，就可以在浏览器单分析。

~~说明：jhat 命令在 JDK9、JDK10 中已经被删除，官方建议用 VisualVM 代替。~~

**jhat html 页面**

![image-20260715133813731](https://img-proxy.zzc.dpdns.org/images/4f77a59e8faa305f5c7a14851431463f.webp)

```bash
jhat d:\1.hprof
```

![image-20260715133729692](https://img-proxy.zzc.dpdns.org/images/1eec4f690a9dbb7074406921a5408a2d.webp)

### 6. jstack

jstack（JVM SitackTrace）：**用于生成虚拟机指定进程当前时刻的线程快照**（虚拟机堆栈跟踪）。

线程快照就是当前虚拟机内指定进程的每一条线程正在执行的方法堆栈的集合。

生成线程快照的作用：

可用定位线程出现长时间停顿的原因，如线程间死锁、死循环、请求外部资源导致的长时间等待等问题。这些都是导致线程长时间停顿的常见原因。

当线程出现停顿时，就可以用 jstack 显示各个线程调用的堆栈情况。

**在 thread dump 中，要留意下面几种状态:**

- **死锁，Deadlock（重点关注）**
- **等待资源，Waiting on condition（重点关注）**
- **等待获取监视器，Waiting on monitorentry（重点关注）**
- **阻塞，Blocked（重点关注）**
- 执行中，Runnable 
- 暂停，Suspended

jstack 参数

option 参数：-F 当正常输出的请求不被响应时，强制输出线程堆栈

option 参数：-l 除堆栈外，显示关于锁的附加信息

option 参数：-m 如果调用到本地方法的话，可以显示 C/C++的堆栈

option 参数：-h 帮助操作

java 代码也可以查看

![image-20260715134935888](https://img-proxy.zzc.dpdns.org/images/0a0574d610aa18762687fdbeadbc98af.webp)

### 7. jcmd

在 JDK1.7 以后，新增了一个命令行工具 jcmd。

它是一个多功能的工具，可以用来实现前面除了 jstat 之外所有命令的功能。比如：用它来导出堆、内存使用、查看 Java 进程、导出线程信息、执行 GC、JVM 运行时间等。

官方帮助文档：

https://docs.oracle.com/en/java/javase/11/tools/jcmd.html

jcmd 拥有 jmap 的大部分功能，并且在 oracle 的官方网站上也推荐使用 jcmd 命令代 jmap 命令

jcmd -l 列出所有的 JVM 进程

jcmd pid help 针对指定的进程，列出支持的所有命令

jcmd pid 具体命令 显示指定进程的指令命令的数据

```txt

```

### 8. jstatd

之前的指令只涉及到监控本机的 Java 应用程序，而在这些工具中，一些监控工具也支持对远程计算机的监控（如 jps、jstat）。

为了启用远程监控，则需要配合使用 jstatd 工具。

命令 jstatd 是一个 RMI 服务端程序，它的作用相当于代理服务器，建立本地计算机与远程监控工具的通信。

jstatd 服务器将本机的 Java 应用程序信息传递到远程计算机。

![image-20260715135641273](https://img-proxy.zzc.dpdns.org/images/4b8ed6fd580279c9b6fc6d05e5d40534.webp)

## 二、JVM 调优（图形化工具）

使用上一章命令行工具或组合能获取目标 java 应用性能相关的基础信息，但它们存在下列局限：

1. 无法获取方法级别的分析数据，如方法间的调用关系、各方法的调用次数和调用时间等（这对定位应用性能瓶颈至关重要）。

2. 要求用户登录到目标 Java 应用所在的宿主机上，使用起来不是很方便。

3. 分析数据通过终端输出，结果展示不够直观。

**图形化综合诊断工具**

**JDK 自带的工具**

1. jconsole：JDK 自带的可视化监控工具。查看 Java 应用程序的运行概况、监控堆信息、永久区（或元空间）使用情况、类加载情况等 

>  位置：jdk\bin\jconsole.exe

2. VisualvM：VisualVM 是一个工具，它提供了一个可视界面，用于查看 Java 虚拟机上运行的基于 Java 技术的应用程序的详细信息。 >

>  位置：jdk\bin\jvisualvm.exe

3. JMC: Java Mission Control，内置 Java Flight Recorder。能够以极低的性能开销收集 Java 虚拟机的性能数据。

**第三方工具**

1. MAT：MAT（MemoryAnalyzerTool）是基于 Eclipse 的内存分析工具，是一个快速、功能丰富的 Javaheap 分析工具，它可以帮助我们查找内存泄漏和减少内存消耗

>  Eclipse 的插件形式

2. JProfiler：商业软件，需要付费。功能强大

> 与 VisualVM 类似

3. Arthas：Alibaba 开源的 Java 诊断工具。深受开发者喜爱。

4. Btrace：Java 运行时追踪工具。可以在不停机的情况下，跟踪指定的方法调用、构造函数调用和系统内存等信息。

### 1. jconsole

- 从 Java5 开始，在 JDK 中自带的 java 监控和管理控制台。
- 用于对 JVM 中内存、线程和类等的监控，是一个基于 JMX(java management extensions)的 GUI 性能监控工具。

### 2. Visual VM

Visual VM 是一个功能强大的多合一故障诊断和性能监控的可视化工具。

它集成了多个 JDK 命令行工具，使用 Visual VM 可用于显示虚拟机进程及进程的配置和环境信息(jps, jinfo），监视应用程序的 CPU、GC、堆、方法区及线程的信息（jstat、jstack)等，甚至代替 jconsole。

在 JDK6 Update7 以后，Visual VM 便作为 JDK 的一部分发布（VisualVM 在 JDK/bin 目录下），即：它完全免费。

从 JDK 9 开始，Oracle JDK 不再捆绑 VisualVM（`jvisualvm` 命令没了）。

> **JDK 6 / 7 / 8**：`bin/jvisualvm` 随 Oracle JDK 一起分发，叫 "Java VisualVM"
>
> **JDK 9 起**：Oracle JDK 把 VisualVM 拆出去成为独立项目，JDK 里只留 `jconsole`、`jvisualvm` 等更核心的工具还在，但 VisualVM 本身要自己下
>
> **现在**：独立版在 https://visualvm.github.io 维护，GraalVM 里也还绑了一份

**插件安装**

Visual VM 的一大特点是支持插件扩展，并且插件安装非常方便。我们既可以通过离线下载插件文件*.nbm，然后在 Plugin 对话框的已下载页面下，添加已下载的插件。

也可以在可用插件页面下，在线安装插件。（建议安装上：VisualGC）

插件地址：

https://visualvm.github.io/pluginscenters.html

![image-20260715143340965](https://img-proxy.zzc.dpdns.org/images/9363222d16f8c0d9cfe429f23b2d4e18.webp)

**主要功能**

![image-20260715143440893](https://img-proxy.zzc.dpdns.org/images/b808235a0990f5d4149b280fef831b30.webp)

### 3. eclipse MAT

MAT(Memory Analyzer Tool）工具是一款功能强大的 **Java 堆内存分析器**。可以用于查找内存泄漏以及查看内存消耗情况。

MAT 是基于 Eclipse 开发的，不仅可以单独使用，还可以作为插件的形式嵌入在 Eclipse 中使用。是一款免费的性能分析工具，使用起来非常方便。

**dump 文件内容**

MAT 可以分析 heap dump 文件。在进行内存分析时，只要获得了反映当前设备内存映像的 hprof 文件，通过 MAT 打开就可以直观地看到当前的内存信息。

一般说来，这些内存信息包含：

- 所有的对象信息，包对象实例、成员变量、存储于栈中的基本类型值和存储于堆中的其他对象的引用值。
- 所有的类信息，包括 classloader、类名称、父类、静态变量等 
- GCRoot 到所有的这些对象的引用路径
- 线程信息，包括线程的调用栈及此线程的线程局部变量（TLS）

> 说明 1：缺点：
>
> MAT 不是一个万能工具，它并不能处理所有类型的堆存储文件。但是比较主流的厂家和格式，例如 Sun，HP，SAP 所采用的 HPROF 二进制堆存储文件，以及 IBM 的 PHD 堆存储文件等都能被很好的解析
>
> 说明 2：
>
> 最吸引人的还是能够 `快速为开发人员生成内存泄漏报表`，方便定位问题和分析问题。虽然 MAT 有如此强大的功能，但是内存分析也没有简单到一键完成的程度，很多内存问题还是需要我们从 MAT 展现给我们的信息当中通过经验和直觉来判断才能发现。

**获取 dump 文件**

**方法一：通过 jmap 工具生成，可以生成任意一个 java 进程的 dump 文件**

**方法二：通过配置 JVM 参数生成。**

选项 "-XX:+HeapDumpOnOutofMemoryError" 或 "-XX:+HeapDumpBeforeFullGC"

选项 "-XX: HeapDumpPath" 所代表的含义就是当程序出现 outofMemory 时，将会在相应的目录下生成一份 dump 文件。如果不指定选项“-XX：HeapDumpPath”则在当前目录下生成 dump 文件。

对比：考虑到生产环境中几乎不可能在线对其进行分析，大都是采用离线分析，因此使用 jmap+MAT 工具是最常见的组合。

**方法三：使用 VisualVM 可以导出堆 dump 文件**

**方法四**：**使用 MAT 既可以打开一个已有的堆快照，也可以通过 MAT 直接从活动 JaVa 程序中导出堆快照。该功能将借助 ips 列出当前正在运行的 Java 进程，以供选择并获取快照。**

![image-20260717130351346](https://img-proxy.zzc.dpdns.org/images/7a219e014d92a672e25a2c7ee4f77d6c.webp)

浅堆（shallow heap）

浅堆是指一个对象所消耗的内存。在 32 位系统中，一个对象引用会占据 4 个字节，一个 int 类型会占据 4 个字节，long 型变量会占据 8 个字节，每个对象头需要占用 8 个字节。根据堆快照格式不同，对象的大小可能会向 8 字节进行对齐。

以 String 为例：2 个 int 值共占 8 字节，对象引用占用 4 字节，对象头 8 字节，合计 20 字节，向 8 字节对齐，故占 24 字节。

（jdk7 中）

| int  | hash32 |
| ---- | ------ |
| int  | hash   |
| ref  | value  |

**这 24 字节为 String 对象的浅堆大小。它与 String 的 value 实际取值无关，无论字符串长度如何，浅堆大小始终是 24 字节。**

**保留集(Retained Set)：**

对象 A 的保留集指当对象 A 被垃圾回收后，可以被释放的所有的对象集合（包括对象 A 本身），即对象 A 的保留集可以被认为是只能通过对象 A 被直接或间接访问到的所有对象的集合。通俗地说，就是指仅被对象 A 所持有的对象的集合。

**深堆(Retained Heap)：**

深堆是指对象的保留集中所有的对象的浅堆大小之和。

注意：浅堆指对象本身占用的内存，不包括其内部引用对象的大小。一个对象的深堆指只能通过该对象访问到的(直接或间接)所有对象的浅堆之和，即对象被回收后，可以释放的真实空间。

补充：对象的实际大小

对象的实际大小定义为一个对象所能触及的所有对象的浅堆大小之和，就是通常意义上我们说的对象大小。与深堆相比，似乎这个在日常开发中更为直观和被人接受，但实际上，`这个概念和垃圾回收无关。`

![image-20260717131216575](https://img-proxy.zzc.dpdns.org/images/5c659801c1747bdc8c4ea49ea6d42f16.webp)

A 的浅堆：A  深堆：A + D

B 的浅堆：B  深堆：B + E

GC Roots 情况

![image-20260717131351788](https://img-proxy.zzc.dpdns.org/images/1d09b957390c8f298c8516445cf9561f.webp)

**支配树**

支配树（Dominator Tree）支配树的概念源自图论。

MAT 提供了一个称为支配树（Dominator Tree）的对象图。支配树体现了对象实例间的支配关系。在对象引用图中，所有指向对象 B 的路径都经过对象 A，则认为对象 A 支配对象 B。如果对象 A 是离对象 B 最近的一个支配对象则认为对象 A 为对象 B 的直接支配者。

支配树是基于对象间的引用图所建立的，它有以下基本性质：

对象 A 的子树（所有被对象 A 支配的对象集合）表示对象 A 的保留集（retainedset），即深堆。

如果对象 A 支配对象 B，那么对象 A 的直接支配者也支配对象 B。

支配树的边与对象引用图的边不直接对应。

如下图所示：左图表示对象引用图，右图表示左图所对应的支配树。对象 A 和 B 由根对象直接支配，由于在到对象 C 的路径中，可以经过 A，也可以经过 B，因此对象 C 的直接支配者也是根对象。对象 F 与对象 D 相互引用，因为到对象 F 的所有路径必然经过对象 D，因此，对象 D 是对象 F 的直接支配者。而到对象 D 的所有路径中，必然经过对象 C，即使是从对象 F 到对象 D 的引用，从根节点出发，也是经过对象 C 的，所以，对象 D 的直接支配者为对象 C。

![image-20260717133200289](https://img-proxy.zzc.dpdns.org/images/6557f8962735a12f851b344fbf4a782e.webp)

同理，对象 E 支配对象 G。到达对象 H 的可以通过对象 D，也可以通过对象 E，因此对象 D 和 E 都不能支配对象 H，而经过对象 C 既可以到达 D 也可以到达 E，因此对象 C 为对象 H 的直接支配者。

**Java 内存泄漏的 8 种情况**

![image-20260719184442193](https://img-proxy.zzc.dpdns.org/images/2e86864dcef0d712191185a4da4680c8.webp)

1. 静态集合类

![image-20260719184552283](https://img-proxy.zzc.dpdns.org/images/ce5ad931c31424c4e3af93917ec27aae.webp)

2. 单例模式

   单例模式，和静态集合导致内存泄露的原因类似，因为单例的静态特性，它的生命周期和 JVM 的生命周期一样长，所以如果单例对象如果持有外部对象的引用，那么这外部对象也不会被回收，那么就会造成内存泄漏。

3. 内部类持有外部类

   内部类持有外部类，如果一个外部类的实例对象的方法返回了一个内部类的实例对象。这个内部类对象被长期引用了，即使那个外部类实例对象不再被使用，但由于内部类持有外部类的实例对象，这个外部类对象将不会被垃圾回收，这也会造成内存泄漏。

4. 各种连接，如数据库连接，网络连接，IO 连接

   在对数据库进行操作的过程中，首先需要建立与数据库的连接，当不再使用时，需要调用 c1ose 方法来释放与数据库的连接。只有连接被关闭后，垃圾回收器才会回收对应的对象。
   否则，如果在访问数据库的过程中，对 connection、Statement 或 ResultSet 不显性地关闭，将会造成大量的对象无法被回收，从而引起内存泄漏。

   ![image-20260719190211834](https://img-proxy.zzc.dpdns.org/images/89371831aaa719f94d9b56b28b2a281e.webp)

5. 变量不合理的作用域

   ![image-20260719190239561](https://img-proxy.zzc.dpdns.org/images/8a14ce5e855633d19e9190139f5c221b.webp)

6. 改变 hash 值

   

7. 缓存泄漏

   内存泄漏的另一个常见来源是缓存，一旦你把对象引用放入到缓存中，他就很容易遗忘。比如：前项目在一次上线的时候，应用启动奇慢直到夯死，就是因为代码中会加载一个表中的数据到缓存（内存）中，测试环境只有几百条数据，但是生产环境有几百万的数据。
   对于这个问题，可以使用 WeakHashMap 代表缓存，此种 Map 的特点是，当除了自身有对 key 的引用外，此 key 没有其他引用那么此 map 会自动丢弃此值。

   ![image-20260719190331382](https://img-proxy.zzc.dpdns.org/images/ca2c817be94aa2bf9d6a922b4c733057.webp)

8. 监听器和回调

   内存泄漏第三个常见来源是监听器和其他回调，如果客户端在你实现的 API 中注册回调，却没有显示的取消，那么就会积聚。
   需要确保问调立被当作垃圾可收的最佳方法是只保存它的弱引用，例如将他保存成头为 WeakHashMap 中的键。

### 4. JProfiler

JProfiler 是由 ej-technologies 公司开发的一款 Java 应用性能诊断工具。功能强大，但是收费。

![image-20260719190556442](https://img-proxy.zzc.dpdns.org/images/a26cf09a4c2feb442405155cef2e3634.webp)

### 5. Arthas

Arthas（阿尔萨斯）是 Alibaba 开源的 Java 诊断工具：：动态跟踪 Java 代码：实时监控 JVM 状态。深受开发者喜爱。在线排查问题，无需重启

Arthas 支持 JDK6+，支持 Linux/Mac/windows，采用命令行交互模式，同时提供丰富的 Tab 自动补全功能，进一步方便进行问题的定位和诊断。

- 当你遇到以下类似问题而束手无策时，Arthas 可以帮助你解决：
- 这个类从哪个 iar 包加载的？为什么会报各种类相关的 Exception？
- 我改的代码为什么没有执行到？难道是我没 commit？分支搞错了？
- 遇到问题无法在线上 debug，难道只能通过加日志再重新发布吗？
- 线上遇到某个用户的数据处理有问题，但线上同样无法 debug，线下无法重现！
- 是否有一个全局视角来查看系统的运行状况？
- 有什么办法可以监控到 JVM 的实时运行状态？

在线文档 https://arthas.aliyun.com/zh-cn/

---
title: JDK 工具
date: 2026-07-10 19:24:57
categories:
  - 技术
  - Java
tags: [JDK, javac, javap]
---

## 1. javac

```bash
javac -g Hello.java
```

### 作用

- 默认情况下，`javac`只生成行号和源文件信息（相当于 `-g:lines,source`）。
- 加上 `-g`后，会额外包含**局部变量的调试信息**，方便在 IDE 或调试器中查看变量值、堆栈状态等。

### 常用变体

| 选项        | 含义                                      |
| ----------- | ----------------------------------------- |
| `-g`        | 生成所有调试信息（lines + vars + source） |
| `-g:none`   | 不生成任何调试信息                        |
| `-g:lines`  | 仅生成行号信息                            |
| `-g:vars`   | 仅生成局部变量信息                        |
| `-g:source` | 仅生成源文件信息                          |

## 2. javap

### 基本帮助与版本

- `-help`/ `-?`/ `--help` 输出此用法消息
- `-version` 显示 javap 所在 JDK 的版本信息（非 class 文件版本）

### 访问级别控制（显示哪些成员）

- `-public` 仅显示公共类和成员
- `-protected` 显示受保护的及公共类和成员
- **`-p` ||`-private` 显示所有类和成员（包括私有）**
- `-package` 显示程序包、受保护的及公共类和成员（默认行为）

### 输出内容详细程度

- `-sysinfo` 显示正在处理的类的系统信息（路径、大小、日期、MD5 散列、源文件名）
- `-constants` 显示静态 final 常量（显示值）
- `-s` 输出内部类型签名（即 JVM 内部类型描述符）
- `-l` 输出行号和局部变量表
- **`-c` 对字节码进行反汇编（输出 JVM 指令）**
- **`-v` ||`-verbose` 输出附加详细信息（包含行号、局部变量表、反汇编等全部信息）**

**最全指令**

```bash
javap -v -p Hello.java
```

测试类：

```java
/**
 * 用于演示 javap 命令的测试类
 */
public class Hello {

    // 静态常量（-constants 可见）
    public static final String GREETING = "Hello, World!";

    // 私有实例字段
    private int count;

    // 受保护字段
    protected double value;

    // 公有构造器
    public Hello(int count) {
        this.count = count;
        this.value = 0.0;
    }

    // 私有方法
    private void increment() {
        count++;
    }

    // 公有方法
    public void sayHello(String name) {
        System.out.println(GREETING + ", " + name);
        increment();
    }

    // 包私有静态方法
    static void reset() {
        System.out.println("Reset called");
    }
}
```

**解析 `javap -v -p Hello`命令的输出**

1. **类头部信息**

```txt
Classfile /path/to/Hello.class
  Last modified 2026-07-10; size 1234 bytes
  MD5 checksum aabbccddee...
  Compiled from "Hello.java"
public class Hello
  minor version: 0
  major version: 61
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
```

- **Classfile**：`.class`文件的路径。
- **Last modified / size / MD5**：文件的修改时间、大小、MD5 校验值（`-sysinfo`也会输出）。
- **Compiled from**：源文件名。
- **public class Hello**：类声明。
- **minor/major version**：编译出的 class 文件格式版本。major 61 对应 Java 17。
- **flags**：类的访问标志。`ACC_PUBLIC`表示类是公有的，`ACC_SUPER`表示该类使用 invokespecial 指令的新语义（JDK 1.0.2 之后默认都有）。

好的，我们来详细解析 `javap -v -p Hello`命令的输出。假设你已经编译了上面的 `Hello.java`，执行：

```bash
javap -v -p Hello
```

输出会很长，我们分段解析每一部分的意义。

------

## 1. 类头部信息

```
Classfile /path/to/Hello.class
  Last modified 2026-07-10; size 1234 bytes
  MD5 checksum aabbccddee...
  Compiled from "Hello.java"
public class Hello
  minor version: 0
  major version: 61
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
```

- 

  **Classfile**：`.class`文件的路径。

- 

  **Last modified / size / MD5**：文件的修改时间、大小、MD5 校验值（`-sysinfo`也会输出）。

- 

  **Compiled from**：源文件名。

- 

  **public class Hello**：类声明。

- 

  **minor/major version**：编译出的 class 文件格式版本。major 61 对应 Java 17。

- 

  **flags**：类的访问标志。`ACC_PUBLIC`表示类是公有的，`ACC_SUPER`表示该类使用 invokespecial 指令的新语义（JDK 1.0.2 之后默认都有）。

------

2. **常量池（Constant Pool）**

```
Constant pool:
   #1 = Methodref          #7.#22         // java/lang/Object."<init>":()V
   #2 = Fieldref           #6.#23         // Hello.count:I
   #3 = Fieldref           #6.#24         // Hello.value:D
   #4 = String             #25            // Hello, World!
   #5 = Fieldref           #6.#26         // Hello.GREETING:Ljava/lang/String;
   ...
```

常量池是 class 文件的资源仓库，存储了所有符号引用（类、方法、字段、字符串字面量等）。每条记录有一个编号（#1, #2...），后面跟着类型和具体内容。`javap`会自动解析并显示注释（`//`后面的内容）。

常见条目：

- **Methodref**：方法引用，指向某个类的某个方法。

- **Fieldref**：字段引用。

- **String**：字符串常量。

- **Class**：类或接口的符号引用。

- **Utf8**：UTF-8 编码的字符串（通常用于名称、描述符等）。

**常量池是所有后续指令的基础，字节码中的操作数往往直接引用常量池索引。**

**3. 类的基本信息（this_class, super_class, interfaces）**

```
{
  Hello: this_class = #6                   // Hello
  super_class = #7                         // java/lang/Object
  interfaces: 0 items
}
```

- **this_class**：当前类在常量池中的索引（指向 Class 条目）。
- **super_class**：父类索引。
- **interfaces**：实现的接口数量及列表。

**4. 字段（Fields）**

```
private int count;
  descriptor: I
  flags: (0x0002) ACC_PRIVATE

protected double value;
  descriptor: D
  flags: (0x0004) ACC_PROTECTED

public static final java.lang.String GREETING;
  descriptor: Ljava/lang/String;
  flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
  ConstantValue: String #4                 // Hello, World!
```

- **descriptor**：JVM 内部类型描述符。`I`=int, `D`=double, `Ljava/lang/String;`=String 类。
- **flags**：字段的访问修饰符组合。
- **ConstantValue**：如果是 `static final`字段且值为常量，则直接在这里显示常量池索引。

------

**5. 方法（Methods）**

**5.1 构造器 `<init>`**

```
public Hello(int);
  descriptor: (I)V
  flags: (0x0001) ACC_PUBLIC
  Code:
    stack=2, locals=2, args_size=2
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: aload_0
       5: iload_1
       6: putfield      #2                  // Field count:I
       9: aload_0
      10: dconst_0
      11: putfield      #3                  // Field value:D
      14: return
    LineNumberTable:
      line 13: 0
      line 15: 4
      line 16: 9
      line 18: 14
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
          0      15     0  this   LHello;
          0      15     1 count   I
```

- **descriptor**：`(I)V`表示接收一个 int 参数，返回 void。
- **Code**：方法体字节码。
  - **stack**：操作数栈最大深度。
  - **locals**：局部变量个数（包括 `this`）。
  - **args_size**：参数个数（包括 `this`对实例方法而言）。
  - 字节码指令序列：每行 `偏移: 指令 [操作数] // 注释`。
- **LineNumberTable**：字节码偏移量与源代码行号的映射（调试用）。
- **LocalVariableTable**：局部变量名、类型、作用域范围（调试用）。

**5.2 私有方法 `increment`**

```
private void increment();
  descriptor: ()V
  flags: (0x0002) ACC_PRIVATE
  Code:
    stack=3, locals=1, args_size=1
       0: aload_0
       1: dup
       2: getfield      #2                  // Field count:I
       5: iconst_1
       6: iadd
       7: putfield      #2                  // Field count:I
      10: return
    LineNumberTable:
      line 21: 0
      line 22: 10
```

因为 `-p`选项，私有方法也被显示出来。

**5.3 公有方法 `sayHello`**

```
public void sayHello(java.lang.String);
  descriptor: (Ljava/lang/String;)V
  flags: (0x0001) ACC_PUBLIC
  Code:
    stack=3, locals=2, args_size=2
       0: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: new           #27                 // class java/lang/StringBuilder
       6: dup
       7: invokespecial #28                 // Method java/lang/StringBuilder."<init>":()V
      10: getstatic     #5                  // Field Hello.GREETING:Ljava/lang/String;
      13: invokevirtual #29                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      16: ldc           #30                 // String ", "
      18: invokevirtual #29                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      21: aload_1
      22: invokevirtual #29                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      25: invokevirtual #31                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      28: invokevirtual #32                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      31: aload_0
      32: invokevirtual #33                 // Method Hello.increment:()V
      35: return
    LineNumberTable:
      line 25: 0
      line 26: 31
      line 27: 35
```

这里可以看到编译器对字符串拼接优化成了 `StringBuilder`。

**5.4 包私有静态方法 `reset`**

```
static void reset();
  descriptor: ()V
  flags: (0x0008) ACC_STATIC
  Code:
    stack=2, locals=0, args_size=0
       0: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #34                 // String Reset called
       5: invokevirtual #32                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
    LineNumberTable:
      line 30: 0
      line 31: 8
```

因为没有 `this`，`locals=0`（实际上局部变量表为空）。

------

**6. 内部类（InnerClasses）**

```
InnerClasses:
  public #36= #19 of #6;                    // Inner=class Hello$Inner of class Hello
```

这部分列出了内部类的关系。`#36`是内部类信息在常量池中的索引，`#19`是内部类本身的 Class 条目，`#6`是外部类 Hello 的 Class 条目。`public`表示内部类的访问标志。

如果内部类还有更多细节（如匿名内部类），也会在此显示。

------

7. 其他可能的区域（视类情况而定）

- **Exceptions**：方法抛出的受检异常列表。
- **AnnotationDefault**：注解类型的默认值。
- **BootstrapMethods**：invokedynamic 指令引导方法表（lambda 表达式、字符串拼接等）。
- **NestMembers / NestHost**：Java 11 引入的嵌套类信息。

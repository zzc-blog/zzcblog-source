---
title: JWT及其使用
date: 2026-07-05 18:24:30
categories:
  - 技术
  - Java
tags:
  - JWT
cover: /img/cover/java.jpg
---
[toc]

## 1. 什么是 JWT
`JWT`（JSON Web Token）是一种基于`JSON`的开放标准（RFC 7519），用于在各方之间以紧凑且自包含的方式安全传输信息。它通常用于身份认证和信息交换，由三部分组成：`Header`（头部）、`Payload`（载荷）和 `Signature`（签名），格式为 `xxxxx.yyyyy.zzzzz`。

## 2. 使用 JWT
下面从依赖引入开始，逐步搭建 JWT 工具类。
### 2.1 引入依赖
> **JJWT 版本差异说明**：
>
> - **0.9.1 及更早版本**：`io.jsonwebtoken:jjwt`（一个 jar 包）
>
> - 0.10.0 及更高版本（特别是 0.11.x 及更高版本）
>
>   ：模块化方法
>
>   - `jjwt-api`（编译期）
>   - `jjwt-impl`（运行时，通常为 `runtime` 作用域）
>   - `jjwt-jackson`（JSON 序列化/反序列化，`runtime` 作用域）
>
> 关键区别：0.10+ 使用 `javax.xml.bind`（较旧）或 `java.base`（较新），但更重要的模块化是必需的。

依赖

```xml
<properties>
    <jjwt.version>0.12.6</jjwt.version>
</properties>

<dependencies>
    <!-- 1. 核心API（编译期需要） -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>${jjwt.version}</version>
    </dependency>

    <!-- 2. 运行时实现（必须） -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>${jjwt.version}</version>
        <scope>runtime</scope>
    </dependency>

    <!-- 3. Jackson序列化支持（建议保留，否则操作复杂对象会报错） -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>${jjwt.version}</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>

```

### 2.2 依赖说明

1. **jjwt-api（必须保留）**

  **作用**：编译期需要的接口和注解（如 `Jwts.builder()`、`Claims` 等）。

  **能否省略**：绝对不能。没有它，你的代码连 `import` 都编译不过。

2. **jjwt-impl（必须保留）**

  **作用**：运行时的具体实现类（真正的签名、加密 算法逻辑）。

  **能否省略**：绝对不能。没有它，运行时会报 `NoClassDefFoundError` 或 `NoSuchMethodError`。注意它设置了 `<scope>runtime</scope>`，这很合理，因为编译期只需要接口（api），运行期才需要实现。

3. **jjwt-jackson（强烈建议保留）**

  **作用**：负责 JWT 中 Payload（载荷/Claims）的 JSON 序列化和反序列化。

  **能否省略**：视情况而定，但 99% 的情况下建议保留。

- 如果你的 Claims 里只放字符串、数字（如 `userId`、`role`），去掉它暂时能跑（JJWT 内部会尝试用简单解析器处理）。
- 但只要你往 Claims 里放一个自定义对象（POJO），或者取出来时想直接转成对象，去掉它立马报序列化异常。

  **最佳实践**：为了防止项目迭代时踩坑，直接带上它，成本极低。

### 2.3 代码示例
载荷

![image-20260705183318753](https://hexo-1304867193.cos.ap-guangzhou.myqcloud.com/images/image-20260705183318753.png)



![image-20260705183359395](https://hexo-1304867193.cos.ap-guangzhou.myqcloud.com/images/image-20260705183359395.png)

![image-20260705183415020](https://hexo-1304867193.cos.ap-guangzhou.myqcloud.com/images/image-20260705183415020.png)

```java
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JwtUtils {

    // 新版本要求密钥长度：HS256 必须 >= 256位（32个字符），否则启动报错
    private static final String APP_SECRET = "yourSecretKeyYourSecretKeyYourSecretKey!"; // 至少32位
    private static final long EXPIRE = 1000 * 60 * 60;

    // 生成密钥对象（新API写法）
    private static SecretKey getKey() {
        return Keys.hmacShaKeyFor(APP_SECRET.getBytes(StandardCharsets.UTF_8));
    }

    // 1. 生成JWT（新API链式调用）
    public static String generateToken(String userId, String role) {
        return Jwts.builder()
                .subject(userId) // 对应 setSubject
                .claim("role", role)
                .issuedAt(new Date()) // 对应 setIssuedAt
                .expiration(new Date(System.currentTimeMillis() + EXPIRE)) // 对应 setExpiration
                .signWith(getKey()) // 新API：直接传 SecretKey 对象，无需指定算法（自动推断）
                .compact();
    }

    // 2. 解析JWT（新API写法，捕获异常来校验）
    public static Claims checkJWT(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getKey()) // 新API：验证密钥
                    .build()
                    .parseSignedClaims(token) // 新API：解析签名Claims
                    .getPayload(); // 获取载荷
        } catch (Exception e) {
            // 过期或签名错误
            return null;
        }
    }
}
```

### 生成端逐行拆解

整个过程可以拆解为 **"装数据 → 设时间 → 加签名 → 打包输出"** 四个步骤：

**1. `Jwts.builder()` —— 开工**
创建一个空的 JWT 构建器对象，准备往里塞东西。

**2. 数据装载区（谁、是什么）**
- `.subject(userId)`：将用户 ID 存入标准字段 `sub`（Subject），告诉系统"这个令牌代表谁"。
- `.claim("role", role)`：存入自定义字段 `role`，通常用于存角色、权限或用户昵称。

这两行最终会变成 JWT 载荷（Payload）中的 `{"sub":"10001", "role":"admin"}`。

**3. 时间控制区（生效与失效）**
- `.issuedAt(new Date())`：设置签发时间 `iat`（Issued At），取当前系统时间，用于记录 Token 何时生成。
- `.expiration(new Date(System.currentTimeMillis() + EXPIRE))`：设置过期时间 `exp`（Expiration），在当前时间上加上预设时长（如 `EXPIRE = 3600000` 毫秒即 1 小时），告诉系统"到这个时间点后，Token 就作废"。

**4. 加密签名区（防伪认证）**
- `.signWith(getKey())`：使用密钥对头部（Header）和载荷（Payload）进行加密签名。

在 0.12.x 版本中，无需手动指定算法（如 HS256）。JJWT 会根据你传入的 `SecretKey` 密钥长度自动选择最强安全的算法（密钥 >= 32 字节自动选 HS256）。这一行生成签名，确保 Token 内容不被篡改。只要密钥不泄露，任何人修改了载荷内容，签名校验都会失败。

**5. `.compact()` —— 打包出厂（终极执行）**
这是终结操作（Terminal Operation）。它将前三步组装好的头部、载荷进行 Base64Url 编码，然后拼接上签名，最终输出一个用点号（`.`）分隔的紧凑字符串：

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDAwMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxODAwMDAwMCwiZXhwIjoxNzE4MDAzNjAwfQ.abc123def456...
```

> **⚠️ 特别注意（避坑指南）**
> - **密钥长度**：务必确保密钥字符串长度 >= 32 个字符。如果低于 32 位，`signWith()` 执行时会抛出 `WeakKeyException` 异常导致生成失败。
> - **`compact()` 只能调用一次**：构建器在调用 `compact()` 后即被"消费"，无法再次修改或重新生成。如果后续想调整过期时间，必须重新调用 `Jwts.builder()` 新建一个对象。

### 解析端逐行拆解

生成是这一套，解析时就是反向操作：

```java
// 解析时，用 verifyWith(getKey()) 替换 signWith()
Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();
```

**1. `Jwts.parser()` —— 启动解析器**
创建一个 JWT 解析器的构建器实例，准备开始读取和校验 Token 字符串。

**2. `.verifyWith(getKey())` —— 设置验钞机模板（核心防伪）**
传入与生成时完全相同的密钥，用于校验 Token 的签名（Signature）。JJWT 会拿这个密钥，对当前 Token 的头部（Header）和载荷（Payload）重新计算一次签名，然后与 Token 自带的签名进行比对：
- **一致**：说明内容没被篡改，且确实是由我们的服务端签发的。
- **不一致**：说明 Token 被篡改或伪造，后续解析会报错。

> 注：新版本 API 已废弃旧版的 `setSigningKey()`，强制使用 `verifyWith()`，语义更明确（专门用于验证）。

**3. `.build()` —— 组装验钞机**
将前面设置的密钥等配置"固化"成一个不可变的解析器实例。这一步只是准备，尚未开始实际解析。

**4. `.parseSignedClaims(token)` —— 拆信封并验真伪（最关键的触发点）**
这是真正干活的一行，内部会按顺序做三件大事：
- **解码**：将 JWT 字符串按 `.` 分割，分别解码 Header 和 Payload。
- **验签（安全校验）**：立即执行签名比对。如果签名无效，直接抛出 `SignatureException`。
- **校验时效（时间门禁）**：自动检查载荷中的 `exp`（过期时间）和 `iat`（签发时间）。如果当前系统时间晚于 `exp`，抛出 `ExpiredJwtException`（令牌过期）。（如果设置了 `nbf` 不早于时间，也会在此检查。）

如果以上任何一步失败，整行代码都会抛出异常，程序会直接跳转到你的 `catch` 块中。

**5. `.getPayload()` —— 读取信纸内容（获取数据）**
一旦过了上面那道"安检门"，这行代码就很简单了：直接返回载荷（Payload）中的 `Claims` 对象（可以理解为一个 Map/字典）。拿到这个 `Claims` 后，就可以通过 `.getSubject()` 或 `.get("role")` 来读取之前存入的用户 ID 和角色信息了。

### 生成 vs 解析对照表

| 阶段     | 生成（Builder）                | 解析（Parser）                                 |
| -------- | ------------------------------ | ---------------------------------------------- |
| 准备密钥 | `.signWith(getKey())` 用于签名 | `.verifyWith(getKey())` 用于验签               |
| 动作触发 | `.compact()` 打包输出字符串    | `.parseSignedClaims(token)` 拆包并核验         |
| 异常时机 | 仅在密钥太短时会报错           | 高频报错区：过期、篡改、格式错误都发生在这一行 |
| 结果     | 返回紧凑的 JWT 字符串          | 返回安全的 Claims 对象                         |

### 特别注意（一定要记住）

**1. `verifyWith` 必须和 `signWith` 密钥相同**
这一点至关重要。一个密钥负责"签封"，另一个必须用完全相同的密钥来"拆封"，否则验签必失败。

**2. 异常处理必须精确**
因为 `.parseSignedClaims(token)` 会抛出多种异常，在实际项目中，强烈建议在 `catch` 块中区分异常类型，以便给前端返回不同的提示：

```java
try {
    return Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();
} catch (ExpiredJwtException e) {
    throw new RuntimeException("登录已过期，请重新登录");
} catch (MalformedJwtException | SignatureException e) {
    throw new RuntimeException("无效的Token，请重新登录");
} catch (Exception e) {
    throw new RuntimeException("认证失败");
}
```

---

## 总结

- **三个依赖都加，别省**，否则以后放复杂对象时排查问题很痛苦。
- **代码别抄旧版的**，用上面新版的 `signWith(getKey())` 和 `verifyWith(getKey())` 写法。
- **确保版本号已定义**：`jjwt.version` 属性值在 `pom.xml` 里定义了（比如 `<jjwt.version>0.12.6</jjwt.version>`）。
- **密钥长度要达标**：密钥字符串长度至少 32 个字符，否则启动会报 `WeakKeyException`。
- **Jackson 兼容性**：如果你的项目里本来就有 Jackson（`spring-boot-starter-web` 自带了），`jjwt-jackson` 会和它自动配合，开箱即用。
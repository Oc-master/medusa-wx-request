# medusa-wx-request

medusa-wx-request 是基于官方 API 进行了二次封装的函数工具，主要功能在于为官方 API 提供 Promise 的能力，本方法在保证了官方 request 方法的功能不受影响的前提下，还提供了以下能力：

- 请求过程中 loading 弹出层功能
- 当发生错误时，错误信息提示弹出层功能
- 预设 API 的通用地址部分和过滤返回数据功能

## 初始化请求实例
**示例**
```javascript
/** services.js */
import Request from 'medusa-wx-request';

const md = new Request({
	baseUrl: 'https://www.miniprogram.com',
  isFilterRes: false,
});
```
**参数**

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| baseUrl | String |  | 否 | API地址的通用部分 |
| isFilterRes | Boolean | true | 否 | 为 false 时，则按照官方API的数据结构进行返回。
为 true 时，则只返回其中的 data 属性。 |

## 请求功能函数
通过使用实例的 request 方法，就可以正常使用请求功能。出于异常处理实践方式多样并且复杂的考虑，在请求进入 fail 回调时我任然通过 resolve 的方式来更改 Promise 的状态，我将返回的数据结构更改为数组，索引为 0 的元素代表 error 的信息，当请求成功时索引为 0 的元素值为 null，这样通过 error 的值就可以判断请求是成功或是失败。
**示例**
```javascript
/** services.js **/
const getLoginInfo = () => md.request({ url: '/api/login' });

/** Page **/

/** async 语法 **/
const [err, res] = await getLoginInfo();
/** Promise 语法 **/
getLoginInfo().then(([err, res]) => {
	...
});
```
### Loading 与 Toast 功能
该示例的 request 方法可以接收官方API文档中所列的所有参数，除此之外，还提供了加载中提示与错误提示功能。
**示例**
```javascript
/**
	* 通过 loadingOps 对象控制加载中提示功能
  * @param isShow {Boolean} 开关功能 默认值为true
  * @param text {String} 提示文案 默认值为'loading...'
  **/

/** 为某一请求关闭加载中提示功能 **/
const getLoginInfo = () => md.request({
  url: '/api/login',
  loadingOps: { isShow: false },
});
/** 为某一请求更改提示文案 **/
const getLoginInfo = () => md.request({
  url: '/api/login',
  loadingOps: { text: '正在加载中...' },
});
```
```javascript
/**
	* 通过 toastOps 对象控制错误提示功能
  * @param isShow {Boolean} 开关功能 默认值为 true
  * @param text {String} 提示文案 默认值为 '服务器开小差了哦'
  **/

/** 为某一请求关闭加载中提示功能 **/
const getLoginInfo = () => md.request({
  url: '/api/login',
  toastOps: { isShow: false },
});
/** 为某一请求更改提示文案 **/
const getLoginInfo = () => md.request({
  url: '/api/login',
  toastOps: { text: '请稍后重试' },
});
```

## License

[MIT](https://github.com/Oc-master/medusa-wx-request/blob/master/LICENSE)

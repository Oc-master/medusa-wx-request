const platform = wx;

const DEFAULT_LOADING_OPTIONS = {
  isShow: true,
  text: 'loading...',
};

const DEFAULT_TOAST_OPTIONS = {
  isShow: true,
  text: '服务器开小差了哦',
};

/**
 * Request 请求功能类
 * @param {String} baseUrl API 地址通用部分字符串
 * @param {Boolean} isFilterRes 是否过滤请求返回的数据结构 true: 只返回业务服务器的数据
 */
class Request {
  constructor({ baseUrl = '', isFilterRes = true } = {}) {
    this.baseUrl = baseUrl;
    this.isFilterRes = isFilterRes;
  }

  /**
   * 请求方法
   * @param {Object} options 支持原生 request 方法左右参数，具体请参阅官方 API 文档
   * @param {Object} loadingOps 附加参数，用来支持加载时显示loading功能
   * @param {Object} toastOps 附加参数，用来支持发生错误时提供错误提示功能
   */
  request(options) {
    const {
      url, header = {}, method = 'GET', loadingOps = {}, toastOps = {},
    } = options;
    if (!url) {
      console.error('url 为请求函数必填字段');
      return undefined;
    }
    const upperMethod = method.toUpperCase();
    const loadingOptions = {
      ...DEFAULT_LOADING_OPTIONS,
      ...loadingOps,
    };
    const toastOptions = {
      ...DEFAULT_TOAST_OPTIONS,
      ...toastOps,
    };
    return new Promise((resolve) => {
      if (loadingOptions.isShow) {
        platform.showLoading({
          title: loadingOptions.text,
          mask: true,
        });
      }
      platform.request({
        ...options,
        header,
        url: `${this.baseUrl}${url}`,
        method: upperMethod,
        success: (res) => {
          const { data: resData, statusCode } = res;
          const isError = (/^(4|5)[0-9][0-9]$/).test(statusCode);
          if (isError) {
            const { msg, message } = resData;
            if (toastOptions.isShow) {
              setTimeout(() => {
                platform.showToast({
                  title: msg || message || toastOptions.text,
                  mask: true,
                  icon: 'none',
                });
              }, 0);
            }
            this.isFilterRes ? resolve([resData, null]) : resolve([res, null]);
            return undefined;
          }
          this.isFilterRes ? resolve([null, resData]) : resolve([null, res]);
        },
        fail: (err = {}) => {
          try {
            const { msg, message } = err;
            if (toastOptions.isShow) {
              setTimeout(() => {
                platform.showToast({
                  title: msg || message || toastOptions.text,
                  mask: true,
                  icon: 'none',
                });
              }, 0);
            }
            resolve([err, null]);
          } catch (e) {
            resolve([err, null]);
          }
        },
        complete: () => {
          loadingOptions.isShow && platform.hideLoading();
        },
      });
    });
  }
}

module.exports = Request;

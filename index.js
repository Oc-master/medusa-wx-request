const platform = wx;

const DEFAULT_LOADING_OPTIONS = {
  isShow: false,
  text: 'loading...',
};

const DEFAULT_TOAST_OPTIONS = {
  isShow: false,
  text: '服务器开小差了哦',
};

const POST_DEFAULT_HEADERS = {
  'content-type': 'application/x-www-form-urlencoded',
};

class Request {
  constructor({ baseUrl = '', isFilterRes = true } = {}) {
    this.baseUrl = baseUrl;
    this.isFilterRes = isFilterRes;
  }

  request(options) {
    const {
      url, header = {}, method = 'GET', loadingOps = {}, toastOps = {},
    } = options;
    if (!url) {
      /** 必填字段验证 */
      console.error('url 为请求函数必填字段');
      return undefined;
    }
    const upperMethod = method.toUpperCase();
    if (upperMethod === 'POST') {
      Object.assign(header, POST_DEFAULT_HEADERS);
    }
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
          const { data: resData } = res;
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

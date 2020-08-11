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
  constructor({ baseUrl = '', isFilterRes = true }) {
    this.baseUrl = baseUrl;
    this.isFilterRes = isFilterRes;
  }

  request(options) {
    const {
      url, header, method, loadingOps = {}, toastOps = {},
    } = options;
    if (!url) {
      /** 必填字段验证 */
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
        wx.showLoading({
          title: loadingOptions.text,
          mask: true,
        });
      }
      wx.request({
        ...options,
        header,
        url: `${this.baseUrl}${url}`,
        method: upperMethod,
        success: (res) => {
          const { data: resData } = res;
          this.isFilterRes ? resolve(resData) : resolve(res);
        },
        fail: (err) => {
          if (toastOptions.isShow) {
            setTimeout(() => {
              wx.showToast({
                title: toastOptions.text,
                mask: true,
                icon: 'none',
              });
            }, 0);
          }
          resolve(err);
        },
        complete: () => {
          loadingOptions.isShow && wx.hideLoading();
        },
      });
    });
  }
}

module.exports = Request;

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import 'lib-flexible/flexible'

// 导入vant组件
import {
  Tabbar, TabbarItem,
  Search,
  NavBar,
  GoodsAction, GoodsActionIcon, GoodsActionButton,
  Button,
  Stepper,
  SubmitBar,
  Checkbox, CheckboxGroup, Toast,
  Loading,
  Form,
  Field,
  Popup,
  AddressEdit,
  Area,
  Icon,
  RadioGroup, Radio,
  Empty,
  Uploader,
  Swipe, SwipeItem,
  Lazyload,
  NumberKeyboard
} from 'vant';
// 注册vant组件
Vue
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(NavBar)
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(Button)
  .use(Stepper)
  .use(SubmitBar)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Loading)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(AddressEdit)
  .use(Area)
  .use(Icon)
  .use(Toast)
  .use(Radio)
  .use(RadioGroup)
  .use(Empty)
  .use(Uploader)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(NumberKeyboard)


import VueCookies from 'vue-cookies'
Vue.use(VueCookies)


Vue.config.productionTip = false
Vue.use(VueAxios, axios);

Vue.filter('formatDate', (value) => {
  var dd = new Date(value);

  function foo(num) {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  }

  var y = dd.getFullYear(),
    m = foo(dd.getMonth() + 1),
    date = foo(dd.getDate()),
    h = foo(dd.getHours()),
    min = foo(dd.getMinutes()),
    s = foo(dd.getSeconds());
  return y+"-"+m+"-"+date+" "+h+":"+min+":"+s
})

axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

axios.interceptors.request.use(config => {

  let appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='
  if (config.method == 'get') {
    config.params = config.params || {};
    config.params.appkey = appkey
  } else if (config.method === 'post') {
    config.data = config.data || {};
    //如果是post请求, 参数格式应为 key1=value1&key2=value2...
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`
    }

    paramsString += `appkey=${appkey}`;

    config.data = paramsString;
  }
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  })

  return config;
}), error => {
  Toast.clear();
  return Promise.reject(error)
};

axios.interceptors.response.use(response => {
  Toast.clear();
  return response;
}), error => {
  Toast.clear();
  return Promise.reject(error)
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

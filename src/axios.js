import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'


axios.defaults.baseURL = "http://localhost:8081"

// 自定义前置拦截
axios.interceptors.request.use(config => {
  return config
})

// 自定义后置拦截
axios.interceptors.response.use(response => {
    let res = response.data;

    console.log("=================")
    console.log(res)
    console.log("=================")

    if(res){
        res.message = response.data.msg
    }
    if (res.code === 200) {
        Element.Message.success(res.message)
        return response //放行
    } else {

      Element.Message.error('错了哦，这是一条错误消息', {duration: 3 * 1000})

      return Promise.reject(response.data.msg)
    }
  },

    // 捕获并处理后台异常信息

    error => {
        // 使得异常信息更加友好
        if (error.response.data) { //data不为空时
            error.message = error.response.data.msg
            console.log("-------------------------")
            console.log(error.message)
            console.log("-------------------------")
        }

        if (error.response.status === 401) { //Shiro认证错误
            store.commit("REMOVE_INFO") //清除用户信息:token及userInfo
            router.push("/login") //跳转到登录页面
        }
        Element.Message.error(error.message);
        return Promise.reject(error)//抛出异常, 阻止进入"$axios.post(.."
    }
)
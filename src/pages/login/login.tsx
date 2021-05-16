import React, { useState, useEffect, useCallback } from 'react'
import Taro, { checkIsSupportFacialRecognition, FunctionComponent, setStorageSync } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components'
import api from "../../services/api";
import { AtMessage, AtButton } from "taro-ui"
import './login.less'

const login: FunctionComponent = () => {
  const [ismobile, setIsmobile] = useState(false)

  useEffect(() => {
    login()
    return () => { }
  }, [])

  const getPhoneNumber = (item) => {
    getMobile(item.detail)
  }

  const getMobile = (item) => {
    const { encryptedData, iv } = item
    const openid = Taro.getStorageSync("openid")
    const sessionKey = Taro.getStorageSync("sessionKey")
    api.get(`https://bbhcwx.ltd/WeChat/Auth/BindMobile`, { encryptedData, iv, openid, sessionKey }).then(res => {
      if (res.statusCode == 200) {
        let data = res.data
        if (data.result) {
          Taro.setStorageSync("userId", data.userInfo.userId)
          Taro.setStorageSync("token", data.token)
          Taro.setStorageSync("mobile", data.userInfo.mobile)
          Taro.switchTab({ url: "/pages/index/index" })
        }
        // else {
        //   Taro.switchTab({ url: "/pages/index/index" })
        //   Taro.atMessage({
        //     'message': '非法用户',
        //     'type': "error",
        //   })
        // }
      } else {
        Taro.atMessage({
          'message': '非法用户',
          'type': "error",
        })
      }
    })
  }

  const checkToken = () => {
    let openId = Taro.getStorageSync('openid')
    let mobile = Taro.getStorageSync("mobile")
    api.get(`https://bbhcwx.ltd/WeChat/Auth/GetToken`, { openId, mobile }).then(res => {
      if (res.statusCode == 200) {
        let data = res.data
        if (data.result) {
          Taro.setStorageSync("token", data.token)
          Taro.switchTab({ url: "/pages/index/index?isuser=true" })
        } else {
          Taro.switchTab({ url: "/pages/index/index?isuser=false" })
          Taro.atMessage({
            'message': '非法用户',
            'type': "error",
          })
        }
      }
    })
  }

  const checkmobile = () => {
    if (Taro.getStorageSync("mobile")) {
      checkToken()
      setIsmobile(true)
    } else {
      setIsmobile(false)
    }
  }

  const login = () => {
    let openid = Taro.getStorageSync("openid")
    if (openid) {
      checkmobile()
    } else {
      Taro.login({
        success(res) {
          let code = res.code
          if (res.code) {
            //发起网络请求
            api.get('https://bbhcwx.ltd/WeChat/Auth/Code2Session?jsCode=' + code).then(res => {
              if (res.statusCode == 200) {
                Taro.setStorageSync("openid", res.data.openid)
                Taro.setStorageSync("sessionKey", res.data.session_key)
              } else {
                Taro.atMessage({
                  'message': '系统错误',
                  'type': "error",
                })
              }
            })
          } else {
            Taro.atMessage({
              'message': '登录失败！',
              'type': "error",
            })
          }
        }
      })
    }
  }

  return (<View className="body">
    <View className="desc">
      <Text>小程序仅限上海佰灏铂恒品牌策划有限公司内部员工使用，并承诺不会将用户相关信息挪作他用。小程序只允许已经在公司内部管理系统中注册成功的手机用户查询使用，其他人员将无法查看到数据。授权同意将视作您正式开通了移动端查看系统的权限。</Text>
    </View>
    <View className="phonenumberbt">
      {
        !ismobile ? <AtButton type="primary" openType="getPhoneNumber" onGetPhoneNumber={getPhoneNumber}>同意授权</AtButton> : null
      }
    </View>
    <AtMessage />
  </View>)
}

export default login
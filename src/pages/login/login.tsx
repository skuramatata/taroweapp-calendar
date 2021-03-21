import React, { useState, useEffect, useCallback } from 'react'
import Taro, { checkIsSupportFacialRecognition, FunctionComponent } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components'
import api from "../../services/api";
import { AtMessage, AtButton } from "taro-ui"

const login: FunctionComponent = () => {
  const [ismobile, setIsmobile] = useState(false)

  useEffect(() => {
    login()
    return () => {

    }
  }, [])

  const getPhoneNumber = (item) => {
    getMobile(item.detail)
  }

  const getMobile = (item) => {
    const { encryptedData, iv } = item
    const openid = Taro.getStorageSync("openid")
    const sessionKey = Taro.getStorageSync("sessionKey")
    api.get(`nicai/WeChat/Auth/BindMobile`, { encryptedData, iv, openid, sessionKey }).then(res => {
      if (res.statusCode == 200) {
        let data = res.data
        if (data.result) {
          Taro.setStorageSync("token", data.token)
          Taro.setStorageSync("mobile", data.userInfo.mobile)
          Taro.redirectTo({ url: "/pages/index/index" })
        }
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
    api.get(`nicai/WeChat/Auth/GetToken`, { openId, mobile }).then(res => {
      if (res.statusCode == 200) {
        let data = res.data
        if (data.result) {
          Taro.setStorageSync("token", data.token)
          Taro.redirectTo({ url: "/pages/index/index" })
        } else {
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
            api.get('nicai/WeChat/Auth/Code2Session?jsCode=' + code).then(res => {
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

  return (<View>
    {
      !ismobile ? <AtButton type="primary" openType="getPhoneNumber" onGetPhoneNumber={getPhoneNumber}>认证员工手机号</AtButton> : null
    }
    <AtMessage />
  </View>)
}

export default login
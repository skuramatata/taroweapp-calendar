import React, { useState, useEffect } from 'react'
import Taro, { getCurrentInstance, FunctionComponent } from '@tarojs/taro';
import { AtTabs, AtCard, AtTag, AtDrawer, AtIcon, AtList, AtListItem, AtInput, AtForm, AtTextarea, AtDivider } from "taro-ui"
import api from "../../services/api";
import { View, Text, ScrollView } from '@tarojs/components'
import Review from '../../components/review'
import './approve.less'

const activeList = [{ title: "全部", value: "all", color: "" }, { title: "请假", value: "leaves", color: "red" }, { title: "外出", value: "outs", color: "yellow" }, { title: "报销", value: "expenses", color: "green" }]
const approve: FunctionComponent = () => {
  const [isactive, setIsactive] = useState("all")
  const [approveList, setApproveList] = useState([])
  const [defalutList, setDefalutList] = useState([])
  const [info, setInfo] = useState({})
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    getList()
    return () => { }
  }, [])

  useEffect(() => {
    if (isactive == "all") {
      setApproveList(defalutList)
    } else {
      setApproveList(defalutList.filter(p => p.orderType == isactive))
    }
    return () => { }
  }, [isactive])

  const getList = () => {
    let userid = Taro.getStorageSync("userId")
    api.get(`https://bbhcwx.ltd/ERP/CDM/Approve/Rows/ByDateWithUser/${userid}/2020-01-01/2030-01-01`, {}).then(res => {
      console.log("res", res)
      if (res.statusCode == 200) {
        let list = res.data
        let outlist = []
        for (let i of list["outs"]) {
          outlist.push({ title: i.activityName, creator: i.directorName, remark: i.outDesc, orderType: "outs", startTime: i.outStartDateTime, endTime: i.outEndDateTime, ...i })
        }
        let leaveslist = []
        for (let i of list["leaves"]) {
          leaveslist.push({ title: i.leaveTypeName, creator: i.employeeName, remark: i.leaveDesc, orderType: "leaves", startTime: i.leaveStartDateTime, endTime: i.leaveEndDateTime, ...i })
        }
        let expenseslist = []
        for (let i of list['expenses']) {
          expenseslist.push({ title: i.expenseTypeName, creator: i.directorName, remark: i.remark, orderType: "expenses", startTime: i.monday, endTime: i.sunday, ...i })
        }

        setApproveList([].concat(outlist, leaveslist, expenseslist))
        setDefalutList([].concat(outlist, leaveslist, expenseslist))
      }
    })
  }

  const openDrawer = (item) => {
    setInfo(item)
    setIsShow(true)
  }

  return (<View className="body">
    <AtDivider />
    <View className="calendarTags">
      <View className="taglist">
        {
          activeList.map(p => <AtTag type='primary' active={isactive == p.value} onClick={() => setIsactive(p.value)}>
            <View style={{ display: "flex", alignItems: "center" }}>
              {p.title}
              {
                p.color ? <View style={{ backgroundColor: p.color, width: "10px", height: "10px", marginLeft: "10px" }}>
                </View> : null
              }
            </View>
          </AtTag>)
        }
      </View>
    </View>
    <AtDivider />
    <View>
      <ScrollView scrollY className="approvescroll">
        {
          approveList.map(p => <AtCard
            className="approvecard"
            extra={p.orderType == "attendanceDailys" ? `员工：${p.creator}` : `申请人：${p.creator}`}
            title={p.title}
            thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
            onClick={() => openDrawer(p)}
          >
            <View>内容:{p.remark}</View>
            <View>时间:{p.startTime && p.endTime ? `${p.startTime}~${p.endTime}` : ""}</View>
          </AtCard>)
        }
      </ScrollView>
    </View>
    <View className="drawerInfo">
      {
        isShow ? <AtDrawer
          show={isShow}
          onClose={() => setIsShow(false)}
          width={"90%"}
          right
          mask
        >
          <Review typeinfo={activeList.filter(p => p.value == info.orderType)[0]} info={info}></Review>
        </AtDrawer>
          : null
      }
    </View>
  </View>)
}

export default approve
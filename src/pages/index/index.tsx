import React, { useState, useEffect, useCallback } from 'react'
import Taro, { getCurrentInstance, FunctionComponent } from '@tarojs/taro';
import { AtTabs, AtCard, AtTag, AtDrawer, AtIcon, AtList, AtListItem, AtInput, AtForm, AtTextarea } from "taro-ui"
import { View, Text } from '@tarojs/components'
import Calendar from 'taro-calendar-customizable';
import api from "../../services/api";
import './index.less'
import Datetypeswiper from '../../components/datetypeswiper'
import TypeInfo from '../../components/info'
import dayjs from 'dayjs'
var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

const activeList = [{ title: "全部", value: "all", color: "" }, { title: "请假", value: "leaves", color: "red" }, { title: "外出", value: "outs", color: "yellow" }, { title: "考勤", value: "attendanceDailys", color: "skyblue" }, { title: "加班", value: "extra", color: "green" }]
const Index: FunctionComponent = (props) => {
  const [isShow, setIsShow] = useState(true)
  const [dateType, setDateType] = useState("month")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [week, setWeek] = useState("")
  const [day, setDay] = useState("")
  const [current, setCurrent] = useState(0)
  const [selectday, setSelectDay] = useState(dayjs())
  const [dateTypeList, setDateTypeList] = useState([{ title: "月", value: "month" }, { title: "周", value: "week" }, { title: "今日", value: "day" }])
  const [marks, setMarks] = useState([])
  const [calendarList, setCalendarList] = useState([])
  const [isactive, setisactive] = useState("all")
  const [list, setList] = useState([])
  const [isdshow, setIsdshow] = useState(false)
  const [info, setInfo] = useState({})


  useEffect(() => {
    setYear(dayjs().format("YYYY"))
    setMonth(`${dayjs().month() + 1}`)
    return () => {
    }
  }, [])

  useEffect(() => {
    if (dateType == "month")
      changeDate(selectday)
    if (dateType == "day")
      changeDate(dayjs())

    return () => {
    }
  }, [dateType])

  useEffect(() => {
    if (isactive != "all")
      setCalendarList(list.filter(p => p.orderType == isactive))
    else
      setCalendarList(list)
    return () => {
    }
  }, [isactive])

  const getdateInfo = (item) => {
    changeDate(item)
  }

  const changeDate = (item) => {
    if (item) {
      setSelectDay(item)
      if (Number(item.format("MM")) == 12 && item.week() == 1 && dateType == "week") {
        setYear(item.add(1, 'year').format("YYYY"))
        setMonth("1")
        setWeek("1")
        return
      }

      setYear(item.format("YYYY"))
      setMonth(item.format("MM"))
      setDay(item.format("DD"))
      setWeek(item.week())
      getinfoList(item)
    }
  }

  const changeTabs = (index) => {
    setCurrent(index)
    setDateType(dateTypeList[index].value)
  }

  const onDayClick = (item) => {
    const { value } = item
    const day = dayjs(value)
    setSelectDay(day)
    changeDate(day)
  }

  const onMonthChange = (item) => {
    const res = dayjs(item)
    setSelectDay(res)
    changeDate(res)
  }


  const getinfoList = (item) => {
    let newday = item
    let start = ""
    let end = ""
    if (dateType == "month") {
      start = newday.format("YYYY-MM-01")
      end = newday.format("YYYY-MM-" + `${newday.daysInMonth()}`)
    } else if (dateType == "week") {
      start = newday.day(0).format("YYYY-MM-DD")
      end = newday.day(6).format("YYYY-MM-DD")
    } else {
      newday = dayjs()
      start = newday.format("YYYY-MM-DD")
      end = newday.format("YYYY-MM-DD")
    }
    let userid = Taro.getStorageSync("userId")
    console.log("aaaa", userid)
    api.get(`https://bbhcwx.ltd/ERP/CDM/Calendar/Rows/ByDateWithUser/${userid}/${start}/${end}`, {}).then(res => {
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
        let attendanceDailyslist = []
        for (let i of list["attendanceDailys"]) {
          if (i.abnormalTypeName != "正常")
            attendanceDailyslist.push({
              title: "考勤", creator: i.employeeName, remark: i.abnormalTypeName, orderType: "attendanceDailys", startTime: i.goToTime == "0001-01-01 00:00:00" ? "" : i.goToTime, endTime: i.goOffTime == "0001-01-01 00:00:00" ? "" : i.goOffTime, ...i
            })
        }

        let reslist = [].concat(outlist, leaveslist, attendanceDailyslist)
        if (dateType == "week") {
          setList(reslist)
          setCalendarList(reslist)
        } else {
          let todayList = []
          for (let i of reslist) {
            if (dayjs(i.startTime).date() <= newday.date() && dayjs(i.endTime).date() >= newday.date()) {
              todayList.push(i)
            }
          }
          setisactive("all")
          setList(todayList)
          setCalendarList(todayList)
        }


        let marklist = []
        for (let i of list["marks"]) {
          if (list["attendanceMarks"].findIndex(p => p == i) > -1) {
            marklist.push({ value: dayjs(i).format("YYYY-MM-DD"), color: 'skyblue', markSize: '9px' })
          } else if (list["leaveMarks"].findIndex(p => p == i) > -1) {
            marklist.push({ value: dayjs(i).format("YYYY-MM-DD"), color: 'red', markSize: '9px' })
          } else if (list["extraMarks"].findIndex(p => p == i) > -1) {
            marklist.push({ value: dayjs(i).format("YYYY-MM-DD"), color: 'green', markSize: '9px' })
          } else if (list["outMarks"].findIndex(p => p == i) > -1) {
            marklist.push({ value: dayjs(i).format("YYYY-MM-DD"), color: 'yellow', markSize: '9px' })
          }
        }
        setMarks(marklist)

        //attendanceDailys 蓝色/灰色
        //leaves 红色
        //extra 绿色
        //outs  黄色

      }
    })
  }

  const openDrawer = (item) => {
    setInfo(item)
    setIsdshow(true)
  }

  const onclose = () => {
    setIsdshow(false)
  }

  return (
    <View className="indexbody">
      <Text className="titleIndex">
        <Text className="year">{year}年</Text>
        {`${month}月`}
        {isShow && dateType == "week" ? `${week}周` : null}
        {isShow && dateType == "day" ? `${day}日` : null}
      </Text>
      <AtTabs height="auto" current={current} tabList={dateTypeList} onClick={changeTabs}></AtTabs>
      {
        dateType == "month" ? <AtCard className="calendarcard" isFull={false}>
          <Calendar
            marks={marks}
            mode="normal"
            currentView={selectday.format("YYYY-MM-DD")}
            selectedDate={selectday.format("YYYY-MM-DD")}
            selectedDateColor="#292847"
            onDayClick={onDayClick}
            hideArrow={true}
            hideController={true}
            onCurrentViewChange={onMonthChange}
          />
        </AtCard> : null
      }
      {
        dateType == "week" ? <Datetypeswiper currentDate={selectday} swipertype={dateType} getdateInfo={getdateInfo}></Datetypeswiper> : null
      }
      {
        dateType == "day" && null
      }
      <View className="calendarTags">
        <View className="taglist">
          {
            activeList.map(p => <AtTag type='primary' active={isactive == p.value} onClick={() => setisactive(p.value)}>
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
      <View className={dateType == "week" || dateType == "day" ? "heighcalendarlist" : "calendarlist"}>
        {
          calendarList.map(p => <AtCard
            extra={p.orderType == "attendanceDailys" ? `员工：${p.creator}` : `申请人：${p.creator}`}
            title={p.title}
            thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
            onClick={() => openDrawer(p)}
          >
            <View>内容:{p.remark}</View>
            <View>时间:{p.startTime && p.endTime ? `${p.startTime}~${p.endTime}` : ""}</View>
          </AtCard>)
        }
      </View>
      <View className="drawerInfo">
        {
          isdshow ? <AtDrawer
            show={isdshow}
            onClose={onclose}
            width={"80%"}
            right
            mask
          >
            <TypeInfo typeinfo={activeList.filter(p => p.value == info.orderType)[0]} info={info}></TypeInfo>
          </AtDrawer>
            : null
        }
      </View>

    </View>
  )
}

export default Index


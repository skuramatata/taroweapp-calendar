import React, { useState, useEffect, useCallback } from 'react'
import Taro, { checkIsSupportFacialRecognition, FunctionComponent } from '@tarojs/taro';
import { AtTabs, AtCard } from "taro-ui"
import { View, Text } from '@tarojs/components'
import Calendar from 'taro-calendar-customizable';
import './index.less'
import dayjs from 'dayjs'
import Datetypeswiper from '../../components/datetypeswiper'
var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)


const Index: FunctionComponent = () => {
  const [isShow, setIsShow] = useState(true)
  const [dateType, setDateType] = useState("month")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [week, setWeek] = useState("")
  const [day, setDay] = useState("")
  const [current, setCurrent] = useState(0)
  const [selectday, setSelectDay] = useState(dayjs())
  const [dateTypeList, setDateTypeList] = useState([{ title: "月", value: "month" }, { title: "周", value: "week" }, { title: "日", value: "day" }])
  const [marks, setMarks] = useState([
    { value: '2020-12-11', color: 'red', markSize: '9px' },
    { value: '2020-12-12', color: 'pink', markSize: '9px' },
    { value: '2020-12-13', color: 'gray', markSize: '9px' },
    { value: '2020-12-14', color: 'yellow', markSize: '9px' },
    { value: '2020-12-15', color: 'darkblue', markSize: '9px' },
    { value: '2020-12-16', color: 'pink', markSize: '9px' },
    { value: '2020-12-17', color: 'green', markSize: '9px' }
  ])
  const [calendarList, setCalendarList] = useState([])

  useEffect(() => {
    setYear(dayjs().format("YYYY"))
    setMonth(`${dayjs().month() + 1}`)
    return () => {
    }
  }, [])

  useEffect(() => {
    if (dateType == "month")
      changeDate(selectday)
    return () => {
    }
  }, [dateType])

  const showDate = () => {
    setIsShow(!isShow)
  }

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
    checkcalendar(item)
  }

  const onMonthChange = (item) => {
    const res = dayjs(item)
    setSelectDay(res)
    changeDate(res)
  }

  const checkcalendar = (item) => {
    console.log("item", item)
    if (marks.find(p => p.value == item.value)) {
      setCalendarList([
        { title: "出差", creator: "张三", remark: "去上海见一个客户", orderType: 0, startTime: "2020-12-11", endTime: "2020-12-15" },
        { title: "病假", creator: "李四", remark: "发骚了", orderType: 1, startTime: "2020-12-11", endTime: "2020-12-11" },
        { title: "出差", creator: "王武", remark: "去北京见一个客户", orderType: 0, startTime: "2020-12-22", endTime: "2020-12-30" },
        { title: "产假", creator: "六六", remark: "媳妇五胎", orderType: 1, startTime: "2020-12-11", endTime: "2021-12-15" },
        { title: "出差", creator: "张三", remark: "去上海见一个客户", orderType: 0, startTime: "2020-12-11", endTime: "2020-12-15" },
        { title: "病假", creator: "李四", remark: "发骚了", orderType: 1, startTime: "2020-12-11", endTime: "2020-12-11" },
        { title: "出差", creator: "王武", remark: "去北京见一个客户", orderType: 0, startTime: "2020-12-22", endTime: "2020-12-30" },
        { title: "产假", creator: "六六", remark: "媳妇五胎", orderType: 1, startTime: "2020-12-11", endTime: "2021-12-15" },
      ])
    } else {
      setCalendarList([])
    }
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
        dateType == "day" ? <Datetypeswiper currentDate={selectday} swipertype={dateType} getdateInfo={getdateInfo}></Datetypeswiper> : null
      }

      <View className={dateType == "week" || dateType == "day" ? "heighcalendarlist" : "calendarlist"}>
        {
          calendarList.map(p => <AtCard
            extra={`申请人：${p.creator}`}
            title={p.title}
            thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
          >
            <View>内容:{p.remark}</View>
            <View>时间:{p.startTime}~{p.endTime}</View>
          </AtCard>)
        }
      </View>
    </View>
  )
}

export default Index

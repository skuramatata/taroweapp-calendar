import React, { useState, useEffect } from 'react'
import { Swiper, SwiperItem, View, Text } from '@tarojs/components'
import './datetypeswiper.less'
import dayjs from 'dayjs'

const defaultWeekText = [{ text: "日", value: "sun" }, { text: "一", value: "mon" }, { text: "二", value: "tue" }, { text: "三", value: "wed", }, { text: "四", value: "thu" }, { text: "五", value: "fri" }, { text: "六", value: "sat" }]

const datetypeswiper = (props) => {
  const { getdateInfo, swipertype, currentDate } = props
  const [selectday, setSelectDay] = useState(dayjs())
  const [dateindex, setdateindex] = useState(0)
  const [weeks, setweeks] = useState([])

  useEffect(() => {
    initweek()
    return () => {
    }
  }, [])

  useEffect(() => {
    getdateInfo(selectday)
    return () => {
    }
  }, [selectday])

  const change = (e) => {
    if (e.detail.current > dateindex)
      e.detail.current == 2 && dateindex == 0 ? operation(e, "del") : operation(e, "add")
    else
      e.detail.current == 0 && dateindex == 2 ? operation(e, "add") : operation(e, "del")
  }

  const getdaylist = (item) => {
    let res = []
    for (let i = 0; i < 7; i++) {
      let day = item.day(i)
      res.push({ title: day.format("DD"), value: day })
    }
    return res
  }

  const operation = (e, item) => {
    const sevenday = item == "add" ? selectday.add(7, "day") : selectday.subtract(7, "day")
    setSelectDay(sevenday)
    setdateindex(e.detail.current)
    setweeks(getdaylist(sevenday))
  }

  const initweek = () => {
    setSelectDay(currentDate)
    setweeks(getdaylist(currentDate))
  }

  const clickdate = (e, item) => {
    setSelectDay(item.value)
  }

  return (
    <Swiper onChange={change} circular current={dateindex} className="swipers">
      {
        [0, 1, 2].map(p => <SwiperItem>
          <View>
            <View className="weeklist">
              {
                defaultWeekText.map(x => <Text className="week">{x.text}</Text>)
              }
            </View>
            <View className="weeklist">
              {
                swipertype == "week" ? weeks.map(x => <Text>{x.title}</Text>) : weeks.map(x => <Text className={selectday.format("YYYY-MM-DD") == x.value.format("YYYY-MM-DD") ? "selectDate" : "week"} onClick={(e) => clickdate(e, x)}>{x.title}</Text>)
              }
            </View>
          </View>
        </SwiperItem>)
      }
    </Swiper>
  )
}

export default datetypeswiper
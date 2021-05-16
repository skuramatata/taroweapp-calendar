import React, { useState, useEffect, useCallback } from 'react'
import Taro, { checkIsSupportFacialRecognition, FunctionComponent } from '@tarojs/taro';
import { View, Text } from '@tarojs/components'
import { AtTabs, AtCard, AtTag, AtDrawer, AtIcon, AtList, AtListItem, AtInput, AtForm, AtTextarea } from "taro-ui"
import './info.less'

const index = (props) => {
  const { typeinfo, info } = props

  console.log("info", info)
  console.log("typeinfo", typeinfo)

  return (
    <View style={{ color: "black", height: "100%" }}>
      {/* <View className="header">
        {typeinfo.title}{typeinfo.title != "考勤" ? "申请" : null}
        <View style={{ backgroundColor: typeinfo.color, width: "10px", height: "10px", marginLeft: "10px" }}>
        </View>
      </View> */}
      {
        typeinfo.title == "请假" ?
          <View className="content">
            <AtForm>
              <AtInput border={false}
                name='value1'
                title='请假人'
                type='text'
                disabled
                value={info.creator}
              />
              <AtInput border={false}
                name='value2'
                title='请假原因'
                type='number'
                disabled
                value={info.leaveTypeName}
              />
              <AtInput border={false}
                name='value2'
                title='开始时间'
                type='number'
                disabled
                value={info.startTime}
              />
              <AtInput border={false}
                name='value2'
                title='结束时间'
                type='number'
                disabled
                value={info.endTime}
              />

              <AtInput border={false}
                name='value2'
                title='请假说明'
                type='number'
                disabled
                value=""
              />
              {/* <AtTextarea
                disabled
                count={false}
                value={info.remark}
                maxLength={200}
              /> */}
              <View style={{ paddingLeft: "16px", color: "#c0c0c0" }}>
                {info.remark}
              </View>
            </AtForm>
          </View> : null
      }
      {
        typeinfo.title == "外出" ?
          <View className="content">
            <AtForm>
              <AtInput border={false}
                name='value1'
                title='外出人'
                type='text'
                disabled
                value={info.creator}
              />
              <AtInput border={false}
                name='value2'
                title='外出类型'
                type='number'
                disabled
                value={info.outModeName}
              />
              <AtInput border={false}
                name='value2'
                title='外出原因'
                type='number'
                disabled
                value={info.outTypeName}
              />
              <AtInput border={false}
                name='value2'
                title='开始时间'
                type='number'
                disabled
                value={info.startTime}
              />
              <AtInput border={false}
                name='value2'
                title='结束时间'
                type='number'
                disabled
                value={info.endTime}
              />

              <AtInput border={false}
                name='value2'
                title='外出说明'
                type='number'
                disabled
                value=""
              />
              <View style={{ paddingLeft: "16px", color: "#c0c0c0" }}>
                {info.outDesc}
              </View>
              {/* <AtTextarea
                disabled
                count={false}
                value={info.outDesc}
                maxLength={200}
              /> */}
            </AtForm>
            {
              info.activityId > 0 ?
                <View>
                  <View className="headertitle">活动信息</View>
                  <AtForm>
                    <AtInput border={false}
                      name='value1'
                      title='活动编号'
                      type='text'
                      disabled
                      value={info.activityId}
                    />
                    <AtInput border={false}
                      name='value1'
                      title='活动名称'
                      type='text'
                      disabled
                      value={info.activityName}
                    />
                    <AtInput border={false}
                      name='value1'
                      title='活动地点'
                      type='text'
                      disabled
                      value={info.activityPlaceName}
                    />
                    <AtInput border={false}
                      name='value1'
                      title='搭建时间'
                      type='text'
                      disabled
                      value={info.applyDate}
                    />
                    <AtInput border={false}
                      name='value1'
                      title='活动开始时间'
                      type='text'
                      disabled
                      value={info.effectiveDate}
                    />
                    <AtInput border={false}
                      name='value1'
                      title='活动结束时间'
                      type='text'
                      disabled
                      value={info.expiryDate}
                    />
                    <AtInput border={false}
                      name='value1'
                      title='外出方式'
                      type='text'
                      disabled
                      value={info.outModeName}
                    />
                  </AtForm>
                </View>
                : null
            }
          </View>
          : null
      }
      {
        typeinfo.title == "报销" ?
          <View className="content">
            <AtForm>
              <AtInput border={false}
                name='value1'
                title='报销编号'
                type='text'
                disabled
                value={info.expenseNo}
              />
              <AtInput border={false}
                name='value2'
                title='场次说明'
                type='number'
                disabled
                value={info.activityQuantityDesc}
              />
              <AtInput border={false}
                name='value2'
                title='活动编号'
                type='number'
                disabled
                value={info.activityNo}
              />
              <AtInput border={false}
                name='value2'
                title='活动名称'
                type='number'
                disabled
                value={info.activityName}
              />
              <AtInput border={false}
                name='value2'
                title='活动负责人'
                type='number'
                disabled
                value={info.activityLeaderName}
              />

              <AtInput border={false}
                name='value2'
                title='活动所在场地'
                type='number'
                disabled
                value={info.activityPlaceName}
              />
              <AtInput border={false}
                name='value2'
                title='填表人'
                type='number'
                disabled
                value={info.applierName}
              />
              <AtInput border={false}
                name='value2'
                title='填表时间'
                type='number'
                disabled
                value={info.applyDate}
              />
              <AtInput border={false}
                name='value2'
                title='报销方式'
                type='number'
                disabled
                value={info.expenseTypeName}
              />
              <AtInput border={false}
                name='value2'
                title='备注'
                type='number'
                disabled
                value={info.remark}
              />
            </AtForm>
            <View>
              <View>摘要说明</View>
              <View>周一</View>
              <View>周二</View>
              <View>周三</View>
              <View>周四</View>
              <View>周五</View>
              <View>周六</View>
              <View>周日</View>
              <View>小计</View>
            </View>
          </View>
          : null
      }
    </View>
  )
}

export default index
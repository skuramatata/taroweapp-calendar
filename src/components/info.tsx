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
      <View className="header">
        {typeinfo.title}{typeinfo.title != "考勤" ? "申请" : null}
        <View style={{ backgroundColor: typeinfo.color, width: "10px", height: "10px", marginLeft: "10px" }}>
        </View>
      </View>
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
        typeinfo.title == "考勤" ?
          <View>
            <AtForm>
              <AtInput border={false}
                name='value1'
                title='考勤日期'
                type='text'
                disabled
                value={info.attendanceDate}
              />
              <AtInput border={false}
                name='value2'
                title='工号'
                type='number'
                disabled
                value={info.jobNo}
              />
              <AtInput border={false}
                name='value2'
                title='工号姓名'
                type='number'
                disabled
                value={info.creator}
              />
              <AtInput border={false}
                name='value2'
                title='上班时间'
                type='number'
                disabled
                value={info.goToTime}
              />
              <AtInput border={false}
                name='value2'
                title='下班时间'
                type='number'
                disabled
                value={info.goOffTime}
              />
              <AtInput border={false}
                name='value2'
                title='工作时长'
                type='number'
                disabled
                value={info.workHours}
              />
              <AtInput border={false}
                name='value2'
                title='异常'
                type='number'
                disabled
                value={info.abnormalTypeName}
              />
              <AtInput border={false}
                name='value2'
                title='是否合格'
                type='number'
                disabled
                value={info.isQualified ? "是" : "否"}
              />
              <AtInput border={false}
                name='value2'
                title='状态'
                type='number'
                disabled
                value={info.statusName}
              />
            </AtForm>
          </View>
          : null
      }
      <View>
        <View className="header">审批结果</View>
        <View>
          <AtForm>
            {
              info.directorId > 0 ?
                <>
                  <AtInput border={false}
                    name='value1'
                    title='主管审批'
                    type='text'
                    disabled
                    value={info.directorName}
                  />
                  <AtInput border={false}
                    name='value2'
                    title='审批日期'
                    type='number'
                    disabled
                    value={info.directorDate}
                  />
                </>
                : null
            }
            {
              info.picId > 0 ?
                <>
                  <AtInput border={false}
                    name='value1'
                    title='合规审批'
                    type='text'
                    disabled
                    value={info.picName}
                  />
                  <AtInput border={false}
                    name='value2'
                    title='审批日期'
                    type='number'
                    disabled
                    value={info.picDate}
                  />
                </>
                : null
            }
            {
              info.boosId > 0 ?
                <>
                  <AtInput border={false}
                    name='value1'
                    title='老板审批'
                    type='text'
                    disabled
                    value={info.bossName}
                  />
                  <AtInput border={false}
                    name='value2'
                    title='审批日期'
                    type='number'
                    disabled
                    value={info.bossDate}
                  />
                </>
                : null
            }
          </AtForm>
        </View>
      </View>
    </View>
  )
}

export default index


//审批director->pic->boss

//-1的话没有审批过


//外出  activetyid==-1不显示活动

//expiryDate 活动结束时间

//effectiveDate 活动开始时间
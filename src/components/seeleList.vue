// template define
<template>
  <div class="seeleList-wrap">
    <SeeleData
      :netWork = netWork
      :bestBlock="monitorList.bestBlock"
      :lastBlock="monitorList.lastBlock"
      :avgBlockTime="monitorList.avgBlockTime"
      :avgNetHashRate="monitorList.avgNetHashRate"
      :totalTransactions="monitorList.totalTransactions"
    ></SeeleData>
    <div class="barChart-wrap">
      <barChart v-if="monitorList.statCharData"
        :echartsDataHeight = "monitorList.statCharData.height"
        :echartsDataTxCount = "monitorList.statCharData.txcount"
        :echartsDataBlockTime = "monitorList.statCharData.blocktime"
        :echartsDataDifficulty = "monitorList.statCharData.difficulty"
      ></barChart>
    </div>
    <!-- :activeNodes="monitorList.activeNodes" -->
    <div class="seele-list-wrap">
      <div class="active-nodes-wrap">
        <el-container>
          <el-aside class="img-wrap">
            <img src="../assets/imgs/data/computer.png" :alt="$t('message.nodeStat.activeNodes')">
          </el-aside>
          <el-main class="data-wrap">
            <span class="data-title">{{$t("message.nodeStat.activeNodes")}}</span>
            <span class="data-content" :class="monitorList.activeNodes|infoClass([monitorList.activeNodes, monitorList.totalNodes])">{{monitorList.activeNodes}}/{{monitorList.totalNodes}}</span>
          </el-main>
        </el-container>
        <!-- <span class="data-title">{{$t("message.nodeStat.activeNodes")}}</span>
        <span class="data-content" :class="monitorList.activeNodes|infoClass(monitorList.totalNodes)">{{monitorList.activeNodes}} / {{monitorList.totalNodes}}</span> -->
      </div>
      <div class="seeleList">
        <smList :nodeItems = "monitorList.nodeItems"></smList>
      </div>
    </div>
  </div>
</template>

// script define
<script>
import SeeleData from './seeleData'
import barChart from './statChart'
import {
  formatNumber,
  getTime,
  formatActiveNodeInfoClass,
  formatNodeLatencyCLass,
  formatNodeLatency,
  formatNodeGeo } from '../untils/index'
import VueClient from '../js/monitor-socket'
import _ from 'lodash'
import smList from './sm-list'
export default {
  props: {
    netWork: Number
  },
  data () {
    return {
      number: 0,
      monitorList: {},
      mainMonitorList: {
        bestBlock: 0,
        lastBlock: _.now(),
        avgBlockTime: 0,
        activeNodes: 0,
        totalNodes: 0,
        avgNetHashRate: 0,
        totalTransactions: 0,
        nodeItems: [],
        statCharData: {}
      },
      testMonitorList: {
        bestBlock: 0,
        lastBlock: _.now(),
        avgBlockTime: 0,
        activeNodes: 0,
        totalNodes: 0,
        avgNetHashRate: 0,
        totalTransactions: 0,
        nodeItems: [],
        statCharData: {}
      }
    }
  },
  components: {
    SeeleData,
    barChart,
    smList
  },
  mounted () {
    setInterval(time => {
      this.number++
    }, 1000)
    var vueClient = new VueClient(this.mainMonitorList, this.testMonitorList)
    setInterval(time => {
      this.mainMonitorList = vueClient.vueDataMain
      this.testMonitorList = vueClient.vueDataTest
      this.changeNetwork()
    }, 1000)
  },
  methods: {
    // listen netWork
    upNetWork () {
      this.changeNetwork()
    },
    changeNetwork () {
      if (this.netWork === 1) {
        this.monitorList = this.mainMonitorList
      } else {
        this.monitorList = this.testMonitorList
      }
    }
  },
  watch: {
    netWork: 'upNetWork'
  },
  filters: {
    filterFn (value) {
      return formatNumber(value)
    },
    infoClass (value, value1) {
      return formatActiveNodeInfoClass(value1[0], value1[1])
    },
    filterNodeLatency (latency, state) {
      return formatNodeLatency(latency, state)
    },
    latencyClass (latency, state) {
      return formatNodeLatencyCLass(latency, state)
    },
    nodeLastBlockTimeValue (value, value1) {
      return getTime(value1[1])
    },
    filterNodeGeo (geoInfo) {
      return formatNodeGeo(geoInfo)
    }
  }
}
</script>

// css define
<style lang="less">
@import "../assets/css/base.less";
.barChart-wrap{
  height: 250px;
  // background: url("../assets/imgs/bg_03.png");
  background: #1a3a86;
}
.seele-list-wrap {
  height: 100%;
  background: #08274f;
  .active-nodes-wrap {
    line-height: 18px;
    background: url("../assets/imgs/bg_04.png") no-repeat;
    background-size: 100% auto;
    border-bottom: 1px solid #909090;
    padding: 10px 1%;
    .img-wrap {
      width: 24px !important;
      img {
        width: 100%;
      }
    }
    .data-wrap {
      padding: 0;
      line-height: 24px;
      padding-right: 1%;
      color: #1cfbf8;
      .data-title {
        margin: 0 20px 0 10px;
      }
      .data-content{
        font-size: 14px;
      }
    }
  }
  .data-title {
    color: #1cfbf8;
    margin-right: 20px;
  }
  .data-content{
    color: #27ce33;
    font-size: 18px;
  }
  .seeleList {
    min-height: 400px;
    background: #08274f;
    background: url("../assets/imgs/bg_04.png") no-repeat;
    background-size: 100% auto;
  }
  .seeleList-ul {
    height: 100%;
    min-height: 860px;
    background: url("../assets/imgs/bg_04.png") no-repeat;
    span {
      display: inline-block;
      text-align: center;
    }
    .geo {
      width: 8%;
    }
    .name {
      width: 12%;
      &:hover{
        cursor: pointer;
      }
    }
    .type {
      width: 18%;
    }
    .latency {
      width: 4%;
    }
    .mining {
      width: 4%;
    }
    .peers {
      width: 4%;
    }
    .block {
      width: 12%;
    }
    .time {
      width: 12%;
    }
    .difficulty {
      width: 12%;
    }
    .txcount {
      width: 8%;
    }
    .li-icon-wrap {
      padding: 10px 0 10px 0;
      border-bottom: 1px solid #909090;
    }
    .li-list-wrap {
      padding: 10px 0;
      border-bottom: 1px solid #5a7ca8;
      color: #27ce33;
    }
    .li-list-wrap-offline {
      color: #5a7ca8;
    }
  }
}
// 浮层
.popover-wrap{
  .content-wrap{
    font-size: 12px;
    opacity: 1;
    .popover-content{
      padding: 5px 0;
      font-weight: bold;
    }
  }
}
.el-popover{
  width: auto !important;
}
.el-popover, .popper__arrow{
  opacity: 0.95;
}
@media screen and (max-width: 768px) {
  .barChart-wrap{
    height: auto;
  }
  .seeleList-wrap {
    height: 100%;
  }
  .data-content{
    font-size: 16px !important;
  }
  .seele-list-wrap {
    height: 560px;
    background: #08274f;
    .active-nodes-wrap {
      border-bottom: 1px solid #909090;
      padding: 10px 2%;
      font-size: 12px;
      .img-wrap {
        img {
          width: 100%;
        }
      }
      .data-wrap {
        line-height: 24px;
        padding: 0;
        padding-right: 2%;
      }
    }
    .seeleList {
      width: 100%;
      height: 500px;
      overflow: auto;
      background: #08274f;
      .seeleList-ul {
        min-height: auto;
        width: 1360px;
        span {
          display: inline-block;
          text-align: center;
        }
        .name {
          width: 12%;
        }
        .type {
          width: 18%;
        }
        .latency {
          width: 10%;
        }
        .mining {
          width: 10%;
        }
        .peers {
          width: 10%;
        }
        .block {
          width: 10%;
        }
        .time {
          width: 10%;
        }
        .difficulty {
          width: 10%;
        }
        .txcount {
          width: 10%;
        }
        .li-icon-wrap {
          padding: 10px 0 10px 0;
          border-bottom: 1px solid #909090;
        }
        .li-list-wrap {
          padding: 10px 0;
          border-bottom: 1px solid #5a7ca8;
          color: #27ce33;
        }
        .li-list-wrap-offline {
          color: #5a7ca8;
        }
      }
    }
  }
}
</style>
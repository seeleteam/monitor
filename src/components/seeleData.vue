// template define
<template>
  <div class="seeleData-wrap">
    <el-row class="el-row-wrap">
      <el-col :xs="12" :md="6" :lg="6">
        <div class="grid-content bg-purple">
          <el-container>
            <el-aside class="img-wrap">
              <img src="../assets/imgs/data/BESTBLOCK.png" :alt="$t('message.blockStat.bestBlock')">
            </el-aside>
            <el-main class="data-wrap">
              <div class="data-title">{{$t("message.blockStat.bestBlock")}}</div>
              <div class="data-content">#{{bestBlockValue}}</div>
            </el-main>
          </el-container>
        </div>
      </el-col>
      <el-col :xs="12" :md="6" :lg="6">
        <div class="grid-content bg-purple-light">
          <el-container>
            <el-aside class="img-wrap">
              <img src="../assets/imgs/data/LASTBLOCK.png" :alt="$t('message.blockStat.lastBlock')">
              <!-- <img src="../assets/imgs/data/LASTBLOCK1.gif" :alt="$t('message.blockStat.lastBlock')"> -->
            </el-aside>
            <el-main class="data-wrap data-wrap-color">
              <div class="data-title">{{$t("message.blockStat.lastBlock")}}</div>
              <div class="data-content">{{lastBlockNumber | lastBlockValue([lastBlockNumber, netWork,lastBlock])}}s ago</div>
            </el-main>
          </el-container>
        </div>
      </el-col>
      <el-col :xs="12" :md="6" :lg="6">
        <div class="grid-content bg-purple">
          <el-container>
            <el-aside class="img-wrap">
              <img src="../assets/imgs/data/AVGBLOCKTIME.png" :alt="$t('message.blockStat.avgBLockTime')">
            </el-aside>
            <el-main class="data-wrap">
              <div class="data-title">{{$t("message.blockStat.avgBLockTime")}}</div>
              <div class="data-content">{{avgBlockTime | filterAvgBlockTime}}</div>
            </el-main>
          </el-container>
        </div>
      </el-col>
      <el-col :xs="12" :md="6" :lg="6">
        <div class="grid-content bg-purple-light">
           <el-container>
            <el-aside class="img-wrap">
              <img src="../assets/imgs/data/hashte.png" :alt="$t('message.blockStat.avgNetHashRate')">
            </el-aside>
            <el-main class="data-wrap">
              <div class="data-title">{{$t("message.blockStat.avgNetHashRate")}}</div>
              <div class="data-content">{{avgNetHashRate|filterAvgNetHashRate}}</div>
            </el-main>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

// script define
<script>
import {
  formatNumber,
  getTime,
  formatAvgBlockTime,
  formatCount,
  formatAvgNetHashRate
} from '../untils/index'
export default {
  props: {
    netWork: Number,
    bestBlock: Number,
    lastBlock: Number,
    avgBlockTime: Number,
    totalNodes: Number,
    avgNetHashRate: Number,
    totalTransactions: Number
  },
  data () {
    return {
      lastBlockNumber: 0
    }
  },
  mounted () {
    setInterval(time => {
      this.lastBlockNumber++
    }, 1000)
  },
  computed: {
    bestBlockValue () {
      return formatNumber(this.bestBlock)
    }
  },
  filters: {
    filterAvgBlockTime (value) {
      return formatAvgBlockTime(value)
    },
    filterTransactions (value) {
      return formatCount(value)
    },
    lastBlockValue (value, value1) {
      return getTime(value1[2])
    },
    filterAvgNetHashRate (value) {
      return formatAvgNetHashRate(value)
    }
  }
}
</script>

// css define
<style lang="less">
.seeleData-wrap {
  // position: relative;
  height: 150px;
  background: url("../assets/imgs/bg_02.png");
  .el-row-wrap {
    // width: 100%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 1%;
    .img-wrap {
      width: 80px !important;
    }
    .el-main {
      padding: 0px 0 0 20px;
    }
    .data-wrap {
      padding-top: 1%;
      color: #1cfbf8;
      .data-title {
        font-size: 14px;
      }
      .data-content {
        font-weight: 200;
        font-size: 40px;
        margin-top: 10px;
      }
    }
    .data-wrap-color {
      color: #fac217;
    }
    .data-wrap-change {
      color: #fac217;
    }
  }
}
@media screen and (max-width: 768px) {
  .seeleData-wrap {
    height: 151px;
    background: #23479c;
    .el-row-wrap {
      padding: 0;
      .el-col {
        padding: 10px 0;
        padding-left: 2%;
        border-top: 1px solid #2c54b2;
      }
      .el-col:nth-child(2n) {
        border-left: 1px solid #2c54b2;
      }
      .el-col:nth-child(3) {
        // border-bottom: 1px solid #2c54b2;
      }
      .el-col:nth-child(4) {
        // border-bottom: 1px solid #2c54b2;
      }
      .img-wrap {
        width: 50px !important;
        img {
          width: 100%;
        }
      }
      .el-main {
        padding: 0px 0 0 10px;
      }
      .data-wrap {
        padding-top: 0;
        // text-align: right;
        .data-title {
          font-size: 12px;
        }
        .data-content {
          font-size: 20px;
          margin-top: 10px;
        }
      }
      .data-wrap-color {
        color: #fac217;
      }
      .data-wrap-change {
        color: #fac217;
      }
    }
  }
}
</style>

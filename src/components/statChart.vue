// template define
<template>
  <el-row class='row-bg stat-chart-wrap' justify='space-between'>
    <el-col :xs='24' :lg='6' :md='6'>
      <div class='grid-content bg-purple'>
        <div class="chart-title-wrap chart-count-title" :class="{'chart-title-bottom':!isCount}">
          <img class="chart-img sm-show" src="../assets/imgs/data/TRANSACTIONS.png" alt="TRANSACTIONS">
          {{$t('message.statChart.txCount.title')}}
          <span class="chart-icon-wrap sm-show" @click="showCount(1)">
            <img src="../assets/imgs/chart/count-down.png" alt="drop-down">
          </span>
        </div>
        <div id='chartTxCount' class="chartTxCount" :style="{ 'min-width': '300px', width: '100%', height: '200px'}" v-show="isCount"></div>
      </div>
      <div class="border-bottom-style"></div>
    </el-col>
    <el-col :xs='24' :lg='6' :md='6'>
      <div class='grid-content bg-purple'>
        <div class="chart-title-wrap chart-time-title" :class="{'chart-title-bottom':!isTime}">
          <img class="chart-img sm-show" src="../assets/imgs/data/AVGBLOCKTIME.png" alt="AVGBLOCKTIME">
          {{$t('message.statChart.blockTime.title')}}
          <span class="chart-icon-wrap sm-show" @click="showCount(2)">
            <img src="../assets/imgs/chart/count-down.png" alt="drop-down">
          </span>
        </div>
        <div id='chartBlockTime' class="chartBlockTime" :style="{'min-width': '300px', width: '100%',  height: '200px'}" v-show="isTime"></div>
      </div>
      <div class="border-bottom-style"></div>
    </el-col>
    <el-col :xs='24' :lg='6' :md='6'>
      <div class='grid-content bg-purple'>
        <div class="chart-title-wrap chart-diff-title" :class="{'chart-title-bottom':!isDiff}">
          <img class="chart-img sm-show" src="../assets/imgs/list/problem.png" alt="problem">
          {{$t('message.statChart.blockDifficulty.title')}}
          <span class="chart-icon-wrap sm-show" @click="showCount(3)">
            <img src="../assets/imgs/chart/count-down.png" alt="drop-down">
          </span>
        </div>
        <div id='chartDifficulty' class="chartDifficulty" :style="{'min-width': '300px', width: '100%', height: '200px'}" v-show="isDiff"></div>
      </div>
      <div class="border-bottom-style"></div>
    </el-col>
    <el-col :xs='0'  :lg='6' :md='6'>
      <div class='grid-content bg-purple'>
      </div>
    </el-col>
  </el-row>
</template>

// script define
<script>
import echarts from 'echarts'
export default {
  props: {
    echartsDataHeight: Array,
    echartsDataTxCount: Array,
    echartsDataBlockTime: Array,
    echartsDataDifficulty: Array
  },
  data () {
    return {
      isCount: true,
      isTime: true,
      isDiff: true
    }
  },
  mounted () {
    setInterval(time => {
      this.drawChartTxCount()
      this.drawChartBlockTime()
      this.drawChartDifficulty()
    }, 1000)
    this.isShow()
  },
  methods: {
    isShow () {
      let width = window.screen.width
      if (width > 768) {
        this.isCount = true
        this.isTime = true
        this.isDiff = true
      } else {
        this.isCount = false
        this.isTime = false
        this.isDiff = false
      }
    },
    drawChartTxCount () {
      let myChart = document.getElementById('chartTxCount')
      let chartTxCount = echarts.init(myChart)
      chartTxCount.setOption({
        color: ['#1cfbf8'],
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '5%',
          left: '6%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            splitLine: {
              show: false
            },
            data: this.echartsDataHeight,
            axisLabel: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1
              }
            },
            min: function (value) {
              if (value.min <= 20) {
                return 0
              }
              return value.min - 20
            },
            max: function (value) {
              return value.max + 20
            }
          }
        ],
        series: [
          {
            name: this.$t('message.statChart.txCount.name'),
            type: 'bar',
            barWidth: '96%',
            data: this.echartsDataTxCount
          }
        ]
      })
    },
    drawChartBlockTime () {
      let myChart = document.getElementById('chartBlockTime')
      let chartBlockTime = echarts.init(myChart)
      chartBlockTime.setOption({
        color: ['#edcc74'],
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '5%',
          left: '6%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            splitLine: {
              show: false
            },
            data: this.echartsDataHeight,
            axisLabel: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1
              }
            },
            min: function (value) {
              if (value.min <= 10) {
                return 0
              }
              return value.min - 10
            },
            max: function (value) {
              return value.max + 10
            }
          }
        ],
        series: [
          {
            name: this.$t('message.statChart.blockTime.name'),
            type: 'bar',
            barWidth: '96%',
            data: this.echartsDataBlockTime
          }
        ]
      })
    },
    drawChartDifficulty () {
      let myChart = document.getElementById('chartDifficulty')
      let chartDifficulty = echarts.init(myChart)
      chartDifficulty.setOption({
        color: ['#28ff74'],
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '5%',
          left: '6%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            splitLine: {
              show: false
            },
            data: this.echartsDataHeight,
            axisLabel: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1
              }
            },
            min: function (value) {
              if (value.min <= 100000) {
                return 0
              }
              return value.min - 100000
            },
            max: function (value) {
              return value.max + 100000
            }
          }
        ],
        series: [
          {
            name: this.$t('message.statChart.blockDifficulty.name'),
            type: 'bar',
            barWidth: '96%',
            data: this.echartsDataDifficulty
          }
        ]
      })
    },
    showCount (index) {
      switch (index) {
        case 1:
          this.isCount = !this.isCount
          this.isTime = false
          this.isDiff = false
          break
        case 2:
          this.isTime = !this.isTime
          this.isCount = false
          this.isDiff = false
          break
        case 3:
          this.isDiff = !this.isDiff
          this.isCount = false
          this.isTime = false
          break
      }
    }
  }
}
</script>

// css define
<style lang='less'>
.stat-chart-wrap{
  border-top: 1px solid #3e6ddd;
  // height: 250px;
  // background: url("../assets/imgs/bg_03.png");
  background: #1a3a86;
  padding: 20px 0 10px 0;
}
.chartTxCount{
  width: 100%;
  height: 250px;
}
.chart-title-wrap {
  position: relative;
  font-size: 14px;
  padding-left: 30px;
}
.chart-count-title{
  color: #1cfbf8;
}
.chart-time-title {
  color: #edcc74;
}
.chart-diff-title{
  color: #28ff74;
}

@media screen and (max-width: 768px) {
  .stat-chart-wrap{
    padding: 0;
    width: 100%;
    border-top: none;
  }
  .chartTxCount{
    width: 310px !important;
  }
  .chartBlockTime{
    width: 310px !important;
  }
  .chartDifficulty{
    width: 310px !important;
  }
  .chartTxCount, .chartBlockTime, .chartDifficulty{
    padding: 20px 0;
  }
  .chart-title-wrap {
    padding: 10px 0;
    padding-left: 30px;
  }
  .border-bottom-style{
    border-bottom: 1px solid #3e6ddd;
  }
  .chart-img{
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    width: 16px;
  }
  .chart-icon-wrap{
    position: absolute;
    right: 0;
    display: inline-block;
    width: 20%;
    height: 20px;
    img{
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
  }
  .chart-count-title, .chart-time-title, .chart-diff-title{
    color: #1cfbf8;
  }
}
</style>

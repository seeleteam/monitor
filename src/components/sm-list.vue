// template define
<!-- NodeName
  NodeType
  NodeLatency
  IsMining
  Peers
  LastBlock
  LastBlockTime
-->
<template>
  <el-table
    :data="nodeItems"
    style="width: 100%"
    class="table-list-wrap"
    max-height="500"
    :empty-text="$t('message.noData')">
    <el-table-column
      prop="nodeGeo"
      :render-header="renderGeo"
      sortable
      min-width="100">
      <template slot-scope="scope">
        <el-popover
          placement="top-start"
          trigger="hover"
        >
          <div class="popover-wrap" v-if="scope.row.nodeGeo">
            <div class="content-wrap"><span class="popover-content">{{$t("message.nodeGeoTip.nodeGeoInfo")}}</span></div>
            <div class="content-wrap">&nbsp;&nbsp;{{$t("message.nodeGeoTip.continentName")}}: <span class="popover-content">{{scope.row.nodeGeo.continentName}}</span></div>
            <div class="content-wrap">&nbsp;&nbsp;{{$t("message.nodeGeoTip.continentCode")}}: <span class="popover-content">{{scope.row.nodeGeo.continentCode}}</span></div>
            <div class="content-wrap">&nbsp;&nbsp;{{$t("message.nodeGeoTip.countryName")}}: <span class="popover-content">{{scope.row.nodeGeo.countryName}}</span></div>
            <div class="content-wrap">&nbsp;&nbsp;{{$t("message.nodeGeoTip.countryCode")}}: <span class="popover-content">{{scope.row.nodeGeo.countryCode}}</span></div>
            <div class="content-wrap">&nbsp;&nbsp;{{$t("message.nodeGeoTip.regionName")}}: <span class="popover-content">{{scope.row.nodeGeo.regionName}}</span></div>
            <div class="content-wrap">&nbsp;&nbsp;{{$t("message.nodeGeoTip.regionCode")}}: <span class="popover-content">{{scope.row.nodeGeo.regionCode}}</span></div>
          </div>
          <span slot="reference" class="geo" :class="{'th-offline':scope.row.state==0}">{{scope.row.nodeGeo|filterNodeGeo}}</span>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeName"
      :render-header="renderName"
      sortable
      min-width="200">
      <template slot-scope="scope">
        <el-popover
          placement="top-start"
          trigger="hover"
          >
          <div class="popover-wrap">
            <div class="content-wrap"><span class="popover-content">{{scope.row.nodeInfo.netVersion}}/{{scope.row.nodeInfo.client}}/{{scope.row.nodeInfo.os}}/{{scope.row.nodeInfo.os_v}}</span></div>
            <div class="content-wrap">{{$t("message.nodeInfoTip.version")}}: <span class="popover-content">{{scope.row.nodeInfo.client}}</span></div>
            <div class="content-wrap">{{$t("message.nodeInfoTip.netVersion")}}: <span class="popover-content">{{scope.row.nodeInfo.netVersion}}</span></div>
            <div class="content-wrap">{{$t("message.nodeInfoTip.protocol")}}: <span class="popover-content">{{scope.row.nodeInfo.protocol}}</span></div>
            <div class="content-wrap">{{$t("message.nodeInfoTip.port")}}: <span class="popover-content">{{scope.row.nodeInfo.port}}</span></div>
            <div class="content-wrap">{{$t("message.nodeInfoTip.api")}}: <span class="popover-content">{{scope.row.nodeInfo.api}}</span></div>
            <div class="content-wrap">{{$t("message.nodeInfoTip.oS")}}: <span class="popover-content">{{scope.row.nodeInfo.os}}/{{scope.row.nodeInfo.os_v}}</span></div>
          </div>
          <span slot="reference" class="name" :class="{'th-offline':scope.row.state==0}">{{scope.row.nodeName}}</span>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeType"
      :render-header="renderType"
      sortable
      min-width="300">
      <template slot-scope="scope">
        <span class="type" :class="{'th-offline':scope.row.state==0}">{{scope.row.nodeType}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeLatency"
      :render-header="renderLatency"
      sortable
      min-width="200">
      <template slot-scope="scope">
        <span class="latency" :class="scope.row.nodeLatency|latencyClass(scope.row.state)">{{scope.row.nodeLatency | filterNodeLatency(scope.row.state)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeIsMining"
      :render-header="renderMining"
      sortable
      min-width="80">
      <template slot-scope="scope">
        <span class="mining" :class="{'th-offline':scope.row.state==0}">
          <!-- <img v-if="scope.row.nodeIsMining=='yes'" src="../assets/imgs/yes.png" alt="yes">
          <img v-else src="../assets/imgs/no.png" alt="no"> -->
          <span v-if="scope.row.nodeIsMining==true">yes</span>
          <span v-else class="mining-no">no</span>
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodePeers"
      :render-header="renderPeers"
      sortable
      min-width="80">
      <template slot-scope="scope">
        <span class="peers" :class="{'th-offline':scope.row.state==0}">{{scope.row.nodePeers}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeLastBlock"
      :render-header="renderLastBlock"
      sortable
      min-width="100">
      <template slot-scope="scope">
        <span class="block" :class="{'th-offline':scope.row.state==0}">#{{scope.row.nodeLastBlock | filterFn}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeLastBlockTime"
      :render-header="renderLastBlockTime"
      sortable
      min-width="100">
      <template slot-scope="scope">
        <span class="time" :class="{'th-offline':scope.row.state==0}">{{number | nodeLastBlockTimeValue([number, scope.row.nodeLastBlockTime])}} ago</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeDifficulty"
      :render-header="renderDiff"
      sortable
      min-width="100">
      <template slot-scope="scope">
        <span class="diffculty" :class="{'th-offline':scope.row.state==0}">{{scope.row.nodeDifficulty|filterDifficulty}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="nodeTxcount"
      :render-header="renderTxCount"
      sortable
      min-width="100">
      <template slot-scope="scope">
        <span class="txcount" :class="{'th-offline':scope.row.state==0}">{{scope.row.nodeTxcount|filterFn}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

// script define
<script>
import {
  formatNumber,
  getTime,
  formatNodeLatency,
  formatNodeLatencyCLass,
  formatNodeGeo,
  formatDifficulty } from '../untils/index'
export default {
  props: {
    nodeItems: Array
  },
  data () {
    return {
      number: 0
    }
  },
  mounted () {
    setInterval(time => {
      this.number++
    }, 1000)
  },
  methods: {
    renderGeo () {
      let typeTitle = this.$t('message.nodeStat.nodeGeo')
      let typeImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA4QjQ0N0E0NkQxMTFFODhCMTA5NTQ3NkE4MjQzQTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA4QjQ0N0I0NkQxMTFFODhCMTA5NTQ3NkE4MjQzQTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDhCNDQ3ODQ2RDExMUU4OEIxMDk1NDc2QTgyNDNBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMDhCNDQ3OTQ2RDExMUU4OEIxMDk1NDc2QTgyNDNBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnOL4UgAAAKcSURBVHjarJVraI1xHMfPmTkuY53ZIuZWK2FjdZxEiheE2vJmkZZbW9oL58XcIim05JLLC5yXKyLNmJZLIZdE1JTa4sVQ7uS2Qhxm+Pzqq/54znnOWedfn36d5/yf//f5Pb/f7/sET7R9DfisXKiGRTAFiuA9dEALNC6M9v+W6oAcH4FJOuwwVEA/eCjhORCHzuY7iRm9FYnCLRgPZ2AqFMIEZVMOR2E0XEVobqYig6EV8mA9LIA2ZTBGGbXDUliu680IjchEZB3YDY2wR9fWwDt4DF3QAEHqcYS4A/JhSyYiy+AnbNbvJbAX+sJF6NZ/a/W/iXyExWQTSkdkOIyF2/BK11Yqzod5qs8vqLOLZPOZcEXZlKYjMlTxiXOtULFd8RFY74edPU8Vh6Uj0qXoHnBN0bqpEqwOA+G6s2eQ4gevQft3PYfXME1dZIO2FWZrViq075lTE1uzIKG58s3ECn4SCtS6AXVVRLXZDzGYrE4LUGwTKDEHoD7/WUgwia3YgD3QIWXqpmQrCDeVeRki99NtYSvibhgH23ysZzVMh0NeAn62sl3vd4OK7bVmwk752abeeFdCzvsFjqsm7jJPOw0/bFTI4lMqG3dXlZ6oj1qxStNuh13Qa7GnHgmXYIhNuc0Uxb/szNMNRGNemYTUORE5bEQG2SovK9LB5sLnJbSRw5qIA/StKRerEI16idTAKGhSx4Q1M7b2wQHZTYe+Mwdhl2zlJYTB7qt1GuIvkZBTuIYUXdSiV3kK6pPsOwZvrZ5kU+yKVCsLezX3ktzco32Vij1em/QpjqvesT8iuY6l+82EHXAOvvvsi2tvHdnk5ah7zBLOwt1AFhbZvJGZmjWtMFux1zMRXsijsrUKZE+d7pwUi2yv7t8CDABlmat4WEgGPAAAAABJRU5ErkJggg=='
      return this.setTableTitle(typeTitle, typeImg)
    },
    renderName () {
      let typeTitle = this.$t('message.nodeStat.nodeName')
      let typeImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUM2MTc2NzgzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUM2MTc2NzkzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QzYxNzY3NjNFQzMxMUU4QkU0QkU1QUQ1MzRBNTQ1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QzYxNzY3NzNFQzMxMUU4QkU0QkU1QUQ1MzRBNTQ1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrQWpKUAAAKLSURBVHjapJZbiE5RFMe/77gmlyRFyH0whhk1E/KCcosxosGLDJGUcinPnjyRB+VWU5gpuRQPKPPASPOgxozpy6RhlCFDLnlwmyHGb9X/aLfb5/SNb9Wvfdr7nP9aa++19z7Zq80/Mik2FbbAcpgNEyEL7+Ap3IPL1eVDO5MEsikORsBHGAw/oQO6HMdFMAh+mWOcvA+JDEyJ/gvsB/uwAb5548NhNUxRIHllcBCKYXcmTyPyf8/XHvXss4zoOxf3Rc67O+AELMz8v22Gsziq8R3MhNNavLUFONgmDXMy3XVwDCzXnfA6NJVQAbtEhfr86erS9A6B4/EaFKlCGrRovpXBebWutdm0Itrmf0D0prUCZkWqc7NTCeJNUAK1UCVq1deEWFngu5PKcKtlYJtlCYyEXm9aWiVUCXc8Ecv2JrTDAjLpczKwvfMZmi2DOXqp1xMoVwYXAuIZ9dlYqd5118I25hMreXMwDt4EBErV3k6pmlvOVPpm1TQ2rqI/KSJRHmN9SWORjoLxgRceq12X4qBSbWtgbAJ8iDT/81W7rtlHLbBdleNblcZanGDiRR5GM8/WwRw0SnyNJ2Bp25b/CtehzspO1KnPxmrcCpKt1EHaaGU6g4dn8ACWBiKdq7pf5PU/tF2NeHtgo92lWWYbzbx0KppNsFHPrpnAYk1jifqsBHOhRUF8gy6oGzh/Ht8Hh2CVIs3JqW+5JFFHfJo07O447JbZK9gDo+FKAafpRRgDe4n+hX+jXYJRMKkAB/XmBPH6fO5kswPa5XZeffLGLJj1WpcjiPb09062Wj6q1sxS7lb52t/FZBigS/8MvOyvg+/6VanW2V6s6/Q3vNUZdd/WjOi7k0T+CjAAH+a1Tz6VUBAAAAAASUVORK5CYII='
      return this.setTableTitle(typeTitle, typeImg)
    },
    renderType () {
      let typeTitle = this.$t('message.nodeStat.nodeType')
      let typeImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUM2MTc2NzQzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUM2MTc2NzUzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QzYxNzY3MjNFQzMxMUU4QkU0QkU1QUQ1MzRBNTQ1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QzYxNzY3MzNFQzMxMUU4QkU0QkU1QUQ1MzRBNTQ1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pvt6XOcAAAMSSURBVHjajJV7aM1hGMff389ZjlmxmFDiP5dsyJR/KNfaxMFsbrnkMhGakEIuJRGZy5TrzFxaW2xMRMplyWVzL0nhLyIztzk7zsx8n3x/erx+Z2dvfc7znvfyvM/zvs/z/JzS6oZEY8weMBP8BCfBKhAGCWASyARDQApwQC24Dy6CM9npwR9lNRHRswvMAAHqyZPOPjAPnDd/2mLQDG6BHaA7iIJ74CnnZCyLRuVD+TrIwWCR0rNQfhx40AB5BYQ4cQ5MYP8V2AzOgnrzb2tH79aDvhwrhzeTpYNDRc8Yly7/UhsDlLu5sdhHuTQx7DRIA1s51sZeJB4cgZxPy8X9ieARSAdNJk6DxWJtL3Rvg67U4/AWjoq1y+mB3GciH3AguAxyQJ02iLLZG4DyURClIImHhBggh+WRXf7J5eNEGS0bwEhQA1LlLkEV5xvBNTACrOD7RcBwev9d5uFZLgjLFRlaLpZWgGk0bjw4xTcJgg+cd6gohesk2qZA2Tt6dIhX3gVjH10uGgraqhCTVgkyGC0PQR+GoXjbm2NytVmecrYLQPQOM+wYbjCMc936US4Dn9S49PO4P8Pa81jr9A4IUn6zFvegfOYTQE8oe1rjX1Se/D3Ai/Mka/FbygE+BwyifGONd6T8qg94SZlqLS5nQknSdVbj0s9nxFRYe/pTvtYH3GH4jbMWv2dtkmx9DgpBEftizAI8cK21J5N5UqUPCNPabNDN2nCcOSFRM4vV8gHzoEQvRIgmQ8yWJPUOdtX8TpbnvT73fYPJ9oKWjQU3fdbJtbUH270BfUA12C9JA9bEKD3JVrhq65dCzBGPYf11u3J6bSUfaRvoBNbyI6QPqLMUuywtwl2wRM+71gFRVkHJ6NVMmhwqLmS+zGUJ78DCJl+2jeCqJJ3UH7tc+3nssCRsYUg2sdaXcG6qGvsMNoECKP+vvAdi3LWE2UFwgpFVxDo/XWV+iJ/aMiiuj/W9cON8T8K8joj1tUpgAh5rSXlLHtjeFPPKLnHPaHCgFXtbdYBh5WzkV08OLGAQxG2/BRgAYTTbb8HRYNEAAAAASUVORK5CYII='
      return this.setTableTitle(typeTitle, typeImg)
    },
    renderLatency () {
      let miningTitle = this.$t('message.nodeStat.nodeLatency')
      let miningImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUFBNzVCMTEzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUFBNzVCMTIzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QUE3NUIwRjNFQzMxMUU4QkU0QkU1QUQ1MzRBNTQ1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QUE3NUIxMDNFQzMxMUU4QkU0QkU1QUQ1MzRBNTQ1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpaSeCwAAAIiSURBVHjarJbPS1RRFMdnxjEsSWiRaCAVtVEQWrSVDIJWiiEtchFSgg6Ytsn8kWguUmonargSNZjQGhj/AOcPyE0MjIKoy8RVuUhN0z4Hvk8G8b15b5oDH+6bO/fdc+75dV944dteKID8hMuwAxlIQfzx3ZINtxfCeSgog0O4oLkTSEAPijbPvhAJBZdduAh3YBh+QDOkF1f2nxZCgckxfIe3cFujnWgWJb2FUHAquGUP7CQPdbpRlLTmq8AsP3JRtMzwSP9PouRWPgpeQrfHaUzJO7gE720u6rK2EUph8YzFcz6MGIM2O42dwu0ES3AD1sD8WRwkJgzTVgLQ4uWiUfgCM2CF1JGV+7kkqbE+IjeFXRZayk1BFXyELXjhI3Zp+AM1tnBdlrpJJ3zS8zUYh/4cbjpWAZZH5eu/HuutFTyD61CnuZt+YxJVf6nIsc56T4My5AoMeS0me4oYKq0pRuUvs6waVj3e+wUxn4bXKiEyEbVck6ZQ4cTZK2UK4voRC5CGXu6xTtuu2MUjKqakUrGnANa/VkwTdhE5+fwKDhS8e/9h/QOGN/Bbe54WjNVCl7LK2kR9npt/BcugGNZvnXdlDsKIGtyIOuJBjr3N530wIIP72HzM605+DhNQomqcVozSWQVZpFRsUkAr5JYONp/3c+nbZfFBGzh9ynrLtp4rszrsidp6r+OWIF8VpugJ3FchXtV89mfL5/O+Jhz5J8AAIOiXweFcDKUAAAAASUVORK5CYII='
      return this.setTableTitle(miningTitle, miningImg)
    },
    renderMining () {
      let miningTitle = this.$t('message.nodeStat.isMining')
      let miningImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUFBNzVCMEQzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUFBNzVCMEUzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QUE3NUIwQjNFQzMxMUU4QkU0QkU1QUQ1MzRBNTQ1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QUE3NUIwQzNFQzMxMUU4QkU0QkU1QUQ1MzRBNTQ1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pkkgoa4AAAJuSURBVHjapJZJSFVRGMffu82CtkhXFS4aaaCIh26KTDEQTIiGRRIELZpIFwURBQ0QDRaUi0CKINqUSQsrItEnRNGgREHlqlVI08pIexVqvy/+Dw6P23nn5YEf71zPvd//fMP5jsn2vh+JwDEJLsBeOAUnYXxLarr3o8jz90qogCRMg1vQDFPgOFyBony7iv6x0xvwDJ5DGrpgE/RCI/yGnbZ2uz8z1ScwOefZdtsG2+AtdMJhrZnxehiBL1ozL9fBwxABM35ZO3sD1fAVMlDlGLfRrRDtgNehIWqB3fDKMZ5QMusc4zaOwH7YRZI/hYRoKxyAPqiFoZz3fjpeXoQmOAQ3Q5M833F9yPN+CvbAIFwKqe2sQDsMK6EHPe+bh+dhtpIbLDALZmju88CqZp/mvwoRaNH8uqojbixXOZbo2UJUFiJgH66B92oD2WGVtEHzJTpwxao0C+UyHbSyfFW0UfOjTima8XtaP62zUarKaXO+t7UuRKoo19jQJml21gYWwjwYhRq4C991yOY67w+qjAf03KRQvYD1cSIWokWKuxlvgAfwFFbAYlgNS9UqrHoeKaw2WhWuCnkyM05gDtyX8Q64ZruBjwrZE3inVtGrUKWzIuz6jE8kEgtkvFMHaTQmnCMxIql8ImZ8TEfemtZ2u0Q8RZEr0oOxSp+IJTmjw2W7+RB4uxWpyuw0f1OC7e5IYPiYLqS/iY9UGZsLMJ7rSYl2vFaenODnrDy5ah6sYvIy8X/D9cQu93oE0vKkn5+VyQIu/VCRRlWehag4mqh1dpwN12M1zDvwGcrtv5AJCzgidWqaw8rROWslfwQYADUDwAx5fPHaAAAAAElFTkSuQmCC'
      return this.setTableTitle(miningTitle, miningImg)
    },
    renderPeers () {
      let peersTitle = this.$t('message.nodeStat.peers')
      let peersImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUFBNzVCMDkzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUFBNzVCMEEzRUMzMTFFOEJFNEJFNUFENTM0QTU0NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNzY5NDUxRTNFQzExMUU4QkU0QkU1QUQ1MzRBNTQ1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QUE3NUIwODNFQzMxMUU4QkU0QkU1QUQ1MzRBNTQ1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpzcLukAAAKXSURBVHjapJVtaI1hGMefsxemDLFC8hItsmXSvCWl5iUl+YAVzTKTlzAvpfli+UCWUsr7lJIvs1YiRZO85W0op+hIpGzCcD5Q1sH4XfV/6u7pPOc5nV316zrnfu5z/e/7eq7rOrFLnb+8EJsKjbAQRsNXuA1H4aG/aVVlkZfJ8kLWt0IcahT8B5TASngAByDmZWHpBFbDCQU4KIEhMAwaJLYf9tjmtqe99+AF1KQTiAVSNBjewwidtj3Nb2bCXciHUqVtgp6dgS2k7V/YDdYo+IWQ4Gad0AyFsBEmw074DZugPlOKquRbIlJ7zt/PaVNwzE6utSbSlR8mME4+HiHQBT9hvLN2Hj7CGJgWVUUDsyiQAvjrlGsfLqGvY8MEEs6LzGR2QmuAN4H1UfLJMIFr8rsi6rxB/qq/QN7nqTlT8DJM4DK8Vvc2hQSvEz3KuwWfjmvV83bS9d3No2t/YJ1q2wTmwml4q5e33tINlu8N1t0Ev46fpRt/hr3BFxW0J7AbTsFiEbRmpWczzHbWGzl9V6Y+sOqxmj4eWE/qdr7tg4twBY7AI79UudFJGJBOYKhSs0NjwDp5KQyC4RKvgMPqgbVwwwQ4taWyTFPWGq4VkZgrYL4N5mgsV2kWWX57tadPDWinn6LDlNseghUh8orPC+AmrPCHoS+wHRZpUs6HWxF90A1LNPRmwCE1W0o3S2pklJhAscavp+GV8LIzC1YNVpLbCDZJIl807m0y1+ap7CzHj51aztY+6SUX6k/KN38SLzOB5fpy1svNWvR+qp21uOZUhQlUarEjl+ik5BvumTUiaZroDD5LVbEJjNSfxQcvd3snX+qs1dqtCtTN3V7/rCcwTe0WHW6ZPu+nwB2wPrgffPBfgAEAneqyx43nIIgAAAAASUVORK5CYII='
      return this.setTableTitle(peersTitle, peersImg)
    },
    renderLastBlock () {
      let blockTitle = this.$t('message.nodeStat.lastBlock')
      let blockImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTc2OTQ1MUMzRUMxMTFFOEJFNEJFNUFENTM0QTU0NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTc2OTQ1MUQzRUMxMTFFOEJFNEJFNUFENTM0QTU0NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNzY5NDUxQTNFQzExMUU4QkU0QkU1QUQ1MzRBNTQ1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxNzY5NDUxQjNFQzExMUU4QkU0QkU1QUQ1MzRBNTQ1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pu33w24AAAJ5SURBVHja3JVLSFRhGIaPpyEKAiNatCgitAuWqSmpO4OKXFSEBS2iG1ZiCSoSGIrRlcwui8zuBAlFl01UBi2CwIV0W4xakVAIQmC3lYk15fPBe2A6nHHOZG364WGGM3Pe9/+/25928+k3J8SaDnVQAQ/hAPTaDxsKJo35optEeCrsh/ewAy7AYuiGdshMtrNEBulxwtXQAhmwFxbBdiiC17eeDV+FhEZpvhBNgT0Kh539BJyCrwHvRmATNMEsuARHCFl/kMFkqNIOTfiMdv0xRH4m6kT7YAZcgYMYDXgGlXw2Kt5ttouQwk58kgmTGZXHaZ2HejOIKRfN0ADfnRSWv4owKuPjOvyCfFfiN6AGolDq/MFCeAF08PU2PICFmHfbCcxpGQwoqauhQ4ZvQmh7pbxb/69B+FFQmb6FNbAKZus0J1WyQWuCGs/e26xyzvXELSew1PW9YAnqgxyV6lYJ7PJtpgReqtosvJkIt8KPuP8shy6/wUZ1ab2qYK5tBlrhBayHO/AYPthGEK2CzwnK97ddjUAeHJKBhShbsc1T6ZrZElgLK6En1VFhJoetApSwFj2P6siOQnc3bHVFEjx/p2oKWrFUytd1/vH6Pwysk2th5t8SpcHmqfpirpJpt9QrjYfIOITT4bh6yTZcagb3IUtdeQyeQ3GKwi7sVNeX617JtrHh5WBIzZULX6ATLsK0EOIl6vKzmqQ2Nk57Y8Of5F5N1i3qVmu2bXYxBWjPkaCNjUHrdkQr4VOyKrKkX4P5ErgMT3TZe/f2UeXMTrwO0RUQDXPpB61COCeDiG68Yc0sC8XIePugCwo0g37CPU3ZZs2uMdeoAAMA/2TBYjJWFhsAAAAASUVORK5CYII='
      return this.setTableTitle(blockTitle, blockImg)
    },
    renderLastBlockTime () {
      let blockTimeTitle = this.$t('message.nodeStat.lastBlockTime')
      let blockTimeImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAYCAYAAAAYl8YPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTc2OTQ1MTgzRUMxMTFFOEJFNEJFNUFENTM0QTU0NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTc2OTQ1MTkzRUMxMTFFOEJFNEJFNUFENTM0QTU0NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNzY5NDUxNjNFQzExMUU4QkU0QkU1QUQ1MzRBNTQ1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxNzY5NDUxNzNFQzExMUU4QkU0QkU1QUQ1MzRBNTQ1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmTZ1gkAAAF5SURBVHjatNXNK0RRGMfxezFjGHnZ2ZCykLUJSUpKFlaiKMaf4KWUspOFLIiFjc2EImSl7BQL79ayUGJh6SWDIY3vU2d0m+49914zc+ozc+fe5tec5zxzjrl18fFoGEalkfl4KOBlBdUIYgDXOPfw5VbUYgNfuDX5ZamH5XjCIkY9hMUwjIq+SOhZbuQZWRw5C0uq90KfGd92YS+QAtZ4DKnCG/WKO03zDG0odQmSxWrBqa5mayjGiEvYGEJY1YWt4wZTiDgENWNS9eOmLkyaL6qu99Ge9lw+7+EHQ9biO7WGdH8vwjjAuLo/oT7L9Hpw5bfPkpZr8z9N24gdxNW05tX9OXQggV00uIUFLSvUhcO05zLNbuSrlQ/owgZRhxm7mqhxglnUo18XJiv0jiWX8iyo6UZ1YU04wqtLmGw5x6rnbMPKUIQ7j//Ne5RsX36G7cJSS5/wuWsEcr6fZTzkQJm2HCgyOtX+7uVAkbFM3f4OlKwddb8CDABa9lAFbM8F4QAAAABJRU5ErkJggg=='
      return this.setTableTitle(blockTimeTitle, blockTimeImg)
    },
    renderDiff () {
      let diffTitle = this.$t('message.nodeStat.difficulty')
      let diffImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA4QjQ0NzI0NkQxMTFFODhCMTA5NTQ3NkE4MjQzQTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA4QjQ0NzM0NkQxMTFFODhCMTA5NTQ3NkE4MjQzQTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1Njk1NkIwOTQ2QzMxMUU4OEIxMDk1NDc2QTgyNDNBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1Njk1NkIwQTQ2QzMxMUU4OEIxMDk1NDc2QTgyNDNBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqyMreUAAAGxSURBVHjaxJZNK0RRGMcdZjGS5tpZIlJm4TWxkDILxcLK50DIR5CFjXwKUrJAwihiQVkgQrGwkcUd5G3B+D/1v7fb5cyce+8YT/0659w553m955mrFg7fSgJIM5gBvVxvganhjviZ7kBpAOUt4AD0gzgZlGeLR+/JQhgQz8vBCmgAjWANVPK3SAZkX4rzEXANLsEYn6V0B2O+tQXsPMZuPfN7jnGkKRs1RaEkluO3KoPzj5p9CSfSXAYyBgayeEV/7EO6ipcix0Ar2AAPUZTB83aw6dUjKWoDe3zHIynHsOvXIxFM8+EyqAOKBJVZ6lkCNaiNEiSCPm4YBzchvS/D0MPlKBTfeSP4+qO6uosdzufYXyxiLPD4E0Pa0YOI6oEliIEJ8MLOeMFWYYfwfBJI7x8CV44eMXACusAqN4QSRHFMPevAvWnK94fjbXbKUPFvRXf1/Guzswx6lIK3CU2zy2tAV2jlU2Qbv7PFSFFGU1xx5IP7az03vprjK4pdESUCue3bnM+DJpDk5XQ+XwIX2S/Sq/bBAHHkSb6NClGDU9DNz5ZnKpYO3In0nOsOfQswAAAgcOhmrTuCAAAAAElFTkSuQmCC'
      return this.setTableTitle(diffTitle, diffImg)
    },
    renderTxCount () {
      let countTitle = this.$t('message.nodeStat.txCount')
      let countImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAYAAADafVyIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDdBNzJCMEM0OUUzMTFFODlGQUFEMjE0QzA0ODBCM0YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDdBNzJCMEQ0OUUzMTFFODlGQUFEMjE0QzA0ODBCM0YiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0N0E3MkIwQTQ5RTMxMUU4OUZBQUQyMTRDMDQ4MEIzRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0N0E3MkIwQjQ5RTMxMUU4OUZBQUQyMTRDMDQ4MEIzRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqaHRVsAAAFXSURBVHjaYlx1+rsrAwPDTCBWZCAPfALi6aEmHBXYJBmBFjwA0j+BeCUQ/yPDAgMg9gdiC6AlJ9ElWYBYHoiLgbiPTB8oQC3QAGIMC5ig9D8GygEjNkEmBhoDmlvAgkdOBIi9gFgIh/xZID6MLLD6zA9WIJUIxJxAfAOId+GyQACIzwOxDB4HHARiBzQxNWiSh4EpuCxwhhoOSh2XcKh5hS4ATKZXgb6QgPqgCYgTcFnAC6UPAfEHUsIcaMlLaHCdA1KxQz8V0SWZ/gBifWiW/4Yt8oCAC4jFcJhhDKU/4rJgARBngGIcKqaBRd1uILbC41BQgbkXlwXZQLwRiNWB+CsQ3wViSzR1lUBshMPwt0C8FZh6PuGyAFTQ7YBiXOAQFGNLlsM8FRGygJnSghRXUXEXSs8C4sv4TAEWCbgcFgHEt3FZACqGu4E4HYiDyPTBbSBOAwgwAJfyRvqnYEXDAAAAAElFTkSuQmCC'
      return this.setTableTitle(countTitle, countImg)
    },
    setTableTitle (title, img) {
      return (
        <el-tooltip class="item" effect="dark" content={title} placement="top">
          <img
            src={img}/>
        </el-tooltip>
      )
    }
  },
  filters: {
    filterFn (value) {
      return formatNumber(value)
    },
    filterNodeLatency (latency, state) {
      return formatNodeLatency(latency, state)
    },
    nodeLastBlockTimeValue (value, value1) {
      return getTime(value1[1])
    },
    latencyClass (latency, state) {
      return formatNodeLatencyCLass(latency, state)
    },
    filterNodeGeo (geoInfo) {
      return formatNodeGeo(geoInfo)
    },
    filterDifficulty (difficulty) {
      return formatDifficulty(difficulty)
    }
  }
}
</script>

// css define
<style lang="less">
.time {
  color: #fac217;
}
.el-table th,
.el-table tr {
  background: none;
}
.el-table thead {
  color: #aacbf7;
}
.el-table__body-wrapper {
  color: #27ce33;
}
.th-offline {
  color: #5a7ca8;
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #5a7ca8;
}
.el-table__empty-block {
  background: #08274f;
  .el-table__empty-text {
    color: #5a7ca8;
  }
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #0b3365;
}
.table-list-wrap{
  background: url("../assets/imgs/bg_04.png") no-repeat;
}
.el-table__header-wrapper{
  position: relative;
  .el-table__header{
    .has-gutter{
      .cell{
        img{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .caret-wrapper{
          margin-left: 30px;
        }
      }
    }
  }

}
.el-table .sort-caret.ascending{
  border-bottom-color: #7798c2;
}
.el-table .sort-caret.descending{
  border-top-color: #7798c2;
}
.el-table .ascending .sort-caret.ascending{
  border-bottom-color: #1863de;
}
.el-table .descending .sort-caret.descending{
  border-top-color: #1863de;
}
@media screen and (max-width: 768px) {
  .el-table th,
  .el-table tr {
    background: #08274f;
  }
}
</style>

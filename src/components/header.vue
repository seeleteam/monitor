// html template define
<template>
  <div class="header-wrap">
      <div class="header">
        <img class="logo" src="../assets/imgs/logo.png" alt="logo">
        <div class="select-wrap fr">
            <span>
              <label class="lg-show" for="">{{$t("message.monitorNetwork")}}</label>
              <!-- <el-select v-model="value" class="el-select-wrap">
                <el-option
                  v-for="item in networkList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select> -->
              <select id="selectId" class="selset-option" @change="chooseValue()">
                <option id="1" :selected="selectValue==1?'selected':''" >{{$t("networks.main")}}</option>
                <option id="2" :selected="selectValue==2?'selected':''" >{{$t("networks.test")}}</option>
              </select>
            </span>
            <span class="language-wrap">
              <label class="lg-show" for="">{{$t("message.language")}}</label>
              <select class="selset-option" @change="chooseLanguage()">
                <option :selected="selectLanguage=='zh'?'selected':''" >{{$t("languages.zh")}}</option>
                <option :selected="selectLanguage=='en'?'selected':''" >{{$t("languages.en")}}</option>
              </select>
            </span>
        </div>
      </div>
  </div>
</template>

// script define
<script>
export default {
  data () {
    return {
      selectValue: 1,
      selectLanguage: 'en'
    }
  },
  methods: {
    chooseValue () {
      var objS = document.getElementById('selectId')
      this.selectValue = objS.options[objS.selectedIndex].id
      this.$emit('changeSelect', this.selectValue)
    },
    chooseLanguage () {
      let locale = this.$i18n.locale
      switch (locale) {
        case 'zh':
          this.$i18n.locale = 'en'
          this.selectLanguage = 'en'
          break
        case 'en':
          this.$i18n.locale = 'zh'
          this.selectLanguage = 'zh'
          break
      }
    }
  }
}
</script>

// css define
<style lang="less">
select {
  border: solid 1px #000;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: url("../assets/imgs/drop-down.png") no-repeat scroll right center
    transparent !important;
  padding-right: 20px;
}

select::-ms-expand {
  display: none;
}
.header-wrap {
  background: url("../assets/imgs/bg_01.png");
  background-size: 100% 100%;
  .header {
    position: relative;
    height: 60px;
    line-height: 60px;
    .logo {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
    .select-wrap {
      margin-right: 2%;
      .el-select {
        width: 140px;
      }
      .el-select-wrap {
        .el-input__inner {
          background: none;
          border: none;
          color: #fff !important;
        }
      }
      .selset-option {
        background: none;
        border: none;
        font-size: 14px;
        &:hover {
          cursor: pointer;
          border: none;
        }
        option {
          background: #23479c;
          color: #fff;
          &:hover {
            color: #333;
            background: #23479c;
          }
        }
      }
    }
  }
}
.el-select-dropdown {
  background-color: #23479c;
  border: 1px solid #23479c;
  .el-select-dropdown__item {
    color: #fff;
    &:hover {
      background: #23479c;
    }
  }
}
.language-wrap {
  margin-left: 30px;
}
@media screen and (max-width: 768px) {
  .header-wrap {
    padding: 0 2%;
    background: #23479c;
    .header {
      position: relative;
      height: 50px;
      line-height: 50px;
      .logo {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 100px;
      }
      .select-wrap {
        font-size: 12px;
        margin-right: 0;
        .el-select {
          width: 140px;
        }
        .el-select-wrap {
          .el-input__inner {
            background: none;
            border: none;
            color: #fff !important;
          }
        }
        .selset-option {
          background: none;
          border: none;
          font-size: 14px;
          &:hover {
            cursor: pointer;
            border: none;
          }
          option {
            background: #23479c;
            color: #fff;
            &:hover {
              color: #333;
              background: #23479c;
            }
          }
        }
      }
    }
  }
}
</style>

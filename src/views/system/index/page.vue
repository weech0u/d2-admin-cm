<template>
  <d2-container class="page">
    <div id="main" style="width: 100%;height: 400px"></div>
  </d2-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      let option = {
        title: { text: "在Vue中使用echarts" },
        tooltip: {},
        xAxis: {
            type: 'category',
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
          {
            type: "line",
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById("main"));
      myChart.setOption(option);
      setTimeout(function() {
        window.onresize = function() {
          myChart.resize();
        };
      }, 200);
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  .logo {
    width: 120px;
  }
  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    line-height: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    .btn-group__btn {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }
}
</style>

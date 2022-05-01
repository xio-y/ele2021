<template>
  <div>
    <v-chart class="chart" :option="option" />
    <v-chart class="chart" :option="option1" />
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);
export default {
  name: 'Chart',
  data () {
    return {  
      option: {
        title: {
          text: "分类新闻数量-饼状图",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: []
        },
        series: [
          {
            name: "新闻数量",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      option1: {
        title: {
          text: "分类新闻数量-柱状图",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}"
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: "新闻数量",
            type: 'bar',
            data: [],
            itemStyle: {
              barBorderRadius: 5,
              borderWidth: 1,
              borderType: 'solid',
              borderColor: '#73c0de',
              shadowColor: '#5470c6',
            }
          }
        ]
      },
    }
  },
  created() {
    this.getChartData();
  },
  methods: {
    getChartData() {
      this.axios.get("kind/getNumsByKind").then(response=>{
        var res = response.data;
        //饼状图数据
        var data1=[];
        //数据解释
        var data2 = [];
        //柱状图数据
        var data3 = [];
        res.forEach(item=>{
          data1.push({
            name: item.content,
            value: item.nums,
          });
          data2.push(item.content);
          data3.push({
            name: item.content,
            value: item.nums,
            itemStyle: {
              color: this.buildColor(),
              shadowColor: this.buildColor(),
              opacity: 0.5
            }
          })
        })
        this.option.series[0].data=data1;
        this.option.legend.data = data2;
        this.option1.series[0].data = data3;
        this.option1.xAxis.data = data2;
      })
    },
    //随机6位16进制
    buildColor(){
        var color="#"+Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,"0");
        return color;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
  height: 400px;
}
</style>

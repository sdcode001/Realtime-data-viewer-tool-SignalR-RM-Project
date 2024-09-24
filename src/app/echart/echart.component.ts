import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as echarts from 'echarts';


@Component({
  selector: 'app-echart',
  standalone: true,
  imports: [],
  templateUrl: './echart.component.html',
  styleUrl: './echart.component.css'
})
export class EchartComponent {

    @Input({required: true}) tagId: any
    @Input({required: true}) data?:any[]
   
    constructor(){ }

    ngOnChanges(){

      var chartDom = document.getElementById(`main-${this.tagId}`);
      var myChart = echarts.init(chartDom);
      var option;
      
      //console.log('data---->', this.data)

      option = {
        title: {
          text: `TagId: ${this.tagId} & Realtime Data`
        },
        tooltip: {
          trigger: 'axis',
          // formatter: function (params: any) {
          //   params = params[0];
          //   var date = new Date(params.name);
          //   return (
          //     date.getHours() +
          //     ':' +
          //     date.getMinutes() +
          //     ':' +
          //     date.getSeconds() + // Get current seconds
          //     ' : ' +
          //     params.value[1]
          //   );
        // },
          axisPointer: {
            animation: true
          }
        },
        legend: {
            data: this.tagId
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: 'Tag Data',
            type: 'line',
            showSymbol: false,
            data: this.data
          }
        ]
      };
      
      option && myChart.setOption(option);
      
    }

}

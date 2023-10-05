/** @odoo-module */
import { registry } from "@web/core/registry"
import {loadJS} from "@web/core/assets"
const { Component, onWillStart, useRef, onMounted, onRendered, useEffect } = owl

export class ChartRenderer extends Component{
    setup(){

        this.chartRef = useRef('chart')
        this.chart = ''
        onWillStart(async ()=>{
            await loadJS("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js")

        })

        useEffect(() => {
          if (this.chart ==''){
            console.log("Not rendered");
          }else{
            this.removeData();
            this.addData(this.props.data);
          }


        },()=>[this.props.data]);

        onMounted(()=>
          this.renderChart()
        )
    
    }

    addData(newData) {
      this.chart.data.datasets.forEach((dataset) => {
          dataset.data = newData;
      });
      this.chart.update();
    }

    removeData() {
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        this.chart.update();
    }
   

    

    renderChart(){
        let nameLabels = this.props.dataLabels;
        let chartData = this.props.data;
        
        this.chart = new Chart(this.chartRef.el,
        {
          type: this.props.type,
          
          data: {
            datasets: [{
              label: 'Bán chạy nhất',
              data: this.props.data,
            }],
            
          },

          options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                          return 'Sản phẩm: ' + nameLabels[tooltipItem.dataIndex]
                        },
                        title: function(tooltipItem){
                          return 'Doanh thu: ' + chartData.at(tooltipItem.dataIndex).y;
                        }
                    }
                }
            },
          
          },
        }
      );
    }

}

ChartRenderer.template = "aki_dashboard.AkiChart"
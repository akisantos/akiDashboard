/** @odoo-module */
import { registry } from "@web/core/registry"
import { KpiCard } from "./kpi_card/kpi_card"
import { ChartRenderer } from "./chart/chart"
import {loadJS} from "@web/core/assets"
import { useBus, useService } from "@web/core/utils/hooks"
const { Component, onWillStart, useRef, onMounted, useState } = owl

export class AkiSaleDashboard extends Component{
    setup(){
        // this.orm = useService("orm");
        // onWillStart(async () => {
        //        await this.loadDashboardData();
        // });
        

        this.dashboard_service = useService("akiDashboardServices")
        console.log(this.dashboard_service)
        this.dashboard_data = useState(this.dashboard_service.dashboard_data)
        this.sale_data = useState(this.dashboard_service.sale_data)
    }

//    async loadDashboardData() {
//       const context = {};
//       this.purchase_order_count = await this.orm.call(
//           'res.partner',
//           'get_sale_order_count',
//           [],
//           {
//               context: context
//           }
//       );
//
//       console.log(this.purchase_order_count)
//   }
    // async loadDashboardData() {
    //        const context = {};
    //        this.purchase_order_count = await this.orm.call(
    //            'sale.order',
    //            'get_purchase_order_count',
    //            [],
    //            {
    //                context: context
    //            }
    //        );
    //    }
}

AkiSaleDashboard.template = "aki_dashboard.AkiSaleDashboard"
AkiSaleDashboard.components = { KpiCard, ChartRenderer}
registry.category("actions").add("aki_dashboard.AkiSaleDashboard", AkiSaleDashboard);
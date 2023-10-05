/** @odoo-module */
import { registry } from "@web/core/registry"
import { KpiCard } from "./kpi_card/kpi_card"
import { ChartRenderer } from "./chart/chart"
import {loadJS} from "@web/core/assets"
import { useBus, useService } from "@web/core/utils/hooks"
const { Component, onWillStart, useRef, onMounted, useState } = owl

export class AkiSaleDashboard extends Component{
    setup(){
        this.orm = useService("orm");
        this.actionService = useService("action")

        this.state = useState({
            quotations: {
                value:10,
                percentage:6,
            },

            period: 90,
        })
    
        // this.dashboard_service = useService("akiDashboardServices")
        

        onWillStart(async ()=>{
            this.getDates();
            await this.GetBestSellerChart();
            await this.getQuotation();
            await this.getOrders();

        })
    }


    async onPeriodFilterChange(){
        this.getDates();
        console.log(moment().subtract(this.state.period, 'days').calendar());
        await this.getQuotation();
        await this.getOrders();
        await this.GetBestSellerChart();
    }

    getDates(){
        this.state.currentDate = moment().subtract(this.state.period,'days').format('L');
        this.state.previousDate = moment().subtract(this.state.period * 2,'days').format('L');

    }

    async getQuotation(){
        let domain = [['state', 'in', ['sent', 'draft']]];
        let prevDomain = domain;

        if (this.state.period >0){
            domain.push(['date_order','>=',this.state.currentDate])
            prevDomain.push(['date_order','>=', this.state.previousDate], ['date_order','<=', this.state.currentDate]);
        }

        const data = await this.orm.searchCount("sale.order", domain);
        this.state.quotations.value = data;

        // Tính % kì trước  
        const prevData = await this.orm.searchCount('sale.order', prevDomain);
        const phanTram = (data - prevData)/ prevData *100
        this.state.quotations.percentage = phanTram;

    }
    
    async getOrders(){
        let domain = [['state','in',['done', 'sale']]];
        let prevDomain = [['state','in',['done', 'sale']]];

        if (this.state.period > 0){
            domain.push(['date_order','>=', this.state.currentDate])
            prevDomain.push(['date_order','>=', this.state.previousDate], ['date_order','<=', this.state.currentDate]);
        }
        const data = await this.orm.searchCount('sale.order',domain);

        // Tính % kì trước  
        const prevData = await this.orm.searchCount('sale.order', prevDomain);
        const phanTram = (data - prevData)/(prevData) * 100;

        //Tính đơn thành công (đã xuất hoá đơn)
        let invoicedDomain = domain;
        invoicedDomain.push(['invoice_status', 'in' ,['invoiced', 'to invoice']])
        const invoicedOrderCount = await this.orm.searchCount('sale.order', invoicedDomain);

        //Tính revenue
        let prevRevenueDomain = prevDomain;
        prevRevenueDomain.push(['invoice_status', 'in',['invoiced', 'to invoice']])
        
        const revenue = await this.orm.readGroup('sale.order', domain, ['amount_total:sum'], []);
        const prevRevenue = await this.orm.readGroup('sale.order', prevRevenueDomain, ['amount_total:sum'], []);
        const revenuePercent = (revenue[0].amount_total - prevRevenue[0].amount_total)/ (prevRevenue[0].amount_total) * 100;

        //Tính profit
        let profit = await this.orm.readGroup('sale.order', domain, ['amount_untaxed:sum'], []);

        //Tính average Revenue
        let averageRevenue = revenue[0].amount_total / invoicedOrderCount;

        //Trả kết quả
        this.state.orders = {
            count: data,
            percentage: phanTram.toFixed(1),
            invoicedOrders: invoicedOrderCount,
            revenue: `${(revenue[0].amount_total)}₫`,
            revenuePercent: revenuePercent.toFixed(1),
            profit:`${(profit[0].amount_untaxed)}₫`,
            averageRevenue: averageRevenue.toFixed(2)
        }
    }

    async viewQuotation(){

        // let domain = [['state', 'in', ['sent', 'draft']]]
        // if (this.state.period > 0){
        //     domain.push(['date_order','>', this.state.current_date])
        // }

        // let list_view = await this.orm.searchRead("ir.model.data", [['name', '=', 'view_quotation_tree_with_onboarding']], ['res_id'])

        // this.actionService.doAction({
        //     type: "ir.actions.act_window",
        //     name: "Quotations",
        //     res_model: "sale.order",
        //     domain,
        //     views: [
        //         [list_view.length > 0 ? list_view[0].res_id : false, "list"],
        //         [false, "form"],
        //     ]
        // })

        this.none()

    }

    none(){
        
    }
    async GetBestSellerChart(){
        let domain = [['state', 'in', ['done', 'sale']]]
        
        domain.push(['invoice_status', 'in' ,['invoiced', 'to invoice']])
        if (this.state.period >0){
            domain.push(['date_order','>=',this.state.currentDate])
        }

        let chartData = await this.orm.searchRead('sale.order',domain, ['name','amount_total','date_order'])
        let saleList = []
        let saleListLabels = []
        for(let i =0;i< chartData.length; i++){
            let saleData ={
                x: moment(new Date(chartData[i].date_order)).format("DD/MM/YYYY"),
                y: chartData[i].amount_total,

            }
            saleList.push(saleData);
            saleListLabels.push(chartData[i].name)
        }


        this.state.saleData = {
            label: saleListLabels,
            data: saleList,
        }

    }
}

AkiSaleDashboard.template = "aki_dashboard.AkiSaleDashboard"
AkiSaleDashboard.components = { KpiCard, ChartRenderer}
registry.category("actions").add("aki_dashboard.AkiSaleDashboard", AkiSaleDashboard)

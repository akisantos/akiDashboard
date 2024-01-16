/** @odoo-module */

import {registry} from "@web/core/registry"

import { KpiCard } from "./kpi_card/kpi_card"

import { useBus, useService } from "@web/core/utils/hooks"

const {Component, onWillStart} = owl

export class TiktokDashboard extends Component{
     
    setup(){
   
        this.authorizedShop = useService("akiTiktokService");
        console.log(this.authorizedShop)
    }
}


TiktokDashboard.template = "aki_dashboard.TiktokDashboard"
TiktokDashboard.components = {KpiCard}
registry.category("actions").add("aki_dashboard.TikTokDashboard", TiktokDashboard)
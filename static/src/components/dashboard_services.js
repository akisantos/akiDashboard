/** @odoo-module */

import {registry} from '@web/core/registry'
const { reactive } = owl

export const akiDashboardServices= {
    dependencies: ["rpc"],
    async start(env,{rpc}){
        let dashboard_data = reactive({})
        let sale_data = reactive({})

        Object.assign(dashboard_data, await rpc("aki/dashboard_service/"))
        Object.assign(sale_data, await rpc("aki/dashboard_service/sale_data/"))

        return{
            dashboard_data,
            sale_data
        }
    }
}

registry.category("services").add("akiDashboardServices", akiDashboardServices)
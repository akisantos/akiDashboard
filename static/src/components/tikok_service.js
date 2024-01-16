/** @odoo-module */

import {registry} from '@web/core/registry'
const { reactive } = owl

export const TiktokService= {
    dependencies: ["rpc"],
    async start(env,{rpc}){
        let tiktok_data = reactive({})
        let sale_data = reactive({})

        Object.assign(tiktok_data, await rpc("aki/getAuthorization/"))
        // Object.assign(sale_data, await rpc("aki/dashboard_service/sale_data/"))

        return{
            tiktok_data
        }
    }
}

registry.category("services").add("akiTiktokService", TiktokService)
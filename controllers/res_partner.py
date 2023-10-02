from odoo import http

class ResPartner(http.Controller):

    @http.route('/aki/dashboard_service',type='json', auth='user')
    def dashboard_service(self):
        partner = http.request.env['res.partner']
        return {
            "partners": partner.search_count([]),
            "customers": partner.search_count([('is_company', '=', True)]),
            "individuals": partner.search_count([('is_company', '=', False)]),
            "locations": len(partner.read_group([], ['state_id'], ['state_id'])),

        }

    @http.route('/aki/dashboard_service/sale_data', type='json', auth='user')
    def sale_data(self):
        sale = http.request.env['sale.order']
        rec = sale.search([])
        #('invoice_status', '=','invoiced')
        total_amount=0


        saleList = []
        saleListName = []
        for r in rec:
            total_amount += r.amount_total
            saleListName.append(r.name)
            saleList.append(r.amount_total)

        saleChartData = {
            'label': 'Bán hàng',
            'data': saleList,
            'hoverOffset': 4
        }



        return {
            'all_purchase_order': len(sale.search([])),
            'rfq': len(sale.search([("state", "=", "draft")])),
            'rfq_sent': len(sale.search([("state", "=", "sent")])),
            'sale': len(sale.search([("state", "=", "sale")])),
            'done': len(sale.search([("state", "=", "done")])),
            'cancel': len(sale.search([("state", "=", "cancel")])),
            'amount': str(total_amount) + "₫",
            'saleChartData': saleChartData,
            'saleChartLabels': saleListName
        }
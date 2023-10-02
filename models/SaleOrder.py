# -*- coding: utf-8 -*-
from odoo import models, api, fields

class SaleOrder(models.Model):
    _inherit = 'sale.order'

    @api.model
    def get_purchase_order_count(self):
        purchase_order_count = {
            'all_purchase_order': len(self.env['sale.order'].search([])),
            'rfq': len(self.env['sale.order'].search([("state", "=", "draft")])),
            'rfq_sent': len(self.env['sale.order'].search([("state", "=", "sent")])),
            'sale': len(self.env['sale.order'].search([("state", "=", "sale")])),
            'done': len(self.env['sale.order'].search([("state", "=", "done")])),
            'cancel': len(self.env['sale.order'].search([("state", "=", "cancel")])),

        }
        return purchase_order_count


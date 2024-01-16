from odoo import http
import requests
import hmac
import hashlib
import json
import urllib.parse
import hashlib
import io
import datetime
from datetime import timezone
import codecs
import os
from odoo.addons.aki_dashboard.tiktok_utils import TiktokUtils

from dotenv import load_dotenv

load_dotenv()

class TikTokController(http.Controller):
    
        
    @http.route('/aki/dashboard_service',type='json', auth='user')
    def dashboard_service(self):
        partner = http.request.env['res.partner']
        return {
            "partners": partner.search_count([]),
            "customers": partner.search_count([('is_company', '=', True)]),
            "individuals": partner.search_count([('is_company', '=', False)]),
            "locations": len(partner.read_group([], ['state_id'], ['state_id'])),

        }
        
    @http.route('/aki/shopAuthorization', type='json', auth='user', cors='*')
    def tiktokShopAuth(self):
        pass
        
    
    @http.route('/aki/refreshAccessToken', type='json', auth='user', cors='*')
    def tiktokRefreshAccessToken():

        pass
            
    @http.route('/aki/getAuthorization', type='json', auth='user', cors="*")
    def tiktok_get_authorized_shop(self):
       
        headers = {
            'Accept': 'application/json',
            'x-tts-access-token': os.getenv("ACCESS_TOKEN_SECRET"),
            'Content-Type': 'application/json'
            }
        prod_domain = "	https://open-api.tiktokglobalshop.com"
        path = "/authorization/202309/shops"
        
        secret = os.getenv("APP_SECRET")
        app_key = os.getenv("APP_KEY")
        
        #refreshUrl = TiktokUtils.refreshAccessToken(app_key, secret, os.getenv('REFRESH_TOKEN_SECRET'))
        #print("REFRESH TOKEN URL " + refreshUrl)
        query = {
            "app_key": app_key,
            "timestamp": str(int(datetime.datetime.now(timezone.utc).replace(tzinfo=timezone.utc).timestamp()))
        }
        
        #requestUrl = TiktokUtils.requestAccessToken(app_key,secret, os.getenv('AUTH_CODE'))
        #print("REQUEST: " + requestUrl)
        input = ""
        for x in query:
            input = input + x + query[x]
            #print(query[x])
        
        input = path + input
        input = secret + input + secret
        print(input)
        
        signedReq = TiktokUtils.signRequest(input,secret)
        print(signedReq)
    
        query_url = prod_domain+path + "?app_key=" + query['app_key'] +"&sign=" + signedReq + "&timestamp="+query["timestamp"] 
        print(query_url)
        
        tiktok_data = requests.get(query_url, headers=headers)
    
        
        return tiktok_data.json()
    
        

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
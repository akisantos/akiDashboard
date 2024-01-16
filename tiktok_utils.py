import codecs
import hmac
import hashlib
import requests
from odoo import models
import os
import dotenv
from dotenv import load_dotenv,find_dotenv

class TiktokUtils(models.AbstractModel):
    _name = "aki_dashboard.tiktok_utils"

    @staticmethod
    def signRequest(input, secret):
        
        inputEncoded = codecs.encode(input,'utf-8')
        serectEncoded = codecs.encode(secret, 'utf-8')
        
        h = hmac.new(serectEncoded,inputEncoded, hashlib.sha256)
        return str(h.hexdigest())

    @staticmethod
    def refreshAccessToken(appkey,app_secret, refresh_token):
        
        #Chuẩn bị resource
        endpoint = 'https://auth.tiktok-shops.com/api/v2/token/refresh'
        
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        
        query = {
            'app_key': appkey,
            'app_secret': app_secret,
            'refresh_token': refresh_token,
            'grant_type':'refresh_token'
        }
        
        #Ghép URL 
        
        input = endpoint + "?"
        i = True
        for x in query:
            if (i == True):
                input = input + x + "="+ query[x]
            else: 
                input = input + "&" + x + "="+query[x]
            i=False
    
        #Gửi Request
        response = requests.get(input,headers=headers)  
        
        #Lưu dữ liệu
        data = response.json()
        print(data['data']['access_token'])     
        dot_env_file = find_dotenv("./controllers/.env")
        dotenv.load_dotenv(dot_env_file)
        os.environ["ACCESS_TOKEN_SECRET"] = data['data']['access_token'] 
        os.environ["REFRESH_TOKEN_SECRET"] = data['data']['refresh_token'] 
        dotenv.set_key(dot_env_file, "ACCESS_TOKEN_SECRET",os.environ["ACCESS_TOKEN_SECRET"])
    
        return data
    
    @staticmethod
    def requestAccessToken(appkey, app_secret,auth_code ):

        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        endpoint = 'https://auth.tiktok-shops.com/api/v2/token/get'
        query = {
            'app_key': str(appkey),
            'app_secret': str(app_secret),
            'auth_code': str(auth_code),
            'grant_type':'authorized_code'
        }

        input = endpoint + "?"
        i = True
        for x in query:
            if (i == True):
                input = input + x + "="+ query[x]
            else: 
                input = input + "&" + x + "="+query[x]
            i=False
    
        response = requests.get(input,headers=headers)  
        
    
        data = response.json()
        print(data['data']['access_token'])     
        dot_env_file = find_dotenv("./controllers/.env")
        dotenv.load_dotenv(dot_env_file)
        os.environ["ACCESS_TOKEN_SECRET"] = data['data']['access_token'] 
        os.environ["REFRESH_TOKEN_SECRET"] = data['data']['refresh_token'] 
        dotenv.set_key(dot_env_file, "ACCESS_TOKEN_SECRET",os.environ["ACCESS_TOKEN_SECRET"])
    
        return data
    
    @staticmethod
    def getAccessToken():
        pass

    def shopAuthorization():
        return {
            'type': 'ir.actions.act_url',
            'target':'new',
            'url': 'https://services.tiktokshop.com/open/authorize?service_id=7288037461198898950'
        }

    def getSecretKey():
        pass

    def getAppkey():
        pass

    def getAccessToken():
        pass

    def queryBuilder():
        pass

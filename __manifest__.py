# -*- coding: utf-8 -*-

{
    'name': 'aki Dashboard',
    'version' : '0.1',
    'category': 'akiERP/CustomDashBoard',
    'summary':"Aki Custom Dashboard",
    'description': "Bảng thống kê của Aki",
    'website':'www.akierp.com',
    'sequence':-1,
    'depends':[
        'base',
        'web',
        'sale',
        'board',
        'purchase'
    ],
    'data':[
        'views/sales_dashboard.xml'
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'assets':{
        'web.assets_backend':[
            'aki_dashboard/static/src/components/**/*.js',
            'aki_dashboard/static/src/components/**/*.xml',
            'aki_dashboard/static/src/components/**/*.scss',
            'aki_dashboard/static/src/components/**/*.img',
        ],
    },
}
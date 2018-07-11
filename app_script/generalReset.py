#!/usr/bin/python
# -*- coding: UTF-8 -*-
import pymysql
connection = pymysql.connect(host='47.93.50.205', port=3306, user='root', password='dkl20170531', db='confide', 
                             charset='utf8', cursorclass=pymysql.cursors.DictCursor)

cursor = connection.cursor()

#
# 如果当前推广状态为当日禁用的，设置为启用，并且当日推广金额更新为0
#
sql = "update `confide`.`generalsetting` set `status` = 2,`dayprice` = 0  where `status`=3;"
cursor.execute(sql)

# 提交SQL
connection.commit()
connection.close()
print("测试")
# spider
##基于node的爬虫
爬取知乎页面小头像       
目前实现：
 * 实现基本功能，实现连接队列池，哈希表去重
 * 获取小头像url，以img的形式写入test.txt，实现可持久化
 * 实现并发数控制,异步爬取
         
不足：
 * 代码风格粗糙
 * 在爬取到4W个左右头像的时候，程序报错
 * 数据的展示没优化


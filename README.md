# 使用NodeJs+MongoDB 网站建站

## 课程参考慕课网视频教程,对项目代码添加了部分注释:
### [node+mongodb(一期)——基础搭建](http://www.imooc.com/view/75)
### [node+mongodb(二期)——网站升级](http://www.imooc.com/view/197)

## 简介:
### 一、项目后端搭建:
#####1.使用NodeJs + express完成电影网站后端搭建;
#####2.数据库选择mongodb,使用mongoose来完成对mongodb快速建模;
#####3.使用jade后端模板引擎完成页面创建;
#####4.关于时间和日期的格式化使用Moment.js模块来完成;
#####5.以上模块都也可以通过npm包管理工具来进行安装

### 二、项目前端搭建:
#####1.使用bower模块处理前端静态资源的版本依赖和管理;
#####2.通过jQuery和Bootsrap完成网站前端JS脚本和样式处理;

### 三、本地开发环境搭建:
#####1.使用Grunt集成less文件编译、样式合并、语法检查、前后端单元测试实现、服务的自动重启等

### 四、电影网站整体功能:
#####1.用户注册登录功能;
#####2.电影评论功能;
#####3.电影分类管理及搜索功能;
#####4.列表分页处理功能;
#####5.电影海报图片上传功能;
#####6.同步豆瓣电影数据功能;
#####7.电影访客统计功能;
#####8.单元测试功能;

### 五、使用过程:
#####1.[安装mongodb](https://www.mongodb.org/downloads#production)完成相关配置,并启动数据库`mongod`,如果出错可能需要权限`sudo mongod`； 
#####2.在当前项目目录中使用npm install命令安装相关模块，也可以通过[淘宝npm镜像](http://npm.taobao.org)安装模块，可以提高模块下载速度及减少出错率，按照教程先安装cnpm命令行工具，再使用cnpm install安装项目模块;
#####3.安装grunt工具到全局环境: npm install -g grunt  或者:cnpm install -g grunt；  
#####4.在该项目目录下使用grunt运行程序；
#####5.命令行工具看到：Movie started on； port:4000时在游览器中输入localhost:4000即可看到项目主页
#####6.项目中后台页面做了权限访问限制，需要用户权限大于10才能访问后台，可以先通过注册一个用户后，在新的命令行中输入mongo连接数据库 
- 使用`use imooc`命令切换到该项目数据库;
- 先使用`db.users.find().pretty()`命令查看数据库用户数据， 再使用`db.users.update({"_id":ObjectId("*****")},{$set:{role:**}})`命令更新用户权限，其中`ObjectId("****")`是想更新用户的ID值，`role:**`是想要增加的用户权限，要大于10才可以访问后台控制页面

### 六、项目页面 
####1.首页: localhost:4000/

####2.用户后台页:
- 用户注册页面: localhost:4000/signup
- 用户登陆页面: localhost:4000/signin
- 用户详情列表页: localhost:4000/admin/user/list
- 电影详情页:localhost:4000/movie/:id

####3.电影后台页:
- 电影后台录入页:localhost:4000/admin/movie/new
- 电影列表页:localhost:4000/admin/movie/list
- 电影分类录入页:localhost:4000/admin/category/new
- 电影分类页:localhost:4000/admin/category/list

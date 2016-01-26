NodeJs+MongoDB+jQuery仿豆瓣电影音乐网站搭建
================================================

简介:
---------------

* 项目后端搭建:
  * 使用NodeJs + express完成电影网站后端搭建;
  * 数据库选择mongodb,使用mongoose来完成对mongodb快速建模;
  * 使用jade后端模板引擎完成页面创建渲染;
  * 以上模块都也可以通过npm包管理工具来进行安装

* 项目前端搭建:
  * 使用npm模块处理前端静态资源的版本依赖和管理;
  * 通过jQuery和Bootsrap完成网站前端JS脚本和样式处理;
  * 使用Sass完成电影和音乐首页样式;
  * 使用Ajax与后端进行交互;

* 本地开发环境搭建:
  * 使用Grunt集成Sass文件编译、压缩、样式合并、使用jshint完成语法统一检查、使用mocha完成单元测试、服务的自动重启等功能

* 电影网站整体功能:
  * 豆瓣电影和音乐相同展示页面
  * 用户注册登录;
  * 电影评论;
  * 电影搜索查找;
  * 电影音乐分类管理及搜索;
  * 列表分页处理;
  * 电影音乐海报图片上传;
  * 可同步豆瓣电影音乐数据方便新数据添加;
  * 访客统计;
  * 单元测试;

Node版本:
-------
本次开发是基于0.12版本，升级到4.版本时暂时发现用户注册登录时生成的验证码模块不支持，后期会尝试完善

安装:
----
* 安装mongodb(https://www.mongodb.org/downloads#production)完成相关配置;
* 在当前项目目录中使用npm install命令安装相关模块，也可以通过[淘宝npm镜像](http://npm.taobao.org)安装模块，可以提高模块下载速度及减少出错率，按照教程先安装cnpm命令行工具，再使用cnpm install安装项目模块;
* 安装grunt工具到全局环境: npm install -g grunt  或者:cnpm install -g grunt；

运行:
----  
* 启动数据库`mongod`,如果出现错误尝试输入`sudo mongod`来完成启动
* 使用命令行工具在该项目目录下使用grunt运行程序,默认是使用3000端口，若端口已占用可在gruntfile.js文件中nodemon配置下将PORT设置成一个未占用端口;
* 当命令行工具看到：Movie started on； port:3000时在游览器中输入localhost:3000即可看到项目电影主页
* 项目中后台控制页面做了权限访问限制，需要用户权限大于10才能访问后台;
- 可以先通过注册一个用户后，在新的命令行中输入mongo连接数据库;
- 使用`use imooc`命令切换到该项目数据库;
- 先使用`db.users.find().pretty()`命令查看数据库用户数据， 再使用`db.users.update({"_id":ObjectId("*****")},{$set:{role:**}})`命令更新用户权限，其中`ObjectId("****")`是想更新用户的ID值，`role:**`是想要增加的用户权限，要大于10才可以访问后台控制页面

项目页面:
-------
* 豆瓣电影首页: localhost:3000/  豆瓣音乐: localhost:3000/musicIndex

* 用户后台页:
- 用户注册页面: localhost:3000/signup
- 用户登陆页面: localhost:3000/signin
- 用户详情列表页: localhost:3000/admin/user/list

* 电影后台页:
- 详情页:localhost:3000/movie/:id
- 后台录入页:localhost:3000/admin/movie/new
- 列表页:localhost:3000/admin/movie/list
- 分类录入页:localhost:3000/admin/movie/category/new
- 分类页:localhost:3000/admin/movie/category/list
- 电影院录入页:localhost:3000/admin/movie/programme/new
- 电影院列表页:localhost:3000/admin/movie/city/list

* 音乐后台页:
- 详情页:localhost:3000/music/:id
- 后台录入页:localhost:3000/admin/music/new
- 列表页:localhost:3000/admin/music/list
- 分类录入页:localhost:3000/admin/music/musicCategory/new
- 分类页:localhost:3000/admin/music/musicCategory/new
- 热门榜单录入页:localhost:3000/admin/music/programme/new
- 热门榜单列表页:localhost:3000/admin/music/programme/list

后期完善:
-------
* 1.部分功能还有待完善;
* 2.尝试使用React/Vue等框架完善网站功能，减少多DOM的直接操作，方便后期维护

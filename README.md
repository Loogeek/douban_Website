NodeJs+MongoDB+jQuery仿豆瓣电影音乐网站搭建
========================================

简介:
---------------
本项目电影和音乐首页交互代码是由jQuery完成的，在<a href="https://github.com/Loogeek/douban-react" target="\_blank">douban-react</a>项目中尝试了将部分代码使用React来重写，提高了阅读性和维护性，可以参考下。


**1. 项目后端搭建:**
  * 使用NodeJs + express完成电影网站后端搭建;
  * 数据库选择mongodb,使用mongoose来完成对mongodb快速构建;
  * 使用jade后端模板引擎完成页面创建渲染;

**2. 项目前端搭建:**
  * 通过jQuery和Bootsrap完成网站前端JS脚本和样式处理;
  * 使用Sass完成电影和音乐首页样式;
  * 使用validate插件完成账号注册登录判断;
  * 使用Ajax与后端进行数据请求交互;

**3. 本地开发环境搭建:**
  * 使用gulp集成jshint对JS语法检查，Sass文件编译、压缩等功能，使用mocha完成用户注册存储等步骤的简单单元测试，以及服务器的自动重启等功能。

**4. 网站整体功能:**

  网站正常访问无需管理原权限，以下网站数据的添加及删除功能需要登录默认管理员账号(**账号:1234 密码:1234**)。

  具体功能可查看网站[动态效果演示](http://7xrqxi.com1.z0.glb.clouddn.com/douban.gif),gif图片有点大请耐心等待。
  * 豆瓣电影和音乐相同的展示页面;
  * 用户注册登录及管理;
  * 电影及音乐评论添加及删除;
  * 电影院录入及搜索功能;
  * 电影及音乐搜索查找;
  * 电影及音乐分类添加及删除;
  * 电影及音乐海报图片自定义上传;
  * 列表分页处理;
  * 电影及音乐数据可通过Ajax请求完成;
  * 访客统计;

项目整体效果
-------
<div>
  <img src="https://raw.githubusercontent.com/Loogeek/douban_Website/master/ReadmeImag/doubanMovie.png" width="45%" float"left" height="700" alt="电影首页"/>
  <img src="https://raw.githubusercontent.com/Loogeek/douban_Website/master/ReadmeImag/doubanMusic.png" width="45%" float"left" height="700" alt="音乐首页"/>
</div>
<div text-align="center">
  <img src="https://raw.githubusercontent.com/Loogeek/douban_Website/master/ReadmeImag/doubanDetail.png" width="45%" alt="电影详情"/>
</div>

动态效果演示
-------
[动态效果演示](http://7xrqxi.com1.z0.glb.clouddn.com/douban.gif)

运行环境及Node版本:
-------
目前在Mac下的node 4.2.x版本运行正常

安装:
----
- 安装mongodb(https://www.mongodb.org/downloads#production)完成相关配置;
- 在当前项目目录中使用npm install命令安装相关模块(<a href="http://npm.taobao.org/" target="\_blank">如果模块下载速度慢可考虑使用淘宝cnpm镜像进行下载</a>);

运行与使用:
----
1. 启动数据库`mongod`,如果出现错误尝试输入`sudo mongod`来完成启动
2. 项目目录下的doubanDatabase是可供选择导入的数据库信息，可通过命令`mongorestore -h host -d dataName --dir=path` 来导入该文件夹信息到数据库中，其中-h是连接地址，如127.0.0.1 -d是将要创建数据库的名称，如douban(注意:项目中链接的数据库名称是douban,如果-d后创建的数据库名称叫douban2,则需要将app.js文件`dbUrl = 'mongodb://127.0.0.1/douban`中的douban改成douban2),--dir=后为该doubanDatabase所在路径，具体可通过`mongorestore --help`查看
3. 使用命令行工具在该项目目录下使用gulp运行程序,默认是使用3000端口，若端口已占用可在主目录app.js文件中将3000端口换成未占用的端口，当命令行工具看到：Movie started on； port:3000时在游览器中输入localhost:3000即可看到项目电影主页;
4. doubanDatabase中存储了默认的管理员账号:1234 密码:1234 权限为50，只有当权限大于10才可以访问后台控制页面，可通过修改数据库中users中role值完成用户权限控制。


项目页面:
-------
当使用管理员账号登录时(默认账号密码均是1234)可在顶部搜索栏下显示各后台控制页面的链接，方便页面切换。

**豆瓣电影首页:** localhost:3000/  

**豆瓣音乐:** localhost:3000/musicIndex

**用户后台页:**
- 用户注册页面: localhost:3000/signup
- 用户登陆页面: localhost:3000/signin
- 用户详情列表页: localhost:3000/admin/user/list

**电影后台页:**
- 详情页:localhost:3000/movie/:id
- 后台录入页:localhost:3000/admin/movie/new
- 列表页:localhost:3000/admin/movie/list
- 分类录入页:localhost:3000/admin/movie/movieCategory/new
- 分类页:localhost:3000/admin/movie/movieCategory/list
- 电影院录入页:localhost:3000/admin/movie/programme/new
- 电影院列表页:localhost:3000/admin/movie/city/list

**音乐后台页:**
- 详情页:localhost:3000/music/:id
- 后台录入页:localhost:3000/admin/music/new
- 列表页:localhost:3000/admin/music/list
- 分类录入页:localhost:3000/admin/music/musicCategory/new
- 分类页:localhost:3000/admin/music/musicCategory/new
- 热门榜单列表页:localhost:3000/admin/music/programme/list

后期完善:
-------
1. 完善网站功能;
2. 完善<a href="https://github.com/Loogeek/douban-react" target="\_blank">douban-react</a>项目中的代码;
* 尝试使用React Native制作移动端App;

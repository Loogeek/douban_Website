var City = require('../models/city');    //电影数据模型

// admin new page
exports.new = function(req, res) {
    res.render('cities_admin', {
        title: '豆瓣电影后台影院录入页',
        city: {}
    });
};

// admin post movie
exports.save = function(req, res) {
    var _city = req.body.city;

    City.findOne({cityName:_city.cityName}).exec(function(err,city){

        //如果城市名已存在则将电影院名称存入相应城市的电影院列表中
        if(city){
            //输入的该电影院名称在该城市不存在才存入
            if(city.name.indexOf(_city.name) === -1){
                console.log(city.name.indexOf(_city.name));
                city.name.push(_city.name);     //将输入框中输入的电影院名称添加到name数组中
                city.save(function(err, city) {
                    if (err) {
                        console.log(err);
                    }
                   res.redirect('/admin/city/list');  //重定向到电影院列表页
                }); 
           }else{
                //无法重复在一个城市中输入相同电影院名称
                res.redirect('/admin/city/new');
           }
        }else{
            //城市不存在，则新建城市及电影院对象
            city = new City(_city);
            city.save(function(err, city) {
                if (err) {
                    console.log(err);
                }
               res.redirect('/admin/city/list');
            });        
        }
    });

};

// catelist page
exports.list = function(req, res) {
    City.fetch(function(err, citiesList) {
        if (err) {
            console.log(err);
        }
        res.render('citiesList', {
            title: 'imooc 分类列表页',
            citiesList: citiesList
        });
    });
};

//list delete city 电影分类列表删除电影路由
exports.del = function(req,res){
    //获取客户端Ajax发送的URL值中的id值
    var id  = req.query.id;
    if(id){
        //如果id存在则服务器中将该条数据删除并返回删除成功的json数据
        City.remove({_id:id},function(err,city){
            if(err){
                console.log(err);
            }
            res.json({success:1});
        });
    }
};
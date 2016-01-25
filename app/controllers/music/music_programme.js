/* 热门歌单控制器 */
var Programme = require('../../models/music/music_programme');    //热门歌单数据模型

//豆瓣音乐热门歌单录入页面渲染函数
exports.new = function(req, res) {
    res.render('music/music_programme_admin', {
        title: '豆瓣音乐热门歌单录入页',
        programme: {}
    });
};

//豆瓣音乐热门歌单录入页点击录入处理函数
exports.save = function(req, res) {
    var _programme = req.body.programme;
    var programme = new Programme(_programme);

    programme.save(function(err, programme) {
        if (err) {
            console.log(err);
        }

       res.redirect('/admin/music/programme/list');
    });
};

//豆瓣音乐热门歌单列表页面渲染函数
exports.list = function(req, res) {
    Programme
        .find({})
        .populate({
            path:'musicCategories',
            select:'name',
        })
        .exec(function(err,programmes){
            if(err){
                console.log(err);
            }
            res.render('music/music_programme_list',{
                title:'豆瓣音乐热门歌单列表页',
                programmes:programmes
            });
        });
};

//豆瓣音乐热门歌单列表页删除相应榜单名处理函数
exports.del = function(req,res){
    //获取客户端Ajax发送的URL值中的id值
    var id  = req.query.id;
    if(id){
        //如果id存在则服务器中将该条数据删除并返回删除成功的json数据
        Programme.remove({_id:id},function(err,programme){
            if(err){
                console.log(err);
            }
            res.json({success:1});
        });
    }
};

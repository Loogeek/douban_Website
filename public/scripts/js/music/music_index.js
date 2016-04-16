'use strict';

$.support.cors = true;                                  // 解决IE8/9 Ajax跨域请求问题

$(function() {
  // Ajax请求函数
  function funAjax(URL,method,cb) {
    $.ajax({
      url:URL,
      cache:true,
      type:method,
      crossDomain:true
    }).done(cb);
  }

  // 音乐主页函数
  var musicIndexFun = (function() {
    var oCol6_width = $('.col-md-6').width();  //获取主页左边区域布局对象
    /*
      顶部轮播图区 #galleryFrames
    */
    var galleryFrames = (function(){
      var page = 1,                                          // 页码变量
          $oLeft = $('#galleryFrames .slide-prev'),          // 向左箭头
          $oRight = $('#galleryFrames .slide-next'),         // 向右箭头
          $oUl = $('#galleryFrames .gallery-hot ul'),        // 获取轮播图列表对象
          len = $('#galleryFrames .slide-content li').length,// 总共热门推荐轮播图数量
          $oDots = $('#galleryFrames .slide-dots');          // 获取轮播图滑动点列表对象

      $oUl.width(oCol6_width * len);                         //设置热门推荐区轮播图片的总宽度
      $('#galleryFrames img').width(oCol6_width);            // 设置每张轮播图片li的宽度
      // 设置轮播图显示第一张图片，偏移量为一张附属图宽度
      $oUl.css('left', - oCol6_width);

      // 轮播滚动函数，对作用方向进行不同移动
      function galleryMov(direction) {
        if(!$oUl.is(':animated')){
          if(direction === 'right'){
            page++;
            $oUl.animate({left:'-=' + oCol6_width},400);
            if(page === len - 1) {
              page = 1;
              $oUl.animate({left: - oCol6_width},0);
            }
          }else{
            page--;
            $oUl.animate({left:'+=' + oCol6_width},400);
            if(page === 0) {
              page = len - 2;
              $oUl.animate({left: - (oCol6_width*(len-2))},0);
            }
          }
          // 切换圆点导航样式
          $oDots.find('li:eq('+(page-1)+')').addClass('slide-active').siblings().removeClass('slide-active');
        }
      }

      // 向右切换
      $oRight.on('click',function() {
        galleryMov('right');
      });
      // 向左切换
      $oLeft.on('click',function() {
        galleryMov('left');
      });
      // 轮播图滑动点对象点击事件
      $oDots.on('click','li',function(){
        $(this).addClass('slide-active').siblings().removeClass('slide-active');
        var pageDiff =  $(this).text() - page;                // 获取需要滚动的页数
        page = $(this).text();                                // 将当前点击也赋值给page变量
        $oUl.animate({left:'-='+oCol6_width * pageDiff},300); // 滚动到当前点击页
      });
      // 定时器，每5秒钟向右切换一张图片
      var timer = setInterval(function() {
        galleryMov('right');
      },5000);
      // 当鼠标移入轮播图时图片停止滚动，鼠标移开重新开始移动
      $('#galleryFrames').on('mouseover',function() {
        clearTimeout(timer);
      }).on('mouseout',function() {
        timer = setInterval(function() {
          galleryMov('right');
        },5000);
      });
    })();

    /*
      编辑推荐区事件
    */
    var editorFeatured = (function(){
      var $oEditorScreen = $('#editorFeatured .screen-body'),  //获取编辑推荐区对象
          page = 1,                                            //初始页码
          $oLeft = $('#editorFeatured .slide-prev'),           //获取左按钮
          $oRight = $('#editorFeatured .slide-next'),          //获取右按钮
          oThumbnail = $('#editorFeatured .thumbnail'),        //获取音乐数量
          len = oThumbnail.length,                             //即将编辑推荐区音乐总数
          pageCount = Math.ceil(len / 4),                      //即将编辑推荐区总页数
          // 每张海报的外边距及实际赋给每张海报内容宽度
          marginWidth = oThumbnail.outerWidth(true) - oThumbnail.outerWidth(),
          oThumbnailWidth =  (oCol6_width - marginWidth * 4) / 4;

      // 设置每张海报的宽度
      oThumbnail.outerWidth(oThumbnailWidth);
      // 设置编辑推荐区总宽度
      $oEditorScreen.width(oCol6_width * pageCount);
      // 设置编辑推荐区总页数
      $('#editorFeatured .ui-side-max').html(pageCount);

      // 编辑推荐区滚动函数
      function funMoving(direction) {
        // 获取整个编辑推荐区域宽度
        var pageWidth = (pageCount - 1) * oCol6_width;
        // 设置编辑推荐区当前页码
        var $editorIndex = $('#editorFeatured .ui-side-index');
        // 判断是否已在运动，防止动画叠加
        if(!$oEditorScreen.is(':animated')) {
          //向右移动
          if(direction === 'right') {
            if(page === pageCount) {
              page = 1;
              // 设置显示当前音乐页码
              $editorIndex.html(page);
              $oEditorScreen.animate({left:0},400);
            }else {
              page++;
              $editorIndex.html(page);                    // 设置显示当前音乐页码
              $oEditorScreen.animate({left:'-='+oCol6_width},400);
            }
          // 向左移动
          }else {
            if(page === 1){
              page = pageCount;
              $editorIndex.html(page);
              $oEditorScreen.animate({left:'-='+pageWidth},400);
            }else {
              page--;
              $editorIndex.html(page);
              $oEditorScreen.animate({left:'+='+oCol6_width},400);
            }
          }
        }
      }
      
      // 点击编辑推荐区右箭头
      $oRight.on('click',function() {
        funMoving('right');
      });

      // 点击编辑推荐区左箭头
      $oLeft.on('click',function() {
        funMoving('left');
      });
      // 定时器，编辑推荐区每隔5s向右滚动一次
      var timer = setInterval(function() {
        funMoving('right');
      },5000);
      // 当鼠标划入编辑推荐区时动画停止，移开时重新开始运动
      $('#editorFeatured').on('mouseover',function() {
        clearInterval(timer);
      }).on('mouseout',function() {
        timer = setInterval(function() {
          funMoving('right');
        },5000);
      });
    })();

    /*
      新碟榜区点击切换榜单内容事件
     */
    $('#newAlbums').on('click','li',function() {
      // 只有点击不同按钮才触发Ajax事件，避免对同一个按钮重复点击触发请求
      if($(this).is('.on')) {
        return;
      }else {
        var albumName = $(this).text();                  // 获取按钮文字内容
        var URL = '/musicindex?albumName='+encodeURIComponent('新碟榜'+albumName);   // 对中文进行编码
        // 发送Ajax请求
        funAjax(URL,'GET',function(results) {
          if (results.data) {
            var data = results.data.musics;              // 获取Ajax返回的音乐分类数据
            var oThumbnail = $('#newAlbums .thumbnail'); // 获取当前音乐列表中音乐数量
            // 如果返回的数据少于当前音乐列表节点，则删除多余节点
            if(data.length < oThumbnail.length){
              var dataStart = data.length - 1;           // 设置切换到另外分类后数据起始位置
              $('#newAlbums .thumbnail:gt('+dataStart+')').remove();
              // 返回的分类电影数量大于原分类音乐数量节点则创建多出的节点
            }else if(data.length > oThumbnail.length) {
              //返回内容多于原音乐数量的创建新的节点并赋值
              for(var j = oThumbnail.length; j < data.length; j++) {
                $('#newAlbums .panel-body').append('<div class="thumbnail"><a href="" target="_blank"><img src="" alt=""/></a><div class="caption"><h5></h5><p></p></div></div>');
              }
            }
            // 切换前后音乐节点数量不变，则只替换节点内容
            oThumbnail = $('#newAlbums .thumbnail');      // 重新获取当前音乐列表中音乐节点数量
            for(var k = 0; k < oThumbnail.length; k++) {
              // 将原音乐连接、标题和海报换成切换后返回音乐数据相应内容
              $(oThumbnail[k]).find('a').attr('href','/music/'+ data[k]._id);
              $(oThumbnail[k]).find('h5').html(data[k].title);
              $(oThumbnail[k]).find('p').html(data[k].singer);
              var $oImg = $(oThumbnail[k]).find('img');

              if (data[k].image) {
                // 对音乐海报是否是自行上传进行判断
                if(data[k].image.indexOf('http:') > -1) {
                  $oImg.attr('src',data[k].image).attr('alt',data[k].image);
                }else {
                  // 本地上传音乐图片
                  $oImg.attr('src','/upload/music/'+data[k].image).attr('alt',data[k].image);
                }
              }
            }
            // 修改新碟榜标题更多的超链接URL
            $('#newAlbums .class-top > a').attr('href','/music/results?cat='+ results.data._id +'&p=0');
          // 如果切换的标题没有数据返回，则删除全部歌曲内容
          }else {
            $('#newAlbums .thumbnail').remove();
          }
        });
        // 点击当前新歌版分类添加on样式，其余删除该样式
        $(this).addClass('on').siblings('li').removeClass('on');
      }
    });

    /*
      近期热门歌单区点击切换榜单内容事件
     */
    $('#hotProgrammes').on('click','li',function() {
      // 只有点击不同按钮才触发Ajax事件，避免对同一个按钮重复点击触发请求
      if($(this).is('.on')){
        return;
      }else{
        var hotProName = $(this).text();                    // 获取按钮文字内容
        // 对中文进行编码
        var URL = '/musicindex?hotProName='+encodeURIComponent('近期热门歌单'+hotProName);
        // 发送Ajax请求
        funAjax(URL,'GET',function(results) {
          var dataCars = results.data;                      // 获取Ajax返回的音乐分类数据
          var oThumbnail = $('#hotProgrammes .thumbnail');  // 获取当前音乐分类中歌单数量
          if(dataCars) {
            // 如果切换后的歌单数量小于当前音乐分类中歌单数量，将多余的歌单节点删除
            if(dataCars.length < oThumbnail.length) {
              var dataStart = dataCars.length - 1;
              $('#hotProgrammes .thumbnail:gt(' + dataStart + ')').remove();
            // 返回音乐分类中歌单数量多于原歌单数量则创建新的节点
            }else {
              for(var k = oThumbnail.length; k < dataCars.length; k++) {
                $('#hotProgrammes .panel-body').append('<div class="thumbnail"><div class="inner"><h5><a target="_blank"></a></h5><div class="content"><img src="" alt="" /></div></div></div>');
              }
            }
            oThumbnail = $('#hotProgrammes .thumbnail');  // 重新获取歌曲分类中歌单的数量
            // 将原音乐链接、标题和海报换成切换后音乐数据相应内容
            for(var i = 0; i < dataCars.length; i ++) {
              // 替换歌单标题名称和链接
              $(oThumbnail[i]).find('h5 a').html(dataCars[i].name).attr('href','/music/results?cat=' + dataCars[i]._id + '&p=0');
              // 查找每个歌单中原歌曲数目
              var oALen = $(oThumbnail[i]).find('.content a').length,
                  len = dataCars[i].musics.length;  
              // 如果返回的歌单中歌曲数量小于切换前，则将多出歌曲节点删除
              if(len < oALen) {
                var oThumbnailRemove = dataCars[i].musics.length > 0 ? $(oThumbnail[i]).find('.content a:gt('+ (dataCars[i].musics.length - 1) +')') : $(oThumbnail[i]).find('.content a') ;
                oThumbnailRemove.remove();
                // 删除歌单中的...的span标签
                $('#hotProgrammes .thumbnail:eq('+ i +') span' ).remove();
              // 返回的歌曲数量大于原歌单中歌曲数量则创建新歌曲节点
              }else if(len > oALen) {
                for(var z = 0; z < len - oALen; z++){
                  $('#hotProgrammes .thumbnail:eq('+ i +') .inner .content').append('<a href =/music/'+ dataCars[i].musics[z]._id +' target =_blank title = '+  dataCars[i].musics[z].title +'><p>'+ (z + 1) + '.' + dataCars[i].musics[z].title +'</p></a>');
                }
                // 当每个歌单中歌曲数量大于2首时显示...省略号
                if(dataCars[i].musics.length > 2){
                  $('#hotProgrammes .thumbnail:eq('+ i +') .inner .content').append('<span>...</span>');
                }
              }
              // 歌单中歌曲数量相同，则只替换相应内容，节点数量不变
              for(var j = 0; j < dataCars[i].musics.length; j++) {
                $(oThumbnail[i]).find('.content a:eq('+ j +')').attr('href','/music/' + dataCars[i].musics[j]._id).attr('title',dataCars[i].musics[j].title);
                $(oThumbnail[i]).find('p:eq('+ j +')').html((j + 1) + '.' + dataCars[i].musics[j].title);
              }
              var $oImg = $(oThumbnail[i]).find('img');
              // 判断每个歌单海报是否存在及是否是自行上传
              if(dataCars[i].musics[0]) {
                if(dataCars[i].musics[0].image.indexOf('http:') > -1){
                  $oImg.attr('src',dataCars[i].musics[0].image).attr('alt',dataCars[i].musics[0].image).attr('style','display: inline');
                }else{
                  // 自行上传的海报图片路径不同
                  $oImg.attr('src','/upload/music/'+dataCars[i].musics[0].image).attr('alt',dataCars[i].musics[0].image).attr('style','display: inline');
                }
              }else {
                $oImg.attr('style','display: none');  // 若歌单中没有内容则隐藏img标签
              }
            }
            // 修改近期热门歌单标题更多的超链接URL
            $('#hotProgrammes .class-top > a').attr('href','/music/results?pro='+ results.dataPro._id +'&p=0');
          }else {
            // 若没有数据返回则清空内容
            $('#hotProgrammes .thumbnail').remove();
          }
        });
        //给当前点击的歌曲分类添加on样式，其他删除样式
        $(this).addClass('on').siblings('li').removeClass('on');
      }
    });

    /*
      本周单曲榜区点击切换榜单内容事件
     */
    $('#hotArtistSongs .hot-artistTop').on('click','li',function() {
      // 只有点击不同按钮才触发Ajax事件，避免对同一个按钮重复点击触发请求
      if($(this).is('.on')){
        return;
      }else{
        var hotSongs = $(this).text();           		// 获取按钮文字内容
        // 对中文进行编码
        var URL = '/musicindex?hotSongs='+encodeURIComponent('本周单曲榜'+hotSongs);
        // 发送Ajax请求
        funAjax(URL,'GET',function(results) {
          if(results.data) {
            var data = results.data.musics;        // 获取Ajax返回的音乐分类数据
            var oLi = $('.hotArtist-songs li');    // 获取当前音乐列表中音乐数量
            // 如果返回音乐节点数量小于切换后的音乐节点数量，将多余的音乐节点删除
            if(data.length < oLi.length) {
              var dataStart = data.length - 1;    // 设置切换到另外分类后数据起始位置
              $('.hotArtist-songs li:gt('+ dataStart +')').remove();
            // 若返回分类的音乐数量大于原分类音乐节点数量则创建多出的节点
            }else if(data.length > oLi.length) {
              var oDataMin = data.length; 
              //返回内容多于原音乐数量的创建新的节点并赋值
              for(var j = oLi.length; j < oDataMin; j++) {
                $('.hotArtist-songs ul').append('<li><a href="" target="_blank"><img src="" alt=""><h5></h5><p></p><span class="order"></span></a></li>');
              }
            }
            // 切换前后节点数量相同，则只替换节点内容
            oLi = $('.hotArtist-songs li');          // 重新获取当前音乐列表中音乐数量
            for(var k = 0;k < oLi.length; k++) {
              if(data[k]) {
                //将原音乐连接、标题和海报换成切换后返回音乐数据相应内容
                $(oLi[k]).find('a').attr('href','/music/'+data[k]._id);
                $(oLi[k]).find('h5').html(data[k].title);
                $(oLi[k]).find('p').html(data[k].singer+'&nbsp;/&nbsp;'+data[k].pv+'次播放');
                $(oLi[k]).find('span').html(k+1);
                var $oImg = $(oLi[k]).find('img');
                //对音乐海报是否是自行上传进行判断
                if (data[k].image) {
                  if(data[k].image.indexOf('http:') > -1) {
                    $oImg.attr('src',data[k].image).attr('alt',data[k].image);
                  }else {
                    //自行上传的海报图片路径不同
                    $oImg.attr('src','/upload/music/'+data[k].image).attr('alt',data[k].image);
                  }
                }
              }
            }
          }else {
            // 若没有数据返回则清空内容
            $('#hotArtistSongs .hotArtist-songs li').remove();
          }
        });
      }
      // 给当前点击的音乐标题添加on样式，其余删除该样式
      $(this).addClass('on').siblings('li').removeClass('on');
    });
  })();
});

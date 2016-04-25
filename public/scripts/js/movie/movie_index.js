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

  // 电影主页函数
  var movieIndexFun = (function() {
    var oCol6_width = $('.col-md-6').width();           // 获取主页左边区域布局对象
    /*
        即将上映和正在上映点击切换事件
    */
    var gallerySwitch = (function() {
      var $oPanel = $('#scrollMoives .panel'),          // 获取顶部轮播图面板对象
          $oTitle = $('#headerNow span'),               // 获取即将上映标题对象
          page = 1,                                     // 初始页码
          $oLeft = $('#scrollMoives .slide-prev'),      // 获取左箭头按钮
          $oRight = $('#scrollMoives .slide-next'),     // 获取右箭头按钮
          $oThumbnail = $('#scrollMoives .thumbnail'),  // 获取电影对象
          len = $oThumbnail.length;                     // 即将电影轮播展示区电影总数

      var windowWidth = $(window).width();              // 获取当前视口宽度
      // 如果当前视口宽度小于768，则上映电影区域每个版面展示3张电影
      if (windowWidth < 768) {
        var pageTotal = Math.ceil(len / 3);             // 即将电影轮播展示区总页数
        // 获取海报的外边距，并给计算每张海报应赋予的宽度值
        var marginWidth = $oThumbnail.outerWidth(true) - $oThumbnail.outerWidth();
        var oThumbnailWidth = (oCol6_width - marginWidth * 3) / 3;
      // 否则上映电影区域每个版面展示4张电影
      }else {
        var pageTotal = Math.ceil(len / 4);             // 即将电影轮播展示区总页数
        var marginWidth = $oThumbnail.outerWidth(true) - $oThumbnail.outerWidth();
        var oThumbnailWidth = (oCol6_width - marginWidth * 4) / 4;
      }
      // 设置两个电影展示区总页数
      $('#scrollMoives .side-max').html(pageTotal);
      // 设置电影展示区总宽度
      $('#screenBody').width(oCol6_width * pageTotal);

      // 设置每张轮播海报图片的宽度
      $oThumbnail.width(oThumbnailWidth);

      // 点击电影展示区正在上映或即将上映标题发送Ajax请求切换电影展示内容
      $oTitle.on('click',function() {
        var galleryName = $(this).text();               // 获取点击标题内容
        var URL = '/?galleryName=' + encodeURIComponent(galleryName);

        funAjax(URL,'GET',function(results) {
          var data = results.data || [],                // 返回正在上映或即将上映电影数据
              dataMov = data.movies,
              dataLength = data.movies.length;          // 请求返回的电影数量
          $('#headerNow a').attr('href','/movie/results?cat=' + data._id + '&p=0').text(data.name);                      // 设置标题名称
          // 切换副标题名称
          if(galleryName === '即将上映'){
            $oTitle.text('正在上映');
          }else{
            $oTitle.text('即将上映');
          }
          // 如果切换后电影列表数量小于原电影数量,则将多余节点删除
          if(dataLength < $oThumbnail.length) {
            $('#scrollMoives .thumbnail:gt('+ (dataLength -1) +')').remove();
          // 如果切换后电影列表数量大于原电影数量,则创建多出的节点
          }else if(dataLength > $oThumbnail.length) {
            for(var j = $oThumbnail.length; j < dataLength; j++) {
              $('#screenBody').append('<div class="thumbnail scroll-item"><a href="" target="_blank"><img src="" alt="" /></a><div class="caption"><h5></h5><p><a class="btn btn-primary" href="" role="button">观看预告片</a></p></div></div>');
            }
            // 给新添加的电影节点设置宽度
            $('#screenBody .thumbnail:gt('+ ($oThumbnail.length - 1)  +')').width(oThumbnailWidth);
          }
          $oThumbnail = $('#scrollMoives .thumbnail');      // 重新获取电影对象
          // 重新获取轮播展示区电影数量及总页数
          len = $oThumbnail.length;

          windowWidth = $(window).width();              // 获取当前视口宽度
          // 如果当前视口宽度小于768，则上映电影区域每个版面展示3张电影
          if (windowWidth < 768) {
            pageTotal = Math.ceil(len / 3);             // 即将电影轮播展示区总页数
            // 获取海报的外边距，并给计算每张海报应赋予的宽度值
            marginWidth = $oThumbnail.outerWidth(true) - $oThumbnail.outerWidth();
            oThumbnailWidth = (oCol6_width - marginWidth * 3) / 3;
          // 否则上映电影区域每个版面展示4张电影
          }else {
            pageTotal = Math.ceil(len / 4);             // 即将电影轮播展示区总页数
            marginWidth = $oThumbnail.outerWidth(true) - $oThumbnail.outerWidth();
            oThumbnailWidth = (oCol6_width - marginWidth * 4) / 4;
          }
          // 设置两个电影展示区总页数
          $('#scrollMoives .side-max').html(pageTotal);
          // 设置电影展示区总宽度
          $('#screenBody').width(oCol6_width * pageTotal);

          // 经过上面添加或删除节点操作后节点数量相同，下面只替换节点内容
          for(var k = 0; k < $oThumbnail.length; k++) {
            if (dataMov[k]) {
              $($oThumbnail[k]).find('a').attr('href','/movie/' + dataMov[k]._id);
              $($oThumbnail[k]).find('h5').html(dataMov[k].title);
              var $oImg = $($oThumbnail[k]).find('img');
              // 对电影海报是否是自行上传进行判断
              if(dataMov[k].poster) {
                if(dataMov[k].poster.indexOf('http:') > -1) {
                  $oImg.attr('src',dataMov[k].poster).attr('alt',dataMov[k].poster);
                }else {
                  //自行上传的海报图片路径不同
                  $oImg.attr('src','/upload/movie/'+dataMov[k].poster).attr('alt',dataMov[k].poster);
                }
              }
            }
          }
          // 如果点电影标题切换前所在页码page大于切换后总页码pagaCount
          // 则需要将page修改为pageTotal，即切换后最后页，并移动到最后页
          if(page > pageTotal){
            page = pageTotal;
            $('#scrollMoives .side-index').html(page);
            $('#screenBody').animate({left:-oCol6_width * (page-1)},0);
          }
        });
      });

      // 顶部电影轮播展示区滚动函数
      function funMoving(direction) {
        // 获取整个电影区域宽度
        var pageWidth = (pageTotal - 1) * oCol6_width;
        // 判断是否有滚动动画在执行，防止动画叠加
        if(!$('#screenBody').is(':animated')) {
          // 向右移动
          if(direction === 'right') {
            if(page === pageTotal) {
              page = 1;
              // 设置显示当前电影页码
              $('#scrollMoives .side-index').html(page);
              $('#screenBody').animate({left:0},500);
            }else {
              page ++;
              $('#scrollMoives .side-index').html(page); //设置显示当前电影页码
              // 找到单击元素所在电影滚动面板元素
              $('#screenBody').animate({left:'-='+oCol6_width},500);
            }
          // 向左移动
          }else {
            if(page === 1) {
              page = pageTotal;
              $('#scrollMoives .side-index').html(page);
              $('#screenBody').animate({left:'-='+pageWidth},500);
            }else {
              page --;
              $('#scrollMoives .side-index').html(page);
              // 找到单击元素所在电影滚动面板元素
              $('#screenBody').animate({left:'+='+oCol6_width},500);
            }
          }
        }
      }

      /* 动画事件 */

      // 点击右箭头
      $oRight.on('click',function() {
        funMoving('right');
      });

       // 点击左箭头
      $oLeft.on('click',function() {
        funMoving('left');
      });
      // 定时器，电影展示区每隔5s向右滚动一次
      var timer = setInterval(function() {
        funMoving('right');
      },5000);
      // 当鼠标划入电影展示区时动画停止，移开时重新开始运动
      $('#scrollMoives').on('mouseover',function() {
        clearInterval(timer);
      }).on('mouseout',function(){
        timer = setInterval(function() {
          funMoving('right');
        },5000);
      });
    })();

    /*
        选电影/电视剧区JS代码
        导航栏点击事件
    */
    $('#fliterMovies .class-top').on('click','button',function() {
      // 只有点击不同按钮才触发Ajax事件，避免对同一个按钮重复点击触发请求
      if($(this).is('.btn-primary')) {
        return;
      }else {
        var fliterName = $(this).html();      // 获取按钮文字内容
        var URL = '/?fliterName=' + encodeURIComponent(fliterName + '电影');// 对中文进行编码
        // 发送Ajax请求
        funAjax(URL,'GET',function(results) {
          if (results.data === null || results.data.movies.length === 0) {
            $('#classBody').html('');
          }else {
            var data = results.data.movies;   						// 获取Ajax返回的电影数据
            var oThumbnail = $('#classBody .thumbnail');  // 获取电影列表中电影数量
            var dataStart = data.length - 1; 							// 获取切换到另外分类返回电影数据数量
            // 如果切换后返回的电影数量小于切换前原电影数量，则将多余的电影节点删除
            if(data.length < oThumbnail.length) {
              $('#fliterMovies .col-md-3:gt('+dataStart+')').remove();
            // 如果切换后返回的电影数量大于切换前原电影数量，则创建新节点
            }else if((data.length > oThumbnail.length)) {
              for(var i = oThumbnail.length; i<data.length; i++) {
                $('#classBody').append('<div class="col-md-3 col-sm-3 col-xs-4"><div class="thumbnail"><a href=""><img src="" alt="" /></a><div class="caption"><h5></h5></div></div></div>');
              }
            }
            oThumbnail = $('#classBody .thumbnail'); // 重新获取电影列表中电影数量
            // 原节点不变，只替换节点内容
            for(var j = 0; j < oThumbnail.length; j++) {
              // 将原电影连接、标题和海报换成切换后返回电影数据相应内容
              if (data[j]) {
                $(oThumbnail[j]).find('a').attr('href','/movie/' + data[j]._id);
                $(oThumbnail[j]).find('h5').html(data[j].title);
                var $oImg = $(oThumbnail[j]).find('img');
                // 判断海报是否存在即是否是自行上传
                if(data[j].poster) {
                  if(data[j].poster.indexOf('http:')>-1){
                    $oImg.attr('src',data[j].poster).attr('alt',data[j].poster);
                  }else{
                    // 自行上传的海报图片路径不同
                    $oImg.attr('src','/upload/movie/'+data[j].poster).attr('alt',data[j].poster);
                  }
                }
              }
            }
          }
        });
        // 给当前点击的电影按钮添加primary样式并删除default样式
        $(this).addClass('btn-primary').removeClass('btn-default').parent().siblings().children().addClass('btn-default').removeClass('btn-primary');
      }
    });

    /*
        热门推荐部分
     */
    var galleryFrames = (function(){
      var page = 1,                                     // 页码变量
          $oLeft = $('#galleryFrames .slide-prev'),     // 向左箭头
          $oRight = $('#galleryFrames .slide-next'),    // 向右箭头
          len = $('#galleryFrames li').length,          // 热门推荐轮播图片数量
          $oUl = $('#galleryFrames ul'),                // 获取轮播图列表的对象
          $oItem = $('#galleryFrames .slide-item');     // 获取展示区对象
      // 设置轮播图总数量，因为在轮播图首位各有一张附属图，所以总数量要减去2张
      $('#galleryFrames .side-max').html(len-2);

      $oUl.width(oCol6_width * len);        // 设置热门推荐区轮播图片的总宽度
      $oUl.css('left',-oCol6_width);        // 设置轮播图显示第一张图片，偏移量为一张附属图宽度
      $oItem.width(oCol6_width);            // 设置每张轮播图片li的宽度

      // 轮播滚动函数，对作用方向进行不同移动
      function galleryMov(direction) {
        if(!$oUl.is(':animated')){
          if(direction === 'right'){
            page++;
            $('#galleryFrames .side-index').html(page);      // 设置当前页码
            $oUl.animate({left:'-='+oCol6_width},500);

            if(page === len - 1){
              page = 1;
              $('#galleryFrames .side-index').html(page);    // 设置当前页码
              $oUl.animate({left:-oCol6_width+'px'},0);
            }
          }else{
            page--;
            $('#galleryFrames .side-index').html(page);       // 设置当前页码
            $oUl.animate({left:'+='+oCol6_width},500);

            if(page === 0){
              page = len - 2;
              $('#galleryFrames .side-index').html(page);     // 设置当前页码
              $oUl.animate({left:-(oCol6_width * (len -2))+'px'},0);
            }
          }
        }
      }

      //向右切换
      $oRight.on('click',function(){
        galleryMov('right');
      });
      //向左切换
      $oLeft.on('click',function(){
        galleryMov('left');
      });

      //定时器，每5秒钟向右切换一张图片
      var timer = setInterval(function(){
        galleryMov('right');
      },5000);
      //当鼠标移入轮播图时图片停止滚动，鼠标移开重新开始移动
      $('#galleryFrames').on('mouseover',function(){
        clearTimeout(timer);
      }).on('mouseout',function(){
        timer = setInterval(function(){
          galleryMov('right');
        },5000);
      });
    })();

    /*
        电影院搜索
    */
    var cinemasSearch = (function(){
      var $city = $('#citySearch'),                           // 电影院所在城市
          $cList = $('#citiesList'),                          // 全国各城市名称列表
          $citySug = $('#citySug'),                           // 电影院对象
          $citySugList = $('#citySug .city-suggestion-list'), // 电影院名称列表对象
          $cityTip = $('#citySug .auto-tip'),                 // 可售票影院列表ul对象
          $citySugInput = $('#citySug input');                // 可售票影院搜索框对象
      // 设置可售票影院列表宽度
      $cList.outerWidth($city.width() + $citySug.width());

      // 选择电影院所在城市
      $city.children('span').on('click',function() {
        if($cList.css('display') === 'none'){
          $cList.css('display','block');
        }else{
          $cList.css('display','none');
        }
      });

      // 选择城市所在的分类标题
      $('.cities-list-hd').on('click','li',function() {
        var index = $(this).attr('index');                  // 当前选择的是哪个范围城市
        $(this).addClass('on').siblings().removeClass('on');// 城市头部添加样式
        $cList.find('.cities-list-item').eq(index-1).addClass('active')
            .siblings().removeClass('active');    // 添加active样式，让其点击范围的城市显示
      });

      // 切换当前城市事件
      $('#citiesList .cities-list-item').on('click','a',function() {
        $city.children('span').html($(this).html());     // 点击城市名替换默认的广州城市
        $cList.css('display','none');                    // 城市列表隐藏
        $citySugInput.val('');                           // 每次切换城市时搜索框中关键字清空
      });

      // 获取城市电影院函数
      function funGetCityCinemas() {
        var cityName = $city.children('span').text(),
            searchName = $citySugInput.val(),
            URL = '/?cityName='+encodeURIComponent(cityName)+'&&search='+encodeURIComponent(searchName);
        // 发送Ajax请求
        funAjax(URL,'GET',function(results) {
          var data = results || [];
          $cityTip.html('');                      // 每次添加影院列表前先清空电影院列表，避免叠加
          for(var i = 0;i < data.length; i++) {
            $cityTip.append('<li><a href="javascript:;">' + data[i] + '</a></li>');
          }
          // 显示影院列表
          $citySugList.css('display','block');
        });
      }

      // 电影院搜索框获得焦点时发送Ajax请求该城市的电影院
      $citySugInput.on('focus',function() {
        funGetCityCinemas();
        $cList.css('display','none');            // 当电影院搜索框获得焦点时要隐藏城市列表框
      });

      // 当电影院搜索框中监听到键盘事件时将输入的影院名称发送给服务器
      $citySugInput.keyup(function(event) {
          funGetCityCinemas();
      });

      // 选择影院
      $citySugList.on('mousedown','a',function() {
        $citySugInput.val($(this).html());
        $citySugList.css('display','none');
      });

      // 输入框失去焦点时隐藏影院列表
      $citySugInput.on('blur',function() {
        $citySugList.css('display','none');
      });
    })();
  })();
});

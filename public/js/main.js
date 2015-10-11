$(function(){
	//即将上映和正在上映区域事件
	var galleryTop = function(){
		var page = 1;  //初始页码
		var oScreenBody = $('#m-screenTop').find('.m-screenBody');
		var lenSo = $(oScreenBody[0]).find('.thumbnail').length;//即将上映展示区电影总数
		var lenNow = $(oScreenBody[1]).find('.thumbnail').length;//正在上映展示区电影总数
		var pageCountSo = Math.ceil(lenSo / 4);            //即将上映展示区总页数
		var pageCountNow = Math.ceil(lenNow / 4);          //正在上映展示区总页数
		var panelWidth = $('.panel').width();			   //获取电影显示区宽度
		var $oRight = $('#m-screenTop .glyphicon-chevron-right');
		var $oLeft = $('#m-screenTop .glyphicon-chevron-left');

		$(oScreenBody[0]).width(panelWidth * pageCountSo); //设置即将上映展示区总宽度
		$(oScreenBody[1]).width(panelWidth * pageCountNow); //设置即将上映展示区总宽度

		//设置两个电影展示区总页数
		$(oScreenBody[0]).parents('.panel').find('.ui-side-max').html(pageCountSo);
		$(oScreenBody[1]).parents('.panel').find('.ui-side-max').html(pageCountNow);

		//$('#m-galleryFrames .ui-side-max').html()
		//点击右箭头
		$oRight.on('click',function(){
			var $panel = $(this).parents('.panel');	//获取点击按钮的父元素
			//如果当前点击的是即将上映区,则总页数等于pageCountSo，否则等于pageCountNow
			var pageCount = $panel.find('.thumbnail').length === lenSo ?	pageCountSo : pageCountNow; 
			//对当前电影区域是否有移动，如果没有移动点击才进行下一次动画移动，防止动画叠加
			//造成快速点击一个方向箭头动画会持续运动一段时间
			if(!$panel.find('.m-screenBody ').is(':animated')){
				if(page === pageCount){  
					page = 1;
					$(this).siblings('.ui-side-index').html(page);//设置显示当前电影页码
					$panel.find('.m-screenBody').animate({left:0},700);
				}else{
					page++;
					$(this).siblings('.ui-side-index').html(page);//设置显示当前电影页码
					//找到单击元素所在电影滚动面板元素
					$panel.find('.m-screenBody').animate({left:'-='+panelWidth},700);

				}				
			}
		});
		//点击左箭头
		$oLeft.on('click',function(){
			var $panel = $(this).parents('.panel');	//获取点击按钮的父元素
			//如果当前点击的是即将上映区,则总页数等于pageCountSo，否则等于pageCountNow
			var pageCount = $panel.find('.thumbnail').length === lenSo ?	pageCountSo : pageCountNow; 
			//获取整个电影区域宽度，注意和panelWidth区别，panelWidth是4个电影海报所占宽度
			//而panelWidth是一个分类全部电影海报所占宽度
			var pageWidth = (pageCount - 1) * panelWidth;
			//对当前电影区域是否有移动，如果没有移动点击才进行下一次动画移动，防止动画叠加
			//造成快速点击一个方向箭头动画会持续运动一段时间
			if(!$panel.find('.m-screenBody ').is(':animated')){
				if(page === 1){  
					page = pageCount;
					$(this).siblings('.ui-side-index').html(page);
					$panel.find('.m-screenBody').animate({left:'-='+pageWidth},700);
				}else{
					page--;
					$(this).siblings('.ui-side-index').html(page);
					//找到单击元素所在电影滚动面板元素
					$panel.find('.m-screenBody').animate({left:'+='+panelWidth},700);
					
				}
			}
		});

	};
	galleryTop();

	//选电影/电视剧区JS代码
	//导航栏点击事件
	$('#classTop').on('click','button',function(){

		//只有点击样式为primary的按钮才触发Ajax事件，避免对同一个按钮重复点击触发请求
		if($(this).is('.btn-primary')){	
			return;
		}else{
			var className = $(this).html();      //获取按钮文字内容
			$.ajax({
				url:'/?className='+encodeURIComponent(className+'电影') ,//对中文进行编码
				cache:true,
				type:'GET',
				crossDomain:true,
			})
			.done(function(results){
				var data = results.data.movies;   //获取Ajax返回的电影数据
				var oThumbnail = $('#classBody .thumbnail'); //获取电影列表中电影数量
				var dataStart = data.length - 1; //获取切换到另外分类返回电影数据数量
				//对略缩图内容进行替换
				//
				if(data.length <= oThumbnail.length){
					//如果当前电影列表数量大于切换到另个分类返回的电影数量，将多余的电影节点删除
					$('#screenClass .col-md-3:gt('+dataStart+')').remove();					
					for(var i=0;i<data.length;i++){
						//将原电影连接、标题和海报换成切换后返回电影数据相应内容
						$(oThumbnail[i]).find('a').prop('href',data[i]._id);
						$(oThumbnail[i]).find('h5').html(data[i].title);
						var $oImg = $(oThumbnail[i]).find('img');
						
						//对电影海报是否是自行上传进行判断
						if(data[i].poster.indexOf('http:')>-1){
							$oImg.prop('src',data[i].poster).prop('alt',data[i].poster);
						}else{
						//自行上传的海报图片路径不同	
							$oImg.prop('src','/upload/'+data[i].poster).prop('alt',data[i].poster);
						}				
					}
				}else{
					//返回的分类电影数量大于原分类电影数量节点则创建多出的节点
					//原节点不变，只替换节点内容
					for(var k=0;k<oThumbnail.length;k++){
						//将原电影连接、标题和海报换成切换后返回电影数据相应内容
						$(oThumbnail[k]).find('a').prop('href',data[k]._id);
						$(oThumbnail[k]).find('h5').html(data[k].title);
						var $oImg2 = $(oThumbnail[k]).find('img');
						
						//对电影海报是否是自行上传进行判断
						if(data[k].poster.indexOf('http:')>-1){
							$oImg2.prop('src',data[k].poster).prop('alt',data[k].poster);
						}else{
						//自行上传的海报图片路径不同	
							$oImg2.prop('src','/upload/'+data[k].poster).prop('alt',data[k].poster);
						}							
					}
					//返回内容多于原电影数量的创建新的节点并赋值
					for(var j=oThumbnail.length;j<data.length;j++){
						$('#classBody').append('<div class="col-md-3"><div class="thumbnail"><a href="/movie/'+data[j]._id+'"></a><div class="caption"><h5>'+data[j].title+'</h5></div></div></div>');
						//对是否是原海报还是自行上传的海报图片进行判断
						if(data[j].poster.indexOf('http:') > -1){
							//对该ID下等于j的a标签添加海报图片，避免对全部a标签都添加图片
							$('#classBody a:eq('+j+')').append('<img src='+data[j].poster+' alt='+data[j].title+'>');
						}else{
							$('#classBody a.thumbnail').append('<img src=/upload/'+data[j].poster+' alt='+data[j].title+'>');
						}
					}

				}
				
			});			
		}
		//给当前点击的电影按钮添加primary样式并删除default样式
		//其他button按钮添加default及删除primary样式
		$(this).addClass('btn-primary').removeClass('btn-default').siblings('button').addClass('btn-default').removeClass('btn-primary');

	});

	//热门推荐 #m-galleryFrames
	var galleryFrames = function(){
		//向右切换点击事件
		var page = 1;   //页码变量
		var $oRight = $('#m-galleryFrames .glyphicon-chevron-right');//向右箭头
		var $oLeft = $('#m-galleryFrames .glyphicon-chevron-left');//向左箭头
		var len = $('#m-galleryFrames li').length;//总共热门推荐轮播图数量
		var $oUl = $('#m-galleryFrames ul');
		var galleryWidth = $('#m-galleryFrames li').width();//单个轮播图宽度
		//设置轮播图总数量，因为在轮播图首位各有一张附属图，所以总数量要减去2张
		$('#m-galleryFrames .ui-side-max').html(len-2);  

		$oRight.on('click',function(){		
			if(!$oUl.is(':animated')){
				page++;
				$('#m-galleryFrames .ui-side-index').html(page);//设置当前页码
				$oUl.animate({left:'-='+galleryWidth},700);

				if(page === len - 1){
					page = 1;
					$('#m-galleryFrames .ui-side-index').html(page);//设置当前页码
					$oUl.animate({left:-578+'px'},0);
				}
			}	
		});
		$oLeft.on('click',function(){
			if(!$oUl.is(':animated')){
				page--;
				$('#m-galleryFrames .ui-side-index').html(page); //设置当前页码
				$oUl.animate({left:'+='+galleryWidth},700);

				if(page === 0){
					page = len - 2;
					$('#m-galleryFrames .ui-side-index').html(page);//设置当前页码
					$oUl.animate({left:-2312+'px'},0);
				}
			}		
		});
	};
	galleryFrames();

	// 电影院搜索
	var cinemasSearch = function(){
		//选择电影院城市点击事件
		$('#cityId').on('click',function(){
			var $cList = $('#citiesList');
			if($cList.css('display') === 'none'){
				$cList.css('display','block');
			}else{
				$cList.css('display','none');
			}
		});

		//切换城市列表头部事件
		$('.cities-list-hd').on('click','span',function(){
			$(this).addClass('on').siblings().removeClass('on');//城市头部添加样式
			var index = $(this).attr('index');//当前点击的是那个范围城市span
			$('#citiesList').find('.cities-list-item').eq(index-1).addClass('active').siblings().removeClass('active');//添加active样式，让其点击范围的城市显示
		});

		//切换当前城市事件
		$('#citiesList .cities-list-item').on('click','a',function(){
			$('#cityId').html($(this).html());   //点击城市名替换默认的广州城市
			$('#citiesList').css('display','none');//城市列表隐藏
		});

		//Ajax请求具体城市电影院
		$('#citySug input').focus(function(){
			var cityName = $('#cityId').html();
			$.ajax({
				url:'/?cityName='+encodeURIComponent(cityName) ,//对中文影院名进行编码
				cache:true,
				type:'GET',
				crossDomain:true,				
			})
			.done(function(results){
				var data = results.data.name;
				for(var i=0;i<data.length;i++){
					$('#citySug .auto-tip').append("<li><a>" + data[i] + "</a></li>");
				}
			});
		});
	};
	cinemasSearch();
});
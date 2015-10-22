$(function(){
	/* 
		即将上映和正在上映点击切换事件
	*/
	var gallerySwitch = (function(){
		var $oSpan = $('#headerNow span');
		var $oPanel = $('#m-screenTop .panel');	
		var page = 1;  //初始页码		
		//获取左右按钮
		var $oRight = $('#m-screenTop .glyphicon-chevron-right'); 
		var $oLeft = $('#m-screenTop .glyphicon-chevron-left');
		var panelWidth = $oPanel.width();	 //获取电影显示区宽度
		var oThumbnail = $('#m-screenTop .thumbnail');//获取电影数量
		var len = oThumbnail.length;//即将上映展示区电影总数
		var pageCount = Math.ceil(len / 4);            //即将上映展示区总页数
		//设置两个电影展示区总页数
		$('#m-screenTop .ui-side-max').html(pageCount);
		//设置电影展示区总宽度
		$('#screenBody').width(panelWidth * pageCount); 
		//点击电影展示区标题发送Ajax请求切换电影展示内容
		$oSpan.on('click',function(){			
			var galleryName = $(this).text();  //获取点击标题内容
			var URL = '/?galleryName=' + encodeURIComponent(galleryName);

			funAjax(URL,'GET',function(results){
				var data = results.data || [];
				var dataMov = data.movies;
				var dataLength = data.movies.length;
				$('#headerNow a').attr('href','/results?cat='+data._id+'&p=0').text(data.name);
				//切换名称
				if(galleryName === '即将上映'){
					$oSpan.text('正在上映');
				}else{
					$oSpan.text('即将上映');
				}

				if(dataLength < oThumbnail.length){
					//如果当前电影列表数量大于切换到另个分类返回的电影数量，将多余的电影节点删除
					$('#m-screenTop .thumbnail:gt('+dataLength+')').remove();
					for(var i=0;i<dataLength;i++){
						//将原电影连接、标题和海报换成切换后返回电影数据相应内容
						$(oThumbnail[i]).find('a').attr('href',dataMov[i]._id);
						$(oThumbnail[i]).find('h5').html(dataMov[i].title);
						var $oImg = $(oThumbnail[i]).find('img');
						
						//对电影海报是否是自行上传进行判断
						if(dataMov[i].poster.indexOf('http:')>-1){
							$oImg.attr('src',dataMov[i].poster).attr('alt',dataMov[i].poster);
						}else{
						//自行上传的海报图片路径不同	
							$oImg.attr('src','/upload/'+dataMov[i].poster).attr('alt',dataMov[i].poster);
						}				
					}								
				}else{
					//返回的分类电影数量大于原分类电影数量节点则创建多出的节点
					//原节点不变，只替换节点内容
					for(var k=0;k<oThumbnail.length;k++){
						//将原电影连接、标题和海报换成切换后返回电影数据相应内容
						$(oThumbnail[k]).find('a').attr('href',dataMov[k]._id);
						$(oThumbnail[k]).find('h5').html(dataMov[k].title);
						var $oImg2 = $(oThumbnail[k]).find('img');
						
						//对电影海报是否是自行上传进行判断
						if(dataMov[k].poster.indexOf('http:')>-1){
							$oImg2.attr('src',dataMov[k].poster).attr('alt',dataMov[k].poster);
						}else{
						//自行上传的海报图片路径不同	
							$oImg2.attr('src','/upload/'+dataMov[k].poster).attr('alt',dataMov[k].poster);
						}							
					}
					// console.log(oThumbnail.length,dataLength);
					//返回内容多于原电影数量的创建新的节点并赋值
					for(var j=oThumbnail.length;j<dataLength;j++){
						$('#screenBody').append('<div class="thumbnail"><a href="/movie/'+dataMov[j]._id+'"></a><div class="caption"><h5>'+dataMov[j].title+'</h5></div></div>');
						//对是否是原海报还是自行上传的海报图片进行判断
						if(dataMov[j].poster.indexOf('http:') > -1){
							//对该ID下等于j的a标签添加海报图片，避免对全部a标签都添加图片
							$('#screenBody .thumbnail:eq('+j+') a').append('<img src='+dataMov[j].poster+' alt='+dataMov[j].title+'>');
						}else{
							$('#screenBody .thumbnail:eq('+j+') a').append('<img src=/upload/'+data[j].poster+' alt='+data[j].title+'>');
						}
					}
				}
				panelWidth = $oPanel.width();	 //获取电影显示区宽度
				oThumbnail = $('#m-screenTop .thumbnail');//获取电影数量
				len = oThumbnail.length;//即将上映展示区电影总数
				pageCount = Math.ceil(len / 4);            //即将上映展示区总页数
				/*
					如果点电影标题切换前所在页码page大于切换切换后总页码pagaCount
					则需要将page修改为pageCount，即切换后最后页，并移动到最后页
				 */
				if(page > pageCount){
					page = pageCount;
					$('#m-screenTop .ui-side-index').html(page);
					$('#screenBody').animate({left:-panelWidth * (page-1)},0); 
				}
				//设置两个电影展示区总页数
				$('#m-screenTop .ui-side-max').html(pageCount);
				//设置电影展示区总宽度
				$('#screenBody').width(panelWidth * pageCount); 
			});	
		});
	
		//点击右箭头
		$oRight.on('click',function(){
			funMoving('right');
		});	

	 	//点击左箭头
		$oLeft.on('click',function(){
			funMoving('left');
		});	
		//定时器，电影展示区每隔5s向右滚动一次
		var timer = setInterval(function(){
			funMoving('right');
		},5000);
		//当鼠标划入电影展示区时动画停止，移开时重新开始运动
		$('#m-screenTop').on('mouseover',function(){
			clearInterval(timer);
		}).on('mouseout',function(){
			timer = setInterval(function(){
				funMoving('right');
			},5000);
		});	

		//顶部电影展示区滚动函数 
		function funMoving(direction){
			//获取整个电影区域宽度，注意和panelWidth区别，panelWidth是4个电影海报所占宽度
			//而panelWidth是一个分类全部电影海报所占宽度
			var pageWidth = (pageCount - 1) * panelWidth;
			//对当前电影区域是否有移动，如果没有移动点击才进行下一次动画移动，防止动画叠加
			//造成快速点击一个方向箭头动画会持续运动一段时间
			if(!$('#screenBody').is(':animated')){
				//向右移动
				if(direction === 'right'){
					if(page === pageCount){  
						page = 1;
						//设置显示当前电影页码
						$('#m-screenTop .ui-side-index').html(page);
						$('#screenBody').animate({left:0},700);
					}else{
						page++;
						$('#m-screenTop .ui-side-index').html(page);//设置显示当前电影页码
						//找到单击元素所在电影滚动面板元素
						$('#screenBody').animate({left:'-='+panelWidth},700);
					}
				//向左移动					
				}else{
					if(page === 1){  
						page = pageCount;
						$('#m-screenTop .ui-side-index').html(page);
						$('#screenBody').animate({left:'-='+pageWidth},700);
					}else{
						page--;
						$('#m-screenTop .ui-side-index').html(page);
						//找到单击元素所在电影滚动面板元素
						$('#screenBody').animate({left:'+='+panelWidth},700);					
					}
				}
			}		
		}
	})();

	/*
		选电影/电视剧区JS代码
		导航栏点击事件
	*/	
	$('#classTop').on('click','button',function(){
		
		//只有点击样式为primary的按钮才触发Ajax事件，避免对同一个按钮重复点击触发请求
		if($(this).is('.btn-primary')){	
			return;
		}else{
			var className = $(this).html();      //获取按钮文字内容
			var URL = '/?className='+encodeURIComponent(className+'电影');//对中文进行编码
			//发送Ajax请求
			funAjax(URL,'GET',function(results){
				var data = results.data.movies;   //获取Ajax返回的电影数据
				var oThumbnail = $('#classBody .thumbnail'); //获取电影列表中电影数量
				var dataStart = data.length - 1; //获取切换到另外分类返回电影数据数量
				//对略缩图内容进行替换
				if(data.length <= oThumbnail.length){
					//如果当前电影列表数量大于切换到另个分类返回的电影数量，将多余的电影节点删除
					$('#screenClass .col-md-3:gt('+dataStart+')').remove();					
					for(var i=0;i<data.length;i++){
						//将原电影连接、标题和海报换成切换后返回电影数据相应内容
						$(oThumbnail[i]).find('a').attr('href',data[i]._id);
						$(oThumbnail[i]).find('h5').html(data[i].title);
						var $oImg = $(oThumbnail[i]).find('img');
						
						//对电影海报是否是自行上传进行判断
						if(data[i].poster.indexOf('http:')>-1){
							$oImg.attr('src',data[i].poster).attr('alt',data[i].poster);
						}else{
						//自行上传的海报图片路径不同	
							$oImg.attr('src','/upload/'+data[i].poster).attr('alt',data[i].poster);
						}				
					}
				}else{
					//返回的分类电影数量大于原分类电影数量节点则创建多出的节点
					//原节点不变，只替换节点内容
					for(var k=0;k<oThumbnail.length;k++){
						//将原电影连接、标题和海报换成切换后返回电影数据相应内容
						$(oThumbnail[k]).find('a').attr('href',data[k]._id);
						$(oThumbnail[k]).find('h5').html(data[k].title);
						var $oImg2 = $(oThumbnail[k]).find('img');
						
						//对电影海报是否是自行上传进行判断
						if(data[k].poster.indexOf('http:')>-1){
							$oImg2.attr('src',data[k].poster).attr('alt',data[k].poster);
						}else{
						//自行上传的海报图片路径不同	
							$oImg2.attr('src','/upload/'+data[k].poster).attr('alt',data[k].poster);
						}							
					}
					//返回内容多于原电影数量的创建新的节点并赋值
					for(var j=oThumbnail.length;j<data.length;j++){
						$('#classBody').append('<div class="col-md-3"><div class="thumbnail"><a href="/movie/'+data[j]._id+'"></a><div class="caption"><h5>'+data[j].title+'</h5></div></div></div>');
						//对是否是原海报还是自行上传的海报图片进行判断
						if(data[j].poster.indexOf('http:') > -1){
							//对该ID下等于j的a标签添加海报图片，避免对全部a标签都添加图片
							$('#classBody .thumbnail:eq('+j+') a').append('<img src='+data[j].poster+' alt='+data[j].title+'>');
						}else{
							$('#classBody .thumbnail:eq('+j+') a').append('<img src=/upload/'+data[j].poster+' alt='+data[j].title+'>');
						}
					}

				}			
			});
		}
		//给当前点击的电影按钮添加primary样式并删除default样式
		//其他button按钮添加default及删除primary样式
		$(this).addClass('btn-primary').removeClass('btn-default').siblings('button').addClass('btn-default').removeClass('btn-primary');
	});

	/*
		热门推荐 #m-galleryFrames
	 */
	var galleryFrames = (function(){
		//向右切换点击事件
		var page = 1;   //页码变量
		var $oRight = $('#m-galleryFrames .glyphicon-chevron-right');//向右箭头
		var $oLeft = $('#m-galleryFrames .glyphicon-chevron-left');//向左箭头
		var len = $('#m-galleryFrames li').length;//总共热门推荐轮播图数量
		var $oUl = $('#m-galleryFrames ul');
		var galleryWidth = $('#m-galleryFrames li').width();//单个轮播图宽度
		//设置轮播图总数量，因为在轮播图首位各有一张附属图，所以总数量要减去2张
		$('#m-galleryFrames .ui-side-max').html(len-2);  
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
		$('#m-galleryFrames').on('mouseover',function(){
			clearTimeout(timer);
		}).on('mouseout',function(){
			timer = setInterval(function(){
				galleryMov('right');
			},5000);
		});
		//轮播滚动函数，对作用方向进行不同移动
		var galleryMov = function(direction){
			if(!$oUl.is(':animated')){
				if(direction === 'right'){
					page++;
					$('#m-galleryFrames .ui-side-index').html(page);//设置当前页码
					$oUl.animate({left:'-='+galleryWidth},700);

					if(page === len - 1){
						page = 1;
						$('#m-galleryFrames .ui-side-index').html(page);//设置当前页码
						$oUl.animate({left:-578+'px'},0);
					}					
				}else{
					page--;
					$('#m-galleryFrames .ui-side-index').html(page); //设置当前页码
					$oUl.animate({left:'+='+galleryWidth},700);

					if(page === 0){
						page = len - 2;
						$('#m-galleryFrames .ui-side-index').html(page);//设置当前页码
						$oUl.animate({left:-2312+'px'},0);
					}					
				}
			}
		};
	})();

	/* 
		电影院搜索 
	*/
	var cinemasSearch = (function(){
		var $cList = $('#citiesList');	
		var $citySug = $('#citySug .city-suggestion-list');
		var $cityTip = $('#citySug .auto-tip');
		var $cityInput = $('#citySug input');
		//选择电影院城市点击事件
		$('#cityId').on('click',function(){
			if($cList.css('display') === 'none'){
				$cList.css('display','block');
			}else{
				$cList.css('display','none');
			}
		});

		//切换城市列表头部事件
		$('.cities-list-hd').on('click','span',function(){
			var index = $(this).attr('index');//当前点击的是那个范围城市span
			$(this).addClass('on').siblings().removeClass('on');//城市头部添加样式
			$('#citiesList').find('.cities-list-item').eq(index-1).addClass('active').siblings().removeClass('active');//添加active样式，让其点击范围的城市显示
		});

		//切换当前城市事件
		$('#citiesList .cities-list-item').on('click','a',function(){
			$('#cityId').html($(this).html());   //点击城市名替换默认的广州城市
			$('#citiesList').css('display','none');//城市列表隐藏
			$cityInput.val('');					   //每次切换城市时搜索框中关键字清空
		});

		//输入框获得焦点时发送Ajax请求具体城市电影院
		$cityInput.on('focus',function(){
			//获取城市名称并发送Ajax请求该城市的影院
			var cityName = $('#cityId').html();  
			var searchName = $(this).val();  //获取影院搜索框中的文本值
			var URL;	//发送给服务器的URL地址
			//每次添加影院列表前先清空列表，避免叠加			
			$cityTip.html('');	
			//当搜索框中文本值为空时发送给服务器请求该城市全部影院名字	
			if(!$cityInput.val()){

				URL = '/?suggest='+encodeURIComponent(cityName);//对中文影院名进行编码
				funAjax(URL,'GET',function(results){

					//$cityTip.html('');					
					if(results.data){
						var data = results.data.name;		
						//将Ajax返回的数据添加到影院列表中
						for(var i=0;i<data.length;i++){
							$cityTip.append('<li><a href="javascript:;">' + data[i] + '</a></li>');
						}
						//显示影院列表
						$citySug.css('display','block');
					}
				});
			//当搜索框中存在用户输入的影院名字时发送带有关键字的影院名给服务器	
			}else{
				URL = '/?suggest='+encodeURIComponent(cityName)+'&&search='+encodeURIComponent(searchName);		//发送给服务器的URL地址
				//发送Ajax请求
				funAjax(URL,'GET',function(results){
					var data = results || [];
					//每次添加影院列表前先清空列表，避免叠加				
					//$cityTip.html('');
					for(var i=0;i<data.length;i++){
						$cityTip.append('<li><a href="javascript:;">' + data[i] + '</a></li>');
					}	
					//显示影院列表
					$citySug.css('display','block');					
				});				
			}
			//当监听到键盘事件时将输入的影院名称发送给服务器
			$cityInput.on('keyup',function(event){
				cityName = $('#cityId').html(); 
				searchName = $(this).val();
				URL = '/?suggest='+encodeURIComponent(cityName)+'&&search='+encodeURIComponent(searchName);	
				//当按下键盘空格键或1-9数字键时才发送Ajax请求
				if(49<event.keyCode && event.keyCode<57 || event.keyCode===32){
					//发送Ajax请求
					funAjax(URL,'GET',function(results){
					var data = results || [];
					//每次添加影院列表前先清空列表，避免叠加
					$cityTip.html('');
						for(var i=0;i<data.length;i++){
							$cityTip.append('<li><a href="javascript:;">' + data[i] + '</a></li>');
						}	
						//显示影院列表
						$citySug.css('display','block');						
					});							
				}
			});	
			//隐藏城市列表
			$('#citiesList').css('display','none');						
		});
		//选择影院
		$citySug.on('mousedown','a',function(){
			$cityInput.val($(this).html());
			$citySug.css('display','none');
		});

		//输入框失去焦点时隐藏影院列表
		$cityInput.on('blur',function(){
			$('#citySug .city-suggestion-list').css('display','none');
		});

	})();

	//Ajax请求函数
	var funAjax = function(URL,method,cb){
		$.ajax({
			url:URL,
			cache:true,
			type:method,
			crossDomain:true			
		}).done(cb);
	};

});
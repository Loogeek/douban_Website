$(function() {
	// 获取电影列表删除按钮类名，当点击删除按钮触发删除事件
	$('.movieDel').click(function(e) {
		var target = $(e.target),
				id = target.data('id'),  // 获取点击的id值
				tr = $('.item-id-' + id);// 获取点击删除按钮所在行

		$.ajax({
			type : 'DELETE',
			url : '/admin/movie/list?id=' + id
		})
		.done(function(result) {
			// 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
			if(result.success === 1 && tr) {
				tr.remove();
			}
		});
	});

	// 获取用户列表删除按钮类名，当点击删除按钮触发删除事件
	$('.userDel').click(function(e) {
		var target = $(e.target),
				id = target.data('id'),  // 获取点击的id值
				tr = $('.item-id-' + id);// 获取点击删除按钮所在行

		$.ajax({
			type : 'DELETE',
			url : '/admin/user/list?id=' + id
		})
		.done(function(result) {
			// 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
			if(result.success === 1 && tr) {
				tr.remove();
			}
		});
	});

	// 获取电影分类列表删除按钮类名，当点击删除按钮触发删除事件
	$('.ctyDel').click(function(e) {
		var target = $(e.target),
				id = target.data('id'),  // 获取点击的id值
				tr = $('.item-id-' + id);// 获取点击删除按钮所在行

		$.ajax({
			type : 'DELETE',
			url : '/admin/movie/category/list?id=' + id
		})
		.done(function(result) {
			// 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
			if(result.success === 1 && tr) {
				tr.remove();
			}
		});
	});

	// 获取影院列表删除按钮类名，当点击删除按钮触发删除事件
	$('.citydel').click(function(e) {
		var target = $(e.target),
				id = target.data('id'),  // 获取点击的id值
				tr = $('.item-id-' + id);// 获取点击删除按钮所在行

		$.ajax({
			type : 'DELETE',
			url : '/admin/movie/city/list?id=' + id
		})
		.done(function(result) {
			// 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
			if(result.success === 1 && tr) {
				tr.remove();
			}
		});
	});

  // 电影分类同步豆瓣api数据鼠标离开事件
	$('#doubanMovie').blur(function() {
		var id = $(this).val();
		if(id) {
			$.ajax({
				url:'http://api.douban.com/v2/movie/subject/' + id,
				cache:true,
				type:'get',
				dataType:'jsonp',
				crossDomain:true,
				jsonp:'callback'
			})
			.done(function(data) {
				$('#inputTitle').val(data.title);
          $('#inputDoctor').val(data.directors[0].name);
          $('#inputCountry').val(data.countries[0]);
          $('#inputPoster').val(data.images.large);
          $('#inputYear').val(data.year);
          $('#inputSummary').val(data.summary);
			});
		}
	});
});

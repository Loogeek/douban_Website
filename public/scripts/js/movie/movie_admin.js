'use strict';

$.support.cors = true;                                  // 解决IE8/9 Ajax跨域请求问题

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

  // 获取电影分类列表删除按钮类名，当点击删除按钮触发删除事件
  $('.ctyDel').click(function(e) {
    var target = $(e.target),
        id = target.data('id'),  // 获取点击的id值
        tr = $('.item-id-' + id);// 获取点击删除按钮所在行

    $.ajax({
      type: 'DELETE',
      url: '/admin/movie/movieCategory/list?id=' + id
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
        url: 'http://api.douban.com/v2/movie/subject/' + id,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback'
      })
      .done(function(data) {
        $('#inputTitle').val(data.title);                 // 标题
        $('#inputAka').val(data.aka[0]);                  // 又名
        $('#inputYear').val(data.year);                   // 上映时间
        $('#inputSummary').val(data.summary);             // 简介
        $('#inputCountry').val(data.countries[0]);        // 上映城市
        if(data.rating) {
          $('#inputRating').val(data.rating.average);     // 豆瓣评分
        }
        if(data.images) {
          $('#inputPoster').val(data.images.large);       // 电影海报
        }
        if(data.directors) {
          $('#inputDoctor').val(data.directors[0].name);  // 导演
        }
        // 主演
        if(data.casts) {
          var castNames = '';
          data.casts.forEach(function(item, index) {
            castNames += item.name;
            // 最后一个主演不添加'/'
            if(index < data.casts.length - 1){
              castNames += '/';
            }
          });
          $('#inputCasts').val(castNames);
        }
        // 类型
        if(data.genres) {
          var genreName = '';
          data.genres.forEach(function(item, index) {
            genreName += item;
            // 最后一个类型不添加'/'
            if(index < data.genres.length - 1){
              genreName += '/';
            }
          });
          $('#inputGenres').val(genreName);
        }
      });
    }
  });
});

'use strict';

$.support.cors = true;                                  // 解决IE8/9 Ajax跨域请求问题

$(function() {

  // 获取豆瓣音乐列表删除按钮类名，当点击删除按钮触发删除事件
  $('.musicDel').click(function(e) {
    var target = $(e.target),
        id = target.data('id'),  // 获取点击的id值
        tr = $('.item-id-' + id);

    $.ajax( {
      type : 'DELETE',
      url : '/admin/music/list?id=' + id
    })
    .done(function(result) {
      // 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
      if(result.success === 1 && tr) {
        tr.remove();
      }
    });
  });

  // 获取豆瓣音乐热门歌单列表页删除按钮类名，当点击删除按钮触发删除事件
  $('.programmeDel').click(function(e) {
    var target = $(e.target),
        id = target.data('id'),  // 获取点击的id值
        tr = $('.item-id-' + id);

    $.ajax( {
      type: 'DELETE',
      url: '/admin/music/programme/list?id=' + id
    })
    .done(function(result) {
      // 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
      if(result.success === 1 && tr) {
        tr.remove();
      }
    });
  });

  // 获取豆瓣音乐分类列表删除按钮类名，当点击删除按钮触发删除事件
  $('.musicCayDel').click(function(e) {
    var target = $(e.target),
        id = target.data('id'),  // 获取点击的id值
        tr = $('.item-id-' + id);

    $.ajax( {
      type: 'DELETE',
      url: '/admin/music/musicCategory/list?id=' + id
    })
    .done(function(result) {
      // 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
      if(result.success === 1 && tr) {
        tr.remove();
      }
    });
  });

  // 豆瓣音乐同步豆瓣api数据鼠标离开事件
  $('#doubanMusic').blur(function() {
    var id = $(this).val();
    if(id) {
      $.ajax( {
        url: 'http://api.douban.com/v2/music/' + id,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback'
      })
      .done(function(data) {
        $('#inputMusicTitle').val(data.title);                  // 标题
        $('#inputMusicAltTitle').val(data.alt_title);           // 别名
        $('#inputMusicImage').val(data.image);                  // 海报
        $('#inputMusicSummary').val(data.summary);              // 歌曲简介
        if(data.rating) {
          $('#inputMusicRating').val(data.rating.average);      // 豆瓣评分
        }
        if(data.attrs) {
          $('#inputMusicMedia').val(data.attrs.media);          // 介质
          $('#inputMusicPubdate').val(data.attrs.pubdate);      // 发行时间
          $('#inputMusicVersion').val(data.attrs.version);      // 专辑类型
          $('#inputMusicSinger').val(data.attrs.singer);        // 歌手
          $('#inputMusicPublisher').val(data.attrs.publisher);  // 出版者
        }
      });
    }
  });
});

'use strict';

$.support.cors = true;																	// 解决IE8/9 Ajax跨域请求问题

$(function() {
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
});

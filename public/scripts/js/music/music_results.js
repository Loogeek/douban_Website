'use strict';

$(function() {
  var currentPage = parseInt($('#page').attr('data-currentPage')),
      totalPage = parseInt($('#page').attr('data-totalPage')),
      cat = $('#page').attr('data-query');
  // 调用include文件夹下的page.js文件中的page页码生成函数生成页码
  page({
    id: '#page',
    currentPage: currentPage,
    totalPage: totalPage,
    search: '/music/results?'+ cat +'&p='
  });
});

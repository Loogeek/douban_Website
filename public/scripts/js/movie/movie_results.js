'use strict';

$(function() {
  var currentPage = parseInt($('#page').attr('data-currentPage')),
      totalPage = parseInt($('#page').attr('data-totalPage')),
      cat = $('#page').attr('data-query');
  // 生成页码函数
  page({
    id: '#page',
    currentPage: currentPage,
    totalPage: totalPage,
    search: '/movie/results?'+ cat +'&p='
  });
});

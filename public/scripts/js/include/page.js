'use strict';

// 页码组件
function page(opt) {
  if (!opt.id) {
    return false;
  }
  var $obj = $(opt.id),                        // 获取页码ul容器
      totalPage = opt.totalPage || 5,          // 总页数
      currentPage = opt.currentPage || 1,      // 当前页码
      oLi;                                     // 新创建的li元素

  // 如果当前页不是第一页，则显示首页和上一页按钮
  if (currentPage > 1) {
    $obj.append('<li><a href="'+ opt.search + 0 +'">首页</a></li><li><a href="'+ opt.search + (currentPage - 2) +'" aria-label="Previous">&laquo</a></li>');
  }
  // 如果总页数大于5页
  if (totalPage >= 5) {
    for(var i = 1; i <= 5; i++) {
      // 如果当前页是前两页
      if (currentPage < 3) {
        if (i === currentPage) {
          oLi = $('<li class="active"><a href="'+ opt.search + (i - 1) +'">'+ i +'</a></li>');
        }else {
          oLi = $('<li><a href="'+ opt.search + (i - 1) +'">'+ i +'</a></li>');
        }
      // 如果当前页是后两页
    }else if(currentPage > totalPage - 2) {
        if ((totalPage - 5 + i) === currentPage) {
          oLi = $('<li class="active"><a href="'+ opt.search + (totalPage - 6 + i) +'">'+ (totalPage - 5 + i) +'</a></li>');
        }else {
          oLi = $('<li><a href="'+ opt.search + (totalPage - 6 + i) +'">'+ (totalPage - 5 + i) +'</a></li>');
        }
      }
      // 当前页不是前两页也不是后两页
      else {
        if (i === 3) {
          oLi = $('<li class="active"><a href="'+ opt.search + (currentPage - 4 + i) +'">'+ (currentPage - 3 + i) +'</a></li>');
        }else {
          oLi = $('<li><a href="'+ opt.search + (currentPage - 4 + i) +'">'+ (currentPage - 3 + i) +'</a></li>');
        }
      }
      $obj.append(oLi);
    }
  // 总页数小于5页
  }else {
    for(var j = 1; j <= totalPage; j++) {
      if (j === currentPage) {
        $obj.append('<li class="active"><a href="'+ opt.search + (j - 1) +'">'+ j +'</a></li>');
      }else {
        $obj.append('<li><a href="'+ opt.search + (j - 1) +'">'+ j +'</a></li>');
      }
    }
  }
  // 如果当前页不是最后一页，则显示尾和下一页按钮
  if (currentPage < totalPage) {
    $obj.append('<li><a href="'+ opt.search + currentPage  +'" aria-label="Next">&raquo</a></li><li><a href="'+ opt.search + (totalPage - 1) +'">尾页</a></li>');
  }
}

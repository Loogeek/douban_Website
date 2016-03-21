'use strict';

$(function() {
  $('#fullpage').fullpage( {
    verticalCentered: false,
    anchors: ['page1','page2','page3','page4'],
    navigation: true,
    navigationTooltips: ['Ant-Man','Inception','Minions','The Martian']
  });
});

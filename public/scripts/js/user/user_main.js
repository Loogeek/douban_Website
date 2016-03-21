'use strict';

$.support.cors = true;																	// 解决IE8/9 Ajax跨域请求问题

/* 表单验证 */
$(function() {
	var captchaValue = true;  // 用来判断验证码是否输入正确
	// 通过Ajax发送验证码请求函数
	function captchaAjax() {
		$.ajax({
			url:'/captcha',
			type:'GET',
		}).done(function(results) {
			$('.captcha-show').text(results);
		});
	}
	/*
		用户登录及注册对象方法
	*/
	var signObject = {
		// 用户登录方法
		signIn: function(obj){
			$(obj).validate({
				rules:{
					'name': {
						required: true,
						minlength: 2,
						maxlength: 15
					},
					'password': {
						required: true,
						minlength: 2,
						maxlength: 15
					},
					'captcha': {
						required: true,
					}
				},
				messages: {
					'name': {
						required: '必须填写用户名',
						minlength: '用户名最小2位',
						maxlength: '用户名最大15位'
					},
					'password': {
						required: '必须填写密码',
						minlength: '密码最小2位',
						maxlength: '密码最大15位'
					},
					'captcha': {
						required: '必须填写验证码'
					}
				},
				submitHandler: function() {
					$.ajax({
						url: '/user/signin',
						method: 'GET',
						data:{
							'user': $(obj).serialize()           // 将发送的数据进行序列号
						}
					})
					.done(function(results) {
						switch(results.data) {
							// 用户不存在
							case 0:
								if($(obj).find('input:eq(0)').val().length > 1) {
									$(obj).find('.error:eq(0)').html('用户不存在').show();
								}
								//给登录按钮添加样式及使其无效防止重复提交
								$(obj).find('button:contains("登录")').addClass('btn-danger').attr('disabled','true');
								break;
							// 密码填写错误
							case 1:
								if($(obj).find('input:eq(1)').val().length > 1) {
									$(obj).find('.error:eq(1)').html('密码填写错误').show();
								}
								$(obj).find('button:contains("登录")').addClass('btn-danger').attr('disabled','true');
								break;
							// 验证码填写错误
							case 2:
								if($(obj).find('input:eq(2)') !== '') {
									$(obj).find('.error:eq(2)').html('验证码填写错误').show();
								}
								$(obj).find('button:contains("登录")').addClass('btn-danger').attr('disabled','true');
								break;
							//登录成功
							default:
								$('a')[0].click();											// 登录成功 点击电影首页按钮进入电影首页
						}
					});
				},
				// 表单验证失败时执行的方法
				invalidHandler: function() {
					captchaValue = false;    // 验证码输入正确时该标志位变量为true
					$(obj).find('button:contains("登录")').addClass('btn-danger').attr('disabled','true');
				}
			});
		},
		// 用户注册方法
		signUp: function(obj)  {
			$(obj).validate({
				rules: {
					'name':{
						required: true,
						minlength: 2,
						maxlength: 15,
					},
					'password': {
						required: true,
						minlength: 2,
						maxlength: 15
					},
					'confirm-password': {
						equalTo: $(obj).find('input:eq(1)')
					},
					'captcha': {
						required: true,
					}
				},
				messages:{
					'name': {
						required: '必须填写用户名',
						minlength: '用户名最小2位',
						maxlength: '用户名最大15位'
					},
					'password': {
						required: '必须填写密码',
						minlength: '密码最小2位',
						maxlength: '密码最大15位'
					},
					'confirm-password': {
						equalTo: '两次输入的密码不相同'
					},
					'captcha': {
						required: '必须填写验证码'
					}
				},
				submitHandler: function() {
					$.ajax({
						url: '/user/signup',
						method: 'POST',
						data:{
							'user': $(obj).serialize()
						}
					})
					.done(function(results) {
						console.log(results);
						switch(results.data){
							case 0:
								// 用户名已存在
								if($(obj).find('input:eq(0)').val().length > 1) {
									$(obj).find('.error:eq(0)').html('用户已存在').show();
								}
								$(obj).find('button:contains("注册")').addClass('btn-danger').attr('disabled','true');
								break;
							case 1:
								// 输入的验证码不匹配，显示验证码填写错误在输入框上方
								if($(obj).find('input:eq(3)') !== '') {
									console.log($(obj).find('input:eq(3)'));
									$(obj).find('.error:eq(3)').html('验证码填写错误').show();
								}
								$(obj).find('button:contains("注册")').addClass('btn-danger').attr('disabled','true');
								break;
							default:
								$('a')[0].click();									// 注册成功 点击电影首页按钮进入电影首页
						}
					});
				},
				invalidHandler: function() {
					captchaValue = false;
					$(obj).find('button:contains("注册")').addClass('btn-danger').attr('disabled','true');
				}
			});
		}
	};

	/* 用户登录弹出框 */
	signObject.signIn('#signinForm');

	/* /signin用户登录页面 */
	signObject.signIn('#dSigninForm');

	/* 用户注册弹出框 */
	signObject.signUp('#signupForm');

	/* /signup用户注册页面 */
	signObject.signUp('#dSignupForm');


	/* 登录和注册输入框点击X清除输入框内容 */
	$('.form-clear').on('click',function() {
		$(this).parent().find('input').val('').trigger('keypress');
	});

	/* 当输入框内容不为空时出现X，空时隐藏 */
	$('.modal-body input').on('keypress',function() {
		if($(this).val() === ''){
			 $(this).parent().find('span').addClass('has-remove-sign');
		}else{
			$(this).parent().find('span').removeClass('has-remove-sign');
		}
		// 当输入框内容发生变化时删除登陆或注册按钮按时及使其有效
		$('.modal-footer').find('button:contains("登录")').removeClass('btn-danger').removeAttr('disabled');
		$('.modal-footer').find('button:contains("注册")').removeClass('btn-danger').removeAttr('disabled');
	}).trigger('keypress');

	/* 点击顶部登陆或注册按钮、或刷新验证码重新请求验证码 */
	$('.captcha-repeat,.captcha-show').on('click',function() {
		captchaAjax();
	});
	captchaAjax();
});

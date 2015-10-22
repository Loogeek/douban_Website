//表单验证
$(function(){
	//对表单登陆进行限定
	$('#signinForm').validate({
		rules:{
			'user[name]':{
				required:true,
				minlength:2,
				maxlength:15
			},
			'user[password]':{
				required:true,
				minlength:2,
				maxlength:20
			}
		},
		messages:{
			'user[name]':{
				required:'必须填写用户名',
				minlength:'用户名最小2位',
				maxlength:'用户名最大15位'
			},
			'user[password]':{
				required:'必须填写密码',
				minlength:'密码最小2位',
				maxlength:'密码最大20位'
			}			
		}
	});
	//登陆前将密码发送给Ajax服务器进行判断是否存在
	$('#signinForm').submit(function(event){
		event.preventDefault();
		$.ajax({
			url:'/user/signin',
			type:'POST',
			//把输入的用户名及密码发送给服务器
			data:{'user[name]':$(this).find('input:eq(0)').val(),//用户名
				  'user[password]':$(this).find('input:eq(1)').val()//密码
			}
		}).done(function(results){
			switch(results.data){
				case 0:
					//输入的账号有误，返回用户不存提示信息在显示在输入框上
					$('#signinForm .err_tip').html('用户不存在').attr('style','block');
					break;
				case 1:
					//输入的账号和密码不匹配，返回提示信息在显示在输入框上
					$('#signinForm .err_tip').html('账号或密码错误').attr('style','block');
					break;
				default:
					//登陆成功
					var funSignIn = (function(){
						$('#signinModal').attr('style','none');//隐藏模态框
						//将模态框给body添加的类和设置的style删除
						$('body').removeClass('modal-open').removeAttr('style');
						$('.modal-backdrop').remove();//将遮罩删除
						//将顶栏右侧原注册信息修改为登陆的用户名及登出并删除原模态框自定义属性
						$('.navbar-text a:eq(0)').html('欢迎您:'+$('#signinModal input:eq(0)').val()+'').removeAttr('data-target').removeAttr('data-toggle');
						$('.navbar-text a:eq(1)').html('登出').attr('href','/logout').removeAttr('data-target').removeAttr('data-toggle');
					})();
			}
		});
	});

	//对用户注册进行限定
	$('#signupForm').validate({
		rules:{
			'user[name]':{
				required:true,
				minlength:2,
				maxlength:15
			},
			'user[password]':{
				required:true,
				minlength:2,
				maxlength:20
			}
		},
		messages:{
			'user[name]':{
				required:'必须填写用户名',
				minlength:'用户名最小2位',
				maxlength:'用户名最大15位'
			},
			'user[password]':{
				required:'必须填写密码',
				minlength:'密码最小2位',
				maxlength:'密码最大20位'
			}			
		}
	});
	//注册前将用户名及密码发送给Ajax服务器进行判断是否存在
	$('#signupForm').submit(function(event){
		event.preventDefault();
		$.ajax({
			url:'/user/signup',
			type:'POST',
			//把输入的用户名及密码发送给服务器
			data:{'user[name]':$(this).find('input:eq(0)').val(),//用户名
				  'user[password]':$(this).find('input:eq(1)').val()//密码
			}
		}).done(function(results){

			if(results.data === 0){
				//用户名已存在
				$('#signupForm .err_tip').html('用户已存在').attr('style','block');	
			}else{
				//注册成功
				$('#signupModal').attr('style','none');//隐藏模态框
				//将模态框给body添加的类和设置的style删除
				$('body').removeClass('modal-open').removeAttr('style');
				$('.modal-backdrop').remove();//将遮罩删除
				//将顶栏右侧原注册信息修改为注册的用户名及登出并删除原模态框自定义属性
				$('.navbar-text a:eq(0)').html('欢迎您:'+$('#signupModal input:eq(0)').val()+'').removeAttr('data-target').removeAttr('data-toggle');
				$('.navbar-text a:eq(1)').html('登出').attr('href','/logout').removeAttr('data-target').removeAttr('data-toggle');
			}
		});
	});

	/*
		对/signin页面等于用户进行限定 
	 */ 
	//对表单登陆进行限定
	$('#dSigninForm').validate({
		rules:{
			'user[name]':{
				required:true,
				minlength:2,
				maxlength:15
			},
			'user[password]':{
				required:true,
				minlength:2,
				maxlength:20
			}
		},
		messages:{
			'user[name]':{
				required:'必须填写用户名',
				minlength:'用户名最小2位',
				maxlength:'用户名最大15位'
			},
			'user[password]':{
				required:'必须填写密码',
				minlength:'密码最小2位',
				maxlength:'密码最大20位'
			}			
		}
	});
	//登陆前将密码发送给Ajax服务器进行判断是否存在
	$('#dSigninForm').submit(function(event){
		event.preventDefault();
		$.ajax({
			url:'/user/signin',
			type:'POST',
			//把输入的用户名及密码发送给服务器
			data:{'user[name]':$(this).find('input:eq(0)').val(),//用户名
				  'user[password]':$(this).find('input:eq(1)').val(),//密码
			}
		}).done(function(results){
			switch(results.data){
				case 0:
					//输入的账号有误，返回用户不存提示信息在显示在输入框上
					$('#dSigninForm .err_tip').html('用户不存在').attr('style','block');
					break;
				case 1:
					//输入的账号和密码不匹配，返回提示信息在显示在输入框上
					$('#dSigninForm .err_tip').html('账号或密码错误').attr('style','block');
					break;
				default:
					//登陆成功
					$('a')[0].click();
			}
		});
	});	

	/*
		对/signup页面等于用户进行限定 
	 */ 
	//对表单登陆进行限定
	$('#dSignupForm').validate({
		rules:{
			'user[name]':{
				required:true,
				minlength:2,
				maxlength:15
			},
			'user[password]':{
				required:true,
				minlength:2,
				maxlength:20
			}
		},
		messages:{
			'user[name]':{
				required:'必须填写用户名',
				minlength:'用户名最小2位',
				maxlength:'用户名最大15位'
			},
			'user[password]':{
				required:'必须填写密码',
				minlength:'密码最小2位',
				maxlength:'密码最大20位'
			}			
		}
	});
	//登陆前将密码发送给Ajax服务器进行判断是否存在
	$('#dSignupForm').submit(function(event){
		event.preventDefault();
		$.ajax({
			url:'/user/signup',
			type:'POST',
			//把输入的用户名及密码发送给服务器
			data:{'user[name]':$(this).find('input:eq(0)').val(),//用户名
				  'user[password]':$(this).find('input:eq(1)').val(),//密码
			}
		}).done(function(results){
			if(results.data === 0){
				//用户名已存在
				$('#dSignupForm .err_tip').html('用户已存在').attr('style','block');	
			}else{
				//注册成功跳转至首页
				$('a')[0].click();			
			}
		});
	});	

});

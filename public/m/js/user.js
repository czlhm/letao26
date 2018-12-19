$(function () {
    /*退出登录功能
		1. 点击退出登录 就调用退出登录的API接口
		2. 退出成功就跳转到登录页面
        3. 登录完成后要返回个人中心页面*/
    // 给推出功能一个点击事件
    $('.btn-exit').on('tap', function () {
        $.ajax({
            beforeSend:function(){
                $('.mask').show()
               },
               complete:function(){
                   $('.mask').hide();
               },
            url: '/user/logout',
            success: function (data) {
                //判断是否登出成功
                if (data.success) {
                    //成功就跳转到登录页面
                    location = "login.html?returnUrl=" + location.href;
                }
            }
        })
    })
    /* 
	查询用户的信息 更新用户名和手机号
		1. 页面加载的时候马上请求查询用户信息的API
		2. 查询成功就渲染到用户名和手机号的里面
    */
    $.ajax({
        beforeSend:function(){
            $('.mask').show()
           },
           complete:function(){
               $('.mask').hide();
           },
        url: '/user/queryUserMessage',
        success: function (data) {
            console.log(data);
            if (data.error) {
                // 如果失败就跳转到登录页面，当登录完成后返回当前页面
                location = 'login.html?returnUrl='+location.href;
            }else{
                //成功就渲染用户名和手机号
                $('.username').html(data.username);
                $('.mobile').html(data.mobile);
            }
        }
    })

})
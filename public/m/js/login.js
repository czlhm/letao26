$(function(){
        /* 
    	1. 实现登录功能
    		1. 点击登录的时候获取用户名和密码
    		2. 进行非空判断
    		3. 调用的APi 传入 当前用户名和密码
    		4. 获取后台返回登录结果  成功就返回上一页去继续加入购物车
    		5. 如果失败就提示用户输入正确的用户名和密码
    */
    // 给登录框一个点击事件
    $('.btn-login').on('tap',function(){
        // 获取账号和密码
        var name = $('.name').val().trim();
        var password = $('.password').val().trim();
        // 非空判断
        if(!name){
           mui-alert('请输入用户名!','温馨提示','知道了');
           return false;
        }
        if(!password){
           mui-alert('请输入密码!','温馨提示','知道了');
        }
        // 发送ajax请求(调用api)
        $.ajax({
            beforeSend:function(){
                $('.mask').show()
               },
               complete:function(){
                   $('.mask').hide();
               },
            url:'/user/login',
            type:'post',
            data:{ username:name,password:password },
            success:function(data){
                console.log(data);
                /* 判断用户存不存在 */
                if(data.success){
                  //存在就跳转到上一页继续
                  //先获取之前带过来的数据页面
                  var returnUrl = getQueryString('returnUrl');
                  location = returnUrl;    
               }else{
                  //如果失败就提示用户输入正确的用户名和密码
                  mui.toast(data.message,{ duration:'long',type:'div' });
               }
            }
        })
    })
    // 给注册一个点击事件
    $('.btn-register').on('tap',function(){
        // 跳转到注册页面
        location = 'register.html';
    })
    // 根据url参数名取值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        // console.log(r);
        if (r != null) {
            //转码方式改成 decodeURI
            return decodeURI(r[2]);
        }
        return null;
    }
})
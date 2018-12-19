$(function () {
    /*1. 根据当前url中参数的商品id 获取商品详情数据渲染
    	1. 通过封装好的查询url参数值的函数获取 id参数的值
    	2. 请求API获取数据 传入当前id参数
    	3. 渲染商品详情*/
    // 1. 通过封装好的查询url参数值的函数获取 id参数的值
    var id = getQueryString('id');
    $.ajax({
        beforeSend:function(){
            $('.mask').show()
           },
           complete:function(){
               $('.mask').hide();
           },
        url: '/product/queryProductDetail',
        data: {
            id: id
        },
        success: function (data) {
            //返回的数据是字符串 40-50字符串 把字符串转成数组
            console.log(data);

            //  拿到最小值
            var min = data.size.split('-')[0] - 0;
            //  最大值
            var max = data.size.split('-')[1];
            //  把data.size赋值为空数组
            data.size = [];
            //  循环从最小到最大
            for (var i = min; i <= max; i++) {
                data.size.push(i);
            }
            console.log(data);

            //  调用商品详情的模板生成html
            var html = template('productDetailTpl', data);
            $('#productDetail').html(html);
            //等页面详情加载完之后在初始化区域滚动 这样保证不会出现问题
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });

            //等轮播图结构出来之后在初始化轮播图
            mui('.mui-slider').slider({
                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
            });

            //等数字框也是动态初始化
            mui('.mui-numbox').numbox();
            // 尺码默认也是不能点击的手动初始化
            $('.btn-size').on('tap', function () {
                $(this).addClass('active').siblings().removeClass('active');
            })
        }
    })

    /* 
    2. 加入购物车
    	1. 当点击加入购物车的时候 获取 选择的尺码数量信息
    	2. 判断尺码和数量是否选择 如果没有选择 提示用户选择尺码和数量
    	3. 调用加入购物车的API传入当前商品id 尺码 数量 加入购物车
    	4. 调用APi的时候 post 提交一般是post
    	5. 提交如果当前用户没有登录 提示用户去登录
    	6. 加入成功 提示用是否去购物车查看
    */
    //    1. 当点击加入购物车的时候 获取 选择的尺码数量信息
    $('.btn-cart').on('tap', function () {

        // 获取当前的尺码
        var size = $('.btn-size.active').data('size');
        if (!size) {
            mui.toast('请选择尺码!', {
                duration: 3000,
                type: 'div'
            });
            return false;
        }

        //获取当前选择的数量
        var num = mui('.mui-numbox').numbox().getValue();
        if (!num) {
            mui.toast('请选择数量!', {
                duration: 3000,
                type: 'div'
            });
            return false;
        }

        // 调用APi的时候 post 提交一般是post
        $.ajax({
            beforeSend:function(){
                $('.mask').show()
               },
               complete:function(){
                   $('.mask').hide();
               },
            url: '/cart/addCart',
            type: 'post',
            data: {
                productId: id,
                num: num,
                size: size
            },
            success: function (data) {
                console.log(data);
                if (data.success) {
                    mui.confirm('加入购物车成功,要去购物车查看么?', '你好', ['去看','不看'], function (e) {
                        console.log(e);
                        if (e.index == 0) {
                            location = 'cart.html';
                        } else {
                            mui.toast('你继续看!', {
                                duration: 3000,
                                type: 'div'
                            })
                        }
                    });
                } else {
                    // location.href 就是当前页面的url
                    location = 'login.html?returnUrl=' + location.href;
                }
            }

        })
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
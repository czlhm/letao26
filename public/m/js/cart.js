$(function () {
    queryCart();

    /* 
    下拉刷新和上拉加载购物车
    	1. 添加下拉上拉结构
    	2. 初始化下拉刷新和上拉加载
    	3. 在下拉刷新的函数请求最新的数据
    	4. 结束下拉刷新的效果(不结束会一直转)
    	5. 定义一个page = 1;
    	6. 上拉加载的回调函数让page++
    	7. 请求page++了之后的更多的数据
    	8. 追加append到购物车的列表
    	9. 结束上拉加载效果
    	10. 判断如果没有数据的时候结束并且提示没有数据了  调用结束上拉加载效果传递一个true
    	11. 下拉结束后重置上拉加载的效果
    	12. 把page也要重置为1
    */


    // 1. 添加下拉上拉结构
    // 5. 定义一个page = 1;
    var page = 1;
    // 1. 添加下拉上拉结构
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            // 初始化下拉
            down: {
                callback: function () {
                    // 模拟请求网络请求延迟
                    setTimeout(function () {
                        // 3. 在下拉刷新的函数请求最新的数据
                        queryCart();
                        // 4. 结束下拉刷新的效果(不结束会一直转) 在官方文档函数后 多加一个 ToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 11. 下拉结束后重置上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 12. 把page也要重置为1
                        page = 1;
                    }, 1000);
                }
            },
            // 初始化上拉
            up: {
                callback: function () {
                    // 只是为了模拟延迟
                    setTimeout(function () {
                        // 6. 上拉加载的回调函数让page++
                        page++;
                        // 7. 请求page++了之后的更多的数据
                        $.ajax({
                            url: '/cart/queryCartPaging',
                            data: {
                                page: page,
                                pageSize: 4
                            },
                            success: function (data) {
                                console.log(data);
                                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                                if (data.error) {
                                    // 跳转到登录页面 同时登录成功回到当前购物车页面
                                    location = 'login.html?returnUrl=' + location.href;
                                } else {
                                    // []  一开始这个样子的数组
                                    // {
                                    // 	data:[]
                                    // }// 变成这个样子的对象
                                    console.log(data instanceof Array);
                                    // 判断后返回的数据是不是一个数组 是一个数组 转成一个对象 给对象添加一个data数组 值就是当前的data
                                    if (data instanceof Array) {
                                        data = {
                                            data: data
                                        }
                                    }
                                    if (data.data.length > 0) {
                                        // 调用模板方法生成html
                                        var html = template('cartListTpl', data);
                                        // 8. 追加append到购物车的列表
                                        $('.cart-list').append(html);
                                        // 9. 结束上拉加载效果
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                    } else {
                                        // 10. 结束上拉加载效果提示没有数据了
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }

                                }
                            }
                        });
                    }, 1000);
                }
            }
        }
    });
    /* 
    3. 商品勾选计算总金额
        1. 当复选框选择发生变化的时候要获取所有选中的复选框  什么叫选中的 input:checked
        2. 计算每个选择复选框的商品的单价（商品价格 * 数量）
        3. 定一个和 把所有单价累加起来就是总金额
    */

    $('.cart-list').on('change', '.choose', function () {
        //获取所有选中的复选框
        var checkeds = $('.choose:checked');
        //声明一个商品的总价格
        var sum = 0;
        //遍历所有选中的复选框,计算每一个商品价格
        checkeds.each(function (index, value) {
            var price = $(value).data('price');
            var num = $(value).data('num');
            var count = price * num;
            console.log(price);
            console.log(num);
            sum += count;
        })
        //js会又bug,*0.2的都有小数点 调用toFixed()方法 
        sum = sum.toFixed(2);
        //添加到页面上去
        $('.order-total span').html(sum);
    })

    /* 
    4. 删除商品
        1. 点击删除按钮弹出一个确认框 问用户是否要删除当前商品
        2. 判断如果用户点击了确定  就删除商品
            调用删除购物车商品的APi去删除要求传入购物车id
            在删除按钮上把当前购物车id绑定到删除按钮
        3. 取消滑动回去 什么都不干
    */
    $('.cart-list').on('tap', '.btn-delete', function () {
        var that = this
        //调用mui里面的消息框
        mui.confirm('你确定要删除吗?', '温馨提示', ['yes', 'no'], function (e) {
            //获取当前的id
            var id = $(that).data('id');
            if (e.index == 0) {
                //确定要删了
                $.ajax({
                    url: '/cart/deleteCart',
                    data: {
                        id: id
                    },
                    success: function (data) {
                        if (data.success) {
                            //调用api购物车的方法
                            queryCart();
                        }
                    }
                })
            } else if (e.index == 1) {
                mui.swipeoutClose($(that).parent().parent()[0]); //关闭指定列的滑动菜单，el:指定列的dom对象
            }
        })

    })

    /*
        5. 编辑商品
            1. 点击编辑按钮弹出一个确认框
            2. 把商品尺码数量 的代码放到确认框里面
            3. 准备一个尺码和数量的模板
            4. 需要所有尺码 当前尺码 所有数量 当前数量  传入模板里面
            5. 把模板生成 放到确认框的内容里面
            6. 放上去了之后让尺码数量能够点击(放上去后初始化)
            7. 在确认框点击了确定 获取最新的尺码数量 去编辑 调用API传入参数  编辑成功刷新页面
            8. 点击了取消 就列表滑回去
    */
    $('.cart-list').on('tap', '.btn-edit', function () {
        var that = this;
        var product = $(this).data('product');
        console.log(product);
        // 获取最小值
        var min = product.productSize.split('-')[0] - 0;
        // 获取最大值
        var max = product.productSize.split('-')[1];
        //声明一个空数组接受所有尺码
        product.productSize = [];
        //遍历尺码添加到尺码去
        for (var i = min; i <= max; i++) {
            product.productSize.push(i);
        }
        //传入模板里面
        var html = template('editCartTpl', product);
        //还要把html里面的回车换行去掉
        html = html.replace(/[\r\n]/g, "");
        console.log(product);
        mui.confirm(html, '编辑商品', ['yes', 'no'], function (e) {
            //判断点击的是左还是右
            if (e.index == 0) {
                $.ajax({
                    url: '/cart/updateCart',
                    type: 'post',
                    data: {
                        id: product.id,
                        size: $('.btn-size.active').data('size'),
                        num: mui('.mui-numbox').numbox().getValue() //当前选择数量
                    },
                    success: function (data) {
                        if (data.success) {
                            queryCart();
                        }
                    }

                })
            } else {
                mui.swipeoutClose($(that).parent().parent()[0]); //关闭指定列的滑动菜单，el:指定列的dom对象
            }
        })
        //初始化的时候 默认给赋值为当前选择的数量
        mui('.mui-numbox').numbox().setValue(product.num);
        $('.btn-size').on('tap', function () {
            $(this).addClass('active').siblings().removeClass('active');
        })
    })
    // 请求购物车商品数据函数封装起来
    function queryCart() {
        $.ajax({
            beforeSend:function(){
                $('.mask').show()
               },
               complete:function(){
                   $('.mask').hide();
               },
            url: '/cart/queryCartPaging',
            data: {
                page: 1,
                pageSize: 4
            },
            success: function (data) {

                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                if (data.error) {
                    location = 'login.html?returnUrl=' + location.href;
                } else {
                    if (data instanceof Array) {
                        data = {
                            data: data
                        }
                    }
                    var html = template('cartListTpl', data);
                    $('.cart-list').html(html);
                }
            }
        })
    }
})
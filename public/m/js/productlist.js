$(function () {
    /*1. 商品搜素
		1. 拿到搜索页面传递过来参数?search=鞋# 拿到参数中鞋
		2. 调用查询商品列表的API查询商品列表数据
		3. 创建商品列表的模板 传入数据
        4. 把模板渲染到页面*/
    // 1. 获取url中的参数的值 按照=分割取第二个值(索引是1) 进行转码
    var search = getQueryString('search');

    queryProduct()
    /*2. 商品列表的商品搜索功能
    		1. 点击搜索按钮获取当前输入的值  
    		2. 做非空判断
    		3. 调用API传入当前要搜索的商品关键字
    		4. 接受返回的商品数据 调用模板渲染页面
    */
    // 给搜索框一个点击事件
    $('.btn-search').on('tap', function () {
        // 获取搜索框的内容
        search = $('.input-search').val();
        queryProduct();

    })

    // 封装一个ajke的方法 因为它们请求的数据都是一样的
    function queryProduct() {
        $.ajax({
            beforeSend:function(){
                $('.mask').show()
               },
               complete:function(){
                   $('.mask').hide();
               },
            url: '/product/queryProduct',
            data: {
                page: 1,
                pageSize: 2,
                proName: search
            },
            success: function (data) {
                var html = template('productListTpl', data);
                $('.product-list .ul-list').html(html);
            }
        })
    }


    // 3. 商品的排序功能 点击价格 或者 销量能够实现商品的排序
    // 3.1 给所有排序按钮添加点击事件
    // 3.2 获取当前点击的排序的方式
    //      (在页面中就要定义这种排序的属性) 只要获取排序的data-sort-type属性的值     
    // 3.3 获取当前排序的顺序 
    //         price 1是升序  2 降序
    //         num  1是升序  2 降序
    //         需要在页面中定义排序的顺序 默认都为1
    //         在JS中去获取当前的排序的顺序如果为 1  变成 =  2  如果为2变成1
    //     3.8 获取当前排序里面的i标签  删除之前的类名 再添加新的类名
    // 3.4 判断你当前是属于哪一种排序的方式 如果是price 就行价格排序 如果num就进行num排序
    //     3.5 调用APi传入当前排序的顺序   
    //            3.6 调用模板 
    //             3.7 渲染页面
    //     3.5 调用APi传入当前排序的顺序   
    //             3.6 调用模板 
    //             3.7 渲染页面

    $('.product-list .title ul li a').on('tap', function () {
        // 获取当前的排序顺序
        var sort = $(this).data('sort');
        sort = sort == 1 ? 2 : 1;
        $(this).data('sort', sort);
        // 获取当前点击的排序的方式
        var sorType = $(this).data('type');
        var params = {
            page: 1,
            pageSize: 4,
            proName: search
        };
        params[sorType] = sort;
        $.ajax({
            beforeSend:function(){
                $('.mask').show()
               },
               complete:function(){
                   $('.mask').hide();
               },
            url: '/product/queryProduct',
            data: params,
            success: function (data) {
                var html = template('productListTpl', data);
                $('.product-list .ul-list').html(html);
            }
        })

    })

    // 4. 功能具体实现步骤
    // 4.1 初始化下拉刷新和上拉加载功能
    // 4.2 指定下拉刷新的回调函数 发送ajax请求刷新页面 并结束下拉刷新效果
    // 4.3 发送ajax请求 渲染刷新页面
    // 4.4 调用模板 
    // 4.5 渲染页面
    // 4.6 当页面刷新完成结束下拉刷新效果 不结束会一直转
    // 4.7 除了需要下拉刷新还要重置上拉加载  
    // 4.8 把page也重置为1
    // 初始化方法
    // 定义一个变量记录当前页面页面数
    var page = 1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            down: {
                contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    setTimeout(function () {
                        // 拉了之后重新发送请求刷新页面
                        queryProduct();
                        //当数据请求完毕之后停止刷新
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 9. 下拉完成后 重置这个上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 10. 把page也要重置为1
                        page = 1;
                    }, 800)
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            up: {
                contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    setTimeout(function () {
                        page++;
                        $.ajax({
                            beforeSend:function(){
                                $('.mask').show()
                               },
                               complete:function(){
                                   $('.mask').hide();
                               },
                            url: '/product/queryProduct',
                            data: {
                                page: page,
                                pageSize: 2,
                                proName: search
                            },
                            success: function (data) {
                                if (data.data.length > 0) {
                                    var html = template('productListTpl', data);
                                    $('.product-list .ul-list').append(html);
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                } else {
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            }
                        })
                    }, 800)
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });

    // 给购买一个点击事件
    $('.product-list').on('tap','.btn-buy', function () {
        // 自定义属性 id
        var id = $(this).data('id');
        // 跳转叶敏哎                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        location = 'detail.html?id=' + id;
    })

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
})
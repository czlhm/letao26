

$(function () {
    /*1. 商品搜素
		1. 拿到搜索页面传递过来参数?search=鞋# 拿到参数中鞋
		2. 调用查询商品列表的API查询商品列表数据
		3. 创建商品列表的模板 传入数据
        4. 把模板渲染到页面*/
    // 1. 获取url中的参数的值 按照=分割取第二个值(索引是1) 进行转码
    var search = decodeURI(location.search.split('=')[1]);
    console.log(search);
    $.ajax({
        url:'/product/queryProduct',
        data:{page:1,pageSize:4,proName:search},
        success:function(data){
        var html = template('productListTpl',data);
        $('.product-list .ul-list').html(html);
        }
    })
    
})
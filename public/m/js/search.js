

$(function(){
    /*1. 添加搜索记录
	1. 点击搜索按钮获取当前输入的内容
	2. 对输入内容进行非空判断
	3. 获取之前存储的记录 如果有值就把之前记录转成数组来使用  如果没有值就使用空数组
	4. 添加值之前进行判断 如果值已经在数组中存在了先把存在的值删掉 在数组中的前面添加
    5. 添加完成后把数组重新保存到本地存储里面*/
    // 给搜索按钮一个点击事件
     $('.btn-search').on('tap',function(){
        // 获取输入框的内容
        var search = $('.input-search').val();
        //对输入内容进行非空判断 trim() 函数用于去除字符串两端的空白字符
        // !取反!false == true  !true == false
        if(!search.trim()){
            alert('请输入要搜索的内容');
            return;
        }
        // 获取之前存储的记录 如果有值就把之前记录转成数组来使用  如果没有值就使用空数组
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        console.log(historyData);
        // 添加值之前进行判断 如果值已经在数组中存在了先把存在的值删掉 在数组中的前面添加
        if(historyData.indexOf(search)!=-1){
          //如果indexOf不等于-1表示输入内容在数组中存在 删除当前数组中的这个元素
          //5.2 splice 删除数组中的一个元素 第一个参数是元素索引 第二个参数删除索引后的几个元素
          historyData.splice(historyData.indexOf(search),1);
         }
         // 5.3 如果有重复的上面已经删掉 删掉了后往前加就没问题了
         historyData.unshift(search);
         
         localStorage.setItem('searchHistory',JSON.stringify(historyData));
         queryHistory();
        //  加完了记录后跳到商品列表页面实现真实的商品搜索
        location = 'productlist.html?search='+search;
     }) 
    queryHistory();
    //  查询搜索记录
    function queryHistory(){
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // 2. 数据是一个数组 模板引擎要求对象 需要包装一下
        historyData = { rows: historyData };
        var html = template('searchListTpl',historyData);
        $('.search-history .mui-table-view').html(html);
    }

    // 删除记录
    $('.mui-card-content .mui-table-view').on('tap','.btn-delete',function(){
        //获取当前点击的x的删除的元素的索引
        var index = $(this).data('index');
        // 3. 获取本地存储的所有数据
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // 当前索引元素删除
        historyData.splice(index, 1);
        console.log(historyData);
        // 5. 把删除完成后的数组重新保存到存储里面
        localStorage.setItem('searchHistory',JSON.stringify(historyData));
        queryHistory();
    })

    // 给清空按钮添加点击事件
    $('.btn-clear').on('tap',function(){
        // 删除整个searchHistory的键
        localStorage.removeItem('searchHistory');
        queryHistory();
    })
})
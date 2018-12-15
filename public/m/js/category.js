$(function () {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    $.ajax({
        url: '/category/queryTopCategory',
        success: function (data) {
            var html = template('categoryLeftTpl', data);
            $('.category-left ul').html(html);
        }
    })

    // 给a元素添加点击事件
    $('.category-left ul').on('tap', 'li a', function () {
        // 获取当前的id
        var id = $(this).data('id');
        querySecondCategory(id)
        $(this).parent().addClass('active').siblings().removeClass('active');
    })
    // 默认调用请求数据的函数 传入id为1
    querySecondCategory(1);

    function querySecondCategory(id) {
        $.ajax({
            url: '/category/querySecondCategory',
            data: {
                id: id
            },
            success: function (data) {
                var html = template('categoryRightTpl', data);
                $('.category-right ul').html(html);
            }
        })
    }
})
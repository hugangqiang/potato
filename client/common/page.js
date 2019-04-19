import $ from './jquery';


// 定义构造函数
export const Paging = (el, options) => {
    el.show();
    options = {
        pageNo: 1,
        totalPages: 1,
        totalCount: '',
        slideSpeed: 0,
        callback: ()=>{},
        ...options
    };
    const createDom = () => {
        let ulDom = '';
        let content = '';
        let liWidth = 48;
        let totalPages = options.totalPages;
        let wrapLength = 0;

        totalPages > 5 ? wrapLength = 5 * liWidth : wrapLength = totalPages * liWidth;

        for (let i = 1; i <= options.totalPages; i++) {
            i != 1 ? ulDom += '<li>' + i + '</li>' : ulDom += '<li class="sel-page">' + i + '</li>';
        }

        content = '<button type="button" id="firstPage" class="turnPage first-page">首页</button>' +
            '<button class="turnPage" id="prePage">上一页</button>' +
            '<div class="pageWrap" style="width:' + wrapLength + 'px">' +
            '<ul id="pageSelect" style="transition:all ' + options.slideSpeed + 'ms">' +
            ulDom +
            '</ul></div>' +
            '<button class="turnPage" id="nextPage">下一页</button>' +
            '<button type="button" id="lastPage" class="last-page turnPage">尾页</button>';
        el.html(content);
    }
    const bindEvents = () => {
        var pageSelect = $('#pageSelect'), // ul
            lis = pageSelect.children(), // li的集合
            liWidth = lis[0].offsetWidth + 8, // li的宽度
            totalPages = options.totalPages, // 总页数
            pageIndex = options.pageNo, // 当前选择的页码
            distance = 0, // ul移动距离
            prePage = $('#prePage'),
            nextPage = $('#nextPage'),
            firstPage = $('#firstPage'),
            lastPage = $('#lastPage'),
            jumpBtn = $('#jumpBtn'),
            jumpText = $('#jumpText');

        function handles(pageIndex,def) {
            def = def || false;
            lis.removeClass('sel-page').eq(pageIndex - 1).addClass('sel-page');
            if (totalPages <= 5) {
                if(!def){
                    options.callback(pageIndex);
                }
                return false;
            }
            if (pageIndex >= 3 && pageIndex <= totalPages - 2) distance = (pageIndex - 3) * liWidth;
            if (pageIndex == 2 || pageIndex == 1) distance = 0;
            if (pageIndex > totalPages - 2) distance = (totalPages - 5) * liWidth;
            pageSelect.css('transform', 'translateX(' + (-distance) + 'px)');
            pageIndex == 1 ? firstPage.attr('disabled', true) : firstPage.attr('disabled', false);
            pageIndex == 1 ? prePage.attr('disabled', true) : prePage.attr('disabled', false);
            pageIndex == totalPages ? lastPage.attr('disabled', true) : lastPage.attr('disabled', false);
            pageIndex == totalPages ? nextPage.attr('disabled', true) : nextPage.attr('disabled', false);

            if(!def){
                options.callback(pageIndex);
            }

        }
        prePage.on('click', function() {
            pageIndex--;
            if (pageIndex < 1) pageIndex = 1;
            handles(pageIndex);
        })

        nextPage.on('click', function() {
            pageIndex++;
            if (pageIndex > lis.length) pageIndex = lis.length;
            handles(pageIndex);
        })

        firstPage.on('click', function() {
            pageIndex = 1;
            handles(pageIndex);
        })

        lastPage.on('click', function() {
            pageIndex = totalPages;
            handles(pageIndex);
        })


        lis.on('click', function() {
            pageIndex = $(this).index() + 1;
            handles(pageIndex);
        })


        lis.removeClass('sel-page').eq(options.pageNo-1).addClass('sel-page');
        handles(options.pageNo, true)
        //handles(options.pageNo);
    }
    createDom();
    bindEvents();
}

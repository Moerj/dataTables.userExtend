/**
 * [dataTables的自定义扩展]
 * 依赖于：jQuery、datatables
 * @Author   Moer
 */

$.extend( $.fn.dataTable.defaults, {
	// 汉化datatables
    language: {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    },

    //使用自定义功能，必须将datatables布局成这个类型
    "dom": 'frtip' 
});


(function($){
	$.fn.extend({  

		/**
		 * [添加自定义按钮]
		 * @Author   Moer
		 * @DateTime 2015-09-12T15:18:17+0800
		 * @param    {[type] = jQuery}    $btnGroup [自定义的按钮或按钮组，]
		 * @param    {[type] = string}    domId     [要放置的位置，"top" = 左上角，"top-r" = 右上角，"bottom" = 左下角，"bottom-r" = 右下角]
		 * 
		 * 建议将datatable配置为
		 * DataTable({
		 * 	  "dom": 'frtip'
		 * });
		 */
	    addButtons:function ($btnGroup,domId) {
	    	var tableId = "#" + this.attr('id');

			var direction = 'left' ; //默认的按钮浮动方向
			if (domId.indexOf('-r')>=0) {
				direction = 'right' ; 
			}

			// 将按钮组添加到datatable的左上角或者右下角
			if (domId===undefined || domId.indexOf('top')>=0) {
				domId="_filter";//datatable默认生成的上容器，含搜索框
				setFloat (direction);
			}
			else if (domId.indexOf('bottom')>=0) {
				domId="_paginate";//datatable默认生成的下容器，含页码
				setFloat (direction);
			}

			// 将自定义按钮组加入到table的默认头部容器中
			$( tableId + "_wrapper " + tableId + domId  ).prepend( $btnGroup );

			// 对自定义按钮和他的父容器进行排序
			function setFloat (direction) {
				$btnGroup.css('float', direction);
				if (direction==='right') {
					$( tableId + domId ).css('text-align', 'left');
				}
			}

			return this;
		},


		/*定义全局选中行的类名，默认为bootstrap的info*/
		selectedClass: 'info' ,


		/**
		 * [允许表单被选中]
		 * @Author   Moer
		 * @DateTime 2015-09-13T16:05:28+0800
		 * @param    {[type] = jQuery elements}     relateButtons 	[有选中状态才会激活的自定义按钮]
		 * @param    {[type] = string}      		singleSelect    ['single'，只允许单选]
		 * @param    {[type] = string}     			selectedClass   [定义标记选中行的class]
		 */
		allowSelect: function ( relateButtons, singleSelect, selectedClass ) {
			var	tbody = this.find('tbody');

			if ( selectedClass === undefined ) {
				selectedClass = this.selectedClass ;
			}

			if ( singleSelect !== undefined ) {
				// 只允许选中单行
			    tbody.on( 'click', 'tr', function () {
			    	var selectedRows = tbody.find( 'tr.' + selectedClass );
			    	selectedRows.removeClass( selectedClass );//反选之前已选中的行
			        $(this).toggleClass( selectedClass );

			        relate ();
			    } );
			}else{
				// 允许选中多行
			    tbody.on( 'click', 'tr', function () {
			        $(this).toggleClass( selectedClass );

			        relate ();
			    } );
			}

			// 对传入进来的relateButtons进行处理，找出哪些是禁用的
			// 如果它本身非禁用，则判断它为按钮组的父容器，然后在里面继续查找禁用的按钮
			if (relateButtons !== undefined && !relateButtons.is(':disabled')) {
				relateButtons = relateButtons.children('*:disabled');
				if (relateButtons.length <= 0) {
					relateButtons.children('*');
					console.warn('html标签中没有定义初始禁用的按钮组，默认初始化所有按钮都为禁用');
				}
			}

			// 有行选中时激活功能按钮
			function relate () {
				if (relateButtons !== undefined) {
					var selectedRows = tbody.find( 'tr.' + selectedClass );
					if (selectedRows.length > 0) {
						relateButtons.attr('disabled', false);
					}else{
						relateButtons.attr('disabled', true);
					}
				}
			}

			return this;
		}	

	});  
})(jQuery);
$(function() {
	$('.article-content table').addClass("table table-bordered table-hover");
});
/** 响应式sidebar 左侧菜单 **/
$(function() {
	//页面加载时初始化
	var sidebar = $('#sidebar');
	var sidebarContent = $('#sidebarContent');
	var sidebarBg = $('#sidebar-bg');

	var navHeight = (window.innerWidth < 768) ? 0 : 82;
	var floor = new Array();

	//点击显示菜单按钮
	$('#slider-menu').click(function(event) {
		if(sidebar.is(':hidden')) {
			sidebar.show();
			sidebarBg.css({
				"position": "fixed",
				"top": 0,
				"left": 0,
				"display": "block",
				"width": "100%",
				"height": "100%",
				"z-index": 1090,
				"background-color": "rgba(0,0,0,0.5)"
			});
		} else {
			sidebar.hide();
			sidebarBg.hide();
		}
	});
	//如果是手机屏幕, 点周空白处隐藏菜单
	sidebarBg.click(function() {
		sidebar.hide();
		sidebarBg.hide();
	});

	var buildAnchor = function() {
		var anchorLi = '';
		//将页面的h3作为锚点链接, 添加到导航菜单中
		$('.article-content h3').each(function() {
			floor.push($(this).offset().top);
			anchorLi += '<li><a>' + $(this).text() + '</a></li>';
		});

		//为新加的锚点裢接绑定跳转事件
		$('.left-anchor li').each(function() {
			$(this).click(function() {
				$(window).scrollTop(($('.article-content h3').eq($(this).index()).offset().top) - navHeight);
				if(window.innerWidth < 768) {
					$('#sidebar').hide();
					$('#sidebar-bg').hide();
				}
			});
		});
	}

	buildAnchor();

	//浮动菜单函数
	var flowMenu = function(validHeight) {
		if($('.main-container-row').offset().top < $(window).scrollTop() + navHeight) {
			sidebar.css({
				"position": "fixed",
				"width": sidebar.parent().width(),
				"height": validHeight,
				"top": navHeight
			});
		} else {
			sidebar.css({
				"position": "relative",
				"width": sidebar.parent().width(),
				"height": validHeight,
				"top": ""
			});
		}
	}

	//视口改变时
	$(window).resize(function() {
		navHeight = (window.innerWidth < 768) ? 0 : 82;
		sidebar.css({
			"width": sidebar.parent().width()
		});
		if(window.innerWidth >= 768) {
			sidebar.show();
			sidebarBg.hide();
			var validHeight = $('.main-container-row').offset().top + $('.main-container-row').outerHeight() - $(window).scrollTop() - navHeight;
			flowMenu(validHeight);
		} else {
			sidebar.hide();
			sidebarBg.hide();
		}
	});
	//页面滚动时
	$(window).scroll(function() {
		var aIndex = 0;
		//为菜单加active的class
		//row底部到视口顶部的距离, 元素顶部偏移 + 元素高度 - 滚动条偏移 - 固定导航条高度
		var validHeight = $('.main-container-row').offset().top + $('.main-container-row').outerHeight() - $(window).scrollTop() - navHeight;
		for(var i = 0; i < floor.length; i++) {
			if(floor[i] < ($(window).scrollTop() + navHeight + 10)) {
				aIndex = aIndex + 1;
			}
		}
		if(aIndex > 0) {
			aIndex = aIndex - 1;
		}
		var actLi = $('.left-anchor li').eq(aIndex);
		actLi.siblings().each(function() {
			$(this).children(':first').removeClass('left-active-sub')
		});
		actLi.children(':first').addClass('left-active-sub');

		//PC端时, 控制左边菜单列浮动显示
		if(window.innerWidth >= 768) {
			flowMenu(validHeight);
		}
	})
})

$(function() {
	function createAjax() {
		var oAjax;
		if(window.XMLHttpRequest) {
			oAjax = new XMLHttpRequest();
		} else {
			oAjax = new ActiveXObject("MicroSoft.XMLHTTP");
		}
		return oAjax
	}

	var oAjax = createAjax();
	oAjax.open('GET', 'json/list.json');
	oAjax.send();
	oAjax.onreadystatechange = function() {
		if(oAjax.readyState == 4) {
			if(oAjax.status == 200) {

				var strData = JSON.parse(oAjax.responseText)
				var oList = document.getElementById("list");
				var oLi = oList.getElementsByTagName("li");
				var str = "";

				//第一层标题
				for(var i = 0; i < strData.listDatas.length; i++) {
					oList.innerHTML += '<li><a href="javascript:;" class="ti">' + strData.listDatas[i].title + '</a><ul class="tit"></ul></li>'
				}

				var bIndex = 0;
				if(bIndex > 0) {
					bIndex = bIndex - 1;
				}
				var ctLi = $('#list li').eq(bIndex);
				ctLi.siblings().each(function() {
					$(this).children(':first').removeClass('left-active')
				});
				ctLi.children(':first').addClass('left-active');
				//第二层标题
				for(var i = 0; i < strData.listDatas.length; i++) {
					for(var j = 0; j < strData.listDatas[i].list.length; j++) {
						$(".tit").eq(i).html(function(index, value) {
							return value + '<li><a href="javascript:;" class="al">' + strData.listDatas[i].list[j].title + '</a><ul class="left-anchor ul"></ul></li>'
						})
					}
				}
				//第三层标题
				for(var i = 0; i < strData.listDatas.length; i++) {
					for(var j = 0; j < strData.listDatas[i].list.length; j++) {
						if(strData.listDatas[i].list[j].list) {
							for(var k = 0; k < strData.listDatas[i].list[j].list.length; k++) {
								$("#list > li").eq(i).find(".left-anchor").eq(j).html(function(index, value) {
									return value + '<li><a>' + strData.listDatas[i].list[j].list[k].title + "</a></li>"
								})
							}
						}
					}
				}
				//三级菜单切换
				var flog = true
				$(".al + ul").eq(0).removeClass("ul")
				$(".al").click(function() {
					$(this).siblings("ul").addClass("ul").removeClass("lu")
					if (flog = !flog) {
						$(this).siblings("ul").removeClass("ul").addClass("lu")
					}
				})
				var flo = true
				$("#list li .ti").siblings(".tit").addClass("ul")
				$("#list li .ti").eq(0).siblings(".tit").addClass("lu")
				$("#list li .ti").click(function() {
					if ($("#list li .ti").hasClass("left-active")) {
						$("#list li .ti").removeClass("left-active")
						$(this).addClass("left-active")
					} else {
						$(this).addClass("left-active")
						$("#list li .ti").removeClass("left-active")
					}
					$(this).siblings(".tit").addClass("ul").removeClass("lu")
					if (flo = !flo) {
						$(this).siblings(".tit").removeClass("ul").addClass("lu")
					}
				})
			} else {
				alert("失败")
			}
		}
	}
})
$(function() {
	/**通用-banner大图自定义缩放**/
	var zoomWidth = 992; //所有小于992px的视口都会对原图进行缩放, 只是缩放比例不同
	var maxWidth = 1920; //最大宽度1920px
	var ratio = 1; //缩放比例
	var viewWidth = window.innerWidth;
	var zoomSlider = function() {
		if(viewWidth < 768) {
			ratio = viewWidth / zoomWidth;
		} else if(viewWidth < zoomWidth) {
			ratio = zoomWidth / (zoomWidth + (zoomWidth - 750));
		} else {
			ratio = 1;
		}
		var width = maxWidth * ratio;
		$(".my-slide img").each(function() {
			$(this).css({
				"width": width,
				"max-width": width,
				"margin-left": -(width - viewWidth) / 2
			})
		})
	}
	/**通用-我们的成绩等数字滚动特效**/
	var numOptions = {
		useEasing: true,
		useGrouping: true,
		separator: ',',
		decimal: '.',
		prefix: '',
		suffix: ''
	}
	var numGroup = new Array(
		new CountUp("sum-apply", 0, 18397, 0, 2.5, numOptions),
		new CountUp("sum-rate", 0, 98.8, 1, 2.5, numOptions),
		new CountUp("sum-urgent", 0, 3273, 0, 2.5, numOptions),
		new CountUp("urgent-rate", 0, 100, 0, 2.5, numOptions)
	);
	var runNumber = function() {
		$('.run-number').each(function() {
			var oTop = $(this).offset().top;
			var sTop = $(window).scrollTop();
			var oHeight = $(this).height();
			var oIndex = $(this).index('.run-number');
			if(oTop >= sTop && (oTop + (oHeight / 2)) < (sTop + $(window).height())) {
				numGroup[oIndex].start();
			}
		})
	}

	zoomSlider(); //页面加载时初始化并检查一次.
	runNumber(); //页面加载时判断一次
	/**视口发生变化时的事件**/
	$(window).resize(function() {
		viewWidth = window.innerWidth; // 重置视口宽度
		zoomSlider(); //判断是否绽放banner
		runNumber(); //判断是否执行动画
	})
	/**滚动事件**/
	$(window).scroll(function() {
		runNumber();
	})

	//首页-我们的服务
	$('.card-item').each(function() {
		$(this).mouseover(function() {
			$(this).addClass('card-active');
			$(this).siblings().removeClass('card-active');
			$(this).find(".btn").addClass('btn-outline-inverse').removeClass('btn-outline-blue');
			$(this).siblings().find(".btn").addClass('btn-outline-blue').removeClass('btn-outline-inverse');
		})
	})
})
// Modal
$('#reg_btn, #login_btn').on('click', function () {
	$('body, #navbar').css({
		overflow: 'auto',
		'padding-right': 0
	})
})

// section03 的 .active 問題 ----------------------------------------------
$('#race a').on('click', function () {
	$('#race a').removeClass('active')
	$(this).addClass('active')
})

// swiper ----------------------------------------------------------------
const swiper = new Swiper('#swiper', {
	direction: 'horizontal',
	loop: true,
	speed: 1000,
	spaceBetween: 15,
	centeredSlides: true, // 將 item 放置在中間，開始時第一張惠在正中間
	autoplay: {
		delay: 50000000
	},
	slidesPerView: 'auto', // 依照每個 item 的寬度自動調整顯示的數量
	effect: 'coverflow',
	coverflowEffect: {
		rotate: 50,
		stretch: 0,
		depth: 100,
		modifier: 1,
		slideShadows: true
	},

	breakpoints: {
		576: {
			slidesPerView: 2
		},
		768: {
			slidesPerView: 3
		},
		992: {
			slidesPerView: 3
		},
		1200: {
			slidesPerView: 4
		}
	},

	pagination: {
		el: '.swiper-pagination',
		clickable: true,
		dynamicBullets: false
	},

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
	}
})

// GSAP ------------------------------------------------------------------
// 註冊 Plugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText)

$('#navbar .main-link, .backtop a').each(function (index, link) {
	$(this).on('click', function (e) {
		e.preventDefault() // 阻止 a 連結預設動作
		if ($(this).attr('href') == '#section04' || $(this).attr('href') == '#section05') {
			gsap.to(window, {
				scrollTo: {
					y: `#section0${index + 1}`
				},
				duration: 1.5,
				ease: 'back.inOut'
			})
		} else {
			gsap.to(window, {
				scrollTo: {
					y: `#section0${index + 1}`,
					offsetY: 150
				},
				duration: 1.5,
				ease: 'back.inOut'
			})
		}
	})
})

// 導覽列 active ---------------------------------------------------------
$('.main-link').each(function (index, link) {
	let id = $(link).attr('href') // jq 的 getter
	// console.log(link, id)
	gsap.to(link, {
		scrollTrigger: {
			trigger: `${id}`,
			start: 'top center',
			end: 'bottom center',
			toggleClass: {
				targets: link,
				className: 'active'
			}
			// markers: true
		}
	})
})

// 導覽列收合 -------------------------------------------------------------
const tween = gsap.from('#navbar', {
	yPercent: -100,
	paused: false,
	duration: 0.5,
	scrollTrigger: {
		start: 'top 60',
		end: () => '+=' + document.documentElement.scrollHeight, // 抓到整個文件的高度
		onEnter(self) {
			// console.log(self)
			self.animation.play()
		},
		// onUpdate 是在 scrollTrigger 處於活動狀態時，每次滾動時都會觸發
		onUpdate(self) {
			// console.log(self.direction)
			self.direction === -1 ? self.animation.play() : self.animation.reverse() // -1 往上正向播放， 1 往下反向播放
			// if (self.direction === -1) {
			// 	self.animation.play()
			// } else {
			// 	self.animation.reverse()
			// }
		}
		// markers: true
	}
})

// 霧的動畫 ---------------------------------------------------------------
$('.fog').each(function (index, fog) {
	// gsap.set() 可以設定當下 fog 的初始值
	gsap.set(fog, {
		width: '100%',
		height: '100%',
		background: `url('./images/fog.png') no-repeat center/80%`,
		opacity: 0.8,
		position: 'fixed',
		top: 'random(0, 100)' + '%',
		x: function () {
			// console.log(index)
			// 0,1,2,3
			// 0,2(一組) => 畫面外的左邊
			// ，1,3(一組) => 畫面外的右邊
			return index % 2 == 0 ? -$(window).width() : $(window).width()
		}
	})
	// gsap.to() 可以設定 fog 的動畫
	gsap.to(fog, {
		x: function () {
			return index % 2 == 0 ? $(window).width() : -$(window).width()
		},
		// 當動畫重複播放時，將霧的位置隨機設定
		onRepeat() {
			$(fog).css({
				top: gsap.utils.random(0, 100) + '%'
			})
		},
		duration: 60,
		repeat: -1,
		ease: 'none'
	})
})

// 星空背景 ---------------------------------------------------------------
gsap.to('body', {
	scrollTrigger: {
		trigger: 'body',
		start: 'top 0%',
		end: 'bottom 0%',
		scrub: 5,
		markers: true
	},
	backgroundPosition: '50% 100%',
	// scale: 0,
	// rotation: 3600,
	// opacity: 0,
	ease: 'none'
})

// backtop ----------------------------------------------------------------
gsap.to('.backtop', {
	scrollTrigger: {
		trigger: '#footer',
		start: 'top bottom',
		end: '100% bottom',
		toggleActions: 'play none none reverse'
		// markers: true
	},
	display: 'block',
	opacity: 1,
	duration: 1
})

// 流星 --------------------------------------------------------------------
// 1.創建流星的數目
function createStar(starNumber) {
	for (let i = 0; i < starNumber; i++) {
		$('.shooting_star').append('<div class=star></div>')
	}
	// const stars = document.querySelectorAll('.star')
	// console.log(stars)
	// const stars = Array.from(document.querySelectorAll('.star'))
	const stars = gsap.utils.toArray('.star') // 轉成一般陣列
	return stars
}

// 2.設定流星補間動畫的預設值
function setStarTween(stars) {
	gsap.set('.shooting_star', {
		perspective: 800 // 讓整個舞台有 3D 效果(透視遠近的感覺)
	})

	stars.forEach(function (star, index) {
		gsap.set(star, {
			transformOrigin: '0 50%', // 以左邊中央為基準點
			position: 'absolute',
			left: gsap.utils.random($(window).width() / 2, $(window).width() * 2), // 假設 window 寬度 1000， 1000/2 = 500，1000*2 = 2000
			top: gsap.utils.random(-100, -200),
			rotation: -25
		})
	})

	return stars
}

// 3.設定流星群的動畫
function playStarTimeline(stars) {
	const tl = gsap.timeline({
		repeat: -1
	})
	tl.to(stars, {
		x: `-=${$(window).width() * 1.5}`, // 流星往左
		y: `+=${$(window).height() * 1.5}`, // 流星往下
		z: `random(-100, 500)`,
		stagger: function (index, target, targets) {
			return gsap.utils.random(index + 5, (index + 5) * 2, 1)
		},
		duration: 'random(0.5, 3, 0.1)', // 0.5、0.6、0.7......3 其中一個
		ease: 'none'
	})
}

// 管道設計模式，可以將一整個功能拆解成多個小功能
// 會將函式功能串接在一起，第一個函式回傳值會傳給第二個函式，第二個函式回傳值會傳給第三個函式，以此類推....
const playStar = gsap.utils.pipe(createStar, setStarTween, playStarTimeline) // 會產生一個入口函式
playStar(30)

// 浮空的島 ---------------------------------------------------------------
const float_tl = gsap.timeline({
	scrollTrigger: {
		trigger: 'body',
		start: 'top 100%',
		end: 'bottom 100%',
		scrub: 5
	},
	ease: 'none'
})

// 用外容器去控制進場(左、右、下)
float_tl
	.from('.float-wrap-01', {
		left: '-30%'
	})
	.from(
		'.float-wrap-02',
		{
			right: '-30%'
		},
		'<'
	)
	.from(
		'.float-wrap-03',
		{
			bottom: '-100%'
		},
		'<'
	)

// 用本身去控制上下浮動
$('.float-island').each(function (index, island) {
	gsap.to(island, {
		y: 50 * (index + 1),
		duration: 10 * (index + 1),
		repeat: -1,
		yoyo: true,
		ease: 'power1,inOut'
	})
})

// SplitText -------------------------------------------------------------
gsap.set('#splitText', {
	perspective: 400 // 值越小透視效果越強
})

const tl = gsap.timeline({
	repeat: -1,
	repeatDelay: 8
})

// 將段落文字轉成陣列
const paragraphs = gsap.utils.toArray('#splitText p')
console.log(paragraphs) // [p, p ,p ,p ,p]

/*
最外面這個是 map 回傳的陣列容器
[
	 ['char', 'char', 'char', 'char', 'char'....],   <--- SplitText
	 ['char', 'char', 'char', 'char', 'char'....],   <--- SplitText
	 ['char', 'char', 'char', 'char', 'char'....],   <--- SplitText
	 ['char', 'char', 'char', 'char', 'char'....],   <--- SplitText
	 ['char', 'char', 'char', 'char', 'char'....]    <--- SplitText
]
*/
const splitTexts = paragraphs.map(function (p) {
	// ['char', 'char', 'char', 'char', 'char'....]
	return new SplitText(p, {
		type: 'chars',
		charsClass: 'charBg'
	})
})

console.log(splitTexts) // [[SplitText], [SplitText], [SplitText], [SplitText], [SplitText]]

splitTexts.forEach(function (splitText) {
	const chars = splitText.chars
	// 進場動畫
	tl.from(
		chars,
		{
			y: 80,
			rotationX: 0,
			rotationY: 180,
			scale: 2,
			transformOrigin: '0% 50% -100',
			opacity: 0,
			duration: 2,
			ease: 'back',
			stagger: 0.1,
			// 離場動畫
			onComplete() {
				gsap.to(chars, {
					delay: 3, // 延遲 3 秒
					duration: 2,
					opacity: 0,
					scale: 2,
					y: 80,
					rotationX: 180,
					rotationY: 0,
					transformOrigin: '0% 50% -100',
					ease: 'back',
					stagger: 0.1
				})
			}
		},
		'+=3' // 下一組動畫必須延遲 3 秒才能進場，因為前一組離場動畫有設定延遲 3 秒
	)
})

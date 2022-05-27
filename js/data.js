// 导航列表
let guideTabListData = [
    {
        title: '编程',
        num: 1,
    },
    {
        title: '在线观影',
        num: 2,
    },
    {
        title: '电子书',
        num: 3,
    },
    {
    	title: '在线工具',
    	num: 4,
    }
];


let guideTabGroupListData = [];


let learning = [
	{
		num: 1,
		data:[
			{
				num: 1,
				img: 'img/1.1.png',
				src: 'https://blog.csdn.net/Day_and_Night_2017',
				alt: '我在csdn'
			},
			{
				num: 2,
				img: 'img/1.1.png',
				src: 'https://www.cnblogs.com/',
				alt: 'cnblogs'
			},
			{
				num: 3,
				img: 'img/1.3.png',
				src: 'https://www.learnfk.com/',
				alt: '无涯教程'
			},
			{
				num: 4,
				img: 'img/default.png',
				src: 'https://www.geeksforgeeks.org/',
				alt: '极客算法'
			},
			{
				num: 5,
				img: 'img/1.5.png',
				src: 'https://mvnrepository.com/',
				alt: 'maven库'
			},
			{
				num: 6,
				img: 'img/1.6.png',
				src: 'https://space.bilibili.com/14163840/channel/seriesdetail?sid=433088',
				alt: '黎曼猜想'
			},
			{
				num: 7,
				img: 'img/1.6.png',
				src: 'https://www.bilibili.com/video/BV18L4y1p7n8?spm_id_from=333.337.search-card.all.click',
				alt: '科目三视频'
			}
			
		]
	}
]

let movies = [
	{
		num: 2,
		data:[
			{
				num: 1,
				img: 'img/2.1.png',
				src: 'http://vip.runker.net/',
				alt: '行客影视'
			},
			{
				num: 2,
				img: 'img/default.png',
				src: 'https://www.zhenbuka3.com/',
				alt: '真不卡'
			},
			{
				num: 3,
				img: 'img/2.3.png',
				src: 'http://www.gjw123.com/tools-dyss',
				alt: '电影狗'
			},
			{
				num: 4,
				img: 'img/2.4.png',
				src: 'http://www.tieren5.com/',
				alt: '铁人影院'
			},
			{
				num: 6,
				img: 'img/2.6.png',
				src: 'https://www.bingdou.wang/live',
				alt: '冰豆直播'
			}


			
		]
	}
]

let books = [
	{
		num: 3,
		data:[
			{
				num: 1,
				img: 'img/3.1.png',
				src: 'https://salttiger.com/archives/',
				alt: '盐老虎'
			},
			{
				num: 2,
				img: 'img/default.png',
				src: 'https://www.letmeread.net/',
				alt: 'letmeread'
			},
			{
				num: 3,
				img: 'img/3.3.png',
				src: 'https://book.zhishikoo.com/',
				alt: '知识库'			
			},
			{
				num: 4,
				img: 'img/3.4.png',
				src: 'https://coderprog.com/',
				alt: 'coderprog'			
			},
			{
				num: 5,
				img: 'img/3.5.png',
				src: 'http://www.iebukes.com/',
				alt: 'iebukes'			
			},
			{
				num: 6,
				img: 'img/3.6.png',
				src: 'https://www.bookstack.cn/',
				alt: '书栈网'			
			},
			{
				num: 7,
				img: 'img/3.7.png',
				src: 'https://libgen.unblockit.blue/',
				alt: 'libgen'			
			},
			{
				num: 8,
				img: 'img/3.8.png',
				src: 'https://downloadpdf.cn/index.html',
				alt: 'PDF下载之家'			
			},
			{
				num: 9,
				img: 'img/3.9.png',
				src: 'https://sobooks.net/',
				alt: 'sobooks'			
			},
			{
				num: 10,
				img: 'img/3.10.png',
				src: 'https://www.cmsblogs.com/',
				alt: 'Java技术驿站'			
			},
			{
				num: 11,
				img: 'img/3.11.png',
				src: 'https://javanote.doc.lewky.cn/#/README',
				alt: 'JavaNote'			
			},
			{
				num: 12,
				img: 'img/3.12.png',
				src: 'http://www.dushu369.com/',
				alt: '读书369'			
			},
			{
				num: 13,
				img: 'img/3.13.png',
				src: 'https://elib.cc/',
				alt: 'elib'			
			},
			{
				num: 14,
				img: 'img/3.14.png',
				src: 'https://zh.zlibrary.org/',
				alt: 'zlibrary'			
			},
			{
				num: 15,
				img: 'img/3.15.png',
				src: 'https://yabook.blog/',
				alt: '雅书'			
			},
			{
				num: 16,
				img: 'img/3.16.png',
				src: 'https://itpcb.com/',
				alt: 'itpcb'			
			},
			{
				num: 17,
				img: 'img/default.png',
				src: 'https://goalkicker.com/',
				alt: 'goalkicker'			
			},
			{
				num: 18,
				img: 'img/default.png',
				src: 'https://freepdf-books.com/#%20PDF.zip',
				alt: 'freepdf-books'			
			},
			{
				num: 19,
				img: 'img/default.png',
				src: 'http://www.banshujiang.cn/',
				alt: '搬书匠'			
			},
			{
				num: 20,
				img: 'img/default.png',
				src: 'https://ifeve.com/',
				alt: '并发编程网'			
			}
	
		]
	}
]

let tools = [
	{
		num: 4,
		data:[
			{
				num: 1,
				img: 'img/4.1.png',
				src: 'https://www.toolfk.com/',
				alt: 'tooLFK'
			},
			{
				num: 2,
				img: 'img/default.png',
				src: 'https://cdnjs.com/libraries',
				alt: '免费cdn'
			},
			{
				num: 3,
				img: 'img/default.png',
				src: 'https://www.iconfont.cn/',
				alt: '阿里巴巴Icon'
			},
			{
				num: 4,
				img: 'img/4.4.png',
				src: 'https://www.toolnb.com/',
				alt: '爱资料在线工具'
			},
			{
				num: 5,
				img: 'img/4.5.png',
				src: 'https://tools.sixyin.com/',
				alt: '六音工具箱'
			},
			{
				num: 6,
				img: 'img/default.png',
				src: 'https://www.vmgirls.com/',
				alt: '唯美女生壁纸'
			},
			{
				num: 7,
				img: 'img/default.png',
				src: 'https://onlineconvertfree.com/',
				alt: '在线格式转换'
			},
			{
				num: 8,
				img: 'img/default.png',
				src: 'https://wallhaven.cc/toplist',
				alt: 'wallhaven'
			},
			{
				num: 9,
				img: 'img/4.9.png',
				src: 'https://www.umeitu.com/',
				alt: '优美图库'
			},
			{
				num: 10,
				img: 'img/4.10.png',
				src: 'https://t2cy.com/',
				alt: '推次元'
			},
			{
				num: 11,
				img: 'img/default.png',
				src: 'https://www.yalayi.com/',
				alt: '雅拉依'
			},
			{
				num: 12,
				img: 'img/4.12.png',
				src: 'http://www.netbian.com/',
				alt: '彼岸壁纸'
			},
			{
				num: 13,
				img: 'img/4.13.png',
				src: 'https://mobile.alphacoders.com/',
				alt: 'alphacoders'
			},
			{
				num: 14,
				img: 'img/4.14.png',
				src: 'https://www.520mojing.com/',
				alt: '魔镜街拍'
			},
			{
				num: 15,
				img: 'img/4.15.png',
				src: 'https://www.yasuotu.com/jiazi',
				alt: '在线图片编辑'
			},
			{
				num: 16,
				img: 'img/default.png',
				src: 'https://bz.zzzmh.cn/index',
				alt: '极简壁纸'
			},
			{
				num: 17,
				img: 'img/4.17.png',
				src: 'https://wallpaper.zhhainiao.com/3000/dynamicWallpaper',
				alt: '元气壁纸'
			},
			{
				num: 18,
				img: 'img/4.18.png',
				src: 'http://tooool.org/',
				alt: '程序员导航'
			},
			{
				num: 19,
				img: 'img/default.png',
				src: 'https://www.matheditor.cn/#fractions-and-binomials',
				alt: '在线公式编辑'
			},
			{
				num: 20,
				img: 'img/default.png',
				src: 'https://www.omegaxyz.com/mypage/wallpaper/',
				alt: 'wallpaper'
			},
			{
				num: 21,
				img: 'img/4.21.png',
				src: 'https://mm.enterdesk.com/bizhi/64629.html',
				alt: '回车桌面'
			},
			{
				num: 22,
				img: 'img/default.png',
				src: 'http://suxieban.com/#',
				alt: '在线画板'
			},
			{
				num: 23,
				img: 'img/default.png',
				src: 'https://dimgw.us/',
				alt: 'DIMG'
			},
			{
				num: 24,
				img: 'img/4.24.png',
				src: 'https://www.lanzoui.com/',
				alt: '蓝奏云'
			},
			{
				num: 25,
				img: 'img/4.25.png',
				src: 'https://www.4kbizhi.com/',
				alt: '高清壁纸'
			},
			{
				num: 26,
				img: 'img/4.26.png',
				src: 'https://pic.netbian.com/',
				alt: '彼岸图网'
			},
			{
				num: 27,
				img: 'img/4.27.png',
				src: 'http://bizhi360.com/',
				alt: '壁纸360'
			},
			{
				num: 28,
				img: 'img/4.28.png',
				src: 'https://www.sojson.com/',
				alt: 'Json在线解析'
			},

			
			
		]
	}
]

guideTabGroupListData = guideTabGroupListData.concat(learning);
guideTabGroupListData = guideTabGroupListData.concat(movies);
guideTabGroupListData = guideTabGroupListData.concat(books);
guideTabGroupListData = guideTabGroupListData.concat(tools);
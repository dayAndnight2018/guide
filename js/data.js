// 导航列表
let guideTabListData = [{
		title: '编程',
		num: 0,
	},
	{
		title: '进阶',
		num: 1,
	},
	{
		title: '在线影音',
		num: 2,
	},
	{
		title: '电子书',
		num: 3,
	},
	{
		title: '开发效能',
		num: 4,
	},
	{
		title: '壁纸',
		num: 5,
	},
	{
		title: '在线工具',
		num: 6,
	},
	{
		title: 'Windows应用',
		num: 7
	},
	{
		title: 'Mac应用',
		num: 8
	},
	{
		title: '时事新闻',
		num: 9
	}
];


let guideTabGroupListData = [];

let program = [{
	num: 0,
	data: [{
			src: 'https://blog.csdn.net/Day_and_Night_2017',
			alt: '我在csdn'
		},
		{
			src: 'https://www.cnblogs.com',
			alt: 'cnblogs'
		},
		{
			src: 'https://gitee.com/',
			alt: 'Gitee'
		},
		{
			src: 'https://github.com/',
			alt: 'Github'
		},
		{
			src: 'https://mvnrepository.com',
			alt: 'maven库'
		},
		{
			src: 'https://juejin.cn/backend',
			alt: '掘金'
		},
		{
			src: 'http://doc.redisfans.com/',
			alt: 'Redis文档'
		},
		{
			src: 'https://yiyan.baidu.com/',
			alt: '文心一言'
		},
		{
			src: 'https://chat.deepseek.com/',
			alt: 'DeepSeek'
		}

	]
}]

let learning = [{
	num: 1,
	data: [{
			src: 'https://www.geeksforgeeks.org',
			alt: '极客算法'
		},
		{
			src: 'https://space.bilibili.com/14163840/channel/seriesdetail?sid=433088',
			alt: '黎曼猜想'
		},
		{
			src: 'https://books.halfrost.com/leetcode/ChapterTwo/Array',
			alt: 'Leetcode解析'
		}, {
			src: 'https://hellokoding.com',
			alt: 'HelloKoding'
		}, {
			src: 'https://doocs.github.io/jvm/00-quickstart.html',
			alt: 'JVM解析'
		}, {
			src: 'http://www.cyc2018.xyz',
			alt: 'JAVA八股文'
		}, {
			src: 'https://crossoverjie.top/JCSprout',
			alt: 'JCSprout'
		}, {
			src: 'https://tobebetterjavaer.com/home.html',
			alt: 'JAVA进阶'
		}, {
			src: 'https://javaguide.cn/home.html',
			alt: 'JAVA Guide'
		}, {
			src: 'https://pdai.tech',
			alt: 'JAVA 全栈'
		}, {
			src: 'https://dayAndnight2018.github.io/career-exam',
			alt: '事业单位'
		}, {
			src: "https://www.javacn.site/interview/basic",
			alt: "javacn"
		}
	]
}]

let movies = [{
	num: 2,
	data: [{
			src: 'https://dayandnight2018.github.io/online-music/',
			alt: '云音乐'
		},
		{
			src: 'https://tool.liumingye.cn/music',
			alt: 'MyFreeMP3'
		},
		{
			src: "http://www.htqyy.com/",
			alt: "轻音乐"
		},
		{
			src: 'https://55me7.art/',
			alt: '555影视'
		},
		{
			src: 'https://www.runker.live',
			alt: '行客影视'
		},
		{
			src: 'http://www.gjw123.com/tools-dyss',
			alt: '电影狗'
		},
		{
			src: 'http://www.tieren5.com',
			alt: '铁人影院'
		},
		{
			src: 'http://www.bingdou.live',
			alt: '冰豆直播'
		},
		{
			src: 'http://www.bingdou.wang/movie',
			alt: '冰豆影视'
		},
		{
			src: "http://xiepp.com/movie/list",
			alt: "80电影网"
		},
		{
			src: "https://www.88mv.org/",
			alt: "88影视网"
		},
		{
			src: "https://www.languang.pro/",
			alt: "蓝光影院"
		},
		{
			src: "https://www.yangshipin.cn/resource/pool",
			alt: "央视频"
		},
		{
			src: "https://www.qiuxia678.com/",
			alt: "看看屋"
		},
		{
			src: "https://www.xyys.uk/",
			alt: "星云影视"
		},
		{
			src: "https://libvio.art/",
			alt: "libvio"
		},
		{
			src: "https://www.jscrzn.com/",
			alt: "火机影视"
		},
		{
			src: "https://www.jqqzx.me/type/juji.html",
			alt: "jqqzx"
		},
		{
			src: "https://www.sunnafh.com/",
			alt: "新视讯"
		},
		{
			src : "https://www.haitu.xyz/",
			alt: "海兔影视"
		},
		{
			src: "https://www.dsx888.com/",
			alt : "大师兄影视"
		},
		{
			src: "https://tv.cctv.com/",
			alt: "CCTV"
		}

		
		

	]
}]

let books = [{
	num: 3,
	data: [{
			src: 'https://salttiger.com/archives',
			alt: '盐老虎'
		},
		{
			src: 'https://www.letmeread.net',
			alt: 'letmeread'
		},
		{
			src: 'https://book.zhishikoo.com',
			alt: '知识库'
		},
		{
			src: 'https://www.bookstack.cn',
			alt: '书栈网'
		},
		{
			src: 'https://downloadpdf.cn/index.html',
			alt: 'PDF下载之家'
		},
		{
			src: 'https://javanote.doc.lewky.cn/#/README',
			alt: 'JavaNote'
		},
		{
			src: 'https://goalkicker.com',
			alt: 'goalkicker'
		},
		{
			src: 'https://freepdf-books.com/#%20PDF.zip',
			alt: 'freepdf-books'
		},
		{
			src: 'http://www.banshujiang.cn',
			alt: '搬书匠'
		},
		{
			src: 'https://ifeve.com',
			alt: '并发编程网'
		}, {
			src: 'https://www.book345.com',
			alt: '无名图书'
		}, {
			src: 'https://foxgreat.com',
			alt: 'foxgreat'
		}, {
			src: 'https://jc.pep.com.cn',
			alt: '人民教育出版社'
		}, {
			src: 'https://www.zxx.edu.cn',
			alt: '国家中小学智慧教育平台'
		}, {
			src: 'https://oceanofpdf.com',
			alt: 'PDF海洋'
		},{
			src: "https://zh.kid1412.icu/",
			alt: "Zlibrary"
		}
	]
}]

let developTools = [{
	num: 4,
	data: [{
			src: 'https://www.sojson.com',
			alt: 'Json在线解析'
		},
		{
			src: 'https://mirrors.tuna.tsinghua.edu.cn',
			alt: '清华镜像'
		},
		{
			src: 'https://mirrors.huaweicloud.com/home',
			alt: '华为镜像'
		},
		{
			src: 'https://transfonter.org/',
			alt: '字体到css转换'
		},
		{
			src: 'https://docs.avaloniaui.net/',
			alt: 'Avalonia文档'
		},
		{
			src: 'https://www.sojson.com/',
			alt: 'JSON在线工具'
		},
		{
			src: 'https://github.com/AvaloniaUI/Avalonia/blob/master/src/Avalonia.Themes.Fluent/Controls/Button.xaml',
			alt: 'Fluent样式源码'
		},
		{
			src: 'https://tool.lu/timestamp',
			alt: '在线时间戳转换'
		},
		{
			src: 'https://www.processon.com',
			alt: '在线流程图'
		},
		{
			src: 'https://www.iodraw.com/gantt',
			alt: '在线甘特图'
		},
		{
			src: 'https://excalidraw.com/',
			alt: '在线绘图'
		},
		{
			src: 'https://www.jyshare.com/more/kitymind/index.html',
			alt: '在线思维导图1'
		},
		{
			src: 'https://www.jyshare.com/more/mind-map/index.html#/',
			alt: '在线思维导图2'
		},
		{
			src: 'https://www.mindline.cn/webapp',
			alt: '在线思维导图3'
		},
		   {
			   src: "https://drawnix.com/",
			   alt: "在线绘图"
		   },
		{
			src: 'https://app.diagrams.net/',
			alt: 'drawIO'
		},
		
		
		{
			src: 'https://www.iconfont.cn',
			alt: '阿里巴巴Icon'
		},
		{
			src: 'https://www.toolfk.com',
			alt: 'tooLFK'
		},
		{
			src: 'https://cdnjs.com/libraries',
			alt: '免费cdn'
		},
		{
			src: 'https://www.toolnb.com',
			alt: '爱资料在线工具'
		},
		{
			src: 'https://imgse.com',
			alt: '路过图床'
		},
		{
			src: 'https://pic.codess.cc/',
			alt: '书生图床'
		},
		{
			src: 'https://postimages.org/',
			alt: 'postimages图床'
		},
		{
			src: 'https://imgbox.com/',
			alt: 'imgbox图床'
		},
		{
			src: 'https://www.imagehub.cc/',
			alt: 'imagehub'
		},
		{
			src: 'https://img.tg/',
			alt: 'img图床'
		},
		{
			src: 'https://www.imgurl.org/',
			alt: 'imgurl图床'
		},
		{
			src: 'https://www.diffchecker.com/text-compare',
			alt: '在线diff'
		},
		{
			src: 'https://www.jq22.com',
			alt: 'Jquery效果'
		},
		{
			src: 'https://www.pppet.net/',
			alt: 'cron表达式解析'
		},
		{
			src: 'https://www.lddgo.net/string/line-reduce#toolNoteIframe',
			alt: 'sql合并到一行'
		},
		{
			src: 'https://www.html5tricks.com/',
			alt: 'html5tricks'
		},
		 {
			src: 'https://www.iodraw.com/gantt',
			alt: '在线甘特图'
		}
	]
}]

let pictures = [{
	num: 5,
	data: [	
		{
			src: 'https://www.yalayi.com',
			alt: '雅拉依'
		},
		{
			src: 'http://www.netbian.com',
			alt: '彼岸壁纸'
		},
		{
			src: 'https://www.520mojing.com',
			alt: '魔镜街拍'
		},
		{
			src: 'https://bz.zzzmh.cn/index',
			alt: '极简壁纸'
		},
		{
			src: 'https://wallpaper.zhhainiao.com/3000/dynamicWallpaper',
			alt: '元气壁纸'
		},
		{
			src: 'https://mm.enterdesk.com/bizhi/64629.html',
			alt: '回车桌面'
		},
		{
			src: 'https://www.4kbizhi.com',
			alt: '高清壁纸'
		},
		{
			src: 'https://pic.netbian.com',
			alt: '彼岸图网'
		},
		{
			src: 'http://bizhi360.com',
			alt: '壁纸360'
		},
		{
			src: 'https://www.omegaxyz.com/mypage/wallpaper',
			alt: 'wallpaper'
		}
	]
}]

let tools = [{
	num: 6,
	data: [{
			src: 'https://onlineconvertfree.com',
			alt: '在线格式转换'
		},
		{
			src: 'https://www.yasuotu.com/jiazi',
			alt: '在线图片编辑'
		},
		{
			src: 'http://lovert.net/##',
			alt: '在线公式编辑'
		},
		{
			src: 'http://suxieban.com',
			alt: '在线画板'
		},
		{
			src: 'https://www.lanzoui.com',
			alt: '蓝奏云'
		},

		{
			src: 'https://www.16personalities.com/ch',
			alt: '十六种人格'
		}, {
			src: 'https://studio.metamaker.cn/#/cover',
			alt: '企业卡通形象'
		}, {
			src: 'https://tools.sixyin.com',
			alt: '六音工具箱'
		}, {
			src: 'https://www.photopea.com/',
			alt: '在线PS'
		}, {
			src: 'https://easypdf.com/cn/',
			alt: '在线PDF转换'
		}, {
			src: 'https://www.zhaozi.cn/s/all/freebusiness/',
			alt: '在线免费字体'
		}, {
			src: 'https://hipstersound.com/ambience.html',
			alt: '白噪声'
		},{
			src: 'https://www.tutjiexi.com/',
			alt: "去水印"
		}
	]
}]

let win_soft = [{
	num: 7,
	data: [{
			src: 'https://www.bear20.com/',
			alt: '小熊下载站'
		},
		{
			src: 'https://www.foxitsoftware.cn/pdf-reader/',
			alt: '福昕PDF阅读器'
		},
		{
			src: "https://dev.mysql.com/downloads/workbench/",
			alt: "mysql workbench"
		},
		{
			src: "https://registry.npmmirror.com/binary.html?path=git-for-windows",
			alt: "Git安装包镜像"
		},
		{
			src: "https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html",
			alt: "JDK8"
		}
	]
}]

let mac_soft = [{
	num: 8,
	data: [{
			src: 'https://xclient.info',
			alt: '精品Mac应用'
		},
		{
			src: 'https://www.inpandora.com/code',
			alt: '潘多拉盒子'
		},
		{
			src: 'https://maczz.net',
			alt: 'MacZZ'
		},
		{
			src: 'https://www.macbl.com',
			alt: '马可菠萝'
		},
		{
			src: 'https://macwk.cn',
			alt: 'MacWk'
		},
		{
			src: 'https://www.digit77.com',
			alt: 'digit77'
		},
		{
			src: 'https://www.xmac.im',
			alt: 'xMac'
		},
		{
			src: 'https://appstorrent.ru',
			alt: 'appStorrent'
		},
		{
			src: 'https://www.nbdm.net/mac.html',
			alt: '软件下载'
		}


	]
}]

let news = [{
	num: 9,
	data: [{
			src: 'https://tougao.12371.cn/wenhui.php',
			alt: '先锋文汇'
		},
		{
			src: 'http://www.news.cn/politics/xxjxs/index.htm',
			alt: '学习进行时-新华网'
		},
		{
			src: 'http://cpc.people.com.cn/',
			alt: '人民网'
		},
		{
			src: 'http://www.xinhuanet.com/comments/index.html',
			alt: '新华网评'
		},
		{
			src: 'http://opinion.people.com.cn/',
			alt: '观点-人民网'
		},
		{
			src: 'http://paper.people.com.cn/rmrb/html/2024-06/02/nbs.D110000renmrb_01.htm',
			alt: '人民日报'
		},
		{
			src: 'http://www.qstheory.cn/',
			alt: '求是网'
		},
		{
			src: 'https://www.gkzenti.cn/',
			alt: '题库'
		},
		{
			src: 'https://wanxuege.com/forum-84-1.html',
			alt: '万学阁'
		},
		{
			src: 'https://www.fenbi.com/spa/tiku/guide/catalog/xingce?prefix=xingce',
			alt: '粉笔'
		},
		{
			src: 'https://www.kdocs.cn/l/ctYoDB9lU4o9',
			alt: '学习目录'
		},
		{
			src: 'https://www.wolai.com/shangan/eTk9MfMbm1AtJUa4SrwREC',
			alt: '沉思录'
		},
		{
			src: 'https://www.kdocs.cn/l/cdgatQ7bYlp4?openfrom=docs',
			alt: '汇总'
		},
		{
			src: 'https://px43sfnrcga.feishu.cn/wiki/Fv95wcFALio3aVkEvmScsik3nSd',
			alt: '资源目录'
		},
		{
			src: 'https://www.wolai.com/shangan/jejhnq1rDBh7bPUmrEKrCz',
			alt: '基期'
		},
		{
			src: 'https://plan.zygwy.cn/admin',
			alt: '竹叶'
		},
		{
			src: 'http://gongkao66688.edudisk.cn/webfile.aspx',
			alt: '教程'
		},
		{
			src: 'http://gongkao66688.edudisk.cn/ContentPane.aspx?Path=%2f2025%c4%ea%b9%fa%bf%bc%a1%fb+%a1%fb+%b5%e3%bb%f7%bd%f8%c8%eb/',
			alt: '资料盘1'
		},
		{
			src: 'http://gongkao66688.edudisk.cn/ContentPane.aspx?Path=%2f2025%c4%ea%ca%a1%bf%bc%a1%fb+%a1%fb+%b5%e3%bb%f7%bd%f8%c8%eb/',
			alt: '资料盘2'
		}
		
		
	]
}]

guideTabGroupListData = guideTabGroupListData.concat(program, learning, movies, books, developTools, pictures, tools, win_soft, mac_soft, news);

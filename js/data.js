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
    },
    {
        title: '在线娱乐',
        num: 5,
    }
];


let guideTabGroupListData = [];


let learning = [
	{
		num: 1,
		data:[
			{
				src: 'https://blog.csdn.net/Day_and_Night_2017',
				alt: '我在csdn'
			},
			{
				src: 'https://www.cnblogs.com',
				alt: 'cnblogs'
			},
			{
				src: 'https://www.geeksforgeeks.org',
				alt: '极客算法'
			},
			{
				src: 'https://mvnrepository.com',
				alt: 'maven库'
			},
			{
				src: 'https://space.bilibili.com/14163840/channel/seriesdetail?sid=433088',
				alt: '黎曼猜想'
			},
			{
				src: 'https://www.bilibili.com/video/BV18L4y1p7n8?spm_id_from=333.337.search-card.all.click',
				alt: '科目三视频'
			},
            {
                src: 'https://hipstersound.com/ambience.html',
                alt: '白噪声'
            },
            {
                src: 'https://tool.lu/timestamp',
                alt: '在线时间戳转换'
            },
            {
                src: 'https://www.processon.com',
                alt: '在线流程图'
            },{
				src: 'http://everspringlee.gitee.io/online-music',
				alt: '云音乐'
			},{
                src: 'https://books.halfrost.com/leetcode/ChapterTwo/Array',
                alt: 'Leetcode解析'
            },{
                src: 'https://doocs.gitee.io/source-code-hunter',
                alt: '源码系列'
            },{
                src: 'https://doocs.gitee.io/leetcode',
                alt: '算法题系列'
            },{
                src: 'https://hellokoding.com',
                alt: 'HelloKoding'
            },{
                src: 'https://doocs.gitee.io/advanced-java',
                alt: '面试扫盲'
            },{
                src: 'https://labuladong.gitee.io/algo',
                alt: 'labuladong刷题'
            },{
                src: 'https://doocs.github.io/jvm/00-quickstart.html',
                alt: 'JVM解析'
            },{
                src: 'https://javanote.doc.lewky.cn/#/README',
                alt: 'JAVA Note'
            },{
                src: 'http://www.cyc2018.xyz',
                alt: 'JAVA八股文'
            },{
                src: 'https://crossoverjie.top/JCSprout',
                alt: 'JCSprout'
            },{
                src: 'https://tobebetterjavaer.com/home.html',
                alt: 'JAVA进阶'
            },{
                src: 'https://javaguide.cn/home.html',
                alt: 'JAVA Guide'
            },{
                src: 'https://pdai.tech',
                alt: 'JAVA 全栈'
            },{
                src: 'https://juejin.cn/backend',
                alt: '掘金'
            },{
                src: 'https://dayAndnight2018.github.io/career-exam',
                alt: '事业单位'
            },{
                src: 'https://tool.chinaz.com/dns?type=a&host=github.com&ip=',
                alt: 'dns查询'
            }
            
		]
	}
]

let movies = [
	{
		num: 2,
		data:[
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
				src: 'https://libgen.unblockit.blue',
				alt: 'libgen'			
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
			},{
                src: 'https://www.book123.info',
                alt: '无名图书'
            },{
                src: 'https://foxgreat.com',
                alt: 'foxgreat'
            },{
                src: 'https://jc.pep.com.cn',
                alt: '人民教育出版社'
            },{
                src: 'https://www.zxx.edu.cn',
                alt: '国家中小学智慧教育平台'
            },{
                src: 'https://oceanofpdf.com',
                alt: 'PDF海洋'
            },{
                src: 'https://1lib.tk',
                alt: 'Z-lib镜像站'
            }
            
		]
	}
]

let tools = [
	{
		num: 4,
		data:[
			{
				src: 'https://www.toolfk.com',
				alt: 'tooLFK'
			},
			{
				src: 'https://cdnjs.com/libraries',
				alt: '免费cdn'
			},
			{
				src: 'https://www.iconfont.cn',
				alt: '阿里巴巴Icon'
			},
			{
				src: 'https://www.toolnb.com',
				alt: '爱资料在线工具'
			},
			{
				src: 'https://onlineconvertfree.com',
				alt: '在线格式转换'
			},
			{
				src: 'https://wallhaven.cc/toplist',
				alt: 'wallhaven'
			},
			{
				src: 'https://www.umeitu.com',
				alt: '优美图库'
			},
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
				src: 'https://www.yasuotu.com/jiazi',
				alt: '在线图片编辑'
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
				src: 'http://tooool.org',
				alt: '程序员导航'
			},
			{
				num: 19,
				img: 'img/default.png',
				src: 'https://www.matheditor.cn/#fractions-and-binomials',
				alt: '在线公式编辑'
			},
			{
				src: 'https://www.omegaxyz.com/mypage/wallpaper',
				alt: 'wallpaper'
			},
			{
				src: 'https://mm.enterdesk.com/bizhi/64629.html',
				alt: '回车桌面'
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
				src: 'https://www.sojson.com',
				alt: 'Json在线解析'
			},
            {
				src: 'https://xclient.info',
				alt: '精品Mac应用'
			},
            {
				src: 'https://mirrors.tuna.tsinghua.edu.cn',
				alt: '清华镜像'
			},
            {
				src: 'https://mirrors.huaweicloud.com/home',
				alt: '华为镜像'
			},{
				src: 'https://www.16personalities.com/ch',
				alt: '十六种人格'
			},{
                src: 'https://studio.metamaker.cn/#/cover',
                alt: '企业卡通形象'
            },{
                src: 'https://imgse.com',
                alt: '路过图床'
            },{
                src: 'https://tools.sixyin.com',
                alt: '六音工具箱'
            },{
                src: 'https://www.jq22.com',
                alt: 'Jquery效果' 
            },{
                src: 'https://www.diffchecker.com/text-compare',
                alt: '在线diff'
            },{
                src: 'https://api.f4team.cn/',
                alt: '独角兽API'
            },{
                src: 'https://www.photopea.com/',
                alt: '在线PS'
            },{
                src: 'https://easypdf.com/cn/',
                alt: '在线PDF转换'
            }
		]
	}
]

let amusement = [
	{
		num: 5,
		data:[
			{
				src: 'https://tool.liumingye.cn/music',
				alt: 'MyFreeMP3'
			}			
		]
	}
]

guideTabGroupListData = guideTabGroupListData.concat(learning);
guideTabGroupListData = guideTabGroupListData.concat(movies);
guideTabGroupListData = guideTabGroupListData.concat(books);
guideTabGroupListData = guideTabGroupListData.concat(tools);
guideTabGroupListData = guideTabGroupListData.concat(amusement);
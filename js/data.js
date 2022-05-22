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
			}
		]
	}
]

guideTabGroupListData = guideTabGroupListData.concat(learning);
guideTabGroupListData = guideTabGroupListData.concat(movies);
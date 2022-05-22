function setRgbColor(){
    var r = parseInt(Math.random() * 256);
    var g = parseInt(Math.random() * 256);
    var b = parseInt(Math.random() * 256);
    var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    document.body.style.backgroundColor = "#3B3283";
    document.body.style.color = "#C5CD7C";
}

function colorReverse(oldColor){
   oldColor = '0x' + oldColor.replace(/#/g, '');
   let str = '000000' + (0xFFFFFF - oldColor).toString(16);
   return '#'+ str.substring(str.length - 6, str.length);
}

// rgb转16进制
function setRgbTo16(str){
    let reg = /^(rgb|RGB)/;
    if(!reg.test(str)){return;}
    var arr = str.slice(4, str.length-1).split(",")
    let color = '#';
    for(var i=0;i<arr.length;i++){
         var t = Number(arr[i]).toString(16)
         if(t == "0"){   //如果为“0”的话，需要补0操作,否则只有5位数
             t =  t + "0"
         }
         color += t;
    }
    return color;
}

// 16进制转rgb
function set16ToRgb(str){
   var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
   if(!reg.test(str)){return;}
   let newStr = (str.toLowerCase()).replace(/\#/g,'')
   let len = newStr.length;
   if(len == 3){
       let t = ''
       for(var i=0;i<len;i++){
           t += newStr.slice(i,i+1).concat(newStr.slice(i,i+1))
       }
       newStr = t
   }
   let arr = []; //将字符串分隔，两个两个的分隔
   for(var i =0;i<6;i=i+2){
       let s = newStr.slice(i,i+2)
       arr.push(parseInt("0x" + s))
   }
   return 'rgb(' + arr.join(",")  + ')';
}


$(document).ready(function(){
	$(".guideTabItem").click(function(){
		$(this).addClass("activeGuideTabItem");
		$(this).find("a").addClass("activeGuideTabItemLink");

		$(this).siblings(".guideTabItem").removeClass("activeGuideTabItem");
		$(this).siblings(".guideTabItem").find("a").removeClass("activeGuideTabItemLink");
	})

	$(".guideTabItem")[0].click();

	$("#confirmButton").click(function(){
		let content = $("#searchBox").val();
		var element = null;
		// = vue.guideTabGroupListData.filter((a) => a.data.filter(ele => ele.alt.endsWith(content)))[0];
		for (var i =0; i < vue.guideTabGroupListData.length; i++) {
			for (var j = 0; j < vue.guideTabGroupListData[i].data.length; j++) {
				if (vue.guideTabGroupListData[i].data[j].alt.indexOf(content) != -1){
					element = vue.guideTabGroupListData[i];
					break;
				}
			}
		}
		if (element == null || element == undefined){
			alert("不存在的导航地址");
			return;
		}

		vue.tabSelected(element);
		$(".guideTabItem[data-num$=" + element.num + "]")[0].click();
		document.getElementById($(this).text()).scrollIntoView();
	});
});
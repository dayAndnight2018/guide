function setRgbColor(){
    var r = parseInt(Math.random() * 256);
    var g = parseInt(Math.random() * 256);
    var b = parseInt(Math.random() * 256);
    var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    document.body.style.color = "#C5CD7C";
    let colorList = [
        "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
        "linear-gradient(120deg, #22E1FF 0%, #1D8FE1 48%, #625EB1 100%)",
        "linear-gradient(120deg, #3D4E81 0%, #5753C9 48%, #6E7FF3 100%)",
        "linear-gradient(120deg, #209cff 0%, #68e0cf 100%)",
        "linear-gradient(120deg, #96deda 0%, #50c9c3 100%)",
        "linear-gradient(120deg, #007adf 0%, #00ecbc 100%)",
        "linear-gradient(120deg, #6a11cb 0%, #2575fc 100%)"
    ]
    let index = Math.floor(Math.random()*colorList.length)
    document.body.style.backgroundImage = colorList[index];
    document.getElementsByClassName("guideTab")[0].style.backgroundImage = colorList[(index+1)%colorList.length];
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
		if (content == null && content == undefined && content == ""){
			return;
		}

		var element = null;
		var actualText = null;
		// = vue.guideTabGroupListData.filter((a) => a.data.filter(ele => ele.alt.endsWith(content)))[0];
		for (var i =0; i < vue.guideTabGroupListData.length; i++) {
			for (var j = 0; j < vue.guideTabGroupListData[i].data.length; j++) {
				if (vue.guideTabGroupListData[i].data[j].alt.indexOf(content) != -1){
					element = vue.guideTabGroupListData[i];
					actualText = vue.guideTabGroupListData[i].data[j].alt;
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

		// document.getElementById(actualText).scrollIntoView();
		// document.getElementById(actualText).scrollIntoView();

		vue.$nextTick(() => {
			var cur = document.getElementById(actualText);
      		cur.scrollIntoView();
      		
      		$(cur).addClass('shadow-pulse');
			$(cur).on('animationend', function(){    
				$(cur).removeClass('shadow-pulse');
			});
    	});	
	});
});
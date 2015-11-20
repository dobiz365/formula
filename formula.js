/*
2015-7-13修改对齐方式 为垂直居中
	修改内部行高为100%。
	修改字体未设置时，默认为14PX
	
2015-7-17修改分数分母和分子的line-height:100%
	
2015-8-10修改根元素，从根元素出发查找并替换为我们指定的格式
		修改处理后元素，增加已处理标记
2015-8-12修改默认属性设置，（默认字号=20PX，默认根元素=document）
2015-8-14修改分数中分母分子分数线的LEFT为0PX。
2015-8-16修改分数中分子和分母的宽度为：fzspan.clientWidth+3，原来的宽度会产生换行。
2015-8-17修复分数中有些时候取span宽度为0的的BUG
2015-10-30 修复上级div中font-family和font-weight对frac的影响。
2015-11-20 修改分数显示中的line-height:1，使行高能继承到下级元素，修复this.fontSize的设置，正确显示fontsize属性的设置

*/

function Formula(_default){
	if(_default){
		if(_default.fontSize){
			this.fontSize=_default.fontSize;
		}else this.fontSize=20;
		if(_default.root){
			this.root=_default.root;
		}else this.root=document;
	}else{
		this.fontSize=20;
		this.root=document;
	}
}

/**
处理全部公式，分式、方程组、除法竖式、上标
*/
Formula.prototype.processAll=function(){
	this.frac();
	this.equation();
	this.division();
};

//处理分式
Formula.prototype.frac=function(){
	var tags=this.root.getElementsByTagName('frac');	//document.getElementsByTagName('frac');	
	for(var i=0;i<tags.length;i++){
		if(tags[i].getAttribute('formula')!='ok')   this.processFrac(tags[i]);
		tags[i].setAttribute('formula','ok');
	}
};

Formula.prototype.getWidth = function(fontSize,str)  
{  
    var span = document.getElementById("__getwidth");  
    if (span == null) {  
        span = document.createElement("span");  
        span.id = "__getwidth";  
        document.body.appendChild(span);  
        span.style.visibility = "hidden";  
        span.style.whiteSpace = "nowrap"; 
		span.style.fontFamily='Tahoma';
    }  
    span.innerText = str;  
    span.style.fontSize = fontSize + "px";  
  
    return span.offsetWidth;  
} 

Formula.prototype.processFrac=function(obj){
	var fontsize=parseInt(obj.getAttribute('fontsize'));
	if(fontsize){
		this.fontSize=fontsize;
	}
	
	var frac_arr=obj.innerText.split('/');
	if(frac_arr.length!=2) return;
	var fz=	frac_arr[0],
		fm=frac_arr[1];
	var max=fz.length>fm.length?fz.length:fm.length;
	
	var box=document.createElement('div');
	box.style.display='inline-block';
	box.style.height=this.fontSize*2.2+'px';
	box.style.position='relative';
	box.style.width=this.fontSize*max+'px';
	box.style.margin='0px';
	box.style.padding='0px';
	var fzspan=document.createElement('span');
	fzspan.innerText=fz;
	fzspan.style.whiteSpace = "nowrap"; 
	fzspan.style.position='absolute';
	fzspan.style.fontSize=this.fontSize+'px';
	fzspan.style.top='0px';
	fzspan.style.left='0px';
	fzspan.style.height=this.fontSize+'px';
	fzspan.style.textAlign='center';

	var fmspan=document.createElement('span');
	fmspan.innerText=fm;
	fmspan.style.position='absolute';
	fmspan.style.top=(this.fontSize*1.2)+'px';
	fmspan.style.fontSize=this.fontSize+'px';
	fmspan.style.left='0px';
	fmspan.style.whiteSpace = "nowrap"; 
	fmspan.style.textAlign='center';
	fmspan.style.display='inline-block';
	fzspan.style.display='inline-block';
	
	var fsxspan=document.createElement('span');
	fsxspan.style.display='inline-block';
	fsxspan.style.height='0px';
	fsxspan.style.width=this.fontSize*max+'px';
	fsxspan.style.borderTop='1px solid black';
	fsxspan.style.top=this.fontSize+2+'px';
	fsxspan.style.position='absolute';
	fsxspan.style.left='0px';
	obj.innerHTML='';
	box.appendChild(fzspan);
	box.appendChild(fmspan);
	box.appendChild(fsxspan);
	obj.appendChild(box);	
	//var w1=fzspan.clientWidth+3;
	var w1=this.getWidth(this.fontSize,fz)+3;
	//var w2=fmspan.clientWidth+3;
	var w2=this.getWidth(this.fontSize,fm)+3;

	
	max=w1>w2?w1:w2;
	box.style.width=max+'px';
	fsxspan.style.width=max+'px';
	fzspan.style.width=max+'px';	
	fmspan.style.width=max+'px';
	
	obj.style.width=max;
	obj.style.height=this.fontSize*2+4+'px';
	obj.style.display='inline-block';
	obj.style.verticalAlign='middle';
	obj.style.margin='1px 3px';
	obj.style.padding='0';
	obj.style.textIndent='0';
	obj.style.lineHeight='1';
	obj.style.fontFamily='Tahoma';
	obj.style.fontWeight='normal';
};


//处理方程组
Formula.prototype.equation=function(){
	var tags=this.root.getElementsByTagName('equation');//document.getElementsByTagName('equation');	
	for(var i=0;i<tags.length;i++){		
		if(tags[i].getAttribute('formula')!='ok')   this.processEquation(tags[i]);
		tags[i].setAttribute('formula','ok');
	}
};


Formula.prototype.processEquation=function(obj){
	var fontsize=parseInt(obj.getAttribute('fontsize'));
	fontsize=fontsize?fontsize:this.fontSize;
	var equa_arr=obj.innerText.split(',');
	if(equa_arr.length<2) return;//少于2个方程则不处理
	obj.innerHTML='';
	var max=equa_arr[0].length*fontsize;//算出最宽的可能
	for(var i=1;i<equa_arr.length;i++){
		if(equa_arr[i].length*fontsize>max){
			max=equa_arr[i].length*fontsize;
		}
	}
	max+=fontsize*equa_arr.length;//加上大括号的位置
	
	var box=document.createElement('div');
	box.style.display='inline-block';
	box.style.position='relative';
	box.style.width=max+'px';
	box.style.lineHeight='100%';
	box.style.height=fontsize*equa_arr.length+'px';

	
	var kuohao=document.createElement('span');	
	kuohao.style.fontSize=fontsize*equa_arr.length+'px';
	kuohao.style.display='inline-block';
	//kuohao.style.height=fontsize*equa_arr.length+'px';
	//kuohao.style.width='32px';
	kuohao.style.position='absolute';
	kuohao.style.left='0px';
	kuohao.style.top='0px';
	kuohao.style.lineHeight='100%';
	kuohao.innerText='{';
	box.appendChild(kuohao);
	
	var offset=fontsize*0.12;
	var fc=[];
	for(var i=0;i<equa_arr.length;i++){
		fc[i]=document.createElement('span');
		fc[i].style.fontSize=fontsize+'px';		
		fc[i].style.position='absolute';
		fc[i].style.top=fontsize*i+offset+'px';
		fc[i].innerText=equa_arr[i];
		box.appendChild(fc[i]);
	}
	obj.appendChild(box);
	var kuohao_w=kuohao.clientWidth;
	var w=[];
	for(var i=0;i<fc.length;i++){
		fc[i].style.left=kuohao_w+2+'px';
		w[i]=fc[i].clientWidth;
	}
	max=w[0];
	for(var i=0;i<w.length;i++){
		if(w[i]>max) max=w[i];
	}
	box.style.width=kuohao_w+5+max+'px';
	obj.style.display='inline-block';
	obj.style.width=kuohao_w+5+max+'px';
	obj.style.height=fontsize*equa_arr.length+'px';
	obj.style.verticalAlign='middle';
	obj.style.lineHeight='1';
	obj.style.margin='7px 1px';
};

//处理除法竖式
Formula.prototype.division=function(){
	var tags=this.root.getElementsByTagName('division');//document.getElementsByTagName('division');	
	for(var i=0;i<tags.length;i++){
		if(tags[i].getAttribute('formula')!='ok')   this.processDivision(tags[i]);
		tags[i].setAttribute('formula','ok');		
	}
};

Formula.prototype.processDivision=function(obj){
	var fontsize=parseInt(obj.getAttribute('fontsize'));
	fontsize=fontsize?fontsize:this.fontSize;
	var divi=obj.innerText.split('/');	
	if(divi.length!=2) return;//必须是2个数
	obj.innerHTML='';

	var w=(divi[0].length+divi[1].length+1)*fontsize;
	var box=document.createElement('div');
	box.style.display='inline-block';
	box.style.width=w+'px';
	box.style.position='relative';
	box.style.height=fontsize+5+'px';
	box.style.lineHeight='100%';
	
	var cs=document.createElement('span');
	cs.style.position='absolute';
	cs.style.display='inline-block';
	cs.style.fontSize=fontsize+'px';
	//cs.style.top='10px';
	cs.style.lineHeight='100%';
	cs.innerText=divi[1];
	
	var bcs=document.createElement('span');
	bcs.style.position='absolute';
	bcs.style.display='inline-block';
	bcs.style.fontSize=fontsize+'px';
	//bcs.style.top='10px';
	bcs.style.lineHeight='100%';
	bcs.innerText=divi[0];
	
	var line=document.createElement('span');
	line.style.position='absolute';
	line.style.display='inline-block';
	line.style.height='0px';
	line.style.border='1px solid blue';
	line.style.lineHeight='100%';
	line.style.top='4px';
	
	var xline=document.createElement('span');
	xline.style.position='absolute';
	xline.style.display='inline-block';
	xline.style.fontSize=fontsize+'px';
	xline.style.top='1px';
	xline.style.lineHeight='100%';
	xline.innerText=')';
	xline.style.fontFamily='Arial';
	xline.style.color='blue';
	
	box.appendChild(cs);
	box.appendChild(bcs);
	box.appendChild(line);
	box.appendChild(xline);
	obj.appendChild(box);
	//调整位置
	var cs_w=cs.clientWidth;
	var bcs_w=bcs.clientWidth;
	var xline_w=xline.clientWidth;
	line.style.width=bcs_w*1.3+'px';
	line.style.left=cs_w+2+'px';
	cs.style.top=parseInt(line.style.top)+1+'px';
	bcs.style.top=parseInt(line.style.top)+1+'px';
	bcs.style.left=cs_w+xline_w+5+'px';
	xline.style.left=cs_w+'px';
	box.style.width=cs_w+line.clientWidth+3+'px';
	obj.style.verticalAlign='middle';
	obj.style.width=box.style.width;
	obj.style.height=box.style.height;
	obj.style.display='inline-block';
	obj.style.margin='7px 1px';
	obj.style.lineHeight='1';
};

// ==============================================
// 		scrolling
// ==============================================

class ScrollClass {
	
	constructor(){
		var __this=this;
		this.track=$('#track');
		this.scrTop=$(window).scrollTop();
		this.headerWidth=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerWidth'));
		this.isLerp=0;
		this.currPos=0;
		this.finalPos=0;
		this.isMobile=0;
		$(window).on('resize recalculate', function(){
			__this.testMobile();
			__this.configureAllElements();
			__this.configurePageLimits();
		})
		$(window).on('scroll load recalculate', function(){
			__this.scrollConfig();
			__this.scrollPage();
			__this.testScrollElements();
		})
		this.testMobile();
		this.configureAllElements();
		this.configurePageLimits();
		this.scrollConfig();
		this.scrollPage();
		this.testScrollElements();
	}
	testMobile(){
		if($('#isMobile').is(':visible')) this.isMobile=1;
		else this.isMobile=0;
	}
	configureAllElements(){
		var __this=this;
		this.windowWidth=$(window).outerWidth();
		this.windowHeight=$(window).outerHeight();
		this.logoLimit=this.windowWidth/3;
		this.block=$('[dataVisibilityElement]');
		this.stick=$('.image--overlay__content');
		this.last=0;
		this.block.each(function(){
			var el=$(this);
			if(!__this.isMobile) {
				var left=el.offset().left-el.parent().offset().left;
				var start=left;
				var width=el.outerWidth();
				var end=start+width;
			}else {
				var start=el.offset().top;
				var end=start+el.height();
			}
			el.data('start', start);
			el.data('end', end);
		})
		this.stick.each(function(){
			var el=$(this);
			var parent=el.closest('.section');
			el.data('parent', parent);
			if(!__this.isMobile) {
				var left=parent.offset().left-parent.parent().offset().left;
				var start=left;
				var width=parent.outerWidth();
				var end=start+width;
			}else {
				var start=el.offset().top;
				var end=start+el.height();
			}
			el.data('stickStart', start);
			el.data('stickHide', parseInt(start+width/3));
			el.data('stickEnd', parseInt(start+width));
		})
	}
	configurePageLimits(){
		var __this=this;
		this.end=$(window).height();
		$('#container .section').last().each(function(){
			var el=$(this);
			var left=el.offset().left-el.parent().offset().left;
			var start=left;
			var width=el.outerWidth();
			var diff=__this.windowWidth-__this.windowHeight;
			__this.end=start+width-diff+__this.headerWidth;
		})
		$('body').height(this.end);
	}
	scrollConfig(){
		this.scrTop=$(window).scrollTop();
		this.scrLeft=this.scrTop;
		this.scrFarLeft=this.scrLeft+this.windowWidth-this.headerWidth;
		if(this.isMobile) this.scrFarLeft=this.scrLeft+this.windowHeight;
	}
	scrollPage(){
		var top=this.scrLeft;
		if(top>this.logoLimit) {
			$('body').removeAttr('logoVisibility');
		}else {
			$('body').attr('logoVisibility', 1);
		}
		this.finalPos=top;
		if(!this.isLerp){
			this.isLerp=1;
			this.runLerp();
		}
		
		this.percent=top*100/(this.end - this.windowHeight);
		$('#scroll--bar').css('height', this.percent+'%');
		
	}
	runLerp(){
		var __this=this;
		var diff=(this.finalPos-this.currPos)*.05;
		if(Math.abs(diff)<10000000.025){
			this.currPos=this.finalPos;
			var end=this.currPos*-1;
			this.isLerp=0;
			this.track.css('transform', 'translateX('+end+'px)');
		}else{
			var end=this.currPos+diff;
			this.currPos=end;
			end=end*-1;
			this.track.css('transform', 'translateX('+end+'px)');
			requestAnimationFrame(function(){
				__this.runLerp();
			})
		}
	}
	testScrollElements(){
		var __this=this;
		var useAlt=0;
		var footerActive=0;
		this.block.each(function(){
			var el=$(this);
			if(__this.scrFarLeft>el.data('start')&&__this.scrLeft<el.data('end')){
				el.attr('dataVisibilityInit', 1)
				el.attr('dataVisibility', 1)
				if(el.is('.section--footer')) footerActive=1;
			}else{
				if(el.is('[dataVisibility]')) el.removeAttr('dataVisibility');
			}
			// testing logo stuff
			if(__this.scrLeft>=el.data('start')&&__this.scrLeft<el.data('end')){
				if(el.is('.section.dark--image')) useAlt=1;
			}
		})
		this.stick.each(function(){
			var el=$(this);
			if(__this.scrLeft<el.data('stickStart')){
				el.css('transform', 'none');
			}else{
				var offset=__this.scrLeft-el.data('stickStart');
				el.css('transform', 'translateX('+offset+'px)');
			}
			if(__this.scrLeft<el.data('stickHide')){
				el.data('parent').attr('dataCaption', 1);
			}else{
				el.data('parent').removeAttr('dataCaption');
			}	
		})
		
		//footer
		if((footerActive)) $('body').attr('dataFooterVisible', 1);
		else $('body').removeAttr('dataFooterVisible');
		
		//alt logo
		if(useAlt) $('body').attr('useAltLogo', 1);
		else $('body').removeAttr('useAltLogo');
		
	}
}

class ClickManage {
	
	constructor(){
		$('#navigation a, .section--image-overlay a').on('click', function(e){
			e.preventDefault();
			var url=$(this).attr('href');
			if(url.indexOf('#')==-1){
				$('body').attr('dataClosing', 1);
				setTimeout(function(){
					window.location.href=url;
				}, 2375);
			}else{
				var scrollDistance=parseInt($('body').height()-$(window).height());
				$('html, body')
					.animate({ scrollTop: scrollDistance }, scrollDistance*.333, 'linear', function(){
						$('body').removeAttr('dataNavigation');
					});
			}
		})
	}
}

// ==============================================
// 		loading styles
// ==============================================

class Loader {
	
	constructor(){
		var __this=this;
		this.block=$('.Main-content .sqs-layout > div > div > div');
		this.footerBlock=$('#footerBlocksTop > div > div > div');
		this.headerBlock=$('#footerBlocksMiddle > div > div > div');
		this.blockArray=[];
		
		this.elArray=[];
		this.clearBlocks();
		this.configureBlocks();
		this.configurePage();
		$('#container .accordion-block').each(function(){
			$.data($(this), new Accordion($(this)));
		})
		new Footer(this.footerBlock);
		new Header(this.headerBlock);
		new Logo();
		new ScrollClass();
		new ClickManage();
	}
	clearBlocks(){
		$('.sqs-block').each(function(){
			$(this).removeClass('sqs-block');
		})
		$('.min-font-set').each(function(){
			$(this).removeClass('min-font-set');
		})
		$('body [style]').each(function(){
			$(this).removeAttr('style');
		})
	}
	configureBlocks(){
		var __this=this;
		var array=[];
		this.block.each(function(){
			var el=$(this);
			if(el.is('.spacer-block')) {
				if(array.length) {
					__this.blockArray.push(array);
					array=[];
				}
			}else{
				array.push(el);
			}
		})
		if(array.length) this.blockArray.push(array);
	}
	configurePage(){
		var __this=this;
		$.each(this.blockArray, function(index, array){
			__this.runArray(array);
		})
	}
	runArray(array){
		var first=array[0];
		var elArr=this.elArray;
		if(first.is('.html-block')){
			elArr[elArr.length]=new ContentBlock(array, elArr);
		}else{
			elArr[elArr.length]=new ImageBlock(array, elArr);
		}
	}
}

// ============================
// accordion
// ============================

class Accordion {
	constructor(el) {
		var __this=this;
		this.el=el;
		this.items=this.el.find('.accordion-item');
		this.dropDown='.accordion-item__dropdown';
		this.calculateHeights();
		this.appendIcons();
		$(window).on('resize', function(){ __this.calculateHeights(); });
		this.el.find('button').on('click', function(e){
			__this.runClick($(e.target));
		});
	}
	calculateHeights(){
		var __this=this;
		this.items.each(function(){
			var el=$(this);
			var last=el.find('.accordion-item__description > *').last();
			var height=last.offset().top-last.parent().offset().top+last.height();
			var drop=el.find(__this.dropDown);
			drop.attr('dataHeight', height);
		});
	}
	appendIcons(){
		this.items.each(function(){
			var el=$(this);
			var h3=el.find('button');
			$('.icon--plus').first().clone().appendTo(h3);
		});
	}
	runClick(el){
		var __this=this;
		var item=el.closest('.accordion-item');
		if(item.is('.active')){
			item.removeClass('active');
			item.find(this.dropDown).height(0);
		}else{
			item.addClass('active');
			var dropDown=item.find(this.dropDown);
			dropDown.height(parseInt(dropDown.attr('dataHeight')));
			item.siblings().each(function(){
				var el=$(this);
				el.removeClass('active');
				el.find(__this.dropDown).height(0);
			})
			
		}
	}
}

// ============================
// logo
// ============================

class Logo {
	constructor(){
		var __this=this;
		this.logo=$('#logo-large');
		this.configureLogo();
		this.placeLogo();
	}
	configureLogo(){
		var __this=this;
		this.logo.each(function(){
			var el=$(this);
			__this.large=el;
		})
	}
	placeLogo() {
		if(typeof(this.large)!='undefined') {
			var el=$('<a href="/" id="logo"></a>');
			el.append(this.large.clone())
			el.appendTo('body');
		}
		if(typeof(this.small)!='undefined') {
			var el=$('<a href="/" id="logo--small"></a>');
			el.append(this.small.clone())
			el.appendTo('#header .inner');
		}
	}
}

// ============================
// header
// ============================

class Header {
	
	constructor(block){
		var __this=this;
		this.block=block;
		this.blockArray=[];
		this.configureBlocks();
		new HeaderBlock(this.blockArray);
		new Navigation();
	}
	configureBlocks(){
		var __this=this;
		var array=[];
		this.block.each(function(){
			var el=$(this);
			if(el.is('.spacer-block')) {
				if(array.length) {
					__this.blockArray.push(array);
					array=[];
				}
			}else{
				array.push(el);
			}
		})
		if(array.length) this.blockArray.push(array);
	}
}

// ============================
// navigation
// ============================

class Navigation {
	
	constructor(){
		 var __this=this;
		 this.btn=$('#menu');
		 this.btn.on('click', function(e){
			 e.preventDefault();
			 __this.updateNavigation();
		 })	
	}
	updateNavigation(){
		var __this=this;
		if($('body').is('[dataNavigation]')) {
			$('body').removeAttr('dataNavigation')
		}else{
			$('body').attr('dataNavigation', 'active');
		}
		
	}
}

// ============================
// header
// ============================

class HeaderBlock {

	constructor(array){
		var __this=this;
		this.header=$('#header');
		this.array=array;
		this.innerArray=[];
		
		this.createBase();
		this.populateBase();
	}
	createBase(){
		var __this=this;
		this.section=$('<div id="navigation"></div>');
		this.section.insertAfter(this.header);
	}
	populateBase(){
		var __this=this;
		$.each(this.array, function(index, array){
			var el=$('<div class="nav--item"><div class="nav--item__footer"></div></div>');
			el.appendTo(__this.section);
			__this.populateBaseInner(index, array, el);
		})
	}
	populateBaseInner(index, array, el){
		var __this=this;
		var newIndex=index+1;
		$('<span class="cnt">0'+newIndex+'.</span>').prependTo(el);
		$.each(array, function(index, item){
			if(!item.is('.horizontalrule-block')) item.clone().appendTo(el.find('.nav--item__footer'));
		})
	}
}

// ============================
// footer
// ============================

class Footer {
	
	constructor(block){
		var __this=this;
		this.block=block;
		this.blockArray=[];
		this.configureBlocks();
		new FooterBlock(this.blockArray);
	}
	configureBlocks(){
		var __this=this;
		var array=[];
		this.block.each(function(){
			var el=$(this);
			if(el.is('.spacer-block')) {
				if(array.length) {
					__this.blockArray.push(array);
					array=[];
				}
			}else{
				array.push(el);
			}
		})
		if(array.length) this.blockArray.push(array);
	}
}

class FooterBlock {

	constructor(array){
		var __this=this;
		this.container=$('#track');
		this.array=array;
		this.innerArray=[];
		
		this.createBase();
		this.createContent();
		this.populateBase();
	}
	createBase(){
		var __this=this;
		this.section=$('<div class="section section--content section--footer padding-top-double padding-bottom-double medium-up--padding-top-col medium-up--padding-bottom-col" dataVisibilityElement="1"><div class="wrapper"><div class="grid grid--column"><div class="grid grid--content"></div></div></div></div>');
		this.section.appendTo(this.container);
		this.wrapper=this.section.find('.wrapper');
		this.gridBase=this.section.find('.grid--column');
		this.grid=this.section.find('.grid:not(.grid--column)');
	}
	createContent(){
		var __this=this;
		this.contentArray=[];
		var cnt=0;
		$.each(this.array, function(index, item){
			__this.contentArray.push(item);
			cnt++;
		});		
		this.first=this.contentArray[0];
		this.last=this.contentArray[this.contentArray.length-1];
		
	}
	populateBase(){
		var __this=this;
		var header=$('<div class="content--header"><div class="grid"></div></div>');
		$.each(this.first, function(index, item){
			item.clone().appendTo(header.find('.grid'));
		})
		header.prependTo(this.gridBase);
		var footer=$('<div class="content--footer"><div class="grid"></div></div>');
		$.each(this.last, function(index, item){
			item.clone().appendTo(footer.find('.grid'));	
		});
		footer.appendTo(this.gridBase);
		
		for(var x=1; x<this.contentArray.length-1; x++){
			var array=this.contentArray[x];
			this.innerArray.push(array);
			this.populateBaseInner(array, x);
		}
	}
	
	populateBaseInner(array, index){
		var __this=this;
		var block=$('<div class="footer--inner-col grid--new one-whole medium-up--seven-col medium-up--margin-left-col" dataColIndex="'+index+'"><div class="grid grid--html flex-align--end"></div></div>');
		var cnt=0;
		$.each(array, function(index, item){
			if(item.is('.image-block')){
				block.addClass('image-col');
				item.find('img').clone().appendTo(block);
			}else if(item.is('.html-block')) {
				var className="one-whole medium-up--one-half";
				var paddingClassName=!cnt ? '':'padding-top-double';
				var head=item.find('h2, h3').first();
				if(head.length){
					var str=head.text().split(' | ');
					if(str.length>1){
						if(str.indexOf('fullwidth')>-1) className="one-whole";
						
						head.text(str[0]);
					}
				}
				var el=$('<div class="'+className+' '+paddingClassName+'"></div>');
				item.clone().appendTo(el);
				el.appendTo(block.find('.grid--html'));
				cnt++;
			}else if(item.is('.form-block')){
				var el=item;
				el.appendTo(block);
				/*
				var field=el.find('.field');
				field.each(function(){
					
					var place=$.trim($(this).find('.title').text()).replace(/(\r\n|\n|\r)/gm, " ");
					console.log(place+'place');
					var input=$(this).find('input, textarea');
					input.attr('placeholder', 'testing placeholder text');
					
				})
				*/
			}else if(item.is('.horizontalrule-block')){
				
			}else{
				item.clone().appendTo(block);
			}
		})
		block.appendTo(this.grid);
	}
}


// ==============================================
// 		block (content)
// ==============================================

class ContentBlock {
	
	constructor(array, elArray){
		var __this=this;
		this.container=$('#track');
		this.array=array;
		this.elArray=elArray;
		this.innerArray=[];
		this.hasColumns=0;
		this.createBase();
		this.createContent();
		this.populateBase();
	}
	createBase(){
		var __this=this;
		this.section=$('<div class="section section--content padding-top-double padding-bottom-double medium-up--padding-top-col medium-up--padding-bottom-col" dataVisibilityElement="1"><div class="wrapper pos--relative"><div class="grid grid--column"><div class="grid grid--content"></div></div></div></div>');
		this.section.appendTo(this.container);
		this.wrapper=this.section.find('.wrapper');
		this.gridBase=this.section.find('.grid--column');
		this.grid=this.section.find('.grid:not(.grid--column)');
	}
	createContent(){
		var __this=this;
		this.contentArray=[];
		var cnt=0;
		$.each(this.array, function(index, item){
			if($(this).is('.html-block')||$(this).is('.accordion-block')) {
				__this.contentArray.push(item);
				item.attr('dataTransitionDelay', cnt);
				cnt++;
			}else if($(this).is('.image-block')) {
				item.find('img').clone().appendTo(__this.wrapper);
			}else if($(this).is('.code-block')) {
				var str=$(this).text()
				if(str.indexOf('3column')>-1) {
					__this.section.find('.grid.grid--content').addClass('columns--3');
					__this.hasColumns=1;
				}
				if(str.indexOf('2column')>-1){ 
					__this.section.find('.grid.grid--content').addClass('columns--2');
					__this.hasColumns=1;
				}
			}
		});
		this.first=this.contentArray[0];
		this.last=this.contentArray[this.contentArray.length-1];
	}
	populateBase(){
		
		// this might need fixing
		$.each(this.contentArray, function(index, item){
			var h2=item.find('h2');
			h2.each(function(){
				var el=$(this);
				var str=el.text().split(' | ');
				if(str.length>1){
					var options=str[1];
					if(options.indexOf('preline')>-1){ 
						el.addClass('preline');
						el.text(str[0]);
					}
				}
			})
		})
		
		var __this=this;
		var header=$('<div class="content--header"><div class="grid"></div></div>');
		this.first.clone().prependTo(header.find('.grid'));
		header.prependTo(this.gridBase);
		var footer=$('<div class="content--footer"><div class="grid"></div></div>');
		this.last.clone().prependTo(footer.find('.grid'));
		footer.appendTo(this.gridBase);
		
		for(var x=1; x<this.contentArray.length-1; x++){
			
			var el=this.contentArray[x];
			this.innerArray.push(el);
			var addEl=el.clone();
			var blockWidth=this.hasColumns ? '' : 'medium-up--seven-col';
			// testing strings
			var str=el.text().split(' | ');
			if(str.length>1){
				var options=str[1];
				if(options.indexOf('fullwidth')>-1){ 
					blockWidth=' padding-bottom-double';
				}
				if(options.indexOf('preline')>-1){ 
					addEl.find('h2').addClass('preline');
				}
			}
			addEl.addClass('one-whole '+blockWidth+' medium-up--margin-left-col')
			addEl.appendTo(this.grid);
			this.sanitiseBlock(addEl);
		}
		
		this.updateWrapper();
	}
	updateWrapper(){
		if(this.innerArray.length==1)this.wrapper.addClass('wrapper--ten-col');
		//if(this.innerArray.length==2) this.wrapper.addClass('wrapper--seventeen-col')
	}
	sanitiseBlock(el){
		var __this=this;
		var elArray=el.find('.sqs-html-content > *');
		elArray.each(function(){
			var el=$(this);
			var inner=el.find('> *');
			if(inner.length<=1){
				var str=el.text().split(' | ');
				el.text(str[0]+'\u00A0');
			}else {
				inner.each(function(){
					var innerEl=$(this);
					var str=innerEl.text().split(' | ');
					innerEl.text(str[0]+'\u00A0');	
				})
			}
		})
	}
}

// ==============================================
// 		block (base image)
// ==============================================

class ImageBlock {
	
	constructor(array, elArray){
		var __this=this;
		this.container=$('#track');
		this.array=array;
		this.elArray=elArray;
		this.first=this.array[0];
		this.createBase();
		this.setupLink();
		this.populateBase();
	}
	createBase(){
		var __this=this;
		this.section=$('<div class="section section--image-overlay" dataVisibilityElement="1"><div class="image--caption padding-top--double padding-bottom-double padding-left padding-right medium-up--padding-top-col medium-up--padding-bottom-col medium-up--padding-left-col medium-up--padding-right-col"><div class="grid grid--column"></div></div></div>');
		this.section.appendTo(this.container);
		this.wrapper=this.section.find('.wrapper');
		this.grid=this.section.find('.grid--column');
	}
	setupLink() {
		var a=null;
		for(var x=0; x<this.array.length; x++){
			var el=this.array[x];
			if(a==null){
				if(el.find('a').length){ 
					console.log('found a');
					a=el.find('a').first();
				}
			}
			if(a!=null) this.section.append(a.clone().text(''));
		}
	}
	populateBase(){
		var __this=this;
		this.img=this.first.find('img');
		this.overlayText=this.first.find('figcaption');
		this.heading=this.overlayText.find('.image-title-wrapper > div');
		this.subheading=this.overlayText.find('.image-subtitle-wrapper > div');
		var imgEl=$('<div class="image--overlay"></div>');
		this.img.attr('class');
		var imgAttr=this.img.attr('alt');
		if(typeof imgAttr!='undefined') {
			if(imgAttr.indexOf('width100')>-1) this.section.addClass('width--full');
			if(imgAttr.indexOf('width50')>-1) this.section.addClass('width--half');
			if(imgAttr.indexOf('darkimage')>-1) this.section.addClass('dark--image');
			if(imgAttr.indexOf('hidemobile')>-1) this.section.addClass('hide--medium-down');
			if(imgAttr.indexOf('hidedesktop')>-1) this.section.addClass('hide--medium-up');
		}
		var dims=this.img.attr('data-image-dimensions').split('x');
		var aspect=dims[0]+'/'+dims[1];
		this.img.clone().prependTo(imgEl);
		this.section.css('aspect-ratio', aspect);
		this.img.on('load', function(){
			setTimeout(function(){ console.log('retrigggering'); $(window).trigger('recalculate'); }, 250);
		})
		imgEl.prependTo(this.section);
		var imgWidth=parseInt(this.img.attr('width'));
		var imgHeight=parseInt(this.img.attr('height'));
		var aspect=imgWidth/imgHeight;
		var hasContent=0;
		if(this.array.length){
			this.content=$('<div class="image--overlay__content"></div>').append(this.subheading.clone());
			this.grid.append(this.content);
			$.each(this.array, function(index, item){
				if(item.is('.html-block')){ 
					item.clone().appendTo(__this.content);
					hasContent=1;
				}
			})
			var h2=this.content.find('h2');
			h2.each(function(){
				var thisStr=$(this).text().split(' | ');
				if(thisStr.length>1){
					var str=thisStr[1];
					if(str.indexOf('super')>-1){
						__this.section.addClass('section--super')
					}
					if(str.indexOf('portfolio')>-1){
						__this.section.addClass('section--portfolio')
					}
					$(this).text(thisStr[0]);
				}
			})	
		}
		if(!hasContent) {
			this.section.addClass('contentless');
		}
	}
}

(function($) {
	$(document).ready(function(){ 
		var url=window.location.href;
		if(url.indexOf('config')==-1) new Loader(); 
		else {
			$('#header, .Mobile, .Header').hide();
			$('html .sqs-block.sqs-block-editable:not(.sqs-block-editing)').css('position', 'relative');
		}
	})
})(jQuery);

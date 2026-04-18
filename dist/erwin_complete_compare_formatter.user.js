// ==UserScript==
// @name          Erwin Compare Formatter
// @namespace     npm/erwin-compare-formatter
// @version       5.0.0
// @description   Color code and format Erwin Data Modeler HTML difference reports into a searchable interface.
// @author        TagoDR
// @match         file:///*.html
// @match         file:///*.htm
// @grant         none
// @runAt         document-end
// ==/UserScript==
(function() {
	//#region \0vite/all-css
	try {
		if (typeof document != "undefined") {
			var elementStyle = document.createElement("style");
			elementStyle.appendChild(document.createTextNode("/*\n * bootflat 2.0.4\n *\n * Description: BOOTFLAT is an open source Flat UI KIT based on Bootstrap 3.2.0 CSS framework. It provides a faster, easier and less repetitive way for web developers to create elegant web apps.\n *\n * Homepage: http://bootflat.github.com/\n *\n * By @Flathemes <info@flathemes.com>\n *\n * Last modify time: 2014-09-03\n *\n * Licensed under the MIT license. Please see LICENSE for more information.\n *\n * Copyright 2013 FLATHEMES.\n *\n */\n\nbody{font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;color:#434a54;background-color:#fff}\n\na{color:#3bafda;text-decoration:none}\n\na:focus,a:hover{color:#4fc1e9;text-decoration:none}\n\na:focus{outline:0}\n\n.h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6{font-family:inherit;font-weight:700;line-height:1.1;color:inherit}\n\n.h1 small,.h2 small,.h3 small,.h4 small,.h5 small,.h6 small,h1 small,h2 small,h3 small,h4 small,h5 small,h6 small{color:#e7e9ec}\n\nh1,h2,h3{margin-top:30px;margin-bottom:15px}\n\nh4,h5,h6{margin-top:15px;margin-bottom:15px}\n\nh6{font-weight:400}\n\n.h1,h1{font-size:51px}\n\n.h2,h2{font-size:43px}\n\n.h3,h3{font-size:30px}\n\n.h4,h4{font-size:19px}\n\n.h5,h5{font-size:18px}\n\n.h6,h6{font-size:14px}\n\nblockquote{border-left:3px solid #ccd1d9}\n\n.img-rounded{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.img-comment{margin:24px 0;font-size:15px;font-style:italic;line-height:1.2}\n\n.btn{color:#fff}\n\n.btn,.btn.disabled,.btn[disabled]{background-color:#aab2bd;border-color:#aab2bd}\n\n.btn.active,.btn:active,.btn:focus,.btn:hover{color:#fff;background-color:#ccd1d9;border-color:#ccd1d9;outline:0!important}\n\n.btn.active,.btn:active{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.125);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,.125);box-shadow:inset 0 1px 2px rgba(0,0,0,.125)}\n\n.btn.disabled,.btn[disabled]{filter:alpha(opacity=45);opacity:.45}\n\n.btn-link,.btn-link.active,.btn-link.disabled,.btn-link:active,.btn-link:focus,.btn-link:hover,.btn-link[disabled]{color:#3bafda;background-color:transparent;\r border-color:transparent;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}\n\n.btn-link:focus,.btn-link:hover{text-decoration:underline}\n\n.btn-default{color:#434a54;border-color:#aab2bd!important}\n\n.btn-default.active,.btn-default:active,.btn-default:focus,.btn-default:hover{background-color:#ccd1d9;border-color:#ccd1d9}\n\n.btn-default,.btn-default.disabled,.btn-default[disabled]{background-color:#fff}\n\n.open .dropdown-toggle.btn-default{background-color:#ccd1d9;border-color:#ccd1d9}\n\n.btn-primary,.btn-primary.active,.btn-primary.disabled,.btn-primary:active,.btn-primary[disabled]{background-color:#3bafda;border-color:#3bafda}\n\n.btn-primary:focus,.btn-primary:hover,.open .dropdown-toggle.btn-primary{background-color:#4fc1e9;border-color:#4fc1e9}\n\n.btn-info,.btn-info.active,.btn-info.disabled,.btn-info:active,.btn-info[disabled]{background-color:#37bc9b;border-color:#37bc9b}\n\n.btn-info:focus,.btn-info:hover,.open .dropdown-toggle.btn-info{background-color:#48cfad;border-color:#48cfad}\n\n.btn-success,.btn-success.active,.btn-success.disabled,.btn-success:active,.btn-success[disabled]{background-color:#8cc152;border-color:#8cc152}\n\n.btn-success:focus,.btn-success:hover,.open .dropdown-toggle.btn-success{background-color:#a0d468;border-color:#a0d468}\n\n.btn-warning,.btn-warning.active,.btn-warning.disabled,.btn-warning:active,.btn-warning[disabled]{background-color:#f6bb42;border-color:#f6bb42}\n\n.btn-warning:focus,.btn-warning:hover,.open .dropdown-toggle.btn-warning{background-color:#ffce54;border-color:#ffce54}\n\n.btn-danger,.btn-danger .open .dropdown-toggle.btn,.btn-danger.active,.btn-danger.disabled,.btn-danger:active,.btn-danger[disabled]{background-color:#da4453;border-color:#da4453}\n\n.btn-danger:focus,.btn-danger:hover,.open .dropdown-toggle.btn-danger{background-color:#ed5565;border-color:#ed5565}\n\n.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.125);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,.125);box-shadow:inset 0 1px 2px rgba(0,0,0,.125)}\n\n.btn-group .btn{border-left-color:#96a0ad}\n\n.btn-group .btn-default.active,.btn-group .btn-default:active,.btn-group .btn-default:focus,.btn-group.open .btn-default.dropdown-toggle{color:#fff}\n\n.btn-group .btn-primary,.btn-group .btn-primary.active,.btn-group .btn-primary:active,.btn-group .btn-primary:focus{border-left-color:#269ecb}\n\n.btn-group .btn-success,.btn-group .btn-success.active,.btn-group .btn-success:active,.btn-group .btn-success:focus{border-left-color:#7ab03f}\n\n.btn-group .btn-warning,.btn-group .btn-warning.active,.btn-group .btn-warning:active,.btn-group .btn-warning:focus{border-left-color:#efa50b}\n\n.btn-group .btn-danger,.btn-group .btn-danger.active,.btn-group .btn-danger:active,.btn-group .btn-danger:focus{border-left-color:#d1293a}\n\n.btn-group .btn-info,.btn-group .btn-info.active,.btn-group .btn-info:active,.btn-group .btn-info:focus{border-left-color:#2fa084}\n\n.btn-group .btn-danger:first-child,.btn-group .btn-info:first-child,.btn-group .btn-primary:first-child,.btn-group .btn-success:first-child,.btn-group .btn-warning:first-child,.btn-group .btn:first-child{border-left-color:transparent}\n\n.btn-group-vertical .btn,.btn-group-vertical .btn-group .btn-primary{border-top-color:#96a0ad!important}\n\n.btn-group-vertical .btn-group .btn-primary,.btn-group-vertical .btn-primary,.btn-group-vertical .btn-primary.active,.btn-group-vertical .btn-primary:active,.btn-group-vertical .btn-primary:focus{border-top-color:#269ecb!important}\n\n.btn-group-vertical .btn-group .btn-success,.btn-group-vertical .btn-success,.btn-group-vertical .btn-success.active,.btn-group-vertical .btn-success:active,.btn-group-vertical .btn-success:focus{border-top-color:#7ab03f!important}\n\n.btn-group-vertical .btn-group .btn-warning,.btn-group-vertical .btn-warning,.btn-group-vertical .btn-warning.active,.btn-group-vertical .btn-warning:active,.btn-group-vertical .btn-warning:focus{border-top-color:#efa50b!important}\n\n.btn-group-vertical .btn-danger,.btn-group-vertical .btn-danger.active,.btn-group-vertical .btn-danger:active,.btn-group-vertical .btn-danger:focus,.btn-group-vertical .btn-group .btn-danger{border-top-color:#d1293a!important}\n\n.btn-group-vertical .btn-group .btn-info,.btn-group-vertical .btn-info,.btn-group-vertical .btn-info.active,.btn-group-vertical .btn-info:active,.btn-group-vertical .btn-info:focus{border-top-color:#2fa084!important}\n\n.btn-group-vertical .btn-danger:first-child,.btn-group-vertical .btn-info:first-child,.btn-group-vertical .btn-primary:first-child,.btn-group-vertical .btn-success:first-child,.btn-group-vertical .btn-warning:first-child,.btn-group-vertical .btn:not(.btn-default):first-child{border-top:none}\n\n.badge,.label{background-color:#aab2bd}\n\n.badge-default,.label-default{color:#434a54;background-color:#fff;\r border:1px solid #aab2bd}\n\n.badge-primary,.label-primary{background-color:#3bafda;border-color:#3bafda}\n\n.badge-success,.label-success{background-color:#8cc152;border-color:#8cc152}\n\n.badge-danger,.label-danger{background-color:#da4453;border-color:#da4453}\n\n.badge-warning,.label-warning{background-color:#f6bb42;border-color:#f6bb42}\n\n.badge-info,.label-info{background-color:#37bc9b;border-color:#37bc9b}\n\n.tooltip-inner{color:#fff;background-color:#434a54}\n\n.tooltip.top .tooltip-arrow,.tooltip.top-left .tooltip-arrow,.tooltip.top-right .tooltip-arrow{border-top-color:#434a54}\n\n.tooltip.right .tooltip-arrow{border-right-color:#434a54}\n\n.tooltip.left .tooltip-arrow{border-left-color:#434a54}\n\n.tooltip.bottom .tooltip-arrow,.tooltip.bottom-left .tooltip-arrow,.tooltip.bottom-right .tooltip-arrow{border-bottom-color:#434a54}\n\n.popover{color:#fff;\r background-color:#434a54;border-color:#434a54}\n\n.popover-title{padding-bottom:0;font-weight:700;color:#aab2bd;background-color:transparent;border-bottom:none}\n\n.popover.top .arrow,.popover.top .arrow:after{border-top-color:#434a54}\n\n.popover.right .arrow,.popover.right .arrow:after{border-right-color:#434a54}\n\n.popover.bottom .arrow,.popover.bottom .arrow:after{border-bottom-color:#434a54}\n\n.popover.left .arrow,.popover.left .arrow:after{border-left-color:#434a54}\n\n.progress{background-color:#e6e9ed;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}\n\n.progress-bar{background-color:#3bafda;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}\n\n.progress-bar-success{background-color:#8cc152}\n\n.progress-bar-info{background-color:#37bc9b}\n\n.progress-bar-warning{background-color:#f6bb42}\n\n.progress-bar-danger{background-color:#da4453}\n\n.breadcrumb{color:#434a54;background-color:#e6e9ed}\n\n.breadcrumb>.active{color:#434a54}\n\n.breadcrumb a{color:#3bafda}\n\n.breadcrumb-arrow{height:36px;\r padding:0;line-height:36px;list-style:none;background-color:#e6e9ed}\n\n.breadcrumb-arrow li:first-child a{border-radius:4px 0 0 4px;-webkit-border-radius:4px 0 0 4px;-moz-border-radius:4px 0 0 4px}\n\n.breadcrumb-arrow li,.breadcrumb-arrow li a,.breadcrumb-arrow li span{display:inline-block;vertical-align:top}\n\n.breadcrumb-arrow li:not(:first-child){margin-left:-5px}\n\n.breadcrumb-arrow li+li:before{padding:0;content:\"\"}\n\n.breadcrumb-arrow li span{padding:0 10px}\n\n.breadcrumb-arrow li a,.breadcrumb-arrow li:not(:first-child) span{height:36px;\r padding:0 10px 0 25px;line-height:36px}\n\n.breadcrumb-arrow li:first-child a{padding:0 10px}\n\n.breadcrumb-arrow li a{position:relative;color:#fff;text-decoration:none;background-color:#3bafda;border:1px solid #3bafda}\n\n.breadcrumb-arrow li:first-child a{padding-left:10px}\n\n.breadcrumb-arrow li a:after,.breadcrumb-arrow li a:before{position:absolute;top:-1px;width:0;height:0;content:'';border-top:18px solid transparent;border-bottom:18px solid transparent}\n\n.breadcrumb-arrow li a:before{right:-10px;z-index:3;border-left-color:#3bafda;border-left-style:solid;border-left-width:11px}\n\n.breadcrumb-arrow li a:after{right:-11px;z-index:2;border-left:11px solid #2494be}\n\n.breadcrumb-arrow li a:focus,.breadcrumb-arrow li a:hover{background-color:#4fc1e9;border:1px solid #4fc1e9}\n\n.breadcrumb-arrow li a:focus:before,.breadcrumb-arrow li a:hover:before{border-left-color:#4fc1e9}\n\n.breadcrumb-arrow li a:active{background-color:#2494be;border:1px solid #2494be}\n\n.breadcrumb-arrow li a:active:after,.breadcrumb-arrow li a:active:before{border-left-color:#2494be}\n\n.breadcrumb-arrow li span{color:#434a54}\n\n.pagination>li>a,.pagination>li>span{color:#434a54;background-color:#fff;border-color:#ccd1d9}\n\n.pagination>li>a:focus,.pagination>li>a:hover,.pagination>li>span:focus,.pagination>li>span:hover{color:#fff;background-color:#ccd1d9;border-color:#ccd1d9}\n\n.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{color:#fff;background-color:#8cc152;border-color:#8cc152}\n\n.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#e6e9ed;background-color:#fff;border-color:#ccd1d9}\n\n.pager li>a,.pager li>span{color:#fff;background-color:#8cc152;border-color:#8cc152}\n\n.pager li>a:focus,.pager li>a:hover{background-color:#a0d468;border-color:#a0d468}\n\n.pager .disabled>a,.pager .disabled>a:focus,.pager .disabled>a:hover,.pager .disabled>span{color:#e6e9ed;background-color:#fff;border-color:#e6e9ed}\n\n.form-control{color:#434a54;border-color:#aab2bd}\n\n.form-control,.form-control:focus{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}\n\n.form-control:focus{border-color:#3bafda}\n\n.form-control:-ms-input-placeholder,.form-control::-moz-placeholder,.form-control::-webkit-input-placeholder{color:#e6e9ed}\n\n.form-control.disabled,.form-control[disabled]{background-color:#e6e9ed;border-color:#e6e9ed}\n\n.input-group-btn .btn+.btn{border-color:#96a0ad;border-style:solid;\r border-width:1px}\n\n.input-group-btn .btn+.btn.btn-default{border-color:#ededed}\n\n.input-group-btn .btn+.btn.btn-primary{border-color:#269ecb}\n\n.input-group-btn .btn+.btn.btn-info{border-color:#2fa084}\n\n.input-group-btn .btn+.btn.btn-success{border-color:#7ab03f}\n\n.input-group-btn .btn+.btn.btn-warning{border-color:#f4af20}\n\n.input-group-btn .btn+.btn.btn-danger{border-color:#d1293a}\n\n.input-group-addon{color:#fff;background-color:#aab2bd;border-color:#96a0ad}\n\n.input-group-addon .checkbox,.input-group-addon .radio{margin:-3px 0 -4px!important}\n\n.form-search .search-query,.form-search .search-query:first-child,.form-search .search-query:last-child{padding:0 17px;border-radius:17px;-webkit-border-radius:17px;-moz-border-radius:17px}\n\n.input-group .form-control:last-child{border-top-left-radius:0;border-bottom-left-radius:0;-webkit-border-top-left-radius:0;-moz-border-radius-topleft:0;-webkit-border-bottom-left-radius:0;-moz-border-radius-bottomleft:0}\n\n.input-group .form-control:first-child{border-top-right-radius:0;border-bottom-right-radius:0;-webkit-border-top-right-radius:0;-moz-border-radius-topright:0;-webkit-border-bottom-right-radius:0;-moz-border-radius-bottomright:0}\n\n.form-search .btn{border-radius:17px;-webkit-border-radius:17px;-moz-border-radius:17px}\n\n.search-only{position:relative}\n\n.search-only .search-icon{position:absolute;top:2px;left:8.5px;z-index:20;width:30px;font-size:17px;line-height:30px;color:#e6e9ed;text-align:center}\n\n.search-only .form-control:last-child{padding-left:40px}\n\n.has-success .checkbox,.has-success .checkbox-inline,.has-success .control-label,.has-success .help-block,.has-success .radio,.has-success .radio-inline{color:#8cc152}\n\n.has-success .form-control,.has-success .form-control:focus{border-color:#8cc152;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}\n\n.has-success .input-group-addon{background-color:#8cc152;border-color:#8cc152}\n\n.has-success .form-control-feedback{color:#8cc152}\n\n.has-warning .checkbox,.has-warning .checkbox-inline,.has-warning .control-label,.has-warning .help-block,.has-warning .radio,.has-warning .radio-inline{color:#f6bb42}\n\n.has-warning .form-control,.has-warning .form-control:focus{border-color:#f6bb42;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}\n\n.has-warning .input-group-addon{background-color:#f6bb42;border-color:#f6bb42}\n\n.has-warning .form-control-feedback{color:#f6bb42}\n\n.has-error .checkbox,.has-error .checkbox-inline,.has-error .control-label,.has-error .help-block,.has-error .radio,.has-error .radio-inline{color:#da4453}\n\n.has-error .form-control,.has-error .form-control:focus{border-color:#da4453;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}\n\n.has-error .input-group-addon{background-color:#da4453;border-color:#da4453}\n\n.has-error .form-control-feedback{color:#da4453}\n\n.stepper .stepper-input{overflow:hidden;-moz-appearance:textfield}\n\n.stepper .stepper-input::-webkit-inner-spin-button,.stepper .stepper-input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}\n\n.stepper .stepper-arrow{position:absolute;right:15px;display:block;width:20px;height:50%;text-indent:-99999px;cursor:pointer;\r background-color:#3bafda}\n\n.stepper .stepper-arrow:active,.stepper .stepper-arrow:hover{background-color:#4fc1e9}\n\n.stepper .up{top:0;border:1px solid #269ecb;border-top-right-radius:3px;-webkit-border-top-right-radius:3px;-moz-border-radius-topright:3px}\n\n.stepper .down{bottom:0;border-bottom-right-radius:3px;-webkit-border-bottom-right-radius:3px;-moz-border-radius-bottomright:3px}\n\n.stepper .down::before,.stepper .up::before{position:absolute;width:0;height:0;\r content:\"\";border-right:4px solid transparent;border-left:4px solid transparent}\n\n.stepper .up::before{top:5px;left:5px;border-bottom:4px solid #fff}\n\n.stepper .down:before{bottom:5px;left:6px;border-top:4px solid #fff}\n\n.stepper.disabled .stepper-arrow{background-color:#3bafda;filter:alpha(opacity=45);opacity:.45}\n\n.selecter{position:relative;z-index:1;\r display:block;max-width:100%;outline:0}\n\n.selecter .selecter-element{position:absolute;left:0;z-index:0;display:none;width:100%;height:100%;filter:alpha(opacity=0);opacity:0;*left:-999999px}\n\n.selecter .selecter-element,.selecter .selecter-element:focus{outline:0;-webkit-tap-highlight-color:rgba(255,255,255,0);-webkit-tap-highlight-color:transparent}\n\n.selecter .selecter-selected{position:relative;z-index:2;display:block;padding:6px 10px;overflow:hidden;text-overflow:clip;cursor:pointer;\r background-color:#fff;border:1px solid #aab2bd;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.selecter .selecter-selected:after{position:absolute;top:14px;right:10px;width:0;height:0;content:\"\";border-top:4px solid #000;border-right:4px solid transparent;border-left:4px solid transparent}\n\n.selecter .selecter-options{position:absolute;top:100%;left:0;z-index:50;display:none;width:100%;max-height:260px;overflow:auto;overflow-x:hidden;background-color:#fff;\r border:1px solid #aab2bd;border-width:0 1px 1px;border-radius:0 0 4px 4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);-moz-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175);-webkit-border-radius:0 0 4px 4px;-moz-border-radius:0 0 4px 4px;*width:auto}\n\n.selecter .selecter-group{display:block;padding:5px 10px 4px;font-size:11px;color:#aab2bd;text-transform:uppercase;background-color:#f5f7fa;\r border-bottom:1px solid #e6e9ed}\n\n.selecter .selecter-item{display:block;width:100%;padding:6px 10px;margin:0;overflow:hidden;text-overflow:ellipsis;cursor:pointer;\r background-color:#fff;border-bottom:1px solid #e6e9ed}\n\n.selecter .selecter-item.selected{color:#fff;background-color:#3bafda;border-bottom-color:#4fc1e9}\n\n.selecter .selecter-item.disabled{color:#aab2bd;cursor:default}\n\n.selecter .selecter-item:first-child{border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}\n\n.selecter .selecter-item:last-child{border-bottom:0;border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;-moz-border-radius:0 0 4px 4px}\n\n.selecter .selecter-item:hover{background-color:#e6e9ed}\n\n.selecter .selecter-item.selected:hover{background-color:#3bafda}\n\n.selecter .selecter-item.disabled:hover,.selecter.disabled .selecter-item:hover,.selecter:hover .selecter-selected{background-color:#fff}\n\n.selecter.open{z-index:3;outline:0}\n\n.selecter.open .selecter-selected{z-index:51;border:1px solid #3bafda;border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.selecter.focus .selecter-selected,.selecter.open .selecter-selected{background-color:#fff}\n\n.selecter.cover .selecter-options{top:0;border-width:1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.selecter.cover .selecter-options .selecter-item.first{border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.selecter.cover.open .selecter-selected{z-index:49;border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.selecter.bottom .selecter-options{top:auto;bottom:100%;\r border-width:1px 1px 0}\n\n.selecter.bottom .selecter-item:last-child{border:none;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}\n\n.selecter.bottom.open .selecter-selected{border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;-moz-border-radius:0 0 4px 4px}\n\n.selecter.bottom.open .selecter-options{border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.selecter.bottom.cover .selecter-options{top:auto;bottom:0}\n\n.selecter.bottom.cover.open .selecter-options,.selecter.bottom.cover.open .selecter-selected{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.selecter.multiple .selecter-options{position:static;display:block;width:100%;border-width:1px;border-radius:4px;box-shadow:none;-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.selecter.disabled .selecter-selected{color:#aab2bd;cursor:default;background-color:#e6e9ed;border-color:#e6e9ed}\n\n.selecter.disabled .selecter-options{background-color:#e6e9ed;border-color:#e6e9ed}\n\n.selecter.disabled .selecter-group,.selecter.disabled .selecter-item{color:#aab2bd;cursor:default;background-color:#e6e9ed;border-color:#e6e9ed}\n\n.selecter.disabled .selecter-item.selected{color:#fff;background-color:#3bafda;filter:alpha(opacity=45);opacity:.45}\n\n.selecter .selecter-options.scroller{overflow:hidden}\n\n.selecter .selecter-options.scroller .scroller-content{max-height:260px;padding:0}\n\n.checkbox,.radio{padding-left:0;margin-top:0}\n\n.checkbox label,.radio label{position:relative;top:2px;padding-left:5px}\n\n.icheckbox_flat,.iradio_flat{display:inline-block;width:20px;height:20px;padding:0!important;margin:0;vertical-align:middle;cursor:pointer;background:url(../bootflat/img/check_flat/default.png) no-repeat;border:none;*display:inline}\n\n.icheckbox_flat{background-position:0 0}\n\n.icheckbox_flat.checked{background-position:-22px 0}\n\n.icheckbox_flat.disabled{cursor:default;background-position:-44px 0}\n\n.icheckbox_flat.checked.disabled{background-position:-66px 0}\n\n.iradio_flat{background-position:-88px 0}\n\n.iradio_flat.checked{background-position:-110px 0}\n\n.iradio_flat.disabled{cursor:default;background-position:-132px 0}\n\n.iradio_flat.checked.disabled{background-position:-154px 0}\n\n.toggle{height:32px}\n\n.toggle input[type=checkbox],.toggle input[type=radio]{width:0;height:0;padding:0;margin:0;text-indent:-100000px;filter:alpha(opacity=0);opacity:0}\n\n.toggle .handle{position:relative;top:-20px;left:0;\r display:block;width:50px;height:32px;background-color:#fff;border-radius:19px;-webkit-box-shadow:inset 0 0 0 1px #b8bfc8;-moz-box-shadow:inset 0 0 0 1px #b8bfc8;box-shadow:inset 0 0 0 1px #b8bfc8;-webkit-border-radius:19px;-moz-border-radius:19px}\n\n.toggle .handle:after,.toggle .handle:before{position:absolute;top:1px;left:1px;display:block;width:30px;height:30px;\r content:\"\";background-color:#fff;border-radius:30px;-webkit-box-shadow:inset 0 0 0 1px #b8bfc8,1px 1px 1px #c7ccd3;-moz-box-shadow:inset 0 0 0 1px #b8bfc8,1px 1px 1px #c7ccd3;box-shadow:inset 0 0 0 1px #b8bfc8,1px 1px 1px #c7ccd3;-webkit-transition:all .25s ease-in-out;-moz-transition:all .25s ease-in-out;transition:all .25s ease-in-out;-webkit-border-radius:30px;-moz-border-radius:30px}\n\n.toggle input[type=checkbox]:disabled+.handle,.toggle input[type=checkbox]:disabled+.handle:after,.toggle input[type=checkbox]:disabled+.handle:before,.toggle input[type=radio]:disabled+.handle,.toggle input[type=radio]:disabled+.handle:after,.toggle input[type=radio]:disabled+.handle:before{background-color:#e6e9ed;filter:alpha(opacity=60);\r opacity:.6}\n\n.toggle input[type=checkbox]:checked+.handle:before,.toggle input[type=radio]:checked+.handle:before{width:50px;background-color:#a0d468}\n\n.toggle input[type=checkbox]:checked+.handle:after,.toggle input[type=radio]:checked+.handle:after{left:20px;-webkit-box-shadow:inset 0 0 0 1px #f5f7fa,1px 1px 1px #c7ccd3;-moz-box-shadow:inset 0 0 0 1px #f5f7fa,1px 1px 1px #c7ccd3;box-shadow:inset 0 0 0 1px #f5f7fa,1px 1px 1px #c7ccd3}\n\n.calendar{padding:20px;color:#fff;background-color:#fd9883;border-radius:4px;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);-moz-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2);-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.calendar .unit{float:left;width:14.28%;text-align:center}\n\n.calendar .years .prev{text-align:left}\n\n.calendar .years .next{text-align:right}\n\n.calendar .years .next em,.calendar .years .prev em{position:relative;display:inline-block;width:34px;height:34px;cursor:pointer;border:1px solid #fff;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%}\n\n.calendar .years .next em:before,.calendar .years .prev em:before{position:absolute;display:block;width:0;height:0;margin-top:6px;font-size:0;content:\"\";border-style:solid;border-width:7px}\n\n.calendar .years .prev em:before{top:3px;left:4px;border-color:transparent #fff transparent transparent}\n\n.calendar .years .next em:before{top:3px;left:13px;border-color:transparent transparent transparent #fff}\n\n.calendar .years .next em:active,.calendar .years .next em:hover,.calendar .years .prev em:active,.calendar .years .prev em:hover{border-color:#e9573f}\n\n.calendar .years .prev em:active:before,.calendar .years .prev em:hover:before{border-color:transparent #e9573f transparent transparent}\n\n.calendar .years .next em:active:before,.calendar .years .next em:hover:before{border-color:transparent transparent transparent #e9573f}\n\n.calendar .years .monyear{float:left;width:71.42%;height:34px;line-height:34px;text-align:center}\n\n.calendar .days{padding-top:15px;\r margin-top:15px;border-top:1px solid #ee7f6d}\n\n.calendar .days .unit{height:34px;\r margin-bottom:3px;line-height:34px;text-align:center}\n\n.calendar .days .unit b{width:34px;height:34px;font-weight:400;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%}\n\n.calendar .days .unit.active b,.calendar .days .unit:active b,.calendar .days .unit:hover b{display:inline-block;color:#e9573f;cursor:pointer;background-color:#fff;-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;transition:all .2s ease-in-out}\n\n.calendar .days .unit.older b{width:auto;height:auto;color:#e9573f;cursor:default;background-color:transparent}\n\n.pricing ul{padding:0;list-style:none}\n\n.pricing .unit{position:relative;display:inline-block;min-width:250px;text-align:center;border-radius:4px;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);-moz-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2);-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.pricing .unit.active{top:5px;z-index:1;margin-right:-36px;margin-left:-36px;-webkit-box-shadow:0 0 8px rgba(0,0,0,.6);-moz-box-shadow:0 0 8px rgba(0,0,0,.6);box-shadow:0 0 8px rgba(0,0,0,.6)}\n\n.pricing .unit.active .price-title h3{font-size:40px}\n\n@media screen and (max-width:767px){.pricing .unit{display:block;margin-bottom:20px}.pricing .unit.active{top:0;margin-right:0;margin-left:0}.pricing .unit.active .price-title h3{font-size:30px}}\n\n.pricing .price-title{padding:20px 20px 10px;color:#fff;border-top-left-radius:4px;border-top-right-radius:4px;-webkit-border-top-left-radius:4px;-moz-border-radius-topleft:4px;-webkit-border-top-right-radius:4px;-moz-border-radius-topright:4px}\n\n.pricing .price-title h3,.pricing .price-title h3>p{margin:0}\n\n.pricing .price-body{padding:20px 20px 10px}\n\n.pricing .price-body ul{padding-top:10px}\n\n.pricing .price-body li{margin-bottom:10px}\n\n.pricing .price-body h4{margin:0}\n\n.pricing .price-foot{padding:20px;background-color:#e6e9ed;border-bottom-right-radius:4px;border-bottom-left-radius:4px;-webkit-border-bottom-left-radius:4px;-moz-border-radius-bottomleft:4px;-webkit-border-bottom-right-radius:4px;-moz-border-radius-bottomright:4px}\n\n.pricing .price-primary .price-title{background-color:#4fc1e9}\n\n.pricing .price-primary .price-body{background-color:#d7f1fa}\n\n.pricing .price-primary .price-body ul{border-top:1px solid #aae1f4}\n\n.pricing .price-success .price-title{background-color:#a0d468}\n\n.pricing .price-success .price-body{background-color:#ebf6df}\n\n.pricing .price-success .price-body ul{border-top:1px solid #d2ebb7}\n\n.pricing .price-warning .price-title{background-color:#ffce54}\n\n.pricing .price-warning .price-body{background-color:#fffaed}\n\n.pricing .price-warning .price-body ul{border-top:1px solid #ffebba}\n\n.alert h4{margin-bottom:10px;font-weight:700}\n\n.alert-dismissable .close{color:#000}\n\n.alert-info{background-color:#7cd1ef;border:#4fc1e9}\n\n.alert-warning{background-color:#ffdd87;border:#ffce54}\n\n.alert-danger{background-color:#f2838f;border:#ed5565}\n\n.alert-success{background-color:#b9df90;border:#a0d468}\n\n.alert .alert-link{text-decoration:underline;\r cursor:pointer;filter:alpha(opacity=65);opacity:.65}\n\n.alert .alert-link:focus,.alert .alert-link:hover{filter:alpha(opacity=45);opacity:.45}\n\n.alert .btn-link,.alert .btn-link:focus,.alert .btn-link:hover{color:#000;filter:alpha(opacity=65);opacity:.65}\n\n.alert .btn-link:focus,.alert .btn-link:hover{text-decoration:none;filter:alpha(opacity=40);opacity:.4}\n\n.nav-tabs{background-color:#e6e9ed;\r border-bottom:none;border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.nav-tabs>li{margin-bottom:0;border-left:1px solid #ccd1d9}\n\n.nav-tabs>li:first-child{border-left:none}\n\n.nav-tabs>li>a{margin-right:0;color:#434a54;border:none;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}\n\n.nav-tabs>li:first-child>a{border-radius:4px 0 0;-webkit-border-radius:4px 0 0;-moz-border-radius:4px 0 0}\n\n.nav-tabs>li>a:focus,.nav-tabs>li>a:hover{background-color:#f5f7fa;border:none}\n\n.nav-tabs>li.active>a,.nav-tabs>li.active>a:focus,.nav-tabs>li.active>a:hover{background-color:#fff!important;border:none}\n\n.nav-tabs .dropdown-toggle,.nav-tabs .dropdown-toggle:focus,.nav-tabs .dropdown-toggle:hover{color:#434a54}\n\n.nav-tabs li.dropdown.open .dropdown-toggle{color:#434a54;background-color:#f5f7fa}\n\n.nav-tabs li.dropdown.active.open .dropdown-toggle{color:#434a54}\n\n.nav-tabs .dropdown-toggle .caret,.nav-tabs .dropdown-toggle:focus .caret,.nav-tabs .dropdown-toggle:hover .caret,.nav-tabs li.dropdown.active .dropdown-toggle .caret,.nav-tabs li.dropdown.active.open .dropdown-toggle .caret,.nav-tabs li.dropdown.open .caret,.nav-tabs li.dropdown.open a:focus .caret,.nav-tabs li.dropdown.open a:hover .caret,.nav-tabs li.dropdown.open.active .caret{border-top-color:#434a54;border-bottom-color:#434a54}\n\n.nav-tabs.nav-justified>li>a{margin-bottom:0;text-align:center}\n\n.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}\n\n.nav-tabs.nav-justified>li>a{border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}\n\n.nav-tabs.nav-justified>li:first-child>a{border-radius:4px 0 0;-webkit-border-radius:4px 0 0;-moz-border-radius:4px 0 0}\n\n.nav-tabs.nav-justified>li:last-child>a{border-radius:0 4px 0 0;-webkit-border-radius:0 4px 0 0;-moz-border-radius:0 4px 0 0}\n\n.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border:none}\n\n@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:none;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border-bottom:none}}\n\n.tab-content{padding:10px}\n\n.tabs-below .nav-tabs{border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;-moz-border-radius:0 0 4px 4px}\n\n.tabs-below .nav-tabs>li:first-child>a{border-radius:0 0 0 4px;-webkit-border-radius:0 0 0 4px;-moz-border-radius:0 0 0 4px}\n\n.tabs-below .nav-tabs.nav-justified>li:last-child>a{border-radius:0 0 4px;-webkit-border-radius:0 0 4px;-moz-border-radius:0 0 4px}\n\n.tabs-left .nav-tabs>li,.tabs-right .nav-tabs>li{float:none;border-top:1px solid #ccd1d9;border-left:none}\n\n.tabs-left .nav-tabs>li:first-child,.tabs-right .nav-tabs>li:first-child{border-top:none}\n\n.tabs-left .nav-tabs>li>a,.tabs-right .nav-tabs>li>a{min-width:74px;margin-right:0}\n\n.tabs-left .nav-tabs{float:left;margin-right:19px;border-radius:4px 0 0 4px;-webkit-border-radius:4px 0 0 4px;-moz-border-radius:4px 0 0 4px}\n\n.tabs-left .nav-tabs>li:first-child>a{border-radius:4px 0 0;-webkit-border-radius:4px 0 0;-moz-border-radius:4px 0 0}\n\n.tabs-left .nav-tabs>li:last-child>a{border-radius:0 0 0 4px;-webkit-border-radius:0 0 0 4px;-moz-border-radius:0 0 0 4px}\n\n.tabs-right .nav-tabs{float:right;margin-left:19px;border-radius:0 4px 4px 0;-webkit-border-radius:0 4px 4px 0;-moz-border-radius:0 4px 4px 0}\n\n.tabs-right .nav-tabs>li:first-child>a{border-radius:0 4px 0 0;-webkit-border-radius:0 4px 0 0;-moz-border-radius:0 4px 0 0}\n\n.tabs-right .nav-tabs>li:last-child>a{border-radius:0 0 4px;-webkit-border-radius:0 0 4px;-moz-border-radius:0 0 4px}\n\n.nav-pills>li.active>a,.nav-pills>li.active>a:focus,.nav-pills>li.active>a:hover{color:#fff;background-color:#3bafda}\n\n.nav-pills>li>a{color:#3bafda}\n\n.nav-pills>li>a:hover{color:#434a54;background-color:#e6e9ed}\n\n.nav-pills>.active>a>.badge{color:#3bafda}\n\n.nav-pills .open>a,.nav-pills .open>a:focus,.nav-pills .open>a:hover{color:#434a54;background-color:#e6e9ed}\n\n.navbar-form{padding:0!important}\n\n.navbar-default{background-color:#37bc9b;border-color:#37bc9b}\n\n.navbar-default .btn-link,.navbar-default .navbar-brand,.navbar-default .navbar-link{color:#26816a}\n\n.navbar-default .btn-link:focus,.navbar-default .btn-link:hover,.navbar-default .navbar-brand:focus,.navbar-default .navbar-brand:hover,.navbar-default .navbar-link:hover{color:#fff;background-color:transparent}\n\n.navbar-default .navbar-nav>li>a,.navbar-default .navbar-text{color:#26816a}\n\n.navbar-default .navbar-nav>li>a:focus,.navbar-default .navbar-nav>li>a:hover{color:#fff}\n\n.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:focus,.navbar-default .navbar-nav>.active>a:hover{color:#fff;background-color:#48cfad}\n\n.navbar-default .btn-link[disabled]:focus,.navbar-default .btn-link[disabled]:hover,.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:focus,.navbar-default .navbar-nav>.disabled>a:hover,fieldset[disabled] .navbar-default .btn-link:focus,fieldset[disabled] .navbar-default .btn-link:hover{color:#2e9c81;background-color:transparent}\n\n.navbar-default .navbar-toggle{background-color:#26816a;border-color:#26816a}\n\n.navbar-default .navbar-toggle:focus,.navbar-default .navbar-toggle:hover{background-color:#2b957a;border-color:#2b957a}\n\n.navbar-default .navbar-toggle .icon-bar{background-color:#37bc9b}\n\n.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#48cfad}\n\n.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:focus,.navbar-default .navbar-nav>.open>a:hover{color:#fff;background-color:#37bc9b}\n\n@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>.divider,.navbar-default .navbar-nav>li>a:focus,.navbar-default .navbar-nav>li>a:hover{background-color:#48cfad}.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#26816a}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover{color:#fff;background-color:#48cfad}.navbar-default .navbar-nav .open .dropdown-menu>.dropdown-header{color:#26816a}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#2b957a}}\n\n.navbar-inverse{background-color:#333;border-color:#333}\n\n.navbar-inverse .btn-link,.navbar-inverse .navbar-brand,.navbar-inverse .navbar-link{color:#8c8c8c}\n\n.navbar-inverse .btn-link:focus,.navbar-inverse .btn-link:hover,.navbar-inverse .navbar-brand:focus,.navbar-inverse .navbar-brand:hover,.navbar-inverse .navbar-link:hover{color:#fff;background-color:transparent}\n\n.navbar-inverse .navbar-nav>li>a,.navbar-inverse .navbar-text{color:#8c8c8c}\n\n.navbar-inverse .navbar-nav>li>a:focus,.navbar-inverse .navbar-nav>li>a:hover{color:#fff}\n\n.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:focus,.navbar-inverse .navbar-nav>.active>a:hover{color:#fff;background-color:#000}\n\n.navbar-inverse .btn-link[disabled]:focus,.navbar-inverse .btn-link[disabled]:hover,.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:focus,.navbar-inverse .navbar-nav>.disabled>a:hover,fieldset[disabled] .navbar-inverse .btn-link:focus,fieldset[disabled] .navbar-inverse .btn-link:hover{color:#666;background-color:transparent}\n\n.navbar-inverse .navbar-toggle{background-color:#000;border-color:#000}\n\n.navbar-inverse .navbar-toggle:focus,.navbar-inverse .navbar-toggle:hover{background-color:#1a1a1a;border-color:#1a1a1a}\n\n.navbar-inverse .navbar-toggle .icon-bar{background-color:#8c8c8c}\n\n.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#000}\n\n.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:focus,.navbar-inverse .navbar-nav>.open>a:hover{color:#fff;background-color:#000}\n\n@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.divider,.navbar-inverse .navbar-nav>li>a:focus,.navbar-inverse .navbar-nav>li>a:hover{background-color:#000}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#8c8c8c}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover{color:#fff;background-color:#000}.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{color:#bfbfbf}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#666}}\n\n.list-group{border-radius:4px;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);-moz-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2);-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.list-group-item{border-color:transparent;border-top-color:#e6e9ed}\n\n.list-group-item:first-child{border-top:none}\n\n.list-group-item-heading,a.list-group-item{color:#434a54}\n\na.list-group-item .list-group-item-heading{font-size:16px;color:#434a54}\n\na.list-group-item:focus,a.list-group-item:hover{background-color:#e6e9ed}\n\na.list-group-item.active,a.list-group-item.active:focus,a.list-group-item.active:hover{background-color:#4fc1e9;border-color:#4fc1e9}\n\na.list-group-item.active .list-group-item-text,a.list-group-item.active:focus .list-group-item-text,a.list-group-item.active:hover .list-group-item-text{color:#fff}\n\n.list-group-item-primary{color:#22b1e3;background-color:#4fc1e9;border-color:#3bafda transparent transparent}\n\n.list-group-item-primary:first-child{border-color:transparent}\n\na.list-group-item-primary{color:#126d8d}\n\na.list-group-item-primary:focus,a.list-group-item-primary:hover{color:#fff}\n\na.list-group-item-primary.active,a.list-group-item-primary:focus,a.list-group-item-primary:hover{background-color:#3bafda;border-color:#4fc1e9 transparent transparent}\n\n.list-group-item-success{color:#87c940;background-color:#a0d468;border-color:#8cc152 transparent transparent}\n\n.list-group-item-success:first-child{border-color:transparent}\n\na.list-group-item-success{color:#537f24}\n\na.list-group-item-success:focus,a.list-group-item-success:hover{color:#fff}\n\na.list-group-item-success.active,a.list-group-item-success:focus,a.list-group-item-success:hover{background-color:#8cc152;border-color:#a0d468 transparent transparent}\n\n.list-group-item-warning{color:#ffbf21;background-color:#ffce54;border-color:#f6bb42 transparent transparent}\n\n.list-group-item-warning:first-child{border-color:transparent}\n\na.list-group-item-warning{color:#876000}\n\na.list-group-item-warning:focus,a.list-group-item-warning:hover{color:#fff}\n\na.list-group-item-warning.active,a.list-group-item-warning:focus,a.list-group-item-warning:hover{background-color:#f6bb42;border-color:#ffce54 transparent transparent}\n\n.list-group-item-info{color:#2fb593;background-color:#48cfad;border-color:#37bc9b transparent transparent}\n\n.list-group-item-info:first-child{border-color:transparent}\n\na.list-group-item-info{color:#1a6451}\n\na.list-group-item-info:focus,a.list-group-item-info:hover{color:#fff}\n\na.list-group-item-info.active,a.list-group-item-info:focus,a.list-group-item-info:hover{background-color:#37bc9b;border-color:#48cfad transparent transparent}\n\n.list-group-item-danger{color:#e8273b;background-color:#ed5565;border-color:#da4453 transparent transparent}\n\n.list-group-item-danger:first-child{border-color:transparent}\n\na.list-group-item-danger{color:#99101f}\n\na.list-group-item-danger:focus,a.list-group-item-danger:hover{color:#fff}\n\na.list-group-item-danger.active,a.list-group-item-danger:focus,a.list-group-item-danger:hover{background-color:#da4453;border-color:#ed5565 transparent transparent}\n\n.media-list{color:#aab2bd}\n\n.media-heading{font-size:14px;color:#434a54}\n\n.modal-content{color:#434a54;\r border:none;border-radius:4px;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);-moz-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2);-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.modal-header{border-bottom:none}\n\n.modal-body{padding:0 15px}\n\n.modal-footer{border-top:none}\n\n.well{padding:10px;color:#434a54;background-color:#fff;border:none;border-radius:4px;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);-moz-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2);-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.well blockquote{border-color:#ccd1d9}\n\n.well-lg{padding:20px}\n\n.well-sm{padding:5px}\n\n.thumbnail{border:none;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);-moz-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2)}\n\n.thumbnail a>img,.thumbnail>img{width:100%}\n\n.thumbnail .caption{font-size:14px}\n\n.thumbnail .caption h1,.thumbnail .caption h2,.thumbnail .caption h3,.thumbnail .caption h4,.thumbnail .caption h5,.thumbnail .caption h6{margin:5px 0 10px;font-size:16px}\n\n.jumbotron{padding:0;\r margin-bottom:20px;background-color:#fff;border-radius:4px;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);-moz-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2);-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.container .jumbotron{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.jumbotron>.jumbotron-photo img{width:100%;border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.jumbotron .jumbotron-contents{padding:20px;color:#434a54}\n\n.jumbotron .carousel,.jumbotron .carousel-inner,.jumbotron .carousel-inner>.item.active img{border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.jumbotron .carousel-inner>.item>a>img,.jumbotron .carousel-inner>.item>img{width:100%}\n\n.jumbotron .carousel-control.left{border-radius:4px 0 0;-webkit-border-radius:4px 0 0;-moz-border-radius:4px 0 0}\n\n.jumbotron .carousel-control.right{border-radius:0 4px 0 0;-webkit-border-radius:0 4px 0 0;-moz-border-radius:0 4px 0 0}\n\n.jumbotron .h1,.jumbotron .h2,.jumbotron h1,.jumbotron h2{font-weight:400}\n\n.jumbotron .h1,.jumbotron h1{font-size:28px}\n\n.jumbotron .h2,.jumbotron h2{font-size:24px}\n\n.jumbotron p{font-size:14px}\n\n@media screen and (min-width:768px){.container .jumbotron,.jumbotron{padding:0}.jumbotron .h1,.jumbotron h1{font-size:28px}}\n\n.panel{background-color:#fff;border:none;border-radius:4px;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);-moz-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2);-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.panel .list-group{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}\n\n.panel .list-group-item:first-child{border-top:1px solid #e6e9ed}\n\n.panel-heading{border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.panel-title{font-size:14px;font-weight:400;color:#434a54}\n\n.panel-footer{background-color:#e6e9ed;border-top-color:#e6e9ed;border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;-moz-border-radius:0 0 4px 4px}\n\n.panel-default{border-color:#e6e9ed}\n\n.panel-default>.panel-heading{color:#434a54;background-color:#e6e9ed;border-color:#e6e9ed}\n\n.panel-primary{border-color:#3bafda}\n\n.panel-primary>.panel-heading{color:#fff;background-color:#3bafda;border-color:#3bafda}\n\n.panel-success{border-color:#8cc152}\n\n.panel-success>.panel-heading{color:#fff;background-color:#8cc152;border-color:#8cc152}\n\n.panel-info{border-color:#37bc9b}\n\n.panel-info>.panel-heading{color:#fff;background-color:#37bc9b;border-color:#37bc9b}\n\n.panel-warning{border-color:#f6bb42}\n\n.panel-warning>.panel-heading{color:#fff;background-color:#f6bb42;border-color:#f6bb42}\n\n.panel-danger{border-color:#da4453}\n\n.panel-danger>.panel-heading{color:#fff;background-color:#da4453;border-color:#da4453}\n\n.panel-danger>.panel-heading>.panel-title,.panel-info>.panel-heading>.panel-title,.panel-primary>.panel-heading>.panel-title,.panel-success>.panel-heading>.panel-title,.panel-warning>.panel-heading>.panel-title{color:#fff}\n\n.panel>.list-group:first-child .list-group-item:first-child,.panel>.table-responsive:first-child>.table:first-child,.panel>.table:first-child{border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.panel>.list-group:last-child .list-group-item:last-child{border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;-moz-border-radius:0 0 4px 4px}\n\n.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table:first-child>thead:first-child>tr:first-child th:first-child{border-radius:4px 0 0;-webkit-border-radius:4px 0 0;-moz-border-radius:4px 0 0}\n\n.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table:first-child>thead:first-child>tr:first-child th:last-child{border-radius:0 4px 0 0;-webkit-border-radius:0 4px 0 0;-moz-border-radius:0 4px 0 0}\n\n.panel>.table-responsive:last-child>.table:last-child,.panel>.table:last-child{border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;-moz-border-radius:0 0 4px 4px}\n\n.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:first-child{border-radius:0 0 0 4px;-webkit-border-radius:0 0 0 4px;-moz-border-radius:0 0 0 4px}\n\n.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:last-child{border-radius:0 0 4px;-webkit-border-radius:0 0 4px;-moz-border-radius:0 0 4px}\n\n.panel>.panel-body+.table,.panel>.panel-body+.table-responsive{border-top-color:#e6e9ed}\n\n.panel-group .panel{background-color:transparent;border-radius:0;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;-webkit-border-radius:0;-moz-border-radius:0}\n\n.panel-group .panel+.panel{margin-top:0}\n\n.panel-group .panel-heading{padding:0;border-bottom-color:transparent}\n\n.panel-group .panel-heading+.panel-collapse .panel-body{padding:15px 0;border-top-color:transparent}\n\n.panel-group .panel-title a{display:block;padding:10px 0}\n\n.panel-group-lists .panel{background-color:#fff;\r border-bottom:1px solid #e6e9ed;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);-moz-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2)}\n\n.panel-group-lists .panel:first-child{border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.panel-group-lists .panel:last-child{border-bottom:none;border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;-moz-border-radius:0 0 4px 4px}\n\n.panel-group-lists .panel-heading+.panel-collapse .panel-body{padding:15px;border-top-color:#e6e9ed}\n\n.panel-group-lists .panel-title a{padding:10px 15px;color:#434a54}\n\n.panel-group-lists .panel-title a:active,.panel-group-lists .panel-title a:focus,.panel-group-lists .panel-title a:hover{color:#aab2bd}\n\n.footer{padding:40px 0;background-color:#434a54}\n\n.footer-logo,.footer-nav{float:left;width:20%;padding:0 20px}\n\n@media (max-width:768px){.footer-logo{margin-bottom:20px}.footer-logo,.footer-nav{display:block;\r float:none;width:100%}}\n\n.footer-logo{height:32px;\r margin-top:-5px;line-height:32px}\n\n.footer-logo img{margin-right:10px}\n\n.footer-logo a{font-size:20px;font-weight:700;color:#fff}\n\n.footer-logo a:active,.footer-logo a:hover{text-decoration:none}\n\n.footer-nav .nav-title{margin-bottom:15px;color:#e6e9ed}\n\n.footer-nav .nav-item{line-height:28px}\n\n.footer-nav .nav-item>a{color:#aab2bd}\n\n.footer-nav .nav-item>a:active,.footer-nav .nav-item>a:hover{color:#ccd1d9;text-decoration:none}\n\n.footer-copyright{color:#aab2bd}\n\n.timeline dl{position:relative;top:0;padding:20px 0;margin:0}\n\n.timeline dl:before{position:absolute;top:0;bottom:0;left:50%;z-index:100;width:2px;margin-left:-1px;content:'';background-color:#ccd1d9}\n\n.timeline dl dt{position:relative;top:30px;z-index:200;width:120px;padding:3px 5px;margin:0 auto 30px;font-weight:400;color:#fff;text-align:center;background-color:#aab2bd;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.timeline dl dd{position:relative;z-index:200}\n\n.timeline dl dd .circ{position:absolute;top:40px;left:50%;z-index:200;width:22px;height:22px;margin-left:-11px;background-color:#4fc1e9;border:4px solid #f5f7fa;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%}\n\n.timeline dl dd .time{position:absolute;top:31px;left:50%;display:inline-block;width:100px;padding:10px 20px;color:#4fc1e9}\n\n.timeline dl dd .events{position:relative;width:47%;padding:10px 10px 0;margin-top:31px;background-color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}\n\n.timeline dl dd .events:before{position:absolute;top:12px;width:0;height:0;content:'';border-style:solid;border-width:6px}\n\n.timeline dl dd .events .events-object{margin-right:10px}\n\n.timeline dl dd .events .events-body{overflow:hidden;zoom:1}\n\n.timeline dl dd .events .events-body .events-heading{margin:0 0 10px;font-size:14px}\n\n.timeline dl dd.pos-right .time{margin-left:-100px;text-align:right}\n\n.timeline dl dd.pos-right .events{float:right}\n\n.timeline dl dd.pos-right .events:before{left:-12px;border-color:transparent #fff transparent transparent}\n\n.timeline dl dd.pos-left .time{margin-left:0;text-align:left}\n\n.timeline dl dd.pos-left .events{float:left}\n\n.timeline dl dd.pos-left .events:before{right:-12px;border-color:transparent transparent transparent #fff}\n\n@media screen and (max-width:767px){.timeline dl:before{left:60px}.timeline dl dt{margin:0 0 30px}.timeline dl dd .circ{left:60px}.timeline dl dd .time{left:0}.timeline dl dd.pos-left .time{padding:10px 0;\r margin-left:0;text-align:left}.timeline dl dd.pos-left .events{float:right;width:84%}.timeline dl dd.pos-left .events:before{left:-12px;border-color:transparent #fff transparent transparent}.timeline dl dd.pos-right .time{padding:10px 0;\r margin-left:0;text-align:left}.timeline dl dd.pos-right .events{float:right;width:84%}}\n\n.dropdown-menu{background-color:#434a54;border:none}\n\n.dropdown-menu .dropdown-header{padding:5px 20px;font-size:14px;font-weight:700;color:#aab2bd}\n\n.dropdown-menu li a{padding:5px 20px;color:#fff}\n\n.dropdown-menu .active a,.dropdown-menu .active a:focus,.dropdown-menu .active a:hover,.dropdown-menu li a:focus,.dropdown-menu li a:hover{color:#fff;background-color:#656d78;outline:0}\n\n.dropdown-menu .disabled a,.dropdown-menu .disabled a:focus,.dropdown-menu .disabled a:hover{color:#656d78;cursor:default}\n\n.dropdown-menu .divider{background-color:#656d78;border-bottom:none}\n\n.dropup .dropdown-menu{margin-bottom:0;border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0}\n\n.dropdown-submenu{position:relative}\n\n.dropdown-submenu .dropdown-menu{top:0;left:100%;margin-top:-6px;margin-left:-1px;border-radius:0 4px 4px;-webkit-border-radius:0 4px 4px;-moz-border-radius:0 4px 4px}\n\n.dropdown-submenu:hover .dropdown-menu{display:block}\n\n.dropup .dropdown-submenu .dropdown-menu{top:auto;bottom:0;margin-top:0;margin-bottom:-2px;border-radius:4px 4px 4px 0;-webkit-border-radius:4px 4px 4px 0;-moz-border-radius:4px 4px 4px 0}\n\n.dropdown-submenu>a:after{display:block;float:right;width:0;height:0;margin-top:5px;margin-right:-10px;content:\" \";border-color:transparent;border-style:solid;border-width:5px 0 5px 5px;border-left-color:#fff}\n\n.dropdown-default .dropdown-submenu>a:after{border-left-color:#434a54}\n\n.dropdown-submenu:hover a:after{border-left-color:#fff}\n\n.dropdown-submenu.pull-left{float:none}\n\n.dropdown-submenu.pull-left .dropdown-menu{left:-100%;margin-left:10px;border-radius:4px 0 4px 4px;-webkit-border-radius:4px 0 4px 4px;-moz-border-radius:4px 0 4px 4px}\n\n/* --- Design System / Theme --- */\n\n:root {\r\n  /* DARK THEME (Default) */\r\n  --bg-main: #34495e;\r\n  --bg-panel: #2c3e50;\r\n  --text-primary: #f1f2f2;\r\n  --text-secondary: #95a5a6;\r\n  --border-subtle: #465c71;\r\n  --accent-blue: #3498db;\r\n\r\n  /* Office 2010 Palette */\r\n  --off-blue-base: #4f81bd;\r\n  --off-blue-80: #dbe5f1;\r\n  --off-blue-60: #b8cce4;\r\n  --off-blue-40: #95b3d7;\r\n  --off-blue-d25: #366092;\r\n  --off-blue-d50: #244061;\r\n\r\n  --off-red-base: #c0504d;\r\n  --off-red-80: #f2dbdb;\r\n  --off-red-60: #e5b9b7;\r\n  --off-red-40: #d99694;\r\n  --off-red-d25: #953734;\r\n  --off-red-d50: #632423;\r\n\r\n  --off-green-base: #9bbb59;\r\n  --off-green-80: #ebf1de;\r\n  --off-green-60: #d7e3bc;\r\n  --off-green-40: #c4d79b;\r\n  --off-green-d25: #76923c;\r\n  --off-green-d50: #4f6128;\r\n\r\n  --off-purple-base: #8064a2;\r\n  --off-purple-80: #e4dfec;\r\n  --off-purple-60: #ccc1d9;\r\n  --off-purple-40: #b2a1c7;\r\n  --off-purple-d25: #5f497a;\r\n  --off-purple-d50: #3f3151;\r\n\r\n  --off-aqua-base: #4bacc6;\r\n  --off-aqua-80: #daeef3;\r\n  --off-aqua-60: #b7dee8;\r\n  --off-aqua-40: #92cddc;\r\n  --off-aqua-d25: #31859b;\r\n  --off-aqua-d50: #215967;\r\n\r\n  --off-orange-base: #f79646;\r\n  --off-orange-80: #fde9d9;\r\n  --off-orange-60: #fbd5b5;\r\n  --off-orange-40: #fac08f;\r\n  --off-orange-d25: #e36c09;\r\n  --off-orange-d50: #974806;\r\n\r\n  /* Icon Size */\r\n  --icon-size: 1.2rem;\r\n\r\n  /* Table Status mapping */\r\n  --status-I-bg: var(--off-green-base);\r\n  --status-I-text: #ffffff;\r\n  --status-I-bg-light: var(--off-green-60);\r\n  --status-I-text-light: #262626;\r\n\r\n  --status-A-bg: var(--off-purple-base);\r\n  --status-A-text: #ffffff;\r\n  --status-A-bg-light: var(--off-purple-60);\r\n  --status-A-text-light: #262626;\r\n\r\n  --status-E-bg: var(--off-red-base);\r\n  --status-E-text: #ffffff;\r\n  --status-E-bg-light: var(--off-red-60);\r\n  --status-E-text-light: #262626;\r\n\r\n  /* Object Type Colors (Orange Scale) */\r\n  --color-obj-l0: var(--off-orange-d25);\r\n  --color-obj-l1: var(--off-orange-base);\r\n  --color-obj-l2: var(--off-orange-40);\r\n  --color-obj-l3: var(--off-orange-60);\r\n  --color-obj-l4: var(--off-orange-80);\r\n\r\n  --bg-empty: rgba(44, 62, 80, 0.95);\r\n  --text-muted: #7f8c8d;\r\n\r\n  --row-bg-normal: #2c3e50;\r\n  --row-text-normal: #f1f2f2;\r\n\r\n  --text-on-dark: #ffffff;\r\n  --text-on-light: #262626;\r\n\r\n  --hover-bg: rgba(255, 255, 255, 0.05);\r\n\r\n  /* Grouping Rows (Grayscale) */\r\n  --bg-group-l0: #6c7a89;\r\n  --bg-group-l1: #95a5a6;\r\n  --bg-group-l2: #bdc3c7;\r\n  --bg-group-l3: #bfbfbf;\r\n\r\n  --btn-danger-bg: #da4453;\r\n  --btn-danger-border: #ed5565;\r\n}\n\n[data-theme=\"light\"] {\r\n  --bg-main: #ecf0f1;\r\n  --bg-panel: #ffffff;\r\n  --text-primary: #262626;\r\n  --text-secondary: #7f8c8d;\r\n  --border-subtle: #d1d8e0;\r\n  --accent-blue: #2980b9;\r\n\r\n  --row-bg-normal: #ffffff;\r\n  --row-text-normal: #262626;\r\n\r\n  --bg-empty: rgba(255, 255, 255, 0.95);\r\n  --hover-bg: rgba(0, 0, 0, 0.05);\r\n}\n\nbody {\r\n  background-color: var(--bg-main);\r\n  color: var(--text-primary);\r\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n  margin: 0;\r\n  transition:\r\n    background-color 0.3s ease,\r\n    color 0.3s ease;\r\n}\n\n/* Bootflat Overrides */\n\n.table {\r\n  color: var(--text-primary);\r\n  background: transparent;\r\n  border: 1px solid var(--border-subtle);\r\n  width: 100%;\r\n}\n\n.table thead {\r\n  background-color: var(--bg-panel);\r\n}\n\n.table th {\r\n  border-bottom: 2px solid var(--border-subtle);\r\n  text-transform: uppercase;\r\n  font-size: 0.75rem;\r\n  letter-spacing: 0.05em;\r\n  color: var(--text-secondary);\r\n}\n\n.table td {\r\n  border-top: 1px solid var(--border-subtle);\r\n}\n\n.table-hover tbody tr:hover {\r\n  background-color: var(--hover-bg);\r\n}\n\n[data-theme=\"dark\"] .table-hover tbody tr:hover {\r\n  background-color: var(--hover-bg);\r\n}\n\n.form-control {\r\n  background-color: var(--bg-panel);\r\n  color: var(--text-primary);\r\n  border: 1px solid var(--border-subtle);\r\n  border-radius: 4px;\r\n}\n\n.form-control:focus {\r\n  border-color: var(--accent-blue);\r\n  box-shadow: none;\r\n}\n\nlabel {\r\n  color: var(--text-secondary);\r\n  font-size: 0.75rem;\r\n  margin-bottom: 0.25rem;\r\n}\n\n.btn-primary {\r\n  background-color: var(--accent-blue);\r\n  border-color: var(--accent-blue);\r\n}\n\n.btn-danger {\r\n  background-color: var(--btn-danger-bg);\r\n  border-color: var(--btn-danger-border);\r\n}\n\n/* Remove Glyphicons dependency */\n\n@font-face {\r\n  font-family: \"Glyphicons Halflings\";\r\n  src: local(\"sans-serif\");\r\n}\r\n/*$vite$:1*/"));
			document.head.appendChild(elementStyle);
		}
	} catch (e) {
		console.error("vite-plugin-css-injected-by-js", e);
	}
	//#endregion
})();
(function() {
	//#region \0rolldown/runtime.js
	var __defProp = Object.defineProperty;
	var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
	var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	//#endregion
	//#region node_modules/lit-translate/model.js
	var init_model = __esmMin((() => {}));
	//#endregion
	//#region node_modules/lit-translate/config.js
	var LANG_CHANGED_EVENT;
	var init_config = __esmMin((() => {
		LANG_CHANGED_EVENT = "langChanged";
	}));
	//#endregion
	//#region node_modules/lit-translate/helpers.js
	/**
	* Interpolates the values into the string.
	* @param text
	* @param values
	* @param config
	*/
	function interpolate(text, values, config) {
		return Object.entries(extract(values || {})).reduce((text, [key, value]) => text.replace(new RegExp(`{{[  ]*${key}[  ]*}}`, `gm`), String(extract(value))), text);
	}
	/**
	* Returns a string based on a chain of keys using the dot notation.
	* @param key
	* @param config
	*/
	function lookup(key, config) {
		const parts = key.split(".");
		let string = config.strings;
		while (string != null && parts.length > 0) string = string[parts.shift()];
		return string != null ? string.toString() : null;
	}
	/**
	* Extracts either the value from the function or returns the value that was passed in.
	* @param obj
	*/
	function extract(obj) {
		return typeof obj === "function" ? obj() : obj;
	}
	var init_helpers = __esmMin((() => {}));
	//#endregion
	//#region node_modules/lit-translate/util.js
	/**
	* Registers a translation config.
	* @param config
	*/
	function registerTranslateConfig(config) {
		return translateConfig = Object.assign(Object.assign({}, translateConfig), config);
	}
	/**
	* Dispatches a language changed event.
	* @param detail
	*/
	function dispatchLangChanged(detail) {
		window.dispatchEvent(new CustomEvent(LANG_CHANGED_EVENT, { detail }));
	}
	/**
	* Updates the configuration object with a new language and strings.
	* Then dispatches that the language has changed.
	* @param newLang
	* @param newStrings
	* @param config
	*/
	function updateLang(newLang, newStrings, config = translateConfig) {
		dispatchLangChanged({
			previousStrings: config.strings,
			previousLang: config.lang,
			lang: config.lang = newLang,
			strings: config.strings = newStrings
		});
	}
	/**
	* Listens for changes in the language.
	* Returns a method for unsubscribing from the event.
	* @param callback
	* @param options
	*/
	function listenForLangChanged(callback, options) {
		const handler = (e) => callback(e.detail);
		window.addEventListener(LANG_CHANGED_EVENT, handler, options);
		return () => window.removeEventListener(LANG_CHANGED_EVENT, handler);
	}
	/**
	* Sets a new current language and dispatches a global language changed event.
	* @param lang
	* @param config
	*/
	async function use(lang, config = translateConfig) {
		const strings = await config.loader(lang, config);
		config.translationCache = {};
		updateLang(lang, strings, config);
	}
	/**
	* Translates a key and interpolates if values are defined.
	* Uses the current strings and translation cache to fetch the translation.
	* @param key (eg. "common.get_started")
	* @param values (eg. { count: 42 })
	* @param config
	*/
	function get(key, values, config = translateConfig) {
		let translation = config.translationCache[key] || (config.translationCache[key] = config.lookup(key, config) || config.empty(key, config));
		values = values != null ? extract(values) : null;
		return values != null ? config.interpolate(translation, values, config) : translation;
	}
	var defaultTranslateConfig, translateConfig;
	var init_util = __esmMin((() => {
		init_config();
		init_helpers();
		defaultTranslateConfig = () => {
			return {
				loader: () => Promise.resolve({}),
				empty: (key) => `[${key}]`,
				lookup,
				interpolate,
				translationCache: {}
			};
		};
		translateConfig = defaultTranslateConfig();
	}));
	//#endregion
	//#region node_modules/lit-translate/node_modules/lit-html/directive.js
	var t$7, e$8, i$7;
	var init_directive$2 = __esmMin((() => {
		t$7 = {
			ATTRIBUTE: 1,
			CHILD: 2,
			PROPERTY: 3,
			BOOLEAN_ATTRIBUTE: 4,
			EVENT: 5,
			ELEMENT: 6
		}, e$8 = (t) => (...e) => ({
			_$litDirective$: t,
			values: e
		});
		i$7 = class {
			constructor(t) {}
			get _$AU() {
				return this._$AM._$AU;
			}
			_$AT(t, e, i) {
				this._$Ct = t, this._$AM = e, this._$Ci = i;
			}
			_$AS(t, e) {
				return this.update(t, e);
			}
			update(t, e) {
				return this.render(...e);
			}
		};
	}));
	//#endregion
	//#region node_modules/lit-translate/node_modules/lit/directive.js
	var init_directive$1 = __esmMin((() => {
		init_directive$2();
	}));
	//#endregion
	//#region node_modules/lit-translate/node_modules/lit-html/lit-html.js
	function P$1(t, i) {
		if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
		return void 0 !== e$7 ? e$7.createHTML(i) : i;
	}
	function S$2(t, i, s = t, e) {
		var o, n, l, h;
		if (i === T$1) return i;
		let r = void 0 !== e ? null === (o = s._$Co) || void 0 === o ? void 0 : o[e] : s._$Cl;
		const u = d$3(i) ? void 0 : i._$litDirective$;
		return (null == r ? void 0 : r.constructor) !== u && (null === (n = null == r ? void 0 : r._$AO) || void 0 === n || n.call(r, !1), void 0 === u ? r = void 0 : (r = new u(t), r._$AT(t, s, e)), void 0 !== e ? (null !== (l = (h = s)._$Co) && void 0 !== l ? l : h._$Co = [])[e] = r : s._$Cl = r), void 0 !== r && (i = S$2(t, r._$AS(t, i.values), r, e)), i;
	}
	var t$6, i$6, s$5, e$7, o$9, n$6, l$4, h$4, r$7, u$3, d$3, c$5, v$2, a$3, f$3, _$1, m$2, p$3, g$1, $$1, y$2, w$1, T$1, A$1, E$1, C$1, V$1, N$1, M$1, R$1, k$1, H$1, I$1, L$1, z$1, Z$1, j$1, B$1, init_lit_html$1 = __esmMin((() => {
		i$6 = window, s$5 = i$6.trustedTypes, e$7 = s$5 ? s$5.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, o$9 = "$lit$", n$6 = `lit$${(Math.random() + "").slice(9)}$`, l$4 = "?" + n$6, h$4 = `<${l$4}>`, r$7 = document, u$3 = () => r$7.createComment(""), d$3 = (t) => null === t || "object" != typeof t && "function" != typeof t, c$5 = Array.isArray, v$2 = (t) => c$5(t) || "function" == typeof (null == t ? void 0 : t[Symbol.iterator]), a$3 = "[ 	\n\f\r]", f$3 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _$1 = /-->/g, m$2 = />/g, p$3 = RegExp(`>|${a$3}(?:([^\\s"'>=/]+)(${a$3}*=${a$3}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), g$1 = /'/g, $$1 = /"/g, y$2 = /^(?:script|style|textarea|title)$/i, w$1 = (t) => (i, ...s) => ({
			_$litType$: t,
			strings: i,
			values: s
		}), w$1(1), w$1(2), T$1 = Symbol.for("lit-noChange"), A$1 = Symbol.for("lit-nothing"), E$1 = /* @__PURE__ */ new WeakMap(), C$1 = r$7.createTreeWalker(r$7, 129, null, !1);
		V$1 = (t, i) => {
			const s = t.length - 1, e = [];
			let l, r = 2 === i ? "<svg>" : "", u = f$3;
			for (let i = 0; i < s; i++) {
				const s = t[i];
				let d, c, v = -1, a = 0;
				for (; a < s.length && (u.lastIndex = a, c = u.exec(s), null !== c);) a = u.lastIndex, u === f$3 ? "!--" === c[1] ? u = _$1 : void 0 !== c[1] ? u = m$2 : void 0 !== c[2] ? (y$2.test(c[2]) && (l = RegExp("</" + c[2], "g")), u = p$3) : void 0 !== c[3] && (u = p$3) : u === p$3 ? ">" === c[0] ? (u = null != l ? l : f$3, v = -1) : void 0 === c[1] ? v = -2 : (v = u.lastIndex - c[2].length, d = c[1], u = void 0 === c[3] ? p$3 : "\"" === c[3] ? $$1 : g$1) : u === $$1 || u === g$1 ? u = p$3 : u === _$1 || u === m$2 ? u = f$3 : (u = p$3, l = void 0);
				const w = u === p$3 && t[i + 1].startsWith("/>") ? " " : "";
				r += u === f$3 ? s + h$4 : v >= 0 ? (e.push(d), s.slice(0, v) + o$9 + s.slice(v) + n$6 + w) : s + n$6 + (-2 === v ? (e.push(void 0), i) : w);
			}
			return [P$1(t, r + (t[s] || "<?>") + (2 === i ? "</svg>" : "")), e];
		};
		N$1 = class N$1 {
			constructor({ strings: t, _$litType$: i }, e) {
				let h;
				this.parts = [];
				let r = 0, d = 0;
				const c = t.length - 1, v = this.parts, [a, f] = V$1(t, i);
				if (this.el = N$1.createElement(a, e), C$1.currentNode = this.el.content, 2 === i) {
					const t = this.el.content, i = t.firstChild;
					i.remove(), t.append(...i.childNodes);
				}
				for (; null !== (h = C$1.nextNode()) && v.length < c;) {
					if (1 === h.nodeType) {
						if (h.hasAttributes()) {
							const t = [];
							for (const i of h.getAttributeNames()) if (i.endsWith(o$9) || i.startsWith(n$6)) {
								const s = f[d++];
								if (t.push(i), void 0 !== s) {
									const t = h.getAttribute(s.toLowerCase() + o$9).split(n$6), i = /([.?@])?(.*)/.exec(s);
									v.push({
										type: 1,
										index: r,
										name: i[2],
										strings: t,
										ctor: "." === i[1] ? H$1 : "?" === i[1] ? L$1 : "@" === i[1] ? z$1 : k$1
									});
								} else v.push({
									type: 6,
									index: r
								});
							}
							for (const i of t) h.removeAttribute(i);
						}
						if (y$2.test(h.tagName)) {
							const t = h.textContent.split(n$6), i = t.length - 1;
							if (i > 0) {
								h.textContent = s$5 ? s$5.emptyScript : "";
								for (let s = 0; s < i; s++) h.append(t[s], u$3()), C$1.nextNode(), v.push({
									type: 2,
									index: ++r
								});
								h.append(t[i], u$3());
							}
						}
					} else if (8 === h.nodeType) if (h.data === l$4) v.push({
						type: 2,
						index: r
					});
					else {
						let t = -1;
						for (; -1 !== (t = h.data.indexOf(n$6, t + 1));) v.push({
							type: 7,
							index: r
						}), t += n$6.length - 1;
					}
					r++;
				}
			}
			static createElement(t, i) {
				const s = r$7.createElement("template");
				return s.innerHTML = t, s;
			}
		};
		M$1 = class {
			constructor(t, i) {
				this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
			}
			get parentNode() {
				return this._$AM.parentNode;
			}
			get _$AU() {
				return this._$AM._$AU;
			}
			u(t) {
				var i;
				const { el: { content: s }, parts: e } = this._$AD, o = (null !== (i = null == t ? void 0 : t.creationScope) && void 0 !== i ? i : r$7).importNode(s, !0);
				C$1.currentNode = o;
				let n = C$1.nextNode(), l = 0, h = 0, u = e[0];
				for (; void 0 !== u;) {
					if (l === u.index) {
						let i;
						2 === u.type ? i = new R$1(n, n.nextSibling, this, t) : 1 === u.type ? i = new u.ctor(n, u.name, u.strings, this, t) : 6 === u.type && (i = new Z$1(n, this, t)), this._$AV.push(i), u = e[++h];
					}
					l !== (null == u ? void 0 : u.index) && (n = C$1.nextNode(), l++);
				}
				return C$1.currentNode = r$7, o;
			}
			v(t) {
				let i = 0;
				for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
			}
		};
		R$1 = class R$1 {
			constructor(t, i, s, e) {
				var o;
				this.type = 2, this._$AH = A$1, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cp = null === (o = null == e ? void 0 : e.isConnected) || void 0 === o || o;
			}
			get _$AU() {
				var t, i;
				return null !== (i = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) && void 0 !== i ? i : this._$Cp;
			}
			get parentNode() {
				let t = this._$AA.parentNode;
				const i = this._$AM;
				return void 0 !== i && 11 === (null == t ? void 0 : t.nodeType) && (t = i.parentNode), t;
			}
			get startNode() {
				return this._$AA;
			}
			get endNode() {
				return this._$AB;
			}
			_$AI(t, i = this) {
				t = S$2(this, t, i), d$3(t) ? t === A$1 || null == t || "" === t ? (this._$AH !== A$1 && this._$AR(), this._$AH = A$1) : t !== this._$AH && t !== T$1 && this._(t) : void 0 !== t._$litType$ ? this.g(t) : void 0 !== t.nodeType ? this.$(t) : v$2(t) ? this.T(t) : this._(t);
			}
			k(t) {
				return this._$AA.parentNode.insertBefore(t, this._$AB);
			}
			$(t) {
				this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
			}
			_(t) {
				this._$AH !== A$1 && d$3(this._$AH) ? this._$AA.nextSibling.data = t : this.$(r$7.createTextNode(t)), this._$AH = t;
			}
			g(t) {
				var i;
				const { values: s, _$litType$: e } = t, o = "number" == typeof e ? this._$AC(t) : (void 0 === e.el && (e.el = N$1.createElement(P$1(e.h, e.h[0]), this.options)), e);
				if ((null === (i = this._$AH) || void 0 === i ? void 0 : i._$AD) === o) this._$AH.v(s);
				else {
					const t = new M$1(o, this), i = t.u(this.options);
					t.v(s), this.$(i), this._$AH = t;
				}
			}
			_$AC(t) {
				let i = E$1.get(t.strings);
				return void 0 === i && E$1.set(t.strings, i = new N$1(t)), i;
			}
			T(t) {
				c$5(this._$AH) || (this._$AH = [], this._$AR());
				const i = this._$AH;
				let s, e = 0;
				for (const o of t) e === i.length ? i.push(s = new R$1(this.k(u$3()), this.k(u$3()), this, this.options)) : s = i[e], s._$AI(o), e++;
				e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
			}
			_$AR(t = this._$AA.nextSibling, i) {
				var s;
				for (null === (s = this._$AP) || void 0 === s || s.call(this, !1, !0, i); t && t !== this._$AB;) {
					const i = t.nextSibling;
					t.remove(), t = i;
				}
			}
			setConnected(t) {
				var i;
				void 0 === this._$AM && (this._$Cp = t, null === (i = this._$AP) || void 0 === i || i.call(this, t));
			}
		};
		k$1 = class {
			constructor(t, i, s, e, o) {
				this.type = 1, this._$AH = A$1, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = o, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(/* @__PURE__ */ new String()), this.strings = s) : this._$AH = A$1;
			}
			get tagName() {
				return this.element.tagName;
			}
			get _$AU() {
				return this._$AM._$AU;
			}
			_$AI(t, i = this, s, e) {
				const o = this.strings;
				let n = !1;
				if (void 0 === o) t = S$2(this, t, i, 0), n = !d$3(t) || t !== this._$AH && t !== T$1, n && (this._$AH = t);
				else {
					const e = t;
					let l, h;
					for (t = o[0], l = 0; l < o.length - 1; l++) h = S$2(this, e[s + l], i, l), h === T$1 && (h = this._$AH[l]), n || (n = !d$3(h) || h !== this._$AH[l]), h === A$1 ? t = A$1 : t !== A$1 && (t += (null != h ? h : "") + o[l + 1]), this._$AH[l] = h;
				}
				n && !e && this.j(t);
			}
			j(t) {
				t === A$1 ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t ? t : "");
			}
		};
		H$1 = class extends k$1 {
			constructor() {
				super(...arguments), this.type = 3;
			}
			j(t) {
				this.element[this.name] = t === A$1 ? void 0 : t;
			}
		};
		I$1 = s$5 ? s$5.emptyScript : "";
		L$1 = class extends k$1 {
			constructor() {
				super(...arguments), this.type = 4;
			}
			j(t) {
				t && t !== A$1 ? this.element.setAttribute(this.name, I$1) : this.element.removeAttribute(this.name);
			}
		};
		z$1 = class extends k$1 {
			constructor(t, i, s, e, o) {
				super(t, i, s, e, o), this.type = 5;
			}
			_$AI(t, i = this) {
				var s;
				if ((t = null !== (s = S$2(this, t, i, 0)) && void 0 !== s ? s : A$1) === T$1) return;
				const e = this._$AH, o = t === A$1 && e !== A$1 || t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive, n = t !== A$1 && (e === A$1 || o);
				o && this.element.removeEventListener(this.name, this, e), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
			}
			handleEvent(t) {
				var i, s;
				"function" == typeof this._$AH ? this._$AH.call(null !== (s = null === (i = this.options) || void 0 === i ? void 0 : i.host) && void 0 !== s ? s : this.element, t) : this._$AH.handleEvent(t);
			}
		};
		Z$1 = class {
			constructor(t, i, s) {
				this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
			}
			get _$AU() {
				return this._$AM._$AU;
			}
			_$AI(t) {
				S$2(this, t);
			}
		};
		j$1 = {
			O: o$9,
			P: n$6,
			A: l$4,
			C: 1,
			M: V$1,
			L: M$1,
			R: v$2,
			D: S$2,
			I: R$1,
			V: k$1,
			H: L$1,
			N: z$1,
			U: H$1,
			F: Z$1
		}, B$1 = i$6.litHtmlPolyfillSupport;
		B$1?.(N$1, R$1), (null !== (t$6 = i$6.litHtmlVersions) && void 0 !== t$6 ? t$6 : i$6.litHtmlVersions = []).push("2.8.0");
	})), l$3, e$6;
	var init_directive_helpers = __esmMin((() => {
		init_lit_html$1();
		({I: l$3} = j$1), e$6 = (o) => void 0 === o.strings;
	}));
	//#endregion
	//#region node_modules/lit-translate/node_modules/lit-html/async-directive.js
	function n$4(i) {
		void 0 !== this._$AN ? (o$8(this), this._$AM = i, r$5(this)) : this._$AM = i;
	}
	function h$2(i, t = !1, e = 0) {
		const r = this._$AH, n = this._$AN;
		if (void 0 !== n && 0 !== n.size) if (t) if (Array.isArray(r)) for (let i = e; i < r.length; i++) s$3(r[i], !1), o$8(r[i]);
		else null != r && (s$3(r, !1), o$8(r));
		else s$3(this, i);
	}
	var s$3, o$8, r$5, l$2, c$3;
	var init_async_directive$1 = __esmMin((() => {
		init_directive_helpers();
		init_directive$2();
		s$3 = (i, t) => {
			var e, o;
			const r = i._$AN;
			if (void 0 === r) return !1;
			for (const i of r) null === (o = (e = i)._$AO) || void 0 === o || o.call(e, t, !1), s$3(i, t);
			return !0;
		}, o$8 = (i) => {
			let t, e;
			do {
				if (void 0 === (t = i._$AM)) break;
				e = t._$AN, e.delete(i), i = t;
			} while (0 === (null == e ? void 0 : e.size));
		}, r$5 = (i) => {
			for (let t; t = i._$AM; i = t) {
				let e = t._$AN;
				if (void 0 === e) t._$AN = e = /* @__PURE__ */ new Set();
				else if (e.has(i)) break;
				e.add(i), l$2(t);
			}
		};
		l$2 = (i) => {
			var t, s, o, r;
			i.type == t$7.CHILD && (null !== (t = (o = i)._$AP) && void 0 !== t || (o._$AP = h$2), null !== (s = (r = i)._$AQ) && void 0 !== s || (r._$AQ = n$4));
		};
		c$3 = class extends i$7 {
			constructor() {
				super(...arguments), this._$AN = void 0;
			}
			_$AT(i, t, e) {
				super._$AT(i, t, e), r$5(this), this.isConnected = i._$AU;
			}
			_$AO(i, t = !0) {
				var e, r;
				i !== this.isConnected && (this.isConnected = i, i ? null === (e = this.reconnected) || void 0 === e || e.call(this) : null === (r = this.disconnected) || void 0 === r || r.call(this)), t && (s$3(this, i), o$8(this));
			}
			setValue(t) {
				if (e$6(this._$Ct)) this._$Ct._$AI(t, this);
				else {
					const i = [...this._$Ct._$AH];
					i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
				}
			}
			disconnected() {}
			reconnected() {}
		};
	}));
	//#endregion
	//#region node_modules/lit-translate/node_modules/lit/async-directive.js
	var init_async_directive = __esmMin((() => {
		init_async_directive$1();
	}));
	//#endregion
	//#region node_modules/lit-translate/directives/lang-changed-base.js
	var LangChangedDirectiveBase;
	var init_lang_changed_base = __esmMin((() => {
		init_async_directive();
		init_util();
		LangChangedDirectiveBase = class extends c$3 {
			constructor() {
				super(...arguments);
				this.langChangedSubscription = null;
				this.getValue = (() => "");
			}
			/**
			* Sets up the directive by setting the getValue property and subscribing.
			* When subclassing LangChangedDirectiveBase this function should be call in the render function.
			* @param getValue
			*/
			renderValue(getValue) {
				this.getValue = getValue;
				this.subscribe();
				return this.getValue();
			}
			/**
			* Called when the lang changed event is dispatched.
			* @param e
			*/
			langChanged(e) {
				this.setValue(this.getValue(e));
			}
			/**
			* Subscribes to the lang changed event.
			*/
			subscribe() {
				if (this.langChangedSubscription == null) this.langChangedSubscription = listenForLangChanged(this.langChanged.bind(this));
			}
			/**
			* Unsubscribes from the lang changed event.
			*/
			unsubscribe() {
				if (this.langChangedSubscription != null) this.langChangedSubscription();
			}
			/**
			* Unsubscribes when disconnected.
			*/
			disconnected() {
				this.unsubscribe();
			}
			/**
			* Subscribes when reconnected.
			*/
			reconnected() {
				this.subscribe();
			}
		};
	}));
	//#endregion
	//#region node_modules/lit-translate/directives/translate.js
	var TranslateDirective, translate;
	var init_translate = __esmMin((() => {
		init_directive$1();
		init_util();
		init_lang_changed_base();
		TranslateDirective = class extends LangChangedDirectiveBase {
			render(key, values, config) {
				return this.renderValue(() => get(key, values, config));
			}
		};
		translate = e$8(TranslateDirective);
	}));
	//#endregion
	//#region node_modules/lit-translate/node_modules/lit-html/directives/unsafe-html.js
	var e$5, o$7;
	var init_unsafe_html$2 = __esmMin((() => {
		init_lit_html$1();
		init_directive$2();
		e$5 = class extends i$7 {
			constructor(i) {
				if (super(i), this.et = A$1, i.type !== t$7.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
			}
			render(r) {
				if (r === A$1 || null == r) return this.ft = void 0, this.et = r;
				if (r === T$1) return r;
				if ("string" != typeof r) throw Error(this.constructor.directiveName + "() called with a non-string value");
				if (r === this.et) return this.ft;
				this.et = r;
				const s = [r];
				return s.raw = s, this.ft = {
					_$litType$: this.constructor.resultType,
					strings: s,
					values: []
				};
			}
		};
		e$5.directiveName = "unsafeHTML", e$5.resultType = 1;
		o$7 = e$8(e$5);
	}));
	//#endregion
	//#region node_modules/lit-translate/node_modules/lit/directives/unsafe-html.js
	var init_unsafe_html$1 = __esmMin((() => {
		init_unsafe_html$2();
	})), TranslateUnsafeHTMLDirective;
	var init_translate_unsafe_html = __esmMin((() => {
		init_directive$1();
		init_unsafe_html$1();
		init_translate();
		init_util();
		TranslateUnsafeHTMLDirective = class extends TranslateDirective {
			render(key, values, config) {
				return this.renderValue(() => o$7(get(key, values, config)));
			}
		};
		e$8(TranslateUnsafeHTMLDirective);
	})), LangChangedDirective;
	var init_lang_changed = __esmMin((() => {
		init_directive$1();
		init_lang_changed_base();
		LangChangedDirective = class extends LangChangedDirectiveBase {
			render(getValue) {
				return this.renderValue(getValue);
			}
		};
		e$8(LangChangedDirective);
	}));
	//#endregion
	//#region node_modules/lit-translate/index.js
	var init_lit_translate = __esmMin((() => {
		init_model();
		init_util();
		init_helpers();
		init_translate();
		init_translate_unsafe_html();
		init_lang_changed();
		init_lang_changed_base();
	}));
	//#endregion
	//#region src/parser/html-parser.ts
	/**
	* Parses the HTML content from Erwin's Complete Compare report.
	* @param html The raw HTML string.
	* @returns An array of ErwinRow.
	*/
	function parseErwinHtml(html) {
		const doc = new DOMParser().parseFromString(html, "text/html");
		const rows = [];
		doc.querySelectorAll("tbody tr").forEach((tr) => {
			const tds = tr.querySelectorAll("td");
			if (tds.length < 4) return;
			const objectTd = tds[0];
			const rawLeft = tds[1].textContent?.trim() || "";
			const rawRight = tds[3].textContent?.trim() || "";
			const leftModel = rawLeft.replace(/\[Calculated\]/g, "").trim();
			const rightModel = rawRight.replace(/\[Calculated\]/g, "").trim();
			const rawTypeText = objectTd.textContent || "";
			const type = rawTypeText.trim();
			const leadingWhitespace = rawTypeText.match(/^[\s\u00a0]*/)?.[0] || "";
			const indent = Math.floor(leadingWhitespace.length / 3);
			let change = "";
			if (leftModel && rightModel) change = "A";
			else if (leftModel) change = "I";
			else if (rightModel) change = "E";
			const isUDP = (type.startsWith("Entity.Physical.") || type.startsWith("Entity.Logical.")) && leadingWhitespace.length === 15 || (type.startsWith("Attribute.Physical.") || type.startsWith("Attribute.Logical.")) && leadingWhitespace.length === 18;
			rows.push({
				type,
				indent,
				rawIndent: leadingWhitespace.length,
				leftModel: rawLeft,
				rightModel: rawRight,
				change,
				prop: "",
				view: "",
				isUDP
			});
		});
		return rows;
	}
	var init_html_parser = __esmMin((() => {}));
	//#endregion
	//#region node_modules/nanostores/atom/index.js
	var listenerQueue, lqIndex, QUEUE_ITEMS_PER_LISTENER, epoch, atom;
	var init_atom = __esmMin((() => {
		listenerQueue = [];
		lqIndex = 0;
		QUEUE_ITEMS_PER_LISTENER = 4;
		epoch = 0;
		atom = /* @__NO_SIDE_EFFECTS__ */ (initialValue) => {
			let listeners = [];
			let $atom = {
				get() {
					if (!$atom.lc) $atom.listen(() => {})();
					return $atom.value;
				},
				init: initialValue,
				lc: 0,
				listen(listener) {
					$atom.lc = listeners.push(listener);
					return () => {
						for (let i = lqIndex + QUEUE_ITEMS_PER_LISTENER; i < listenerQueue.length;) if (listenerQueue[i] === listener) listenerQueue.splice(i, QUEUE_ITEMS_PER_LISTENER);
						else i += QUEUE_ITEMS_PER_LISTENER;
						let index = listeners.indexOf(listener);
						if (~index) {
							listeners.splice(index, 1);
							if (!--$atom.lc) $atom.off();
						}
					};
				},
				notify(oldValue, changedKey) {
					epoch++;
					let runListenerQueue = !listenerQueue.length;
					for (let listener of listeners) listenerQueue.push(listener, $atom.value, oldValue, changedKey);
					if (runListenerQueue) {
						for (lqIndex = 0; lqIndex < listenerQueue.length; lqIndex += QUEUE_ITEMS_PER_LISTENER) listenerQueue[lqIndex](listenerQueue[lqIndex + 1], listenerQueue[lqIndex + 2], listenerQueue[lqIndex + 3]);
						listenerQueue.length = 0;
					}
				},
				off() {},
				set(newValue) {
					let oldValue = $atom.value;
					if (oldValue !== newValue) {
						$atom.value = newValue;
						$atom.notify(oldValue);
					}
				},
				subscribe(listener) {
					let unbind = $atom.listen(listener);
					listener($atom.value);
					return unbind;
				},
				value: initialValue
			};
			return $atom;
		};
	}));
	//#endregion
	//#region node_modules/nanostores/lifecycle/index.js
	var MOUNT, UNMOUNT, REVERT_MUTATION, on, STORE_UNMOUNT_DELAY, onMount;
	var init_lifecycle = __esmMin((() => {
		MOUNT = 5;
		UNMOUNT = 6;
		REVERT_MUTATION = 10;
		on = (object, listener, eventKey, mutateStore) => {
			object.events = object.events || {};
			if (!object.events[eventKey + REVERT_MUTATION]) object.events[eventKey + REVERT_MUTATION] = mutateStore((eventProps) => {
				object.events[eventKey].reduceRight((event, l) => (l(event), event), {
					shared: {},
					...eventProps
				});
			});
			object.events[eventKey] = object.events[eventKey] || [];
			object.events[eventKey].push(listener);
			return () => {
				let currentListeners = object.events[eventKey];
				let index = currentListeners.indexOf(listener);
				currentListeners.splice(index, 1);
				if (!currentListeners.length) {
					delete object.events[eventKey];
					object.events[eventKey + REVERT_MUTATION]();
					delete object.events[eventKey + REVERT_MUTATION];
				}
			};
		};
		STORE_UNMOUNT_DELAY = 1e3;
		onMount = ($store, initialize) => {
			let listener = (payload) => {
				let destroy = initialize(payload);
				if (destroy) $store.events[UNMOUNT].push(destroy);
			};
			return on($store, listener, MOUNT, (runListeners) => {
				let originListen = $store.listen;
				$store.listen = (...args) => {
					if (!$store.lc && !$store.active) {
						$store.active = true;
						runListeners();
					}
					return originListen(...args);
				};
				let originOff = $store.off;
				$store.events[UNMOUNT] = [];
				$store.off = () => {
					originOff();
					setTimeout(() => {
						if ($store.active && !$store.lc) {
							$store.active = false;
							for (let destroy of $store.events[UNMOUNT]) destroy();
							$store.events[UNMOUNT] = [];
						}
					}, STORE_UNMOUNT_DELAY);
				};
				return () => {
					$store.listen = originListen;
					$store.off = originOff;
				};
			});
		};
	}));
	//#endregion
	//#region node_modules/nanostores/computed/index.js
	var computedStore, computed;
	var init_computed = __esmMin((() => {
		init_atom();
		init_lifecycle();
		computedStore = (stores, cb, batched) => {
			if (!Array.isArray(stores)) stores = [stores];
			let previousArgs;
			let currentEpoch;
			let set = () => {
				if (currentEpoch === epoch) return;
				currentEpoch = epoch;
				let args = stores.map(($store) => $store.get());
				if (!previousArgs || args.some((arg, i) => arg !== previousArgs[i])) {
					previousArgs = args;
					let value = cb(...args);
					if (value && value.then && value.t) value.then((asyncValue) => {
						if (previousArgs === args) $computed.set(asyncValue);
					});
					else {
						$computed.set(value);
						currentEpoch = epoch;
					}
				}
			};
			let $computed = /* @__PURE__ */ atom(void 0);
			let get = $computed.get;
			$computed.get = () => {
				set();
				return get();
			};
			let timer;
			let run = batched ? () => {
				clearTimeout(timer);
				timer = setTimeout(set);
			} : set;
			onMount($computed, () => {
				let unbinds = stores.map(($store) => $store.listen(run));
				set();
				return () => {
					for (let unbind of unbinds) unbind();
				};
			});
			return $computed;
		};
		computed = /* @__NO_SIDE_EFFECTS__ */ (stores, fn) => computedStore(stores, fn);
	}));
	//#endregion
	//#region node_modules/nanostores/index.js
	var init_nanostores = __esmMin((() => {
		init_atom();
		init_computed();
		init_lifecycle();
	}));
	//#endregion
	//#region src/store/data.store.ts
	var rawData$, isLoading$, fileName$, isUserscript$, filterChange$, filterName$, onlyEntities$, onlyEntitiesAndAttributes$, hideCalculated$, showProperties$, toggledPropertiesIds$, hiddenSubObjectsIds$, checkedIds$, isFlipped$, GROUPING_KEYWORDS, HEADERS_CONFIG, enrichedData$, filteredData$, togglePropertiesGlobal, togglePropertiesIndividual, toggleSubObjects, toggleCheck, initializeVisibility, toggleFlip, statsSummary$;
	var init_data_store = __esmMin((() => {
		init_nanostores();
		rawData$ = /* @__PURE__ */ atom([]);
		isLoading$ = /* @__PURE__ */ atom(false);
		fileName$ = /* @__PURE__ */ atom(null);
		isUserscript$ = /* @__PURE__ */ atom(false);
		filterChange$ = /* @__PURE__ */ atom("");
		filterName$ = /* @__PURE__ */ atom("");
		onlyEntities$ = /* @__PURE__ */ atom(false);
		onlyEntitiesAndAttributes$ = /* @__PURE__ */ atom(false);
		hideCalculated$ = /* @__PURE__ */ atom(true);
		showProperties$ = /* @__PURE__ */ atom(false);
		toggledPropertiesIds$ = /* @__PURE__ */ atom(/* @__PURE__ */ new Set());
		hiddenSubObjectsIds$ = /* @__PURE__ */ atom(/* @__PURE__ */ new Set());
		checkedIds$ = /* @__PURE__ */ atom(/* @__PURE__ */ new Set());
		isFlipped$ = /* @__PURE__ */ atom(false);
		GROUPING_KEYWORDS = [
			"Annotations",
			"Attribute Storage Objects",
			"Attributes",
			"Attributes/Columns",
			"Collections",
			"Columns",
			"Default Constraint Usages",
			"Default Values",
			"Domains",
			"ER Diagrams",
			"Entities",
			"Entities/Tables",
			"Fields",
			"Indexes",
			"Keys Groups",
			"Keys Groups/Indexes",
			"Partition Description Objects",
			"Physical Storage Objects",
			"Range Partitions Info Objects",
			"Range Partitions",
			"Relationships",
			"Sequences",
			"Subject Areas",
			"Subtype Symbols",
			"Tables",
			"Tablespaces",
			"Views"
		];
		HEADERS_CONFIG = [
			{
				prop: "O",
				object: "Annotation",
				indentation: [9]
			},
			{
				prop: "Atr",
				object: "Attribute",
				indentation: [15]
			},
			{
				prop: "Atr",
				object: "Attribute/Column",
				indentation: [15]
			},
			{
				prop: "Ent",
				object: "Collection",
				indentation: [9]
			},
			{
				prop: "Atr",
				object: "Column",
				indentation: [15]
			},
			{
				prop: "O",
				object: "Default Constrain Usage",
				indentation: [21]
			},
			{
				prop: "O",
				object: "Default Value",
				indentation: [9]
			},
			{
				prop: "O",
				object: "Domain",
				indentation: [9]
			},
			{
				prop: "M",
				object: "ER Diagram",
				indentation: [9, 12],
				hide: true
			},
			{
				prop: "Ent",
				object: "Entity",
				indentation: [9]
			},
			{
				prop: "Ent",
				object: "Entity/Table",
				indentation: [9]
			},
			{
				prop: "Atr",
				object: "Field",
				indentation: [
					15,
					18,
					21,
					24,
					27,
					30
				]
			},
			{
				prop: "IX",
				object: "Index",
				indentation: [15]
			},
			{
				prop: "IX",
				object: "Key Group/Index",
				indentation: [15]
			},
			{
				prop: "O",
				object: "Model",
				indentation: [3]
			},
			{
				prop: "O",
				object: "Physical Storage Object",
				indentation: [15, 21]
			},
			{
				prop: "O",
				object: "Range Partition",
				indentation: [18]
			},
			{
				prop: "FK",
				object: "Relationship",
				indentation: [15]
			},
			{
				prop: "O",
				object: "Sequence",
				indentation: [9]
			},
			{
				prop: "M",
				object: "Subject Area",
				indentation: [9],
				hide: true
			},
			{
				prop: "FK",
				object: "Subtype Symbol",
				indentation: [15]
			},
			{
				prop: "Ent",
				object: "Table",
				indentation: [9]
			},
			{
				prop: "O",
				object: "Tablespace",
				indentation: [9]
			},
			{
				prop: "O",
				object: "Theme",
				indentation: [9]
			},
			{
				prop: "Ent",
				object: "View",
				indentation: [9]
			}
		];
		enrichedData$ = /* @__PURE__ */ computed(rawData$, (data) => {
			const rowCount = data.length;
			if (rowCount === 0) return [];
			const rowsById = /* @__PURE__ */ new Map();
			const childrenMap = /* @__PURE__ */ new Map();
			const headerStack = [];
			const processed = data.map((row, index) => {
				const cleanedType = row.type.trim();
				const isGrouping = GROUPING_KEYWORDS.some((kw) => cleanedType === kw);
				const headerMatch = HEADERS_CONFIG.find((h) => h.object === cleanedType && h.indentation.includes(row.rawIndent));
				const enriched = {
					...row,
					id: `row-${index}`,
					isHeader: isGrouping || !!headerMatch,
					isGrouping,
					isHeaderHidden: headerMatch?.hide || false,
					prop: headerMatch?.prop || "",
					isCalculated: row.leftModel === row.rightModel || row.leftModel.endsWith("[Calculated]") && row.rightModel.endsWith("[Calculated]")
				};
				if (!enriched.view) {
					const type = enriched.type;
					if (type === "Entity/Table" || type === "Attribute/Column") enriched.view = "L/P";
					else if (type === "Entity" || type === "Attribute") enriched.view = "L";
					else if (type === "Table" || type === "Column") enriched.view = "P";
				}
				while (headerStack.length > 0 && headerStack[headerStack.length - 1].indent >= enriched.indent) headerStack.pop();
				let parentId = "";
				let isUnderHiddenHeader = enriched.isHeaderHidden || false;
				for (let j = headerStack.length - 1; j >= 0; j--) {
					const stackItem = headerStack[j];
					if (!stackItem.isGrouping && !parentId) parentId = stackItem.id;
					if (stackItem.isHidden) isUnderHiddenHeader = true;
				}
				enriched.parentId = parentId;
				enriched.isUnderHiddenHeader = isUnderHiddenHeader;
				if (parentId) {
					const list = childrenMap.get(parentId) || [];
					list.push(enriched.id);
					childrenMap.set(parentId, list);
				}
				if (enriched.isHeader) headerStack.push({
					id: enriched.id,
					indent: enriched.indent,
					isGrouping: enriched.isGrouping,
					isHidden: enriched.isHeaderHidden
				});
				rowsById.set(enriched.id, enriched);
				return enriched;
			});
			for (let i = rowCount - 1; i >= 0; i--) {
				const row = processed[i];
				if (row.isHeader && !row.isGrouping) {
					const childrenIds = childrenMap.get(row.id) || [];
					if (childrenIds.length > 0) {
						let allCalculated = true;
						let hasProps = false;
						let hasSubs = false;
						let attrCount = 0;
						for (const cid of childrenIds) {
							const child = rowsById.get(cid);
							if (!child || child.isGrouping) continue;
							if (!child.isCalculated) allCalculated = false;
							if (!child.isHeader) hasProps = true;
							if (child.isHeader) hasSubs = true;
							if (child.isHeader && (child.type === "Attribute/Column" || child.type === "Attribute" || child.type === "Column")) attrCount++;
						}
						row.isCalculated = allCalculated;
						row.hasProperties = hasProps;
						row.hasSubObjects = hasSubs;
						if (row.type === "Entity/Table" || row.type === "Entity" || row.type === "Table") for (const cid of childrenIds) {
							const child = rowsById.get(cid);
							if (child?.type === "Column Order List" || child?.type === "Attribute Order List") {
								const count = Math.max(child.leftModel ? child.leftModel.split(",").length : 0, child.rightModel ? child.rightModel.split(",").length : 0);
								attrCount = Math.max(attrCount, count);
							}
						}
						if (attrCount > 0) row.attributeCount = attrCount;
					}
				}
				if (row.parentId && !row.isHeader) {
					const parent = rowsById.get(row.parentId);
					if (parent) {
						if (row.type === "Logical Only" && row.leftModel === "true") parent.view = "L";
						else if (row.type === "Physical Only" && row.leftModel === "true") parent.view = "P";
					}
				}
			}
			let currentPropCode = "O";
			return processed.map((row) => {
				if (row.isHeader && row.prop) currentPropCode = row.prop;
				return {
					...row,
					prop: row.isHeader ? row.prop : currentPropCode
				};
			}).filter((row) => {
				const isEmpty = !row.leftModel.trim() && !row.rightModel.trim();
				return !row.isGrouping && !isEmpty && !row.isUnderHiddenHeader;
			});
		});
		filteredData$ = /* @__PURE__ */ computed([
			enrichedData$,
			filterChange$,
			filterName$,
			onlyEntities$,
			onlyEntitiesAndAttributes$,
			showProperties$,
			hideCalculated$
		], (data, change, name, onlyEntities, onlyEntitiesAndAttributes, _showProperties, hideCalculated) => {
			if (data.length === 0) return [];
			const rowsById = /* @__PURE__ */ new Map();
			const childrenMap = /* @__PURE__ */ new Map();
			for (const r of data) {
				const id = r.id;
				if (!id) continue;
				rowsById.set(id, r);
				if (r.parentId) {
					const list = childrenMap.get(r.parentId) || [];
					list.push(id);
					childrenMap.set(r.parentId, list);
				}
			}
			let result = data;
			if (hideCalculated) {
				const familyOfCalculatedIds = /* @__PURE__ */ new Set();
				const addFamily = (id) => {
					if (familyOfCalculatedIds.has(id)) return;
					familyOfCalculatedIds.add(id);
					const children = childrenMap.get(id);
					if (children) for (const cid of children) addFamily(cid);
				};
				for (const r of data) if (r.isCalculated && r.id) addFamily(r.id);
				result = result.filter((r) => r.id && !familyOfCalculatedIds.has(r.id));
			}
			if (onlyEntities || onlyEntitiesAndAttributes) {
				const familyIds = /* @__PURE__ */ new Set();
				const addWithAncestors = (id) => {
					let currId = id;
					while (currId) {
						if (familyIds.has(currId)) break;
						familyIds.add(currId);
						currId = rowsById.get(currId)?.parentId;
					}
				};
				const addDescendants = (id) => {
					const children = childrenMap.get(id);
					if (children) {
						for (const cid of children) if (!familyIds.has(cid)) {
							familyIds.add(cid);
							addDescendants(cid);
						}
					}
				};
				for (const r of result) if ((onlyEntities ? r.isHeader && r.prop === "Ent" : r.isHeader && (r.prop === "Ent" || r.prop === "Atr")) && r.id) {
					addWithAncestors(r.id);
					addDescendants(r.id);
				}
				result = result.filter((r) => r.id && familyIds.has(r.id) && r.type !== "Model");
			}
			if (change) {
				const matches = /* @__PURE__ */ new Set();
				const addDescendants = (id) => {
					matches.add(id);
					const children = childrenMap.get(id);
					if (children) for (const cid of children) addDescendants(cid);
				};
				for (const r of result) if (r.isHeader && r.prop === "Ent" && r.change === change && r.id) addDescendants(r.id);
				result = result.filter((r) => r.id && matches.has(r.id));
			}
			if (name) {
				const search = name.toLowerCase();
				const hits = /* @__PURE__ */ new Set();
				for (const r of result) {
					const typeMatch = (r.originalType || r.type).toLowerCase().includes(search);
					const leftMatch = r.leftModel.toLowerCase().includes(search);
					const rightMatch = r.rightModel.toLowerCase().includes(search);
					if (r.isHeader && (typeMatch || leftMatch || rightMatch) && r.id) hits.add(r.id);
					else if ((r.type === "Name" || r.type === "Physical Name") && (leftMatch || rightMatch) && r.id) hits.add(r.id);
				}
				const finalIds = /* @__PURE__ */ new Set();
				const addDescendants = (id) => {
					if (finalIds.has(id)) return;
					finalIds.add(id);
					const children = childrenMap.get(id);
					if (children) for (const cid of children) addDescendants(cid);
				};
				const addAncestors = (id) => {
					let currId = id;
					while (currId) {
						if (finalIds.has(currId)) break;
						finalIds.add(currId);
						currId = rowsById.get(currId)?.parentId;
					}
				};
				for (const id of hits) {
					const row = rowsById.get(id);
					if (!row) continue;
					const objectId = !row.isHeader && row.parentId ? row.parentId : id;
					addDescendants(objectId);
					addAncestors(objectId);
				}
				result = result.filter((r) => r.id && finalIds.has(r.id));
			}
			return result;
		});
		togglePropertiesGlobal = () => {
			const nextValue = !showProperties$.get();
			showProperties$.set(nextValue);
			toggledPropertiesIds$.set(/* @__PURE__ */ new Set());
		};
		togglePropertiesIndividual = (id) => {
			const current = new Set(toggledPropertiesIds$.get());
			if (current.has(id)) current.delete(id);
			else current.add(id);
			toggledPropertiesIds$.set(current);
		};
		toggleSubObjects = (id) => {
			const current = new Set(hiddenSubObjectsIds$.get());
			if (current.has(id)) current.delete(id);
			else current.add(id);
			hiddenSubObjectsIds$.set(current);
		};
		toggleCheck = (id) => {
			const currentChecked = new Set(checkedIds$.get());
			if (!currentChecked.has(id)) {
				currentChecked.add(id);
				const currentHiddenSubs = new Set(hiddenSubObjectsIds$.get());
				currentHiddenSubs.add(id);
				hiddenSubObjectsIds$.set(currentHiddenSubs);
				const globalShow = showProperties$.get();
				const currentToggled = new Set(toggledPropertiesIds$.get());
				if (globalShow) currentToggled.add(id);
				else currentToggled.delete(id);
				toggledPropertiesIds$.set(currentToggled);
			} else currentChecked.delete(id);
			checkedIds$.set(currentChecked);
		};
		initializeVisibility = () => {
			showProperties$.set(false);
			toggledPropertiesIds$.set(/* @__PURE__ */ new Set());
			hiddenSubObjectsIds$.set(/* @__PURE__ */ new Set());
			isFlipped$.set(false);
		};
		toggleFlip = () => {
			isFlipped$.set(!isFlipped$.get());
		};
		statsSummary$ = /* @__PURE__ */ computed([enrichedData$, isFlipped$], (data, isFlipped) => {
			const summary = {
				Tables: {
					type: "Tables",
					total: 0,
					inclusion: 0,
					alteration: 0,
					exclusion: 0,
					calculated: 0,
					largeTablesCount: 0
				},
				Columns: {
					type: "Columns",
					total: 0,
					inclusion: 0,
					alteration: 0,
					exclusion: 0,
					calculated: 0
				}
			};
			for (const row of data) {
				if (!row.isHeader || row.isGrouping || !row.change) continue;
				const isTable = row.prop === "Ent";
				const isColumn = row.prop === "Atr";
				const increment = (key) => {
					const stats = summary[key];
					stats.total++;
					if (row.isCalculated) stats.calculated++;
					else {
						let change = row.change;
						if (isFlipped) {
							if (change === "I") change = "E";
							else if (change === "E") change = "I";
						}
						if (change === "I") stats.inclusion++;
						if (change === "A") stats.alteration++;
						if (change === "E") stats.exclusion++;
					}
					if (isTable && row.attributeCount && row.attributeCount > 11) stats.largeTablesCount = (stats.largeTablesCount || 0) + 1;
				};
				if (isTable) increment("Tables");
				if (isColumn) increment("Columns");
			}
			return Object.values(summary);
		});
		if (typeof window !== "undefined") window.erwinData = {
			rawData$,
			enrichedData$,
			filteredData$,
			filterChange$,
			filterName$,
			showProperties$,
			hideCalculated$,
			onlyEntities$,
			onlyEntitiesAndAttributes$
		};
	}));
	//#endregion
	//#region src/i18n/en-US.json
	var header$3, stats$3, table$3, changes$3, app$3, en_US_default;
	var init_en_US = __esmMin((() => {
		header$3 = {
			"title": "Erwin Compare Formatter",
			"comparison": "Comparison",
			"flip": "Flip",
			"flip_tooltip": "Switch Model sides",
			"upload": "Drop Erwin HTML here or click to upload",
			"close": "Close File",
			"filters": {
				"change": "Change",
				"category": "Category",
				"name": "Search Name..."
			}
		};
		stats$3 = {
			"row_general": "General",
			"row_tables": "Tables",
			"row_columns": "Columns",
			"col_type": "Object",
			"col_total": "Total",
			"col_addition": "Inclusion",
			"col_change": "Alteration",
			"col_deletion": "Exclusion",
			"col_calculated": "Calculated",
			"actions": {
				"copy_tables": "COPY TABLES",
				"show_props": "SHOW PROPERTIES",
				"hide_props": "HIDE PROPERTIES",
				"hide_calculated": "HIDE CALCULATED",
				"only_entities": "ONLY ENTITIES",
				"only_ent_atr": "ONLY ENT+ATR"
			},
			"messages": {
				"copied": "Table name list copied to clipboard!",
				"no_tables": "No table names found."
			}
		};
		table$3 = {
			"empty": "Select a html with the comparison generated by Erwin to format",
			"col_type": "Type / Object",
			"col_left": "Work Model (Left)",
			"col_right": "Reference Model (Right)",
			"col_prop": "Prop",
			"col_change": "Change",
			"col_view": "View",
			"copy_left": "Copy Left",
			"copy_right": "Copy Right"
		};
		changes$3 = {
			"all": "All",
			"addition": "Inclusion (I)",
			"change": "Alteration (A)",
			"deletion": "Exclusion (E)"
		};
		app$3 = {
			"no_file": "No file loaded, select a file above.",
			"loading": "Processing html File..."
		};
		en_US_default = {
			header: header$3,
			stats: stats$3,
			table: table$3,
			changes: changes$3,
			app: app$3
		};
	}));
	//#endregion
	//#region src/i18n/es-ES.json
	var header$2, stats$2, table$2, changes$2, app$2, es_ES_default;
	var init_es_ES = __esmMin((() => {
		header$2 = {
			"title": "Formateador de Comparación Erwin",
			"comparison": "Comparación",
			"flip": "Invertir",
			"flip_tooltip": "Cambiar lados de los modelos",
			"upload": "Suelte el HTML de Erwin aquí o haga clic para cargar",
			"close": "Cerrar archivo",
			"filters": {
				"change": "Tipo de cambio",
				"category": "Categoría",
				"name": "Filtrar por nombre"
			}
		};
		stats$2 = {
			"row_general": "General",
			"row_tables": "Tablas",
			"row_columns": "Columnas",
			"col_type": "Objeto",
			"col_total": "Total",
			"col_addition": "Inclusión",
			"col_change": "Alteración",
			"col_deletion": "Exclusión",
			"col_calculated": "Calculado",
			"actions": {
				"copy_tables": "COPIAR TABLAS",
				"show_props": "MOSTRAR PROPIEDADES",
				"hide_props": "OCULTAR PROPIEDADES",
				"hide_calculated": "OCULTAR CALCULADOS",
				"only_entities": "SOLO ENTIDADES",
				"only_ent_atr": "SOLO ENT+ATR"
			},
			"messages": {
				"copied": "¡Lista de nombres de tablas copiada al portapapeles!",
				"no_tables": "No se encontraron nombres de tablas."
			}
		};
		table$2 = {
			"empty": "Seleccione un archivo HTML con la comparación generada por Erwin para formatear",
			"col_type": "Tipo / Objeto",
			"col_left": "Modelo de trabajo (Izquierda)",
			"col_right": "Modelo de referencia (Derecha)",
			"col_prop": "Prop",
			"col_change": "Cambio",
			"col_view": "Vista",
			"copy_left": "Copiar izquierda",
			"copy_right": "Copiar derecha"
		};
		changes$2 = {
			"all": "Todos",
			"addition": "Inclusión (I)",
			"change": "Alteración (A)",
			"deletion": "Exclusión (E)"
		};
		app$2 = {
			"no_file": "Ningún archivo cargado, seleccione un archivo arriba.",
			"loading": "Procesando archivo HTML..."
		};
		es_ES_default = {
			header: header$2,
			stats: stats$2,
			table: table$2,
			changes: changes$2,
			app: app$2
		};
	}));
	//#endregion
	//#region src/i18n/fr-FR.json
	var header$1, stats$1, table$1, changes$1, app$1, fr_FR_default;
	var init_fr_FR = __esmMin((() => {
		header$1 = {
			"title": "Erwin Compare Formatter",
			"comparison": "Comparaison",
			"flip": "Inverser",
			"flip_tooltip": "Inverser les côtés des modèles",
			"upload": "Déposez le fichier HTML Erwin ici ou cliquez pour télécharger",
			"close": "Fermer le fichier",
			"filters": {
				"change": "Type de changement",
				"category": "Catégorie",
				"name": "Filtrer par nom"
			}
		};
		stats$1 = {
			"row_general": "Général",
			"row_tables": "Tables",
			"row_columns": "Colonnes",
			"col_type": "Objet",
			"col_total": "Total",
			"col_addition": "Inclusion",
			"col_change": "Altération",
			"col_deletion": "Exclusion",
			"col_calculated": "Calculé",
			"actions": {
				"copy_tables": "COPIER LES TABLES",
				"show_props": "AFFICHER LES PROPRIÉTÉS",
				"hide_props": "MASQUER LES PROPRIÉTÉS",
				"hide_calculated": "MASQUER LES CALCULÉS",
				"only_entities": "UNIQUEMENT ENTITÉS",
				"only_ent_atr": "UNIQUEMENT ENT+ATR"
			},
			"messages": {
				"copied": "Liste des noms de tables copiée dans le presse-papiers !",
				"no_tables": "Aucun nom de table trouvé."
			}
		};
		table$1 = {
			"empty": "Sélectionnez un fichier HTML avec la comparaison générée par Erwin pour le formater",
			"col_type": "Type / Objet",
			"col_left": "Modèle de travail (Gauche)",
			"col_right": "Modèle de référence (Droite)",
			"col_prop": "Prop",
			"col_change": "Chgt",
			"col_view": "Vue",
			"copy_left": "Copier gauche",
			"copy_right": "Copier droite"
		};
		changes$1 = {
			"all": "Tous",
			"addition": "Inclusion (I)",
			"change": "Altération (A)",
			"deletion": "Exclusion (E)"
		};
		app$1 = {
			"no_file": "Aucun fichier chargé, sélectionnez un fichier ci-dessus.",
			"loading": "Traitement du fichier HTML..."
		};
		fr_FR_default = {
			header: header$1,
			stats: stats$1,
			table: table$1,
			changes: changes$1,
			app: app$1
		};
	}));
	//#endregion
	//#region src/i18n/pt-BR.json
	var header, stats, table, changes, app, pt_BR_default;
	var init_pt_BR = __esmMin((() => {
		header = {
			"title": "Formatador de Comparação do Erwin",
			"comparison": "Comparação",
			"flip": "Inverter",
			"flip_tooltip": "Inverter lados dos modelos",
			"upload": "Arraste o HTML do Erwin aqui ou clique para carregar",
			"close": "Fechar Arquivo",
			"filters": {
				"change": "Tipo de Alteração",
				"category": "Categoria",
				"name": "Filtrar por Nome"
			}
		};
		stats = {
			"row_general": "Geral",
			"row_tables": "Tabelas",
			"row_columns": "Colunas",
			"col_type": "Objeto",
			"col_total": "Total",
			"col_addition": "Inclusão",
			"col_change": "Alteração",
			"col_deletion": "Exclusão",
			"col_calculated": "Calculado",
			"actions": {
				"copy_tables": "COPIAR TABELAS",
				"show_props": "MOSTRAR PROPRIEDADES",
				"hide_props": "ESCONDER PROPRIEDADES",
				"hide_calculated": "ESCONDER CALCULADOS",
				"only_entities": "SOMENTE ENTIDADES",
				"only_ent_atr": "SOMENTE ENT+ATR"
			},
			"messages": {
				"copied": "Lista de tabelas copiada para a área de transferência!",
				"no_tables": "Nenhuma tabela encontrada."
			}
		};
		table = {
			"empty": "Selecione um html com a comparação gerada pelo Erwin para formatar",
			"col_type": "Tipo / Objeto",
			"col_left": "Modelo de Trabalho (Esquerda)",
			"col_right": "Modelo de Referência (Direita)",
			"col_prop": "Prop",
			"col_change": "Alt.",
			"col_view": "Visão",
			"copy_left": "Copiar Esquerda",
			"copy_right": "Copiar Direita"
		};
		changes = {
			"all": "Todos",
			"addition": "Inclusão (I)",
			"change": "Alteração (A)",
			"deletion": "Exclusão (E)"
		};
		app = {
			"no_file": "Nenhum arquivo carregado, selecione um arquivo acima.",
			"loading": "Processando arquivo html..."
		};
		pt_BR_default = {
			header,
			stats,
			table,
			changes,
			app
		};
	}));
	//#endregion
	//#region src/store/i18n.store.ts
	var translations, language$, changeLanguage, initI18n;
	var init_i18n_store = __esmMin((() => {
		init_lit_translate();
		init_nanostores();
		init_en_US();
		init_es_ES();
		init_fr_FR();
		init_pt_BR();
		translations = {
			"en-US": en_US_default,
			"pt-BR": pt_BR_default,
			"fr-FR": fr_FR_default,
			"es-ES": es_ES_default
		};
		language$ = /* @__PURE__ */ atom("pt-BR");
		changeLanguage = async (lang) => {
			await use(lang);
			language$.set(lang);
		};
		initI18n = async () => {
			registerTranslateConfig({ loader: (lang) => Promise.resolve(translations[lang] || pt_BR_default) });
			const browserLang = navigator.language;
			let defaultLang = "pt-BR";
			if (browserLang.startsWith("en")) defaultLang = "en-US";
			else if (browserLang.startsWith("fr")) defaultLang = "fr-FR";
			else if (browserLang.startsWith("es")) defaultLang = "es-ES";
			else if (browserLang.startsWith("pt")) defaultLang = "pt-BR";
			await changeLanguage(defaultLang);
		};
	}));
	//#endregion
	//#region node_modules/@nanostores/lit/lib/StoreController.js
	var require_StoreController = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.StoreController = void 0;
		/**
		* A `ReactiveController` that subscribes a `LitElement` to a `nanostores` atom and updates the host element when the atom changes.
		*
		* @example
		* ```ts
		* import { atom } from 'nanostores';
		* import { StoreController } from '@nanostores/lit';
		* import { LitElement, html } from 'lit';
		* import { customElement } from 'lit/decorators.js';
		*
		* const count = atom(0);
		*
		* @customElement('my-element')
		* class MyElement extends LitElement {
		* private controller = new StoreController(this, count);
		*  render() {
		*   const $count = this.controller.value;
		*   return html\`Count: \${$count}\`;
		*  }
		* }
		* ```
		*/
		var StoreController = class {
			constructor(host, atom) {
				this.host = host;
				this.atom = atom;
				host.addController(this);
			}
			hostConnected() {
				this.unsubscribe = this.atom.subscribe(() => {
					this.host.requestUpdate();
				});
			}
			hostDisconnected() {
				var _a;
				(_a = this.unsubscribe) === null || _a === void 0 || _a.call(this);
			}
			/**
			* The current value of the atom.
			* @readonly
			*/
			get value() {
				return this.atom.get();
			}
		};
		exports.StoreController = StoreController;
	}));
	//#endregion
	//#region node_modules/@nanostores/lit/lib/MultiStoreController.js
	var require_MultiStoreController = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.MultiStoreController = void 0;
		/**
		* A `ReactiveController` that subscribes a `LitElement` to several `nanostores` atoms and updates the host element when any of the atoms changes.
		*
		* @example
		* ```ts
		* import { atom } from 'nanostores';
		* import { StoreController } from '@nanostores/lit';
		* import { LitElement, html } from 'lit';
		* import { customElement } from 'lit/decorators.js';
		*
		* const count1 = atom(0);
		* const count2 = atom(0);
		*
		* @customElement('my-element')
		* class MyElement extends LitElement {
		* private controller = new MultiStoreController(this, [count1, count2]);
		*  render() {
		*   const [$count1, $count2] = controller.values;
		*   return html\`Count 1: \${count1}\, Count 2: \${count2}\`;
		*  }
		* }
		* ```
		*/
		var MultiStoreController = class {
			constructor(host, atoms) {
				this.host = host;
				this.atoms = atoms;
				host.addController(this);
			}
			hostConnected() {
				this.unsubscribes = this.atoms.map((atom) => atom.subscribe(() => this.host.requestUpdate()));
			}
			hostDisconnected() {
				var _a;
				(_a = this.unsubscribes) === null || _a === void 0 || _a.forEach((unsubscribe) => unsubscribe());
			}
			/**
			* The current values of the atoms.
			* @readonly
			*/
			get values() {
				return this.atoms.map((atom) => atom.get());
			}
		};
		exports.MultiStoreController = MultiStoreController;
	}));
	//#endregion
	//#region node_modules/@nanostores/lit/lib/useStores.js
	var require_useStores = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.useStores = void 0;
		var MultiStoreController_1 = require_MultiStoreController();
		/**
		* A TypeScript decorator that creates a new `MultiStoreController` for the atoms
		* @decorator `withStores(atoms)`
		* @param atoms The atoms to subscribe to.
		*
		* @example
		* ```ts
		* import { LitElement, html } from 'lit';
		* import { customElement } from 'lit/decorators.js';
		* import { atom } from 'nanostores';
		* import { useStores } from '@nanostores/lit';
		*
		* const count = atom(0);
		*
		* @customElement('my-element')
		* @useStores(count)
		* class MyElement extends LitElement {
		*  render() {
		*   return html\`Count: \${count.get()}\`;
		*   }
		* }
		* ```
		*/
		function useStores(...atoms) {
			return (constructor) => {
				return class extends constructor {
					constructor(...args) {
						super(...args);
						new MultiStoreController_1.MultiStoreController(this, atoms);
					}
				};
			};
		}
		exports.useStores = useStores;
	}));
	//#endregion
	//#region node_modules/@nanostores/lit/lib/withStores.js
	var require_withStores = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.withStores = void 0;
		var MultiStoreController_1 = require_MultiStoreController();
		/**
		* A mixin that subscribes a LitElement to a list of atoms.
		* @mixin `withStores`
		* @param LitElementClass The LitElement class to extend.
		* @param atoms The atoms to subscribe to.
		*
		* @example
		* ```ts
		* import { LitElement, html } from 'lit';
		* import { customElement } from 'lit/decorators.js';
		* import { atom } from 'nanostores';
		* import { withStores } from '@nanostores/lit';
		*
		* const count = atom(0);
		*
		* @customElement('my-element')
		* class MyElement extends withStores(LitElement, [count]) {
		*  render() {
		*   return html\`Count: \${count.get()}\`;
		*  }
		* }
		* ```
		*/
		var withStores = (LitElementClass, atoms) => {
			return class LitElementWithStores extends LitElementClass {
				constructor(...args) {
					super(...args);
					new MultiStoreController_1.MultiStoreController(this, atoms);
				}
			};
		};
		exports.withStores = withStores;
	}));
	//#endregion
	//#region node_modules/@nanostores/lit/lib/index.js
	var require_lib = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.withStores = exports.useStores = exports.MultiStoreController = exports.StoreController = void 0;
		var StoreController_1 = require_StoreController();
		Object.defineProperty(exports, "StoreController", {
			enumerable: true,
			get: function() {
				return StoreController_1.StoreController;
			}
		});
		var MultiStoreController_1 = require_MultiStoreController();
		Object.defineProperty(exports, "MultiStoreController", {
			enumerable: true,
			get: function() {
				return MultiStoreController_1.MultiStoreController;
			}
		});
		var useStores_1 = require_useStores();
		Object.defineProperty(exports, "useStores", {
			enumerable: true,
			get: function() {
				return useStores_1.useStores;
			}
		});
		var withStores_1 = require_withStores();
		Object.defineProperty(exports, "withStores", {
			enumerable: true,
			get: function() {
				return withStores_1.withStores;
			}
		});
	})), t$4, e$4, s$2, o$6, n$3, r$4, S$1, c$2;
	var init_css_tag = __esmMin((() => {
		t$4 = globalThis, e$4 = t$4.ShadowRoot && (void 0 === t$4.ShadyCSS || t$4.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$6 = /* @__PURE__ */ new WeakMap();
		n$3 = class {
			constructor(t, e, o) {
				if (this._$cssResult$ = !0, o !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
				this.cssText = t, this.t = e;
			}
			get styleSheet() {
				let t = this.o;
				const s = this.t;
				if (e$4 && void 0 === t) {
					const e = void 0 !== s && 1 === s.length;
					e && (t = o$6.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$6.set(s, t));
				}
				return t;
			}
			toString() {
				return this.cssText;
			}
		};
		r$4 = (t) => new n$3("string" == typeof t ? t : t + "", void 0, s$2), S$1 = (s, o) => {
			if (e$4) s.adoptedStyleSheets = o.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
			else for (const e of o) {
				const o = document.createElement("style"), n = t$4.litNonce;
				void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
			}
		}, c$2 = e$4 ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((t) => {
			let e = "";
			for (const s of t.cssRules) e += s.cssText;
			return r$4(e);
		})(t) : t;
	}));
	//#endregion
	//#region node_modules/@lit/reactive-element/reactive-element.js
	var i$3, e$3, h$1, r$3, o$5, n$2, a$1, c$1, l$1, p$1, d$1, u$1, f$1, b$1, y$1;
	var init_reactive_element = __esmMin((() => {
		init_css_tag();
		({is: i$3, defineProperty: e$3, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$5, getPrototypeOf: n$2} = Object), a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t, s) => t, u$1 = {
			toAttribute(t, s) {
				switch (s) {
					case Boolean:
						t = t ? l$1 : null;
						break;
					case Object:
					case Array: t = null == t ? t : JSON.stringify(t);
				}
				return t;
			},
			fromAttribute(t, s) {
				let i = t;
				switch (s) {
					case Boolean:
						i = null !== t;
						break;
					case Number:
						i = null === t ? null : Number(t);
						break;
					case Object:
					case Array: try {
						i = JSON.parse(t);
					} catch (t) {
						i = null;
					}
				}
				return i;
			}
		}, f$1 = (t, s) => !i$3(t, s), b$1 = {
			attribute: !0,
			type: String,
			converter: u$1,
			reflect: !1,
			useDefault: !1,
			hasChanged: f$1
		};
		Symbol.metadata ??= Symbol("metadata"), a$1.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
		y$1 = class extends HTMLElement {
			static addInitializer(t) {
				this._$Ei(), (this.l ??= []).push(t);
			}
			static get observedAttributes() {
				return this.finalize(), this._$Eh && [...this._$Eh.keys()];
			}
			static createProperty(t, s = b$1) {
				if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
					const i = Symbol(), h = this.getPropertyDescriptor(t, i, s);
					void 0 !== h && e$3(this.prototype, t, h);
				}
			}
			static getPropertyDescriptor(t, s, i) {
				const { get: e, set: r } = h$1(this.prototype, t) ?? {
					get() {
						return this[s];
					},
					set(t) {
						this[s] = t;
					}
				};
				return {
					get: e,
					set(s) {
						const h = e?.call(this);
						r?.call(this, s), this.requestUpdate(t, h, i);
					},
					configurable: !0,
					enumerable: !0
				};
			}
			static getPropertyOptions(t) {
				return this.elementProperties.get(t) ?? b$1;
			}
			static _$Ei() {
				if (this.hasOwnProperty(d$1("elementProperties"))) return;
				const t = n$2(this);
				t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
			}
			static finalize() {
				if (this.hasOwnProperty(d$1("finalized"))) return;
				if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
					const t = this.properties, s = [...r$3(t), ...o$5(t)];
					for (const i of s) this.createProperty(i, t[i]);
				}
				const t = this[Symbol.metadata];
				if (null !== t) {
					const s = litPropertyMetadata.get(t);
					if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
				}
				this._$Eh = /* @__PURE__ */ new Map();
				for (const [t, s] of this.elementProperties) {
					const i = this._$Eu(t, s);
					void 0 !== i && this._$Eh.set(i, t);
				}
				this.elementStyles = this.finalizeStyles(this.styles);
			}
			static finalizeStyles(s) {
				const i = [];
				if (Array.isArray(s)) {
					const e = new Set(s.flat(Infinity).reverse());
					for (const s of e) i.unshift(c$2(s));
				} else void 0 !== s && i.push(c$2(s));
				return i;
			}
			static _$Eu(t, s) {
				const i = s.attribute;
				return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
			}
			constructor() {
				super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
			}
			_$Ev() {
				this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
			}
			addController(t) {
				(this._$EO ??= /* @__PURE__ */ new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
			}
			removeController(t) {
				this._$EO?.delete(t);
			}
			_$E_() {
				const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
				for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
				t.size > 0 && (this._$Ep = t);
			}
			createRenderRoot() {
				const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
				return S$1(t, this.constructor.elementStyles), t;
			}
			connectedCallback() {
				this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
			}
			enableUpdating(t) {}
			disconnectedCallback() {
				this._$EO?.forEach((t) => t.hostDisconnected?.());
			}
			attributeChangedCallback(t, s, i) {
				this._$AK(t, i);
			}
			_$ET(t, s) {
				const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
				if (void 0 !== e && !0 === i.reflect) {
					const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$1).toAttribute(s, i.type);
					this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
				}
			}
			_$AK(t, s) {
				const i = this.constructor, e = i._$Eh.get(t);
				if (void 0 !== e && this._$Em !== e) {
					const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : u$1;
					this._$Em = e;
					const r = h.fromAttribute(s, t.type);
					this[e] = r ?? this._$Ej?.get(e) ?? r, this._$Em = null;
				}
			}
			requestUpdate(t, s, i, e = !1, h) {
				if (void 0 !== t) {
					const r = this.constructor;
					if (!1 === e && (h = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? f$1)(h, s) || i.useDefault && i.reflect && h === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
					this.C(t, s, i);
				}
				!1 === this.isUpdatePending && (this._$ES = this._$EP());
			}
			C(t, s, { useDefault: i, reflect: e, wrapped: h }, r) {
				i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), !0 !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), !0 === e && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
			}
			async _$EP() {
				this.isUpdatePending = !0;
				try {
					await this._$ES;
				} catch (t) {
					Promise.reject(t);
				}
				const t = this.scheduleUpdate();
				return null != t && await t, !this.isUpdatePending;
			}
			scheduleUpdate() {
				return this.performUpdate();
			}
			performUpdate() {
				if (!this.isUpdatePending) return;
				if (!this.hasUpdated) {
					if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
						for (const [t, s] of this._$Ep) this[t] = s;
						this._$Ep = void 0;
					}
					const t = this.constructor.elementProperties;
					if (t.size > 0) for (const [s, i] of t) {
						const { wrapped: t } = i, e = this[s];
						!0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
					}
				}
				let t = !1;
				const s = this._$AL;
				try {
					t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((t) => t.hostUpdate?.()), this.update(s)) : this._$EM();
				} catch (s) {
					throw t = !1, this._$EM(), s;
				}
				t && this._$AE(s);
			}
			willUpdate(t) {}
			_$AE(t) {
				this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
			}
			_$EM() {
				this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
			}
			get updateComplete() {
				return this.getUpdateComplete();
			}
			getUpdateComplete() {
				return this._$ES;
			}
			shouldUpdate(t) {
				return !0;
			}
			update(t) {
				this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
			}
			updated(t) {}
			firstUpdated(t) {}
		};
		y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1?.({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ??= []).push("2.1.2");
	}));
	//#endregion
	//#region node_modules/lit-html/lit-html.js
	function V(t, i) {
		if (!u(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
		return void 0 !== e$2 ? e$2.createHTML(i) : i;
	}
	function M(t, i, s = t, e) {
		if (i === E) return i;
		let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
		const o = a(i) ? void 0 : i._$litDirective$;
		return h?.constructor !== o && (h?._$AO?.(!1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = M(t, h._$AS(t, i.values), h, e)), i;
	}
	var t$3, i$2, s$1, e$2, h, o$4, n$1, r$2, l, c, a, u, d, f, v, _, m, p, g, $, y, x, b, E, A, C, P, N, S, R, k, H, I, L, z, Z, B, D;
	var init_lit_html = __esmMin((() => {
		t$3 = globalThis, i$2 = (t) => t, s$1 = t$3.trustedTypes, e$2 = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, h = "$lit$", o$4 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$1 = "?" + o$4, r$2 = `<${n$1}>`, l = document, c = () => l.createComment(""), a = (t) => null === t || "object" != typeof t && "function" != typeof t, u = Array.isArray, d = (t) => u(t) || "function" == typeof t?.[Symbol.iterator], f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y = /^(?:script|style|textarea|title)$/i, x = (t) => (i, ...s) => ({
			_$litType$: t,
			strings: i,
			values: s
		}), b = x(1), x(2), x(3), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l.createTreeWalker(l, 129);
		N = (t, i) => {
			const s = t.length - 1, e = [];
			let n, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = v;
			for (let i = 0; i < s; i++) {
				const s = t[i];
				let a, u, d = -1, f = 0;
				for (; f < s.length && (c.lastIndex = f, u = c.exec(s), null !== u);) f = c.lastIndex, c === v ? "!--" === u[1] ? c = _ : void 0 !== u[1] ? c = m : void 0 !== u[2] ? (y.test(u[2]) && (n = RegExp("</" + u[2], "g")), c = p) : void 0 !== u[3] && (c = p) : c === p ? ">" === u[0] ? (c = n ?? v, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? p : "\"" === u[3] ? $ : g) : c === $ || c === g ? c = p : c === _ || c === m ? c = v : (c = p, n = void 0);
				const x = c === p && t[i + 1].startsWith("/>") ? " " : "";
				l += c === v ? s + r$2 : d >= 0 ? (e.push(a), s.slice(0, d) + h + s.slice(d) + o$4 + x) : s + o$4 + (-2 === d ? i : x);
			}
			return [V(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), e];
		};
		S = class S {
			constructor({ strings: t, _$litType$: i }, e) {
				let r;
				this.parts = [];
				let l = 0, a = 0;
				const u = t.length - 1, d = this.parts, [f, v] = N(t, i);
				if (this.el = S.createElement(f, e), P.currentNode = this.el.content, 2 === i || 3 === i) {
					const t = this.el.content.firstChild;
					t.replaceWith(...t.childNodes);
				}
				for (; null !== (r = P.nextNode()) && d.length < u;) {
					if (1 === r.nodeType) {
						if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(h)) {
							const i = v[a++], s = r.getAttribute(t).split(o$4), e = /([.?@])?(.*)/.exec(i);
							d.push({
								type: 1,
								index: l,
								name: e[2],
								strings: s,
								ctor: "." === e[1] ? I : "?" === e[1] ? L : "@" === e[1] ? z : H
							}), r.removeAttribute(t);
						} else t.startsWith(o$4) && (d.push({
							type: 6,
							index: l
						}), r.removeAttribute(t));
						if (y.test(r.tagName)) {
							const t = r.textContent.split(o$4), i = t.length - 1;
							if (i > 0) {
								r.textContent = s$1 ? s$1.emptyScript : "";
								for (let s = 0; s < i; s++) r.append(t[s], c()), P.nextNode(), d.push({
									type: 2,
									index: ++l
								});
								r.append(t[i], c());
							}
						}
					} else if (8 === r.nodeType) if (r.data === n$1) d.push({
						type: 2,
						index: l
					});
					else {
						let t = -1;
						for (; -1 !== (t = r.data.indexOf(o$4, t + 1));) d.push({
							type: 7,
							index: l
						}), t += o$4.length - 1;
					}
					l++;
				}
			}
			static createElement(t, i) {
				const s = l.createElement("template");
				return s.innerHTML = t, s;
			}
		};
		R = class {
			constructor(t, i) {
				this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
			}
			get parentNode() {
				return this._$AM.parentNode;
			}
			get _$AU() {
				return this._$AM._$AU;
			}
			u(t) {
				const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? l).importNode(i, !0);
				P.currentNode = e;
				let h = P.nextNode(), o = 0, n = 0, r = s[0];
				for (; void 0 !== r;) {
					if (o === r.index) {
						let i;
						2 === r.type ? i = new k(h, h.nextSibling, this, t) : 1 === r.type ? i = new r.ctor(h, r.name, r.strings, this, t) : 6 === r.type && (i = new Z(h, this, t)), this._$AV.push(i), r = s[++n];
					}
					o !== r?.index && (h = P.nextNode(), o++);
				}
				return P.currentNode = l, e;
			}
			p(t) {
				let i = 0;
				for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
			}
		};
		k = class k {
			get _$AU() {
				return this._$AM?._$AU ?? this._$Cv;
			}
			constructor(t, i, s, e) {
				this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? !0;
			}
			get parentNode() {
				let t = this._$AA.parentNode;
				const i = this._$AM;
				return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
			}
			get startNode() {
				return this._$AA;
			}
			get endNode() {
				return this._$AB;
			}
			_$AI(t, i = this) {
				t = M(this, t, i), a(t) ? t === A || null == t || "" === t ? (this._$AH !== A && this._$AR(), this._$AH = A) : t !== this._$AH && t !== E && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : d(t) ? this.k(t) : this._(t);
			}
			O(t) {
				return this._$AA.parentNode.insertBefore(t, this._$AB);
			}
			T(t) {
				this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
			}
			_(t) {
				this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t : this.T(l.createTextNode(t)), this._$AH = t;
			}
			$(t) {
				const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = S.createElement(V(s.h, s.h[0]), this.options)), s);
				if (this._$AH?._$AD === e) this._$AH.p(i);
				else {
					const t = new R(e, this), s = t.u(this.options);
					t.p(i), this.T(s), this._$AH = t;
				}
			}
			_$AC(t) {
				let i = C.get(t.strings);
				return void 0 === i && C.set(t.strings, i = new S(t)), i;
			}
			k(t) {
				u(this._$AH) || (this._$AH = [], this._$AR());
				const i = this._$AH;
				let s, e = 0;
				for (const h of t) e === i.length ? i.push(s = new k(this.O(c()), this.O(c()), this, this.options)) : s = i[e], s._$AI(h), e++;
				e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
			}
			_$AR(t = this._$AA.nextSibling, s) {
				for (this._$AP?.(!1, !0, s); t !== this._$AB;) {
					const s = i$2(t).nextSibling;
					i$2(t).remove(), t = s;
				}
			}
			setConnected(t) {
				void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
			}
		};
		H = class {
			get tagName() {
				return this.element.tagName;
			}
			get _$AU() {
				return this._$AM._$AU;
			}
			constructor(t, i, s, e, h) {
				this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(/* @__PURE__ */ new String()), this.strings = s) : this._$AH = A;
			}
			_$AI(t, i = this, s, e) {
				const h = this.strings;
				let o = !1;
				if (void 0 === h) t = M(this, t, i, 0), o = !a(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
				else {
					const e = t;
					let n, r;
					for (t = h[0], n = 0; n < h.length - 1; n++) r = M(this, e[s + n], i, n), r === E && (r = this._$AH[n]), o ||= !a(r) || r !== this._$AH[n], r === A ? t = A : t !== A && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
				}
				o && !e && this.j(t);
			}
			j(t) {
				t === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
			}
		};
		I = class extends H {
			constructor() {
				super(...arguments), this.type = 3;
			}
			j(t) {
				this.element[this.name] = t === A ? void 0 : t;
			}
		};
		L = class extends H {
			constructor() {
				super(...arguments), this.type = 4;
			}
			j(t) {
				this.element.toggleAttribute(this.name, !!t && t !== A);
			}
		};
		z = class extends H {
			constructor(t, i, s, e, h) {
				super(t, i, s, e, h), this.type = 5;
			}
			_$AI(t, i = this) {
				if ((t = M(this, t, i, 0) ?? A) === E) return;
				const s = this._$AH, e = t === A && s !== A || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== A && (s === A || e);
				e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
			}
			handleEvent(t) {
				"function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
			}
		};
		Z = class {
			constructor(t, i, s) {
				this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
			}
			get _$AU() {
				return this._$AM._$AU;
			}
			_$AI(t) {
				M(this, t);
			}
		};
		B = t$3.litHtmlPolyfillSupport;
		B?.(S, k), (t$3.litHtmlVersions ??= []).push("3.3.2");
		D = (t, i, s) => {
			const e = s?.renderBefore ?? i;
			let h = e._$litPart$;
			if (void 0 === h) {
				const t = s?.renderBefore ?? null;
				e._$litPart$ = h = new k(i.insertBefore(c(), t), t, void 0, s ?? {});
			}
			return h._$AI(t), h;
		};
	}));
	//#endregion
	//#region node_modules/lit-element/lit-element.js
	var s, i$1, o$3;
	var init_lit_element = __esmMin((() => {
		init_reactive_element();
		init_reactive_element();
		init_lit_html();
		init_lit_html();
		s = globalThis;
		i$1 = class extends y$1 {
			constructor() {
				super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
			}
			createRenderRoot() {
				const t = super.createRenderRoot();
				return this.renderOptions.renderBefore ??= t.firstChild, t;
			}
			update(t) {
				const r = this.render();
				this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = D(r, this.renderRoot, this.renderOptions);
			}
			connectedCallback() {
				super.connectedCallback(), this._$Do?.setConnected(!0);
			}
			disconnectedCallback() {
				super.disconnectedCallback(), this._$Do?.setConnected(!1);
			}
			render() {
				return E;
			}
		};
		i$1._$litElement$ = !0, i$1["finalized"] = !0, s.litElementHydrateSupport?.({ LitElement: i$1 });
		o$3 = s.litElementPolyfillSupport;
		o$3?.({ LitElement: i$1 });
		(s.litElementVersions ??= []).push("4.2.2");
	}));
	//#endregion
	//#region node_modules/lit-html/is-server.js
	var init_is_server = __esmMin((() => {}));
	//#endregion
	//#region node_modules/lit/index.js
	var init_lit = __esmMin((() => {
		init_reactive_element();
		init_lit_html();
		init_lit_element();
		init_is_server();
	}));
	//#endregion
	//#region node_modules/@lit/reactive-element/decorators/custom-element.js
	var t$2;
	var init_custom_element = __esmMin((() => {
		t$2 = (t) => (e, o) => {
			void 0 !== o ? o.addInitializer(() => {
				customElements.define(t, e);
			}) : customElements.define(t, e);
		};
	}));
	//#endregion
	//#region node_modules/@lit/reactive-element/decorators/property.js
	function n(t) {
		return (e, o) => "object" == typeof o ? r$1(t, e, o) : ((t, e, o) => {
			const r = e.hasOwnProperty(o);
			return e.constructor.createProperty(o, t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
		})(t, e, o);
	}
	var o$2, r$1;
	var init_property = __esmMin((() => {
		init_reactive_element();
		o$2 = {
			attribute: !0,
			type: String,
			converter: u$1,
			reflect: !1,
			hasChanged: f$1
		}, r$1 = (t = o$2, e, r) => {
			const { kind: n, metadata: i } = r;
			let s = globalThis.litPropertyMetadata.get(i);
			if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), "setter" === n && ((t = Object.create(t)).wrapped = !0), s.set(r.name, t), "accessor" === n) {
				const { name: o } = r;
				return {
					set(r) {
						const n = e.get.call(this);
						e.set.call(this, r), this.requestUpdate(o, n, t, !0, r);
					},
					init(e) {
						return void 0 !== e && this.C(o, void 0, t, e), e;
					}
				};
			}
			if ("setter" === n) {
				const { name: o } = r;
				return function(r) {
					const n = this[o];
					e.call(this, r), this.requestUpdate(o, n, t, !0, r);
				};
			}
			throw Error("Unsupported decorator location: " + n);
		};
	}));
	//#endregion
	//#region node_modules/@lit/reactive-element/decorators/state.js
	/**
	* @license
	* Copyright 2017 Google LLC
	* SPDX-License-Identifier: BSD-3-Clause
	*/ function r(r) {
		return n({
			...r,
			state: !0,
			attribute: !1
		});
	}
	var init_state = __esmMin((() => {
		init_property();
	}));
	//#endregion
	//#region node_modules/@lit/reactive-element/decorators/event-options.js
	var init_event_options = __esmMin((() => {}));
	//#endregion
	//#region node_modules/@lit/reactive-element/decorators/query.js
	var init_query = __esmMin((() => {}));
	//#endregion
	//#region node_modules/@lit/reactive-element/decorators/query-all.js
	var init_query_all = __esmMin((() => {}));
	//#endregion
	//#region node_modules/@lit/reactive-element/decorators/query-async.js
	var init_query_async = __esmMin((() => {}));
	//#endregion
	//#region node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
	var init_query_assigned_elements = __esmMin((() => {}));
	//#endregion
	//#region node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
	var init_query_assigned_nodes = __esmMin((() => {}));
	//#endregion
	//#region node_modules/lit/decorators.js
	var init_decorators = __esmMin((() => {
		init_custom_element();
		init_property();
		init_state();
		init_event_options();
		init_query();
		init_query_all();
		init_query_async();
		init_query_assigned_elements();
		init_query_assigned_nodes();
	}));
	//#endregion
	//#region node_modules/lit-html/directive.js
	var t$1, e$1, i;
	var init_directive = __esmMin((() => {
		t$1 = {
			ATTRIBUTE: 1,
			CHILD: 2,
			PROPERTY: 3,
			BOOLEAN_ATTRIBUTE: 4,
			EVENT: 5,
			ELEMENT: 6
		}, e$1 = (t) => (...e) => ({
			_$litDirective$: t,
			values: e
		});
		i = class {
			constructor(t) {}
			get _$AU() {
				return this._$AM._$AU;
			}
			_$AT(t, e, i) {
				this._$Ct = t, this._$AM = e, this._$Ci = i;
			}
			_$AS(t, e) {
				return this.update(t, e);
			}
			update(t, e) {
				return this.render(...e);
			}
		};
	})), e;
	var init_unsafe_html = __esmMin((() => {
		init_lit_html();
		init_directive();
		e = class extends i {
			constructor(i) {
				if (super(i), this.it = A, i.type !== t$1.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
			}
			render(r) {
				if (r === A || null == r) return this._t = void 0, this.it = r;
				if (r === E) return r;
				if ("string" != typeof r) throw Error(this.constructor.directiveName + "() called with a non-string value");
				if (r === this.it) return this._t;
				this.it = r;
				const s = [r];
				return s.raw = s, this._t = {
					_$litType$: this.constructor.resultType,
					strings: s,
					values: []
				};
			}
		};
		e.directiveName = "unsafeHTML", e.resultType = 1;
		e$1(e);
	}));
	//#endregion
	//#region node_modules/lit-html/directives/unsafe-svg.js
	var t, o;
	var init_unsafe_svg$1 = __esmMin((() => {
		init_directive();
		init_unsafe_html();
		t = class extends e {};
		t.directiveName = "unsafeSVG", t.resultType = 2;
		o = e$1(t);
	}));
	//#endregion
	//#region node_modules/lit/directives/unsafe-svg.js
	var init_unsafe_svg = __esmMin((() => {
		init_unsafe_svg$1();
	}));
	//#endregion
	//#region src/assets/icons/check.svg
	var check_default;
	var init_check = __esmMin((() => {
		check_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"icon icon-tabler icons-tabler-outline icon-tabler-check\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" /><path d=\"M5 12l5 5l10 -10\" /></svg>";
	}));
	//#endregion
	//#region src/assets/icons/chevron-down.svg
	var chevron_down_default;
	var init_chevron_down = __esmMin((() => {
		chevron_down_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"icon icon-tabler icons-tabler-outline icon-tabler-chevron-down\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" /><path d=\"M6 9l6 6l6 -6\" /></svg>";
	}));
	//#endregion
	//#region src/assets/icons/clipboard-copy.svg
	var clipboard_copy_default;
	var init_clipboard_copy = __esmMin((() => {
		clipboard_copy_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-clipboard-copy\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h3m9 -9v-5a2 2 0 0 0 -2 -2h-2\"/>\r\n    <path d=\"M13 17v-1a1 1 0 0 1 1 -1h1m3 0h1a1 1 0 0 1 1 1v1m0 3v1a1 1 0 0 1 -1 1h-1m-3 0h-1a1 1 0 0 1 -1 -1v-1\"/>\r\n    <path d=\"M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/clipboard-list.svg
	var clipboard_list_default;
	var init_clipboard_list = __esmMin((() => {
		clipboard_list_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-clipboard-list\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2\"/>\r\n    <path d=\"M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2\"/>\r\n    <path d=\"M9 12l.01 0\"/>\r\n    <path d=\"M13 12l2 0\"/>\r\n    <path d=\"M9 16l.01 0\"/>\r\n    <path d=\"M13 16l2 0\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/copy.svg
	var copy_default;
	var init_copy = __esmMin((() => {
		copy_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-copy\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666\"/>\r\n    <path d=\"M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/file-diff.svg
	var file_diff_default;
	var init_file_diff = __esmMin((() => {
		file_diff_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-file-diff\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M14 3v4a1 1 0 0 0 1 1h4\"/>\r\n    <path d=\"M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2\"/>\r\n    <path d=\"M12 10l0 4\"/>\r\n    <path d=\"M10 12l4 0\"/>\r\n    <path d=\"M10 17l4 0\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/file-upload.svg
	var file_upload_default;
	var init_file_upload = __esmMin((() => {
		file_upload_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-file-upload\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M14 3v4a1 1 0 0 0 1 1h4\"/>\r\n    <path d=\"M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2\"/>\r\n    <path d=\"M12 11v6\"/>\r\n    <path d=\"M9.5 13.5l2.5 -2.5l2.5 2.5\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/filter.svg
	var filter_default;
	var init_filter = __esmMin((() => {
		filter_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-filter\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/filter-off.svg
	var filter_off_default;
	var init_filter_off = __esmMin((() => {
		filter_off_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-filter-off\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M8 4h12v2.172a2 2 0 0 1 -.586 1.414l-3.914 3.914m-.5 3.5v4l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227\"/>\r\n    <path d=\"M3 3l18 18\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/moon.svg
	var moon_default;
	var init_moon = __esmMin((() => {
		moon_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-moon\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/schema.svg
	var schema_default;
	var init_schema = __esmMin((() => {
		schema_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"icon icon-tabler icons-tabler-outline icon-tabler-schema\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" /><path d=\"M5 2h5v4h-5l0 -4\" /><path d=\"M15 10h5v4h-5l0 -4\" /><path d=\"M5 18h5v4h-5l0 -4\" /><path d=\"M5 10h5v4h-5l0 -4\" /><path d=\"M10 12h5\" /><path d=\"M7.5 6v4\" /><path d=\"M7.5 14v4\" /></svg>";
	}));
	//#endregion
	//#region src/assets/icons/schema-off.svg
	var schema_off_default;
	var init_schema_off = __esmMin((() => {
		schema_off_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"icon icon-tabler icons-tabler-outline icon-tabler-schema-off\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" /><path d=\"M6 2h4v4m-4 0h-1v-1\" /><path d=\"M15 11v-1h5v4h-2\" /><path d=\"M5 18h5v4h-5l0 -4\" /><path d=\"M5 10h5v4h-5l0 -4\" /><path d=\"M10 12h2\" /><path d=\"M7.5 7.5v2.5\" /><path d=\"M7.5 14v4\" /><path d=\"M3 3l18 18\" /></svg>";
	}));
	//#endregion
	//#region src/assets/icons/square-check.svg
	var square_check_default;
	var init_square_check = __esmMin((() => {
		square_check_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-square-check\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14\"/>\r\n    <path d=\"M9 12l2 2l4 -4\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/sun.svg
	var sun_default;
	var init_sun = __esmMin((() => {
		sun_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-sun\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0\"/>\r\n    <path d=\"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/switch-horizontal.svg
	var switch_horizontal_default;
	var init_switch_horizontal = __esmMin((() => {
		switch_horizontal_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"icon icon-tabler icons-tabler-outline icon-tabler-switch-horizontal\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" /><path d=\"M16 3l4 4l-4 4\" /><path d=\"M10 7l10 0\" /><path d=\"M8 13l-4 4l4 4\" /><path d=\"M4 17l9 0\" /></svg>";
	}));
	//#endregion
	//#region src/assets/icons/x.svg
	var x_default;
	var init_x = __esmMin((() => {
		x_default = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\r\n     stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\r\n     class=\"icon icon-tabler icons-tabler-outline icon-tabler-x\">\r\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M18 6l-12 12\"/>\r\n    <path d=\"M6 6l12 12\"/>\r\n</svg>";
	}));
	//#endregion
	//#region src/assets/icons/index.ts
	var icons;
	var init_icons = __esmMin((() => {
		init_lit();
		init_unsafe_svg();
		init_check();
		init_chevron_down();
		init_clipboard_copy();
		init_clipboard_list();
		init_copy();
		init_file_diff();
		init_file_upload();
		init_filter();
		init_filter_off();
		init_moon();
		init_schema();
		init_schema_off();
		init_square_check();
		init_sun();
		init_switch_horizontal();
		init_x();
		icons = {
			check: b`${o(check_default)}`,
			"chevron-down": b`${o(chevron_down_default)}`,
			"clipboard-copy": b`${o(clipboard_copy_default)}`,
			"clipboard-list": b`${o(clipboard_list_default)}`,
			copy: b`${o(copy_default)}`,
			"file-diff": b`${o(file_diff_default)}`,
			"file-upload": b`${o(file_upload_default)}`,
			filter: b`${o(filter_default)}`,
			"filter-off": b`${o(filter_off_default)}`,
			moon: b`${o(moon_default)}`,
			schema: b`${o(schema_default)}`,
			"schema-off": b`${o(schema_off_default)}`,
			"square-check": b`${o(square_check_default)}`,
			sun: b`${o(sun_default)}`,
			"switch-horizontal": b`${o(switch_horizontal_default)}`,
			x: b`${o(x_default)}`
		};
	}));
	//#endregion
	//#region src/index.css
	var init_src = __esmMin((() => {}));
	//#endregion
	//#region src/main.css?inline
	var main_default;
	var init_main$1 = __esmMin((() => {
		main_default = ":host {\r\n  display: block;\r\n  min-height: 100vh;\r\n  background-color: var(--bg-main);\r\n}\r\n\r\n.main-content {\r\n  position: relative;\r\n}\r\n\r\n.display-area {\r\n  padding: 0.5rem;\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 1.5rem;\r\n}\r\n\r\n.loading-overlay {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  background: var(--bg-empty);\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  align-items: center;\r\n  z-index: 2000;\r\n  color: var(--text-primary);\r\n  gap: 1.5rem;\r\n}\r\n\r\n.spinner {\r\n  width: 50px;\r\n  height: 50px;\r\n  border: 5px solid var(--border-subtle);\r\n  border-top: 5px solid var(--accent-blue);\r\n  border-radius: 50%;\r\n  animation: spin 1s linear infinite;\r\n}\r\n\r\n.loading-text {\r\n  font-size: 1rem;\r\n  font-weight: 600;\r\n  color: var(--text-secondary);\r\n  letter-spacing: 0.05em;\r\n  text-transform: uppercase;\r\n}\r\n\r\n@keyframes spin {\r\n  0% {\r\n    transform: rotate(0deg);\r\n  }\r\n  100% {\r\n    transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n.empty-state {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  padding-top: 10vh;\r\n  color: var(--text-muted);\r\n}\r\n\r\n.empty-icon {\r\n  font-size: 4rem;\r\n  margin-bottom: 1rem;\r\n}\r\n\r\n.main-content svg {\r\n  width: var(--icon-size);\r\n  height: var(--icon-size);\r\n}\r\n\r\n.empty-icon svg {\r\n  width: 64px;\r\n  height: 64px;\r\n}\r\n";
	}));
	//#endregion
	//#region src/store/theme.store.ts
	var theme$, toggleTheme;
	var init_theme_store = __esmMin((() => {
		init_nanostores();
		theme$ = /* @__PURE__ */ atom("dark");
		toggleTheme = () => {
			const newTheme = theme$.get() === "dark" ? "light" : "dark";
			theme$.set(newTheme);
			document.documentElement.setAttribute("data-theme", newTheme);
		};
		document.documentElement.setAttribute("data-theme", theme$.get());
	}));
	//#endregion
	//#region src/components/app-header.css?inline
	var app_header_default;
	var init_app_header$1 = __esmMin((() => {
		app_header_default = ":host {\r\n  display: block;\r\n  position: sticky;\r\n  top: 0;\r\n  z-index: 1000;\r\n  background: var(--bg-panel);\r\n  border-bottom: 2px solid var(--border-subtle);\r\n  padding: 0.5rem 1.5rem;\r\n  color: var(--text-primary);\r\n}\r\n\r\n.header-layout {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  height: 2.5rem;\r\n}\r\n\r\n.brand {\r\n  flex-basis: 10%;\r\n  font-size: 1.125rem;\r\n  font-weight: 800;\r\n  letter-spacing: -0.025em;\r\n  white-space: nowrap;\r\n  margin-right: 15px;\r\n}\r\n\r\n.file-drop-zone {\r\n  flex: 1;\r\n  border: 2px dashed var(--border-subtle);\r\n  border-radius: 6px;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  gap: 0.75rem;\r\n  padding: 0.1rem 1rem;\r\n  font-size: 0.8125rem;\r\n  color: var(--text-secondary);\r\n  transition: all 0.2s ease;\r\n  position: relative;\r\n  cursor: pointer;\r\n}\r\n\r\n.file-drop-zone.dragging {\r\n  border-color: var(--accent-blue);\r\n  background: var(--hover-bg);\r\n  color: var(--accent-blue);\r\n}\r\n\r\n.file-drop-zone input[type=\"file\"] {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  opacity: 0;\r\n  cursor: pointer;\r\n}\r\n\r\n.file-info {\r\n  flex: 1;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  gap: 2rem;\r\n  background: var(--bg-main);\r\n  padding: 0.3rem 1.5rem;\r\n  border-radius: 4px;\r\n  border: 1px solid var(--border-subtle);\r\n}\r\n\r\n.file-name {\r\n  color: var(--accent-blue);\r\n  font-weight: 600;\r\n  font-family: monospace;\r\n  font-size: 0.875rem;\r\n  max-width: 400px;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n}\r\n\r\n.close-btn {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n  padding: 0.2rem 0.8rem;\r\n  font-weight: 700;\r\n  text-transform: uppercase;\r\n  font-size: 0.7rem;\r\n  letter-spacing: 0.05em;\r\n}\r\n\r\n.close-btn span {\r\n  line-height: 1;\r\n}\r\n\r\n.header-controls {\r\n  flex-basis: 10%;\r\n  display: flex;\r\n  flex-direction: row;\r\n  align-items: center;\r\n  justify-content: flex-end;\r\n  gap: 12px;\r\n  margin-left: 15px;\r\n}\r\n\r\n.version-tag {\r\n  font-size: 10px;\r\n  color: var(--text-secondary);\r\n  opacity: 0.7;\r\n  font-weight: bold;\r\n  pointer-events: none;\r\n  order: 3;\r\n}\r\n\r\n.lang-select {\r\n  background: var(--bg-main);\r\n  border: 1px solid var(--border-subtle);\r\n  color: var(--text-primary);\r\n  font-size: 11px;\r\n  font-weight: bold;\r\n  padding: 2px 4px;\r\n  border-radius: 4px;\r\n  cursor: pointer;\r\n  outline: none;\r\n}\r\n\r\n.theme-toggle {\r\n  background: transparent;\r\n  border: none;\r\n  color: var(--text-primary);\r\n  cursor: pointer;\r\n  padding: 2px;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  border-radius: 4px;\r\n  transition: background 0.2s;\r\n  order: 2;\r\n}\r\n\r\n.theme-toggle:hover {\r\n  background: var(--hover-bg);\r\n}\r\n\r\n[data-theme=\"dark\"] .theme-toggle:hover {\r\n  background: var(--hover-bg);\r\n}\r\n\r\n.header-layout svg {\r\n  width: var(--icon-size);\r\n  height: var(--icon-size);\r\n}\r\n";
	}));
	//#endregion
	//#region \0@oxc-project+runtime@0.124.0/helpers/decorate.js
	function __decorate(decorators, target, key, desc) {
		var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		return c > 3 && r && Object.defineProperty(target, key, r), r;
	}
	var init_decorate = __esmMin((() => {}));
	//#endregion
	//#region src/components/app-header.ts
	var import_lib$3, AppHeader;
	var init_app_header = __esmMin((() => {
		import_lib$3 = require_lib();
		init_lit();
		init_decorators();
		init_lit_translate();
		init_icons();
		init_data_store();
		init_i18n_store();
		init_theme_store();
		init_app_header$1();
		init_decorate();
		AppHeader = class AppHeader extends i$1 {
			constructor(..._args) {
				super(..._args);
				this.fileName = new import_lib$3.StoreController(this, fileName$);
				this.theme = new import_lib$3.StoreController(this, theme$);
				this.language = new import_lib$3.StoreController(this, language$);
				this.isUserscript = new import_lib$3.StoreController(this, isUserscript$);
				this.isDragging = false;
			}
			static {
				this.styles = r$4(app_header_default);
			}
			render() {
				const isMonkey = this.isUserscript.value;
				return b`
      <div class="header-layout">
        ${b`<div class="brand">${translate("header.title")}</div>`}
        ${isMonkey ? b`<div class="file-info">${this.fileName.value}</div>` : ""}

        ${!isMonkey ? b`
          ${this.fileName.value ? b`
            <div class="file-info">
              <span class="file-name">${this.fileName.value}</span>
              <button class="btn btn-danger btn-xs close-btn" @click=${this._closeFile}>
                 ${icons.x} <span>${translate("header.close")}</span>
              </button>
            </div>
          ` : b`
            <div 
              class="file-drop-zone ${this.isDragging ? "dragging" : ""}"
              @drop=${this._onDrop}
              @dragover=${this._onDragOver}
              @dragleave=${this._onDragLeave}
            >
              <span class="icon">${icons["file-diff"]}</span>
              <span>${translate("header.upload")}</span>
              <input type="file" @change=${(e) => this._handleFile(e.target.files?.[0])} />
            </div>
          `}
        ` : ""}

        <div class="header-controls">
          ${b`
          <select class="lang-select" .value=${this.language.value} @change=${this._onLanguageChange}>
            <option value="pt-BR">PT</option>
            <option value="en-US">EN</option>
            <option value="fr-FR">FR</option>
            <option value="es-ES">ES</option>
          </select>
          `}

          <button class="theme-toggle" @click=${toggleTheme} title="Change Theme">
            ${this.theme.value === "dark" ? icons.sun : icons.moon}
          </button>
          
          <div class="version-tag">v5</div>
        </div>
      </div>
    `;
			}
			_handleFile(file) {
				if (!file) return;
				this.dispatchEvent(new CustomEvent("file-selected", {
					detail: { file },
					bubbles: true,
					composed: true
				}));
			}
			_onDrop(e) {
				e.preventDefault();
				this.isDragging = false;
				const file = e.dataTransfer?.files[0];
				if (file) this._handleFile(file);
			}
			_onDragOver(e) {
				e.preventDefault();
				this.isDragging = true;
			}
			_onDragLeave() {
				this.isDragging = false;
			}
			_closeFile() {
				fileName$.set(null);
				rawData$.set([]);
				filterName$.set("");
			}
			_onLanguageChange(e) {
				const val = e.target.value;
				changeLanguage(val);
			}
		};
		__decorate([r()], AppHeader.prototype, "isDragging", void 0);
		AppHeader = __decorate([t$2("app-header")], AppHeader);
	}));
	//#endregion
	//#region src/components/app-stats.css?inline
	var app_stats_default;
	var init_app_stats$1 = __esmMin((() => {
		app_stats_default = ":host {\r\n  display: block;\r\n  margin-bottom: 1.5rem;\r\n}\r\n\r\n.layout-stats {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  gap: 2rem;\r\n}\r\n\r\n.left-stats {\r\n  display: flex;\r\n  align-items: stretch;\r\n  gap: 1.5rem;\r\n}\r\n\r\n.stats-container {\r\n  display: flex;\r\n  align-items: stretch;\r\n  background: var(--bg-panel);\r\n  border: 1px solid var(--border-subtle);\r\n  border-radius: 6px;\r\n  overflow: hidden;\r\n  min-width: 450px;\r\n}\r\n\r\n.flip-btn,\r\n.copy-side-btn {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  gap: 0.25rem;\r\n  border: none;\r\n  border-radius: 0;\r\n  padding: 0 0.75rem;\r\n  font-size: 0.65rem;\r\n  font-weight: 800;\r\n  background: var(--bg-main);\r\n  color: var(--text-secondary);\r\n  transition: all 0.2s;\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.05em;\r\n}\r\n\r\n.flip-btn {\r\n  border-right: 1px solid var(--border-subtle);\r\n}\r\n\r\n.copy-side-btn {\r\n  border-left: 1px solid var(--border-subtle);\r\n}\r\n\r\n.flip-btn:hover,\r\n.copy-side-btn:hover {\r\n  background: var(--hover-bg);\r\n  color: var(--accent-blue);\r\n}\r\n\r\n.flip-btn svg,\r\n.copy-side-btn svg {\r\n  width: 1.25rem;\r\n  height: 1.25rem;\r\n}\r\n\r\n.stats-table {\r\n  width: 100%;\r\n  border-collapse: collapse;\r\n  font-size: 0.75rem;\r\n  color: var(--text-primary);\r\n}\r\n\r\nth {\r\n  background: var(--bg-main);\r\n  padding: 0.3rem 0.6rem;\r\n  text-align: left;\r\n  font-weight: 700;\r\n  color: var(--text-secondary);\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.05em;\r\n  border-bottom: 2px solid var(--border-subtle);\r\n}\r\n\r\ntd {\r\n  padding: 0.3rem 0.6rem;\r\n  border-bottom: 1px solid var(--border-subtle);\r\n}\r\n\r\n.clickable-cell {\r\n  cursor: pointer;\r\n  transition:\r\n    opacity 0.2s,\r\n    transform 0.1s;\r\n}\r\n\r\n.clickable-cell:hover {\r\n  opacity: 0.8;\r\n  filter: brightness(1.1);\r\n}\r\n\r\n.clickable-cell:active {\r\n  transform: scale(0.95);\r\n}\r\n\r\n.val-col {\r\n  text-align: center;\r\n  font-family: Futura, Helvetica, \"JetBrains Mono\", monospace;\r\n  font-size: 0.8rem;\r\n}\r\n\r\n.val-wrapper {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  gap: 6px;\r\n}\r\n\r\n.large-count-bubble {\r\n  padding: 2px 3px;\r\n  border-radius: 10px;\r\n  min-width: 16px;\r\n  text-align: center;\r\n  line-height: 1;\r\n  font-size: 0.75rem;\r\n  background-color: var(--bg-main);\r\n  border: 1px solid var(--border-subtle);\r\n  color: var(--text-primary);\r\n  font-weight: bold;\r\n  margin-left: auto;\r\n}\r\n\r\n/* --- Phase 1: Office 2010 Stats Summary Colors --- */\r\n\r\n/* Tables Row (Base Colors) */\r\ntr[data-type=\"Tables\"] {\r\n  background-color: var(--off-blue-base);\r\n  color: var(--text-on-dark);\r\n}\r\ntr[data-type=\"Tables\"] .type-col {\r\n  color: var(--text-on-dark);\r\n  font-weight: bold;\r\n}\r\ntr[data-type=\"Tables\"] .status-I {\r\n  background-color: var(--off-green-base);\r\n  color: var(--text-on-dark);\r\n}\r\ntr[data-type=\"Tables\"] .status-A {\r\n  background-color: var(--off-purple-base);\r\n  color: var(--text-on-dark);\r\n}\r\ntr[data-type=\"Tables\"] .status-E {\r\n  background-color: var(--off-red-base);\r\n  color: var(--text-on-dark);\r\n}\r\ntr[data-type=\"Tables\"] .status-C {\r\n  background-color: var(--off-orange-base);\r\n  color: var(--text-on-dark);\r\n}\r\ntr[data-type=\"Tables\"] .total-col {\r\n  background-color: var(--off-blue-40);\r\n  color: var(--text-on-dark);\r\n}\r\n\r\n/* Columns Row (60% Lighter Colors) */\r\ntr[data-type=\"Columns\"] {\r\n  background-color: var(--off-blue-60);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-type=\"Columns\"] .type-col {\r\n  color: var(--text-on-light);\r\n  font-weight: bold;\r\n}\r\ntr[data-type=\"Columns\"] .status-I {\r\n  background-color: var(--off-green-60);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-type=\"Columns\"] .status-A {\r\n  background-color: var(--off-purple-60);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-type=\"Columns\"] .status-E {\r\n  background-color: var(--off-red-60);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-type=\"Columns\"] .status-C {\r\n  background-color: var(--off-orange-60);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-type=\"Columns\"] .total-col {\r\n  background-color: var(--off-blue-80);\r\n  color: var(--text-on-light);\r\n}\r\n\r\n/* Filter Panel Styling */\r\n.filter-panel {\r\n  display: flex;\r\n  flex-direction: row;\r\n  gap: 1.5rem;\r\n  background: var(--bg-panel);\r\n  padding: 0.6rem 1.2rem;\r\n  border-radius: 6px;\r\n  border: 1px solid var(--border-subtle);\r\n  align-items: center;\r\n}\r\n\r\n.filter-item {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 0.3rem;\r\n}\r\n\r\n.filter-item label {\r\n  font-size: 0.65rem;\r\n  font-weight: 800;\r\n  color: var(--text-secondary);\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.05em;\r\n}\r\n\r\n.filter-item .form-control {\r\n  height: 1.8rem;\r\n  padding: 0.2rem 0.5rem;\r\n  font-size: 0.75rem;\r\n  min-width: 120px;\r\n}\r\n\r\n.search-input-wrapper {\r\n  display: flex;\r\n  align-items: center;\r\n  background: var(--bg-main);\r\n  border: 1px solid var(--border-subtle);\r\n  border-radius: 4px;\r\n  padding: 0 0.5rem;\r\n  height: 1.8rem;\r\n}\r\n\r\n.search-input-wrapper input {\r\n  background: transparent;\r\n  border: none;\r\n  color: var(--text-primary);\r\n  font-size: 0.75rem;\r\n  width: 150px;\r\n  outline: none;\r\n}\r\n\r\n.search-input-wrapper svg {\r\n  color: var(--text-secondary);\r\n  opacity: 0.7;\r\n}\r\n\r\n.filter-switches {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 1.5rem;\r\n  padding-left: 1.5rem;\r\n  border-left: 1px solid var(--border-subtle);\r\n  align-self: stretch;\r\n}\r\n\r\n.main-switch {\r\n  font-size: 0.75rem;\r\n  color: var(--accent-blue);\r\n}\r\n\r\n.stacked-switches {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 0.4rem;\r\n  justify-content: center;\r\n}\r\n\r\n.switch-label {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n  font-size: 0.65rem;\r\n  font-weight: bold;\r\n  color: var(--text-primary);\r\n  cursor: pointer;\r\n  margin-bottom: 0;\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.02em;\r\n}\r\n\r\n/* The switch - the box around the slider */\r\n.switch {\r\n  position: relative;\r\n  display: inline-block;\r\n  width: 32px;\r\n  height: 16px;\r\n}\r\n\r\n/* Hide default HTML checkbox */\r\n.switch input {\r\n  opacity: 0;\r\n  width: 0;\r\n  height: 0;\r\n}\r\n\r\n/* The slider */\r\n.slider {\r\n  position: absolute;\r\n  cursor: pointer;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  background-color: #7f8c8d;\r\n  -webkit-transition: 0.4s;\r\n  transition: 0.4s;\r\n}\r\n\r\n.slider:before {\r\n  position: absolute;\r\n  content: \"\";\r\n  height: 12px;\r\n  width: 12px;\r\n  left: 2px;\r\n  bottom: 2px;\r\n  background-color: white;\r\n  -webkit-transition: 0.4s;\r\n  transition: 0.4s;\r\n}\r\n\r\ninput:checked + .slider {\r\n  background-color: #2ecc71;\r\n}\r\n\r\ninput:focus + .slider {\r\n  box-shadow: 0 0 1px #2ecc71;\r\n}\r\n\r\ninput:checked + .slider:before {\r\n  -webkit-transform: translateX(16px);\r\n  -ms-transform: translateX(16px);\r\n  transform: translateX(16px);\r\n}\r\n\r\n/* Rounded sliders */\r\n.slider.round {\r\n  border-radius: 16px;\r\n}\r\n\r\n.slider.round:before {\r\n  border-radius: 50%;\r\n}\r\n\r\n/* Action Panel on the right */\r\n.action-panel {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 0.5rem;\r\n  justify-content: center;\r\n}\r\n\r\n.action-btn {\r\n  background: var(--bg-main);\r\n  color: var(--text-primary);\r\n  border: 1px solid var(--border-subtle);\r\n  padding: 0.4rem 1rem;\r\n  border-radius: 4px;\r\n  font-size: 0.7rem;\r\n  font-weight: bold;\r\n  cursor: pointer;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.6rem;\r\n  transition: all 0.2s;\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.05em;\r\n  min-width: 160px;\r\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n.action-btn:hover {\r\n  background: var(--accent-blue);\r\n  border-color: var(--accent-blue);\r\n  color: var(--text-on-dark);\r\n}\r\n\r\n.action-btn:active {\r\n  transform: translateY(1px);\r\n}\r\n\r\n.layout-stats svg {\r\n  width: var(--icon-size);\r\n  height: var(--icon-size);\r\n}\r\n";
	}));
	//#endregion
	//#region src/components/app-stats.ts
	var import_lib$2, AppStats;
	var init_app_stats = __esmMin((() => {
		import_lib$2 = require_lib();
		init_lit();
		init_decorators();
		init_lit_translate();
		init_icons();
		init_data_store();
		init_app_stats$1();
		init_decorate();
		AppStats = class AppStats extends i$1 {
			constructor(..._args) {
				super(..._args);
				this.stats = new import_lib$2.StoreController(this, statsSummary$);
				this.nameFilter = new import_lib$2.StoreController(this, filterName$);
				this.showProps = new import_lib$2.StoreController(this, showProperties$);
				this.hideCalc = new import_lib$2.StoreController(this, hideCalculated$);
				this.onlyEnt = new import_lib$2.StoreController(this, onlyEntities$);
				this.onlyEntAtr = new import_lib$2.StoreController(this, onlyEntitiesAndAttributes$);
				this.isCopying = false;
			}
			static {
				this.styles = r$4(app_stats_default);
			}
			render() {
				if (this.stats.value.length === 0) return b``;
				return b`
      <div class="layout-stats">
        <div class="left-stats">
          <div class="stats-container">
            <button class="btn btn-primary btn-xs flip-btn" @click=${toggleFlip} title="${translate("header.flip_tooltip")}">
               ${icons["switch-horizontal"]} <span>${translate("header.flip")}</span>
            </button>
            <table class="table table-condensed stats-table">
              <thead>
                <tr>
                  <th>${translate("stats.col_type")}</th>
                  <th class="total-col">${translate("stats.col_total")}</th>
                  <th class="status-I">${translate("stats.col_addition")}</th>
                  <th class="status-A">${translate("stats.col_change")}</th>
                  <th class="status-E">${translate("stats.col_deletion")}</th>
                  <th class="status-C">${translate("stats.col_calculated")}</th>
                </tr>
              </thead>
              <tbody>
                ${this.stats.value.map((s) => b`
                  <tr data-type="${s.type}">
                    <td class="type-col">${translate(`stats.row_${s.type.toLowerCase()}`)}</td>
                    <td class="val-col total-col clickable-cell" @click=${() => this._handleCellClick(s.type, "")}>
                      <div class="val-wrapper">
                        ${s.total}
                        ${s.type === "Tables" ? b`<span class="large-count-bubble" title="Tables with > 11 attributes">${s.largeTablesCount}</span>` : ""}
                      </div>
                    </td>
                    <td class="val-col status-I clickable-cell" @click=${() => this._handleCellClick(s.type, "I")}>${s.inclusion}</td>
                    <td class="val-col status-A clickable-cell" @click=${() => this._handleCellClick(s.type, "A")}>${s.alteration}</td>
                    <td class="val-col status-E clickable-cell" @click=${() => this._handleCellClick(s.type, "E")}>${s.exclusion}</td>
                    <td class="val-col status-C">${s.calculated}</td>
                  </tr>
                `)}
              </tbody>
            </table>
            <button class="btn btn-primary btn-xs copy-side-btn" @click=${this._copyTablesToClipboard} title="${translate("stats.actions.copy_tables")}">
               ${this.isCopying ? icons.check : icons["clipboard-list"]} 
               <span>${this.isCopying ? translate("stats.messages.copied") : translate("stats.actions.copy_tables")}</span>
            </button>
          </div>

          <div class="filter-panel">
            <div class="filter-item search-filter">
              <label for="name-filter">${translate("header.filters.name")}</label>
              <div class="search-input-wrapper">
                  ${icons.filter}
                  <input 
                    id="name-filter"
                    type="text" 
                    class="form-control" 
                    placeholder="Search..." 
                    .value=${this.nameFilter.value}
                    @input=${this._updateNameFilter}
                  />
              </div>
            </div>

            <div class="filter-item">
              <label for="change-filter">${translate("header.filters.change")}</label>
              <select id="change-filter" class="form-control" @change=${this._updateChangeFilter}>
                <option value="">${translate("changes.all")}</option>
                <option value="I">${translate("changes.addition")}</option>
                <option value="A">${translate("changes.change")}</option>
                <option value="E">${translate("changes.deletion")}</option>
              </select>
            </div>

            <div class="filter-switches">
              <div class="stacked-switches main-stacked">
                <label class="switch-label main-switch">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.showProps.value} @change=${togglePropertiesGlobal}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate("stats.actions.show_props")}</span>
                </label>

                <label class="switch-label">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.hideCalc.value} @change=${(e) => hideCalculated$.set(e.target.checked)}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate("stats.actions.hide_calculated")}</span>
                </label>
              </div>

              <div class="stacked-switches">
                <label class="switch-label">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.onlyEnt.value} @change=${(e) => {
					onlyEntities$.set(e.target.checked);
					if (e.target.checked) onlyEntitiesAndAttributes$.set(false);
				}}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate("stats.actions.only_entities")}</span>
                </label>

                <label class="switch-label">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.onlyEntAtr.value} @change=${(e) => {
					onlyEntitiesAndAttributes$.set(e.target.checked);
					if (e.target.checked) onlyEntities$.set(false);
				}}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate("stats.actions.only_ent_atr")}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
			}
			_updateChangeFilter(e) {
				const val = e.target.value;
				filterChange$.set(val);
			}
			_updateNameFilter(e) {
				const val = e.target.value;
				filterName$.set(val);
			}
			_handleCellClick(type, change) {
				filterChange$.set(change);
				const select = this.renderRoot.querySelector("#change-filter");
				if (select) select.value = change;
				if (type === "Tables") if (change === "") {
					const current = onlyEntities$.get();
					onlyEntities$.set(!current);
					if (!current) onlyEntitiesAndAttributes$.set(false);
				} else {
					onlyEntities$.set(true);
					onlyEntitiesAndAttributes$.set(false);
				}
				else if (type === "Columns") if (change === "") {
					const current = onlyEntitiesAndAttributes$.get();
					onlyEntitiesAndAttributes$.set(!current);
					if (!current) onlyEntities$.set(false);
				} else {
					onlyEntitiesAndAttributes$.set(true);
					onlyEntities$.set(false);
				}
			}
			_copyTablesToClipboard() {
				const tables = enrichedData$.get().filter((row) => row.isHeader && row.prop === "Ent" && (row.leftModel || row.rightModel)).map((row) => row.leftModel || row.rightModel).filter((v, i, a) => v && a.indexOf(v) === i).join("\n");
				if (tables) navigator.clipboard.writeText(tables).then(() => {
					this.isCopying = true;
					setTimeout(() => {
						this.isCopying = false;
					}, 2e3);
				});
				else alert(get("stats.messages.no_tables"));
			}
		};
		__decorate([r()], AppStats.prototype, "isCopying", void 0);
		AppStats = __decorate([t$2("app-stats")], AppStats);
	}));
	//#endregion
	//#region src/components/app-table.css?inline
	var app_table_default;
	var init_app_table$1 = __esmMin((() => {
		app_table_default = ":host {\r\n  --font-mono: monospace;\r\n  --card-bg: transparent;\r\n  --border-color: var(--border-subtle);\r\n}\r\n\r\n.table-container {\r\n  margin-top: 5px;\r\n  background-color: var(--card-bg);\r\n  border: 1px solid var(--border-color);\r\n  font-size: 0.85rem;\r\n  line-height: 1.2;\r\n  width: 100%;\r\n  table-layout: fixed;\r\n  border-collapse: separate; /* Changed to separate for better row hover stability */\r\n  border-spacing: 0;\r\n}\r\n\r\n.indent-dots {\r\n  display: flex;\r\n  gap: 2px;\r\n  color: var(--text-secondary);\r\n  opacity: 0.5;\r\n  font-family: monospace;\r\n  margin-right: 4px;\r\n}\r\n\r\n.dot {\r\n  width: 6px;\r\n  text-align: center;\r\n}\r\n\r\ntr[data-udp=\"true\"] {\r\n  background-color: rgba(0, 128, 128, 0.2);\r\n  color: var(--text-primary);\r\n}\r\n\r\n[data-theme=\"dark\"] tr[data-udp=\"true\"] {\r\n  background-color: rgba(0, 128, 128, 0.4);\r\n}\r\n\r\n/* Remove 3D effects from header */\r\n.table-condensed > thead > tr > th {\r\n  border: none;\r\n  background-color: var(--off-blue-base);\r\n  color: var(--text-on-dark);\r\n  font-weight: 600;\r\n  text-shadow: none;\r\n  box-shadow: none;\r\n}\r\n\r\n.table-condensed > thead > tr > th,\r\n.table-condensed > tbody > tr > th,\r\n.table-condensed > tfoot > tr > th,\r\n.table-condensed > thead > tr > td,\r\n.table-condensed > tbody > tr > td,\r\n.table-condensed > tfoot > tr > td {\r\n  padding: 4px 8px;\r\n  border-bottom: 1px solid var(--border-color);\r\n  border-right: 1px solid var(--border-color);\r\n  vertical-align: middle;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n}\r\n\r\n.table-condensed > thead > tr > th:last-child,\r\n.table-condensed > tbody > tr > td:last-child {\r\n  border-right: none;\r\n}\r\n\r\n.col-check {\r\n  width: 30px;\r\n  text-align: center;\r\n}\r\n\r\n.col-type,\r\n.row-type {\r\n  width: 250px;\r\n  white-space: nowrap;\r\n}\r\n\r\n.col-left,\r\n.col-right,\r\n.row-left,\r\n.row-right {\r\n  text-align: left;\r\n}\r\n\r\n.col-prop,\r\n.row-prop {\r\n  width: 45px;\r\n  text-align: center;\r\n}\r\n\r\n.col-change,\r\n.row-change {\r\n  width: 40px;\r\n  text-align: center;\r\n}\r\n\r\n.col-view,\r\n.row-view {\r\n  width: 40px;\r\n  text-align: center;\r\n}\r\n\r\n.col-cal,\r\n.row-cal {\r\n  width: 35px;\r\n  text-align: center;\r\n}\r\n\r\n.tree-node {\r\n  display: flex;\r\n  align-items: center;\r\n  position: relative;\r\n  min-height: 24px;\r\n}\r\n\r\n.row-indicators {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 6px;\r\n  margin-left: auto;\r\n  padding-right: 4px;\r\n}\r\n\r\n.icon-indicator {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  width: 14px;\r\n  height: 14px;\r\n  opacity: 0.6;\r\n  transition: all 0.2s ease;\r\n}\r\n\r\n.icon-indicator svg {\r\n  width: 12px;\r\n  height: 12px;\r\n  stroke-width: 2.5;\r\n}\r\n\r\n.prop-indicator {\r\n  transform: rotate(-90deg);\r\n}\r\n\r\n.prop-indicator.expanded {\r\n  transform: rotate(0deg);\r\n  opacity: 1;\r\n}\r\n\r\n.sub-indicator path:nth-child(9) {\r\n  color: var(--btn-danger-bg);\r\n}\r\n\r\n.clickable-row {\r\n  cursor: pointer;\r\n  user-select: none;\r\n}\r\n\r\n/*\r\n   Whole row highlight using box-shadow on the row\r\n   and a persistent overlay on the cells.\r\n   Removed transition to prevent the \"flashing\" or \"dissipating\" feel.\r\n*/\r\n.clickable-row:hover td {\r\n  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.12);\r\n  background-image: linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08));\r\n}\r\n\r\n[data-theme=\"light\"] .clickable-row:hover td {\r\n  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05);\r\n  background-image: linear-gradient(rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.03));\r\n}\r\n\r\n.type-text {\r\n  font-family: var(--font-mono, monospace), serif;\r\n  font-size: 0.8rem;\r\n}\r\n\r\ntr[data-header=\"true\"] .type-text {\r\n  font-weight: bold;\r\n}\r\n\r\n.copy-btn {\r\n  opacity: 0.5;\r\n  transition: all 0.2s;\r\n  padding: 2px 4px;\r\n  height: auto;\r\n  line-height: 1;\r\n  margin-left: 4px;\r\n  border-radius: 4px;\r\n  border: 1px solid transparent;\r\n  background: transparent;\r\n  box-shadow: none;\r\n}\r\n\r\n.copy-btn svg {\r\n  width: 14px;\r\n  height: 14px;\r\n}\r\n\r\n.copy-btn:hover {\r\n  opacity: 1;\r\n  border-color: var(--border-subtle);\r\n  background: var(--bg-panel);\r\n  color: var(--off-aqua-base);\r\n}\r\n\r\n.copy-success {\r\n  opacity: 1;\r\n  color: #5cb85c;\r\n  border-color: #5cb85c;\r\n}\r\n\r\n/* Status Colors */\r\n\r\ntr[data-grouping=\"true\"] {\r\n  background-color: var(--bg-group-l0);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-grouping=\"true\"][data-level=\"1\"] {\r\n  background-color: var(--bg-group-l1);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-grouping=\"true\"][data-level=\"2\"] {\r\n  background-color: var(--bg-group-l2);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-grouping=\"true\"][data-level=\"3\"] {\r\n  background-color: var(--bg-group-l3);\r\n  color: var(--text-on-light);\r\n}\r\n\r\ntr[data-header=\"true\"][data-prop=\"Ent\"][data-change=\"I\"] {\r\n  background-color: var(--off-green-base);\r\n  color: var(--text-on-dark);\r\n}\r\ntr[data-header=\"true\"][data-prop=\"Ent\"][data-change=\"A\"] {\r\n  background-color: var(--off-purple-base);\r\n  color: var(--text-on-dark);\r\n}\r\ntr[data-header=\"true\"][data-prop=\"Ent\"][data-change=\"E\"] {\r\n  background-color: var(--off-red-base);\r\n  color: var(--text-on-dark);\r\n}\r\ntr[data-header=\"true\"][data-prop=\"Ent\"][data-calculated=\"true\"] {\r\n  background-color: var(--off-orange-base);\r\n  color: var(--text-on-dark);\r\n}\r\n\r\ntr[data-header=\"true\"][data-prop=\"Atr\"][data-change=\"I\"] {\r\n  background-color: var(--off-green-60);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-header=\"true\"][data-prop=\"Atr\"][data-change=\"A\"] {\r\n  background-color: var(--off-purple-60);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-header=\"true\"][data-prop=\"Atr\"][data-change=\"E\"] {\r\n  background-color: var(--off-red-60);\r\n  color: var(--text-on-light);\r\n}\r\ntr[data-header=\"true\"][data-prop=\"Atr\"][data-calculated=\"true\"] {\r\n  background-color: var(--off-orange-60);\r\n  color: var(--text-on-light);\r\n}\r\n\r\n/* Orange Scale for Everything Else (Headers) */\r\ntr[data-header=\"true\"]:not([data-prop=\"Ent\"]):not([data-prop=\"Atr\"]):not([data-grouping=\"true\"]) {\r\n  color: var(--text-on-dark);\r\n}\r\n\r\ntr[data-header=\"true\"][data-level=\"0\"]:not([data-prop=\"Ent\"]):not([data-prop=\"Atr\"]):not(\r\n    [data-grouping=\"true\"]\r\n  ),\r\ntr[data-header=\"true\"][data-level=\"1\"]:not([data-prop=\"Ent\"]):not([data-prop=\"Atr\"]):not(\r\n    [data-grouping=\"true\"]\r\n  ) {\r\n  background-color: var(--color-obj-l1);\r\n}\r\n\r\ntr[data-header=\"true\"][data-level=\"2\"]:not([data-prop=\"Ent\"]):not([data-prop=\"Atr\"]):not(\r\n    [data-grouping=\"true\"]\r\n  ) {\r\n  background-color: var(--color-obj-l2);\r\n  color: var(--text-on-light);\r\n}\r\n\r\ntr[data-header=\"true\"][data-level=\"3\"]:not([data-prop=\"Ent\"]):not([data-prop=\"Atr\"]):not(\r\n    [data-grouping=\"true\"]\r\n  ) {\r\n  background-color: var(--color-obj-l3);\r\n  color: var(--text-on-light);\r\n}\r\n\r\ntr[data-header=\"true\"][data-level=\"4\"]:not([data-prop=\"Ent\"]):not([data-prop=\"Atr\"]):not(\r\n    [data-grouping=\"true\"]\r\n  ),\r\ntr[data-header=\"true\"][data-level=\"5\"]:not([data-prop=\"Ent\"]):not([data-prop=\"Atr\"]):not(\r\n    [data-grouping=\"true\"]\r\n  ),\r\ntr[data-header=\"true\"][data-level=\"6\"]:not([data-prop=\"Ent\"]):not([data-prop=\"Atr\"]):not(\r\n    [data-grouping=\"true\"]\r\n  ) {\r\n  background-color: var(--color-obj-l4);\r\n  color: var(--text-on-light);\r\n}\r\n\r\n.checked-row {\r\n  opacity: 0.5;\r\n  filter: grayscale(0.5);\r\n}\r\n\r\n.checked-row .type-text {\r\n  text-decoration: line-through;\r\n}\r\n\r\n.row-cal {\r\n  font-weight: bold;\r\n  color: var(--off-orange-base);\r\n}\r\n\r\n.row-left,\r\n.row-right {\r\n  word-break: break-all;\r\n  white-space: normal;\r\n}\r\n\r\n.content-wrapper {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  width: 100%;\r\n}\r\n\r\n.row-actions {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 6px;\r\n  flex-shrink: 0;\r\n}\r\n\r\n.len-badge {\r\n  font-size: 0.85rem;\r\n  padding: 0px 6px;\r\n  border-radius: 4px;\r\n  color: white;\r\n  font-weight: bold;\r\n  min-width: 24px;\r\n  text-align: center;\r\n  line-height: 1.4;\r\n}\r\n\r\n.len-ok {\r\n  background-color: #5cb85c;\r\n}\r\n.len-warn {\r\n  background-color: #d9534f;\r\n}\r\n\r\n.attr-badge {\r\n  font-family: Futura, Helvetica, \"JetBrains Mono\", monospace;\r\n  font-size: 0.75rem;\r\n  padding: 1px 6px;\r\n  border-radius: 12px;\r\n  background-color: var(--bg-main);\r\n  border: 1px solid var(--border-subtle);\r\n  color: var(--text-primary);\r\n  font-weight: bold;\r\n  margin-left: auto;\r\n  min-width: 20px;\r\n  text-align: center;\r\n  line-height: 1;\r\n}\r\n";
	}));
	//#endregion
	//#region src/components/app-table.ts
	var import_lib$1, AppTable;
	var init_app_table = __esmMin((() => {
		import_lib$1 = require_lib();
		init_lit();
		init_decorators();
		init_lit_translate();
		init_icons();
		init_data_store();
		init_app_table$1();
		init_decorate();
		AppTable = class AppTable extends i$1 {
			constructor(..._args) {
				super(..._args);
				this.data = new import_lib$1.StoreController(this, filteredData$);
				this.showProps = new import_lib$1.StoreController(this, showProperties$);
				this.toggledProps = new import_lib$1.StoreController(this, toggledPropertiesIds$);
				this.hiddenSubs = new import_lib$1.StoreController(this, hiddenSubObjectsIds$);
				this.checked = new import_lib$1.StoreController(this, checkedIds$);
				this.isFlipped = new import_lib$1.StoreController(this, isFlipped$);
				this.onlyEnt = new import_lib$1.StoreController(this, onlyEntities$);
				this.onlyEntAtr = new import_lib$1.StoreController(this, onlyEntitiesAndAttributes$);
				this.copiedId = null;
				this.copiedSide = null;
			}
			static {
				this.styles = r$4(app_table_default);
			}
			render() {
				const globalShowProps = this.showProps.value;
				const toggledPropsSet = this.toggledProps.value;
				const hiddenSubsSet = this.hiddenSubs.value;
				const checkedSet = this.checked.value;
				const flipped = this.isFlipped.value;
				const onlyEntities = this.onlyEnt.value;
				const onlyEntitiesAndAttributes = this.onlyEntAtr.value;
				const allRows = this.data.value;
				const rowMap = new Map(allRows.map((r) => [r.id, r]));
				const isRowHidden = (rowId) => {
					if (!rowId) return false;
					const row = rowMap.get(rowId);
					if (!row) return false;
					if (row.parentId) {
						const parent = rowMap.get(row.parentId);
						if (parent) {
							if (!row.isHeader) {
								const isParentToggled = toggledPropsSet.has(row.parentId);
								if (!(globalShowProps ? !isParentToggled : isParentToggled)) return true;
							}
							if (row.isHeader) {
								let isHidden = hiddenSubsSet.has(row.parentId);
								if (isHidden && parent.type === "Model" && (row.prop === "Ent" || row.prop === "Atr")) isHidden = false;
								if (onlyEntities && parent.prop === "Ent" && row.prop !== "Ent") isHidden = !isHidden;
								if (onlyEntitiesAndAttributes && parent.prop === "Atr") isHidden = !isHidden;
								if (isHidden) return true;
							}
							if (isRowHidden(row.parentId)) return true;
						}
					}
					return false;
				};
				const visibleRows = allRows.filter((row) => !isRowHidden(row.id));
				const areSubObjectsHidden = (row) => {
					let isHidden = hiddenSubsSet.has(row.id ?? "");
					if (onlyEntities && row.prop === "Ent" && row.hasSubObjects) isHidden = !isHidden;
					if (onlyEntitiesAndAttributes && row.prop === "Atr" && row.hasSubObjects) isHidden = !isHidden;
					return isHidden;
				};
				const arePropertiesHidden = (row) => {
					const isParentToggled = toggledPropsSet.has(row.id ?? "");
					return !(globalShowProps ? !isParentToggled : isParentToggled);
				};
				return b`
      <table class="table table-condensed table-hover table-container">
          <thead>
            <tr>
              <th class="col-check">${icons["square-check"]}</th>
              <th class="col-type">${translate("table.col_type")}</th>
              <th class="col-left">${flipped ? translate("table.col_right") : translate("table.col_left")}</th>
              <th class="col-right">${flipped ? translate("table.col_left") : translate("table.col_right")}</th>
              <th class="col-prop">${translate("table.col_prop")}</th>
              <th class="col-change">${translate("table.col_change")}</th>
              <th class="col-view">${translate("table.col_view")}</th>
              <th class="col-cal">Cal</th>
            </tr>
          </thead>
          <tbody>
            ${visibleRows.length === 0 ? b`
              <tr>
                <td colspan="8" class="text-center empty-cell">
                  <div class="callout">
                    <span class="callout-icon">${icons["clipboard-list"]}</span>
                    ${translate("table.empty")}
                  </div>
                </td>
              </tr>
            ` : visibleRows.map((row) => {
					const isIdentificationRow = row.isHeader && !row.isGrouping;
					const isNameProp = row.type.toLowerCase().includes("name");
					const showCopy = isIdentificationRow || isNameProp;
					const level = row.indent;
					const isChecked = row.id ? checkedSet.has(row.id) : false;
					const leftVal = flipped ? row.rightModel : row.leftModel;
					const rightVal = flipped ? row.leftModel : row.rightModel;
					let change = row.change;
					if (flipped) {
						if (change === "I") change = "E";
						else if (change === "E") change = "I";
					}
					return b`
                <tr 
                  data-change="${change}" 
                  data-level="${level}"
                  data-prop="${row.prop}"
                  data-header="${row.isHeader || false}"
                  data-grouping="${row.isGrouping || false}"
                  data-calculated="${row.isCalculated || false}"
                  data-udp="${row.isUDP || false}"
                  class="${isChecked ? "checked-row" : ""} ${isIdentificationRow ? "clickable-row" : ""}"
                  @click=${() => {
						if (isIdentificationRow && row.id) togglePropertiesIndividual(row.id);
					}}
                  @contextmenu=${(e) => {
						if (isIdentificationRow && row.id) {
							e.preventDefault();
							toggleSubObjects(row.id);
						}
					}}
                >
                  <td class="col-check" @click=${(e) => e.stopPropagation()}>
                     <input 
                      type="checkbox" 
                      .checked=${isChecked}
                      @change=${() => row.id && toggleCheck(row.id)}
                     />
                  </td>
                  <td class="row-type">
                    <div class="tree-node">
                      <div class="indent-dots">
                        ${Array.from({ length: level }).map(() => b`<span class="dot">·</span>`)}
                      </div>
                      <span class="type-text">${row.type}</span>
                      ${this._renderAttributeCounter(row)}

                      <div class="row-indicators">
                        ${row.hasProperties ? b`
                          <span class="icon-indicator prop-indicator ${!arePropertiesHidden(row) ? "expanded" : ""}">
                            ${icons["chevron-down"]}
                          </span>
                        ` : ""}
                        ${row.hasSubObjects ? b`
                          <span class="icon-indicator sub-indicator">
                            ${areSubObjectsHidden(row) ? icons["schema-off"] : icons.schema}
                          </span>
                        ` : ""}
                      </div>
                    </div>
                  </td>
                  <td class="row-left">
                  <div class="content-wrapper">
                    <span class="value-text">${leftVal}</span>
                    <div class="row-actions">
                      ${this._renderLenCounter(row, leftVal)}
                      ${showCopy && leftVal ? b`
                        <button 
                          class="btn btn-default btn-xs copy-btn ${this.copiedId === row.id && this.copiedSide === "left" ? "copy-success" : ""}" 
                          title="${translate("table.copy_left")}" 
                          @click=${(e) => {
						e.stopPropagation();
						this._handleCopy(row.id, leftVal, "left");
					}}
                        >${this.copiedId === row.id && this.copiedSide === "left" ? icons.check : icons.copy}</button>
                      ` : ""}
                    </div>
                  </div>
                </td>
                <td class="row-right">
                  <div class="content-wrapper">
                    <span class="value-text">${rightVal}</span>
                    <div class="row-actions">
                      ${this._renderLenCounter(row, rightVal)}
                      ${showCopy && rightVal ? b`
                        <button 
                          class="btn btn-default btn-xs copy-btn ${this.copiedId === row.id && this.copiedSide === "right" ? "copy-success" : ""}" 
                          title="${translate("table.copy_right")}" 
                          @click=${(e) => {
						e.stopPropagation();
						this._handleCopy(row.id, rightVal, "right");
					}}
                        >${this.copiedId === row.id && this.copiedSide === "right" ? icons.check : icons.copy}</button>
                      ` : ""}
                    </div>
                  </div>
                </td>
                <td class="row-prop">${row.prop}</td>
                <td class="row-change">${isIdentificationRow ? change : ""}</td>
                <td class="row-view">${isIdentificationRow ? row.view : ""}</td>
                <td class="row-cal">${row.isCalculated ? "C" : ""}</td>
              </tr>
            `;
				})}
        </tbody>
      </table>
    `;
			}
			_renderAttributeCounter(row) {
				if (!(row.prop === "Ent" && row.isHeader)) return "";
				const count = row.attributeCount;
				return b`<span class="attr-badge">${count !== void 0 ? count : "?"}</span>`;
			}
			_renderLenCounter(row, value) {
				const isPhysicalName = row.type === "Physical Name";
				const isIdentificationRow = row.isHeader && !row.isGrouping && (row.prop === "Ent" || row.prop === "Atr");
				if (!(isPhysicalName || isIdentificationRow) || !value) return "";
				const getLen = (val) => {
					let clean = val.trim();
					clean = clean.replace(/\s*\[Calculated\]$/, "");
					clean = clean.replace(/\s*\(FK\)$/, "");
					if (clean.includes(".")) {
						const parts = clean.split(".");
						clean = parts[parts.length - 1];
					}
					return clean.length;
				};
				const len = getLen(value);
				if (len === 0) return "";
				return b`<span class="len-badge ${len > 18 ? "len-warn" : "len-ok"}">${len}</span>`;
			}
			_handleCopy(id, text, side) {
				const cleanText = text.includes(":") ? text.split(":")[1].trim() : text.trim();
				navigator.clipboard.writeText(cleanText).then(() => {
					this.copiedId = id;
					this.copiedSide = side;
					setTimeout(() => {
						this.copiedId = null;
						this.copiedSide = null;
					}, 2e3);
				});
			}
		};
		__decorate([r()], AppTable.prototype, "copiedId", void 0);
		__decorate([r()], AppTable.prototype, "copiedSide", void 0);
		AppTable = __decorate([t$2("app-table")], AppTable);
	}));
	//#endregion
	//#region src/main.ts
	var main_exports = /* @__PURE__ */ __exportAll({ AppRoot: () => AppRoot });
	var import_lib, AppRoot;
	var init_main = __esmMin((() => {
		import_lib = require_lib();
		init_lit();
		init_decorators();
		init_lit_translate();
		init_icons();
		init_html_parser();
		init_data_store();
		init_src();
		init_main$1();
		init_app_header();
		init_app_stats();
		init_app_table();
		init_decorate();
		AppRoot = class AppRoot extends i$1 {
			constructor(..._args) {
				super(..._args);
				this.isLoading = new import_lib.StoreController(this, isLoading$);
				this.fileName = new import_lib.StoreController(this, fileName$);
			}
			static {
				this.styles = r$4(main_default);
			}
			firstUpdated() {
				fileName$.subscribe((name) => {
					document.title = name ? name : "Erwin Compare Formatter";
				});
				this._setupGlobalDragDrop();
			}
			render() {
				const showData = !!this.fileName.value && !this.isLoading.value;
				return b`
	<div class="main-content" @file-selected=${this._onFileSelected}>
	<app-header></app-header>
        <div class="display-area">
          ${showData ? b`
            <app-stats></app-stats>
            <app-table></app-table>
          ` : ""}

          ${!this.fileName.value && !this.isLoading.value ? b`
            <div class="empty-state">
              <span class="empty-icon">${icons["file-diff"]}</span>
              <span>${translate("app.no_file")}</span>
            </div>
          ` : ""}
        </div>
        
        ${this.isLoading.value ? b`
          <div class="loading-overlay">
            <div class="spinner"></div>
            <span class="loading-text">${translate("app.loading")}</span>
          </div>
        ` : ""}
      </div>
    `;
			}
			_setupGlobalDragDrop() {
				window.addEventListener("dragover", (e) => {
					e.preventDefault();
					e.stopPropagation();
				});
				window.addEventListener("drop", (e) => {
					e.preventDefault();
					e.stopPropagation();
					const file = e.dataTransfer?.files?.[0];
					if (file?.name.toLowerCase().endsWith(".html")) this._handleFile(file);
				});
			}
			_onFileSelected(e) {
				this._handleFile(e.detail.file);
			}
			_handleFile(file) {
				fileName$.set(file.name);
				isLoading$.set(true);
				const reader = new FileReader();
				reader.onload = (e) => {
					const buffer = e.target?.result;
					this._decodeBuffer(buffer);
				};
				reader.readAsArrayBuffer(file);
			}
			/**
			* Attempts to decode the buffer using UTF-8 first, then falling back to Windows-1252.
			* This is a robust way to handle Erwin reports with special Portuguese characters.
			*/
			_decodeBuffer(buffer) {
				try {
					const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
					this._processFileContent(text);
				} catch (e) {
					console.warn("UTF-8 decoding failed, falling back to windows-1252", e);
					const text = new TextDecoder("windows-1252").decode(buffer);
					this._processFileContent(text);
				}
			}
			async _loadSampleData() {
				fileName$.set("sample.html");
				isLoading$.set(true);
				try {
					const response = await fetch("./src/store/sample.html");
					if (!response.ok) throw new Error("Failed to load sample file");
					const buffer = await response.arrayBuffer();
					this._decodeBuffer(buffer);
				} catch (error) {
					console.error("Error loading sample data:", error);
					isLoading$.set(false);
				}
			}
			_processFileContent(content) {
				const rows = parseErwinHtml(content);
				rawData$.set(rows);
				initializeVisibility();
				isLoading$.set(false);
			}
		};
		AppRoot = __decorate([t$2("app-root")], AppRoot);
	}));
	//#endregion
	//#region src/index.ts
	init_lit_translate();
	init_html_parser();
	init_data_store();
	init_i18n_store();
	function isErwinReport() {
		const ths = Array.from(document.querySelectorAll("table th"));
		const hasType = ths.some((th) => th.textContent?.trim() === "Type");
		const hasLeftValue = ths.some((th) => th.textContent?.trim() === "Left Value");
		const hasRightValue = ths.some((th) => th.textContent?.trim() === "Right Value");
		return hasType && hasLeftValue && hasRightValue;
	}
	initI18n().then(() => {
		if (isErwinReport()) {
			console.log("Erwin Report detected via Userscript, transforming...");
			isUserscript$.set(true);
			const originalHTML = document.documentElement.outerHTML;
			window.__ERWIN_ORIGINAL_HTML__ = originalHTML;
			const firstRow = document.querySelector("tbody tr");
			const newTitle = `${(firstRow?.querySelectorAll("td")[1] || firstRow?.querySelectorAll("td")[3])?.textContent?.trim().replace(/\[Calculated]/g, "") || "Model"} ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]} (${get("header.comparison") || "Comparison"})`;
			document.title = newTitle;
			fileName$.set(newTitle);
			isLoading$.set(true);
			document.body.innerHTML = "<app-root></app-root>";
			setTimeout(() => {
				const rows = parseErwinHtml(originalHTML);
				rawData$.set(rows);
				initializeVisibility();
				isLoading$.set(false);
			}, 100);
		}
		Promise.resolve().then(() => (init_main(), main_exports));
	});
	//#endregion
})();

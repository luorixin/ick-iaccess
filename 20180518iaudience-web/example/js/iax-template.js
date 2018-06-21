var IAX_TEMPLATE = {
	'notificationBox' :
		'<div id="notifications"  class="notification-box message-{{type}}">'+
			'<i class="fa fa-times" onclick="$(this).parent().remove()" aria-hidden="true"></i>'+
			'<div class="notification-bar-container">'+
			    '<div class="notification-bar">'+
			        '<div class="notification-bar-contents">'+
			            '<div class="notification-msg heading1">{{{message}}}</div>'+
			        '</div>'+
			    '</div>'+
			'</div>'+
		'</div>',
	'signInBox':
	'<div class="modal fade sign-in-box" style="display:none;">'+
'       <div class="modal-dialog modal-sm">'+
'         <div class="modal-content">'+
'           <div class="modal-body">'+
'             <p class="modal-title">{{title}}</p>'+
'             <p style="margin-bottom:5px;">{{subTitle}}</p>'+
'             <div class="edit-container x-login-warp">'+
'               <form class="form-horizontal" id="loginForm" action="{{action}}"  method="post">'+
'									{{#params}}'+
'									{{#input}}'+
'                 <div class="form-group">'+
'                   <div class="input-group">'+
'                      <span class="input-group-addon">'+
'                        <span class="fa {{ico-css}}"></span>'+
'                      </span>'+
'                      <input type="{{type}}" name="{{name}}" class="input-password form-control" value="{{value}}" placeholder="{{placeholder}}">'+
'                    </div>'+
'                 </div>'+
'									{{/input}}'+
'									{{/params}}'+
'									{{#selectApp}}'+
'                 <div style="margin:10px 0 0px 0;background:#f2f2f2;padding:10px;width:325px;">'+
'                   <p>Selected app: <b>{{selectApp}}</b> | Price: <b>{{appPrice}}</b></p>'+
'                   <p>Account Balance: <b>{{accountBalance}}</b></p>'+
'                 </div>'+
'									{{/selectApp}}'+
'               </form>'+
'             </div>'+
'           </div>'+
'           <div class="modal-footer">'+
'             <button type="button" class="btn btn-success" onclick="{{fn}}">{{save}}</button>'+
'             <button type="button" class="btn btn-default" data-dismiss="modal">{{cancel}}</button>'+
'           </div>'+
'         </div>'+
'       </div>'+
'     </div>',
	'savePlan':
	'<div class="modal fade save-plan-box" tabindex="-1" role="dialog">'+
'    <div class="modal-dialog modal-sm" role="document">'+
'      <div class="modal-content">'+
'        <div class="modal-header">'+
'          <label class="modal-title" style="font-size:18px;">{{title}}</label>'+
'        </div>'+
'        <div class="modal-body">'+
'          <div class="edit-container">'+
'            <form class="form-horizontal" action="{{action}}" method="post">'+
'								{{#params}}'+
'								{{#input}}'+
'              <div class="control-group">'+
'                <label class="control-label" style="width:120px;">{{label}}</label>'+
'                <div class="controls" style="margin-left:120px;">'+
'                  <div class="clearfix">'+
'                    <input type="text" value="{{value}}" name="{{name}}" placeholder="{{placeholder}}">'+
'                  </div>'+
'                  <div class="modal-error-msg">'+
'                    <label></label>'+
'                  </div>'+
'                </div>'+
'              </div>'+
'								{{/input}}'+
'								{{/params}}'+
'            </form>'+
'          </div>'+
'        </div>'+
'        <div class="modal-footer modal-footer-left">'+
'          <button type="button" class="btn btn-success" {{#disabled}}disabled{{/disabled}} onclick="{{fn}}">{{save}}</button>'+
'          <button type="button" class="btn btn-cancel" data-dismiss="modal">{{cancel}}</button>'+
'        </div>'+
'      </div>'+
'    </div>'+
'  </div>',
	'getAudienceHistory':
'<div class="modal fade audience-history-box" style="width:1000px;margin:-250px 0 0 -500px" tabindex="-1" role="dialog">'+
'  <div class="modal-dialog modal-lg" role="document">'+
'      <div class="modal-content">'+
'        <div class="modal-header" style="background:#e8ebec">'+
'          <label class="modal-title" style="font-size:18px;">{{title}}</label>'+
'        </div>'+
'        <div class="modal-body" style="margin-bottom:20px;">'+
'			<div class="table_white" style="width:100%">'+
'				<table id="{{tableData.tId}}" class="table table-bordered table-condensed width_100" cellspacing="0" width="100%">'+
'	        	<thead>'+
'	            	<tr>'+
              		'{{#tableData.tHead}}'+
'	                	<th>{{name}}</th>'+
              		'{{/tableData.tHead}}'+
'	            	</tr>'+
'	        	</thead>'+
'	        	<tbody>'+
        		'{{#tableData.tBody}}'+
'	            	<tr>'+
					'{{#tdValues}}'+
'	                	<td {{#detail}}data-detail="{{detail}}" onmouseover="{{tableData.detailFun}}"{{/detail}}>'+
							'{{name}}'+
'                  		</td>'+
					'{{/tdValues}}'+
'	            	</tr>'+
        		'{{/tableData.tBody}}'+
'		        </tbody>'+
'		    	</table>'+
'			</div>'+
'		</div>'+

'      </div>'+
' 	</div>'+
'</div>',
	'confirmBox' : 
	'<div id="del-confirm" class="modal fade del-confirm-box" tabindex="-1" style="z-index: 1051;" role="dialog">'+
		'<div class="modal-dialog modal-sm" role="document">'+
		    '<div class="modal-content">'+
		        '<div class="modal-body">'+
		            '<div class="del-confirm-container">'+
		            	'<label class="del-confirm-title">{{title}}</label>'+
		            	'<p class="del-confirm-content">{{content}}</p>'+
		            '</div>'+
            '        <div class="edit-container">'+
			'            <form class="form-horizontal" action="{{action}}" method="post">'+
			'			{{#params}}'+
			'			{{#input}}'+
			'              <div class="control-group" style="padding-top:0">'+
			'                <label class="control-label" style="width:120px;">{{label}}</label>'+
			'                <div class="controls" style="margin-left:120px;">'+
			'                  <div class="clearfix">'+
			'                    <input type="text" value="{{value}}" name="{{name}}" placeholder="{{placeholder}}">'+
			'                  </div>'+
			'                  <div class="modal-error-msg">'+
			'                    <label></label>'+
			'                  </div>'+
			'                </div>'+
			'              </div>'+
			'			{{/input}}'+
			'			{{/params}}'+
			'            </form>'+
			'        </div>'+
		            '<div class="del-confirm-btn">'+
          				'{{#cancel}}<button type="button" {{#fnCancel}}onclick="{{fnCancel}}"{{/fnCancel}} class="btn btn-cancel" data-dismiss="modal">{{cancel}}</button>{{/cancel}}'+
		            	'<button type="button" class="btn btn-success" onclick="{{fn}}" data-dismiss="modal">{{save}}</button>'+
		            '</div>'+
		        '</div>'+
		    '</div>'+
		'</div>'+
	'</div>',
	'competitorBox' :
'<div class="plan-competitor" id="competitorBox_{{id}}">'+
'	 <input type="hidden" name="competitor_json" value="{index:{{id}}}"/>'+
'    <div class="split-line"></div>'+
'    <label class="plan-title">'+
'      Competitor {{show_id}}'+
'    </label>'+
'	<div class="plan-competion-con">'+
'    <div class="plan-group">'+
'      <label class="plan-label">Competitor Name</label>'+
'      <div class="plans">'+
'        <div class="clearfix">'+
'          <input type="text" name="competitorName" value="" placeholder="Enter brand names"  maxlength="80"/>'+
'        </div>'+
'        <div class="warn-message hide">'+
'          <span class="nav-arrow"></span>'+
'          <div class="clearfix">'+
'            Max. 20 characters or 80 letters'+
'          </div>'+
'        </div>'+
'      </div>'+
'    </div>'+
'    <div class="split-line"></div>'+
'    <div class="plan-group">'+
'       <i class="fa fa-plus-square showHideIco"></i>'+
'      <label class="plan-label">Enter keywords that describe your competitor’s brand</label>'+
'      <div class="plans" style="display:none">'+
'		 <div class="select-radio-con">'+
'		   <div class="radio radio-primary radio-switch">'+
'		       <input type="radio" name="brandType_competitor_{{id}}" data-target="" id="brandType_competitor0_{{id}}" value="0" checked="checked">'+
'		       <label for="brandType_competitor0_{{id}}">Enter keywords and get suggested keywords</label>'+
'		   </div>'+
'		   <div class="radio radio-primary radio-switch">'+
'		       <input type="radio" name="brandType_competitor_{{id}}" data-target="uploadfile" id="brandType_competitor1_{{id}}" value="1">'+
'		       <label for="brandType_competitor1_{{id}}">Upload keywords and get suggested keywords</label>'+
'		   </div>'+
'		   <div class="radio radio-primary radio-switch">'+
'		       <input type="radio" name="brandType_competitor_{{id}}" data-target="chooseplan" id="brandType_competitor2_{{id}}" value="2">'+
'		       <label for="brandType_competitor2_{{id}}">Import keywords from other existing audience plans</label>'+
'		   </div>'+
		'</div>'+
'        <div class="keywords-con" style="display:none">'+
'            <div class="uploadfile">'+
'              <input type="file" class="fileStyle" id="keyword" name="uploadKeywords" style="width:110px;" onchange="uploadFile(this)"/>'+
'              <i class="fa fa-upload" style="position: absolute; top: 10px; left: 10px;"></i>'+
'              <button class="btn dropdown-toggle" type="button">'+
'                Upload file&nbsp;'+
'              </button>'+
'              <div class="uploadshow">'+
'                <span class="uploadText">Format: CSV, TSV or text files</span>'+
'                <a href="javascript:;" style="display:none;" class="bluelink" onclick="removeUpload(this)">Remove</a>'+
'              </div>'+
'              <div class="uploadtip">'+
'              </div>'+
'            </div>'+
'        </div>'+
'        <div class="products-con" style="display:none">'+
'          <div class="addproduct chooseplan">'+
'            <i class="fa fa-chevron-down" style="position: absolute; top: 10px; left: 10px;"></i>'+
			'<div class="dropdown tree-stop" style="width:auto;">'+
			'  <input name="plan" id="plan" type="hidden" value=""/>'+
			'  <button class="btn  dropdown-toggle dropdown-stop" data-type="plan" type="button" style="width:auto;" id="dropdownMenu1" data-toggle="dropdown-stop" aria-haspopup="true" aria-expanded="true">Choose plan</button>'+
			'  <div class="dropdown-menu dropdown-tree-con" aria-labelledby="dropdownMenu1">'+
			'    <div class="dropdown-tree-category">'+
			'      <div class="parent_layer">'+
			'          <div class="pannel">'+
			'            <span>Audience Plan: <b>7</b></span>'+
			'            <span style="float:right; margin: 0 5px 0 0!important;">'+
			'              <i class="fa fa-angle-right"></i>'+
			'            </span>'+
			'          </div>'+
			'          <ul class="tree">'+
			'            <li>'+
			'              <a href="javascript:;">Estee Lauder - Makeup</a>'+
			'              <ul class="childs" style="display:none">'+
			'                <li>'+
			'                  <span>My Brand</span>'+
			'                  <ul class="childs">'+
			'                    <li>'+
			'                      <a href="javascript:;">Estee Lauder / Skincare</a>'+
			'                       <ul class="childs" style="display:none">'+
			'                          <li>'+
			'                            <span>All</span>'+
			'                            <ul class="childs">'+
			'                              <li><a href="javascript:;">Stay / Concealer</a></li>'+
			'                              <li><a href="javascript:;">Perferct Brown</a></li>'+
			'                            </ul>'+
			'                          </li>'+
			'                      </ul>'+
			'                    </li>'+
			'                  </ul>'+
			'                </li>'+
			'                <li>'+
			'                  <span>Competitors</span>'+
			'                  <ul class="childs">'+
			'                    <li><a href="javascript:;">Lancome / Concealer</a></li>'+
			'                    <li><a href="javascript:;">Bobbi Brown</a></li>'+
			'                  </ul>'+
			'                </li>'+
			'                <li>'+
			'                  <span>Advanced</span>'+
			'                  <ul class="childs">'+
			'                    <li><a href="javascript:;">Other terms</a></li>'+
			'                  </ul>'+
			'                <li>'+
			'              </ul>'+
			'            </li>'+
			'            <li><a href="javascript:;">Estee Lauder - Cleanser</a></li>'+
			'            <li><a href="javascript:;">Estee Lauder - Foundation</a></li>'+
			'            <li><a href="javascript:;">Estee Lauder - Concealer</a></li>'+
			'            <li><a href="javascript:;">Estee Lauder vs Lancome</a></li>'+
			'            <li><a href="javascript:;">Shiseido vs Lancome</a></li>'+
			'            <li><a href="javascript:;">SK2 vs Shiseido</a></li>'+
			'          </ul>'+
			'      </div>'+
			'      <div class="child_layer">'+
			'          <div class="pannel">'+
			'            <span>Keywords</span>'+
			'            <span style="float:right; margin: 0 5px 0 0!important;">'+
			'              <i class="fa fa-angle-right"></i>'+
			'            </span>'+
			'          </div>'+
			'          <input type="hidden" value="" name="plan_text"/>'+
			'          <ul class="tree">'+
			'          </ul>'+
			'      </div>'+
			'    </div>'+
			'  </div>'+
			'  <label class="dropdown-plan-infos"></label>'+
			'</div>'+
'          </div>'+
'        </div>'+
'        <div class="keywords-con">'+
'            <input type="hidden" name="competitor_result" />'+
'            <div name="keywordsLayer"></div>'+
'        </div>'+
'      </div>'+
'    </div>'+
'    <div class="split-line"></div>'+
'    <div class="plan-group">'+
'       <i class="fa fa-plus-square showHideIco"></i>'+
'      <label class="plan-label">Elaborate your competitor’s product names, categories and descriptors</label>'+
'      <div class="plans" style="display:none;">'+
'      	  <label class="plan-sub-label">*To enhance audience reach, you can get suggested keywords and add to plan</label>'+
'		  <div class="select-radio-con">'+
'			<div class="radio radio-primary radio-switch">'+
'			  <input type="radio" name="productType_competitor_{{id}}" data-target="" id="productType_competitor0_{{id}}" value="0" checked="checked">'+
'			  <label for="productType_competitor0_{{id}}">Input product name, categories and descriptors</label>'+
'			</div>'+
'			<div class="radio radio-primary radio-switch">'+
'			  <input type="radio" name="productType_competitor_{{id}}" data-target="chooseplan" id="productType_competitor1_{{id}}" value="1">'+
'			  <label for="productType_competitor1_{{id}}">Import products from other existing audience plans</label>'+
'		  </div>'+
'		</div>'+
'        <div class="products-con" style="display:none">'+
'          <div class="addproduct chooseplan">'+
'            <i class="fa fa-chevron-down" style="position: absolute; top: 10px; left: 10px;"></i>'+
			'<div class="dropdown tree-stop" style="width:auto;">'+
			'  <input name="plan" id="plan" type="hidden" value=""/>'+
			'  <button class="btn  dropdown-toggle dropdown-stop" data-type="plan" type="button" style="width:auto;" id="dropdownMenu1" data-toggle="dropdown-stop" aria-haspopup="true" aria-expanded="true">Choose plan</button>'+
			'  <div class="dropdown-menu dropdown-tree-con" aria-labelledby="dropdownMenu1">'+
			'    <div class="dropdown-tree-category">'+
			'      <div class="parent_layer">'+
			'          <div class="pannel">'+
			'            <span>Audience Plan: <b>7</b></span>'+
			'            <span style="float:right; margin: 0 5px 0 0!important;">'+
			'              <i class="fa fa-angle-right"></i>'+
			'            </span>'+
			'          </div>'+
			'          <ul class="tree">'+
			'            <li>'+
			'              <a href="javascript:;">Estee Lauder - Makeup</a>'+
			'              <ul class="childs" style="display:none">'+
			'                <li>'+
			'                  <span>My Brand</span>'+
			'                  <ul class="childs">'+
			'                    <li>'+
			'                      <a href="javascript:;">Estee Lauder / Skincare</a>'+
			'                       <ul class="childs" style="display:none">'+
			'                          <li>'+
			'                            <span>All</span>'+
			'                            <ul class="childs">'+
			'                              <li><a href="javascript:;">Stay / Concealer</a></li>'+
			'                              <li><a href="javascript:;">Perferct Brown</a></li>'+
			'                            </ul>'+
			'                          </li>'+
			'                      </ul>'+
			'                    </li>'+
			'                  </ul>'+
			'                </li>'+
			'                <li>'+
			'                  <span>Competitors</span>'+
			'                  <ul class="childs">'+
			'                    <li><a href="javascript:;">Lancome / Concealer</a></li>'+
			'                    <li><a href="javascript:;">Bobbi Brown</a></li>'+
			'                  </ul>'+
			'                </li>'+
			'              </ul>'+
			'            </li>'+
			'            <li><a href="javascript:;">Estee Lauder - Cleanser</a></li>'+
			'            <li><a href="javascript:;">Estee Lauder - Foundation</a></li>'+
			'            <li><a href="javascript:;">Estee Lauder - Concealer</a></li>'+
			'            <li><a href="javascript:;">Estee Lauder vs Lancome</a></li>'+
			'            <li><a href="javascript:;">Shiseido vs Lancome</a></li>'+
			'            <li><a href="javascript:;">SK2 vs Shiseido</a></li>'+
			'          </ul>'+
			'      </div>'+
			'      <div class="child_layer">'+
			'          <div class="pannel">'+
			'            <span>Segments</span>'+
			'            <span style="float:right; margin: 0 5px 0 0!important;">'+
			'              <i class="fa fa-angle-right"></i>'+
			'            </span>'+
			'          </div>'+
			'          <input type="hidden" value="" name="plan_text"/>'+
			'          <ul class="tree">'+
			'          </ul>'+
			'      </div>'+
			'      <div class="child_layer">'+
			'          <div class="pannel">'+
			'            <span>Products</span>'+
			'          </div>'+
			'          <input type="hidden" value="" name="plan_text"/>'+
			'          <ul class="tree">'+
			'          </ul>'+
			'      </div>'+
			'    </div>'+
			'  </div>'+
			'  <label class="dropdown-plan-infos"></label>'+
			'</div>'+
'          </div>'+
'        </div>'+
'        <div class="products-con">'+
'          <!-- for clone -->'+
'          <div class="product-suggest-con" style="display:none">'+
'            <div class="product-suggest-index"></div>'+
'            <div class="product-suggest">'+
'              <input type="text" name="product" placeholder="Enter a product name" />'+
'              <a href="javascript:;" style="margin-left:10px;" class="bluelink">Remove</a>'+
'              <div class="product-suggest-area">'+
'                <div class="dropdown enter-select-con">'+
'                  <input id="category" type="hidden" value="1"/>'+
'					<div class="enter-select-enter">'+
'                        <div>'+
'                          <label class="enter_placeholder">'+
'                            Enter / Select a product category'+
'                          </label>'+
'                          <input type="text"  name="enter_history"/>'+
'                        </div>'+
'                    </div>'+
'                  <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
'                    <span class="caret arrow-down"></span>'+
'                  </button>'+
'                  <ul class="dropdown-menu doself"  aria-labelledby="dropdownMenu1">'+
'                  </ul>'+
'                </div>'+
'                <i class="fa fa-plus"></i>'+
'                <div class="product-suggest-enter-area">'+
'                  <i class="fa fa-plus-circle"></i>'+
'                  <input type="text" class="hide-enter" name="hide-enter" placeholder="Enter keywords that describe your product name and category" />'+
'                  <ul class="selected-area">'+
'                  </ul>'+
'                  <div class="area-button">'+
'                    <button type="button" disabled class="btn btn-success">'+
'                      <i class="fa fa-lightbulb-o"></i>'+
'                      Get suggestions'+
'                    </button>'+
'                    <label class="area-mesage"></label>'+
'                  </div>'+
'                </div>'+
'                <div class="product-suggest-suggest-area">'+
'                  <div class="suggest-area-init">'+
'                    <label>Suggested keywords</label>'+
'                    <label class="noresult">No results</label>'+
'                  </div>'+
'                  <ul class="selected-area">'+
'                    </ul>'+
'                </div>'+
'              </div>'+
'            </div>'+
'          </div>'+
'          <div class="product-suggest-con">'+
'			 <input type="hidden" name="product_json" value="{index:1}" />'+
'            <div class="product-suggest-index">#1</div>'+
'            <div class="product-suggest">'+
'              <input type="text" name="product"  placeholder="Enter a product name"/>'+
'              <div class="product-suggest-area">'+
'                <div class="dropdown enter-select-con">'+
'                  <input id="category" type="hidden" value="1"/>'+
'					<div class="enter-select-enter">'+
'                        <div>'+
'                          <label class="enter_placeholder">'+
'                            Enter / Select a product category'+
'                          </label>'+
'                          <input type="text"  name="enter_history"/>'+
'                        </div>'+
'                    </div>'+
'                  <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
'                    <span class="caret arrow-down"></span>'+
'                  </button>'+
'                  <ul class="dropdown-menu doself"  aria-labelledby="dropdownMenu1">'+
'                  </ul>'+
'                </div>'+
'                <i class="fa fa-plus"></i>'+
'                <div class="product-suggest-enter-area">'+
'                  <i class="fa fa-plus-circle"></i>'+
'                  <input type="text" class="hide-enter" name="hide-enter" placeholder="Enter keywords that describe your product name and category"/>'+
'                  <ul class="selected-area">'+
'                  </ul>'+
'                  <div class="area-button">'+
'                    <button type="button" disabled class="btn btn-success">'+
'                      <i class="fa fa-lightbulb-o"></i>'+
'                      Get suggestions'+
'                    </button>'+
'                    <label class="area-mesage"></label>'+
'                  </div>'+
'                </div>'+
'                <div class="product-suggest-suggest-area">'+
'                  <div class="suggest-area-init">'+
'                    <label>Suggested keywords</label>'+
'                    <label class="noresult">No results</label>'+
'                  </div>'+
'                  <ul class="selected-area">'+
'                    </ul>'+
'                </div>'+
'              </div>'+
'            </div>'+
'          </div>'+
'          <div class="addproduct">'+
'            <i class="fa fa-plus-circle" style="position: absolute; top: 10px; left: 10px;"></i>'+
'            <button class="btn dropdown-toggle cloneproduct" type="button">'+
'              Add one more product&nbsp;'+
'            </button>'+
'          </div>'+
'        </div>'+
'      </div>'+
'    </div>'+
'	</div>'+
'</div>',
'analysisBox' : 
	'<div id="analysis-confirm{{id}}" class="modal fade analysis-confirm-box" tabindex="-1" data-backdrop="static" style="z-index: 1051;" role="dialog">'+
		'<div class="modal-dialog modal-sm" role="document">'+
		    '<div class="modal-content">'+
		        '<div class="modal-body">'+
		            '<div class="del-confirm-container">'+
		            	'<label class="del-confirm-title">{{title}}</label>'+
		            	'<p class="del-confirm-content">{{content}}</p>'+
		            '</div>'+
	        '        <div class="edit-container" style="padding:0 0 20px 0;">'+
	        '			<div style="position:relative;text-align:center;">'+
	        '				<i class="fa fa-spinner fa-spin" style="font-size:40px;"></i>'+
	        '			</div>'+
	        '			<p style="margin-top:10px;color:#ef4136;text-align:center;width:350px;margin:0 auto;font-size:16px;line-height:27px;">{{tip}}</p>'+
			'        </div>'+
			'		<div class="del-confirm-btn">'+
          				'{{#cancel}}<button type="button" class="btn btn-cancel" onclick="{{fnCancel}}" data-dismiss="modal">{{cancel}}</button>{{/cancel}}'+
		            	'<button type="button" class="btn btn-success" onclick="{{fn}}" data-dismiss="modal">{{save}}</button>'+
		            '</div>'+
		        '</div>'+
		    '</div>'+
		'</div>'+
	'</div>',
'analysisLoadingBox' : 
	'<div id="analysis-loading-box{{id}}" class="modal fade analysis-loading-box" tabindex="-1" style="z-index: 1051;" role="dialog">'+
		'<div class="modal-dialog modal-sm" role="document">'+
		    '<div class="modal-content">'+
		        '<div class="modal-body">'+
	        '        <div class="edit-container clearfix" style="padding:20px 0 20px 0;">'+
	        '			<div class="loading-gif-gender" style="position:relative;float:left;width:100px;">'+
	        '				<div class="gender-male">'+
	        '                  <span class="gender-map-ico loading-hide" style=""></span>'+
	        '                  <span class="gender-map-ico" style=""></span>'+
	        '               </div>'+
	        '				<p data-per="0" style="color:#ef4136;margin-top:5px;text-align:center;">0%</p>'+
	        '			</div>'+
	        '			<div style="float:left;width:400px;">'+
	        '				<p style="font-size:20px;line-height:30px;height:60px;">{{title}}</p><hr/>'+
	        '				<p style="color:#999;text-align:left;width:350px;font-size:12px;">{{content}}</p>'+
	        '			</div>'+
			'        </div>'+
		        '</div>'+
		    '</div>'+
		'</div>'+
	'</div>',
'retargetAudienceBox':
	'<div class="modal fade slide-box retargeting-audience-create-box" style="display:none;">'+
    '  <div class="slide-close" data-dismiss="modal"><i class="fa fa-close" aria-hidden="true"></i></div>'+
    '  <div class="slide-content">'+
    '      <div class="modal-content">'+
    '        <div class="modal-body">'+
    '          <ul class="nav nav-tabs sub-nav-tabs" id="myTab">'+
    '            <li class="active">'+
    '              <a data-toggle="tab" href="#tab-create-audience">Create a Retargeting Audience Group</a>'+
    '            </li>'+
    '          </ul>'+
    '          <div class="tab-content" id="myTabContent">'+
    '            <div class="tab-pane fade in active" id="tab-create-audience">'+
    '              <div onclick="$(this).remove()" class="message-top-tip">'+
    '                <i class="fa fa-times" aria-hidden="true"></i>'+
    '                <div class="message-top-tip-container">'+
    '                  <div class="message-tip">'+
    '                    <div class="message-tip-contents">'+
    '                      <div class="message-tip-msg">Goal event saved successfully. You can now create a retargeting audience group.</div>'+
    '                    </div>'+
    '                  </div>'+
    '                </div>'+
    '              </div>'+
    '              <div class="edit-container">'+
    '                <form class="form-horizontal" id="modifyForm" action="{{action}}" ref="adjust" method="post">'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Name</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '                        <input type="hidden" name="id" value="{{data.id}}" />'+
    '                        <input type="hidden" name="clientId" value="{{data.clientId}}" />'+
    '                        <input type="text" name="name" value="{{data.name}}" />'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Divided By Events</label>'+
    '                    <div class="controls">'+
    '                      <div class="">'+
    '                        <div class="table_white">'+
    '                          <table class="table table-bordered table-condensed width_100" cellspacing="0" width="100%">'+
    '                            <thead>'+
    '                                <tr>'+
    '                                    <th>Logic</th>'+
    '                                    <th>Parameter</th>'+
    '                                    <th>Event</th>'+
    '                                    <th>Receny</th>'+
    '                                    <th>Frequency(Min.)</th>'+
    '                                    <th>Frequency(Max.)</th>'+
    '                                </tr>'+
    '                            </thead>'+
    '                            <tfoot>'+
    '                              <tr class="tack-plus" data-type="andOr">'+
    '                                <td colspan="6">'+
    '                                  <i class="fa fa-plus-circle" aria-hidden="true"></i>'+
    '                                  <label>Add one more event</label>'+
    '                                </td>'+
    '                              </tr>'+
    '                            </tfoot>'+
    '                            <tbody>'+
    '                              <tr style="background-color:#fff;display:none">'+
    '                                <td class="align_left">'+
    '									<i class="fa fa-minus-circle" aria-hidden="true" style="margin-left:8px;margin-top:7px;float:left;font-size:14px;cursor:pointer;color:#ef4136;"></i>'+
    '									<div class="dropdown modifylabel" style="width:52px;float:right;">'+
    '									  <input name="logic" type="hidden" value="">'+
    '									  <button class="btn  dropdown-toggle" style="width:52px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '									    or'+
    '									    <span class="caret arrow-down"></span>'+
    '									  </button>'+
    '									  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="width:50px;min-width: 50px;text-align:left;">'+
    '										{{#assist.logicList}}'+
    '                                      	<li data-value="{{id}}"><a href="javascript:;">{{name}}</a></li>'+
    '										{{/assist.logicList}}'+
    '									  </ul>'+
    '									</div>'+
    '								 </td>'+
    '                                <td class="align_right"></td>'+
    '                                <td class="align_center">'+
    '                                  <div class="dropdown modifylabel" style="width:120px;" >'+
    '                                    <input name="eventId" type="hidden" value=""  />'+
    '                                    <button class="btn  dropdown-toggle" style="width:120px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                                      Please select a option'+
    '                                      <span class="caret arrow-down"></span>'+
    '                                    </button>'+
    '                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="width:118px;min-width: 118px;text-align:left;" >'+
    '										{{#assist.eventList}}'+
    '                                      	<li data-value="{{id}}"><a href="javascript:;">{{event_name}}</a></li>'+
    '										{{/assist.eventList}}'+
    '                                    </ul>'+
    '                                  </div>'+
    '                                </td>'+
    '                                <td class="align_center">'+
    '                                  <div class="dropdown modifylabel" style="width:120px;" >'+
    '                                    <input name="receny" type="hidden" value=""  />'+
    '                                    <button class="btn  dropdown-toggle" style="width:120px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                                      Please select a option'+
    '                                      <span class="caret arrow-down"></span>'+
    '                                    </button>'+
    '                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="width:118px;min-width: 118px;text-align:left;" >'+
    '										{{#assist.recencyList}}'+
    '                                      <li data-value="{{id}}"><a href="javascript:;">{{name}}</a></li>'+
    '										{{/assist.recencyList}}'+
    '                                    </ul>'+
    '                                  </div>'+
    '                                </td>'+
    '                                <td class="">'+
    '                                  <div class="rangeBox">'+
    '                                    <button class="btn minus"><i class="fa fa-minus" aria-hidden="true"></i></button>'+
    '                                    <input type="text" style="width:30px" title="1" value="1" name="frequencyMin">'+
    '                                    <button class="btn plus"><i class="fa fa-plus" aria-hidden="true"></i></button>'+
    '                                  </div>'+
    '                                </td>'+
    '                                <td class="">'+
    '                                  <div class="rangeBox">'+
    '                                    <button class="btn minus"><i class="fa fa-minus" aria-hidden="true"></i></button>'+
    '                                    <input type="text" style="width:30px" title="9999" value="9999" name="frequencyMax">'+
    '                                    <button class="btn plus"><i class="fa fa-plus" aria-hidden="true"></i></button>'+
    '                                  </div>'+
    '                                </td>'+
    '                              </tr>'+
    '							{{^data.settings}}'+
   	'                              <tr style="background-color:#fff;">'+
    '                                <td class="align_left">'+
    '									  <input name="logic" type="hidden" value="">'+
    '									<span style="margin-left:12px;">-</span>'+
    '								 </td>'+
    '                                <td class="align_right">#1</td>'+
    '                                <td class="align_center">'+
    '                                  <div class="dropdown modifylabel" style="width:120px;" >'+
    '                                    <input name="eventId" type="hidden" value=""  />'+
    '                                    <button class="btn  dropdown-toggle" style="width:120px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                                      Please select'+
    '                                      <span class="caret arrow-down"></span>'+
    '                                    </button>'+
    '                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="width:118px;min-width: 118px;text-align:left;" >'+
    '										{{#assist.eventList}}'+
    '                                      	<li data-value="{{id}}"><a href="javascript:;">{{event_name}}</a></li>'+
    '										{{/assist.eventList}}'+
    '                                    </ul>'+
    '                                  </div>'+
    '                                </td>'+
    '                                <td class="align_center">'+
    '                                  <div class="dropdown modifylabel" style="width:120px;" >'+
    '                                    <input name="receny" type="hidden" value=""  />'+
    '                                    <button class="btn  dropdown-toggle" style="width:120px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                                      Please select'+
    '                                      <span class="caret arrow-down"></span>'+
    '                                    </button>'+
    '                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="width:118px;min-width: 118px;text-align:left;" >'+
    '										{{#assist.recencyList}}'+
    '                                      <li data-value="{{id}}"><a href="javascript:;">{{name}}</a></li>'+
    '										{{/assist.recencyList}}'+
    '                                    </ul>'+
    '                                  </div>'+
    '                                </td>'+
    '                                <td class="">'+
    '                                  <div class="rangeBox">'+
    '                                    <button class="btn minus"><i class="fa fa-minus" aria-hidden="true"></i></button>'+
    '                                    <input type="text" style="width:30px" title="1" value="1" name="frequencyMin">'+
    '                                    <button class="btn plus"><i class="fa fa-plus" aria-hidden="true"></i></button>'+
    '                                  </div>'+
    '                                </td>'+
    '                                <td class="">'+
    '                                  <div class="rangeBox">'+
    '                                    <button class="btn minus"><i class="fa fa-minus" aria-hidden="true"></i></button>'+
    '                                    <input type="text" style="width:30px" title="9999" value="9999" name="frequencyMax">'+
    '                                    <button class="btn plus"><i class="fa fa-plus" aria-hidden="true"></i></button>'+
    '                                  </div>'+
    '                                </td>'+
    '                              </tr>'+ 	
    '							{{/data.settings}}'+
    '							{{#data.settings}}'+
    '                              <tr style="background-color:#fff;">'+
    '                                <td class="align_left">'+
    '									<i class="fa fa-minus-circle" aria-hidden="true" style="margin-left:8px;margin-top:7px;float:left;font-size:14px;cursor:pointer;color:#ef4136;"></i>'+
    '									<div class="dropdown modifylabel" style="width:52px;float:right;">'+
    '									  <input name="logic" type="hidden" value="{{logic}}">'+
    '									  <button class="btn  dropdown-toggle" style="width:52px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '									    or'+
    '									    <span class="caret arrow-down"></span>'+
    '									  </button>'+
    '									  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="width:50px;min-width: 50px;text-align:left;">'+
    '										{{#assist.logicList}}'+
    '                                      	<li data-value="{{id}}"><a href="javascript:;">{{name}}</a></li>'+
    '										{{/assist.logicList}}'+
    '									  </ul>'+
    '									</div>'+
    '								 </td>'+
    '                                <td class="align_right">#{{index}}</td>'+
    '                                <td class="align_center">'+
    '                                  <div class="dropdown modifylabel" style="width:120px;" >'+
    '                                    <input name="eventId" type="hidden" value="{{eventId}}"  />'+
    '                                    <button class="btn  dropdown-toggle" style="width:120px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                                      Homepage'+
    '                                      <span class="caret arrow-down"></span>'+
    '                                    </button>'+
    '                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="width:118px;min-width: 118px;text-align:left;" >'+
    '										{{#assist.eventList}}'+
    '                                      	<li data-value="{{id}}"><a href="javascript:;">{{event_name}}</a></li>'+
    '										{{/assist.eventList}}'+
    '                                    </ul>'+
    '                                  </div>'+
    '                                </td>'+
    '                                <td class="align_center">'+
    '                                  <div class="dropdown modifylabel" style="width:120px;" >'+
    '                                    <input name="receny" type="hidden" value="{{receny}}"  />'+
    '                                    <button class="btn  dropdown-toggle" style="width:120px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                                      Please select'+
    '                                      <span class="caret arrow-down"></span>'+
    '                                    </button>'+
    '                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="width:118px;min-width: 118px;text-align:left;" >'+
    '										{{#assist.recencyList}}'+
    '                                      <li data-value="{{id}}"><a href="javascript:;">{{name}}</a></li>'+
    '										{{/assist.recencyList}}'+
    '                                    </ul>'+
    '                                  </div>'+
    '                                </td>'+
    '                                <td class="">'+
    '                                  <div class="rangeBox">'+
    '                                    <button class="btn minus"><i class="fa fa-minus" aria-hidden="true"></i></button>'+
    '                                    <input type="text" style="width:30px" title="{{frequencyMin}}" value="{{frequencyMin}}" name="frequencyMin">'+
    '                                    <button class="btn plus"><i class="fa fa-plus" aria-hidden="true"></i></button>'+
    '                                  </div>'+
    '                                </td>'+
    '                                <td class="">'+
    '                                  <div class="rangeBox">'+
    '                                    <button class="btn minus"><i class="fa fa-minus" aria-hidden="true"></i></button>'+
    '                                    <input type="text" style="width:30px" title="{{frequencyMax}}" value="{{frequencyMax}}" name="frequencyMax">'+
    '                                    <button class="btn plus"><i class="fa fa-plus" aria-hidden="true"></i></button>'+
    '                                  </div>'+
    '                                </td>'+
    '                              </tr>'+
    '								{{/data.settings}}'+
    '                            </tbody>'+
    '                          </table>'+
    '                        </div>'+
    '                        </div>'+
    '                      </div>'+
    '                    </div>'+
    '                  <div class="control-group">'+
    '                    <label style="width:100%;">Total Audience: - | Last Updated: -</label>'+
    '                  </div>'+
    '                </form>'+
    '              </div>'+
    '              <div class="modal-footer slide-bottom">'+
    '                <button type="button" class="btn btn-success" onclick="{{saveFn}}">Save</button>'+
    '                <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>'+
    '              </div>'+
    '            </div>'+
    '          </div>'+
    '        </div>'+
    '    </div>'+
    '  </div>'+
    '</div>',
'editUserBox':
	'<div class="modal fade slide-box user-edit-box" style="display:none;">'+
    '  <div class="slide-close" data-dismiss="modal"><i class="fa fa-close" aria-hidden="true"></i></div>'+
    '  <div class="slide-content">'+
    '      <div class="modal-content">'+
    '        <div class="modal-body">'+
    '          <ul class="nav nav-tabs sub-nav-tabs" id="myTab">'+
    '            <li class="active">'+
    '              <a data-toggle="tab" href="#tab-edit-user">Edit User</a>'+
    '            </li>'+
    '          </ul>'+
    '          <div class="tab-content" id="myTabContent">'+
    '            <div class="tab-pane fade in active" id="tab-edit-user">'+
    '              <div class="edit-container">'+
    '                <form class="form-horizontal" id="modifyForm" action="{{action}}" ref="adjust" method="post">'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">User Name</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '                        <input type="hidden" name="id" value="{{data.id}}" />'+
    '                        <input type="text" name="name" disabled value="{{data.name}}" />'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Role</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '                        <input type="hidden" name="roleId" value="{{data.roleId}}" />'+
    '                        <input type="text" name="roleName" disabled value="{{data.roleName}}" />'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Status - CN Ver.</label>'+
    '                    <div class="controls">'+
	'						<div class="dropdown modifylabel">'+
    '                         <input name="statusCN" type="hidden" value="{{data.statusCN}}"  />'+
    '                         <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                           Active'+
    '                           <span class="caret arrow-down"></span>'+
    '                         </button>'+
    '                         <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
    '                           <li data-value="ACTIVE"><a href="javascript:;">Active</a></li>'+
    '                           <li data-value="PAUSED"><a href="javascript:;">Paused</a></li>'+
    '                         </ul>'+
    '                       </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Status - HK Ver.</label>'+
    '                    <div class="controls">'+
	'						<div class="dropdown modifylabel">'+
    '                         <input name="statusHK" type="hidden" value="{{data.statusHK}}"  />'+
    '                         <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                           Active'+
    '                           <span class="caret arrow-down"></span>'+
    '                         </button>'+
    '                         <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
    '                           <li data-value="ACTIVE"><a href="javascript:;">Active</a></li>'+
    '                           <li data-value="PAUSED"><a href="javascript:;">Paused</a></li>'+
    '                         </ul>'+
    '                       </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Account Rights</label>'+
    '                    <div class="controls">'+
    '                      <div class="">'+
    '                        <div id="dropdownTree"></div>'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                </form>'+
    '              </div>'+
    '              <div class="modal-footer slide-bottom">'+
    '                <button type="button" class="btn btn-success" onclick="{{saveFn}}">Save</button>'+
    '                <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>'+
    '              </div>'+
    '            </div>'+
    '          </div>'+
    '        </div>'+
    '    </div>'+
    '  </div>'+
    '</div>',
'editPlanBox':
	'<div class="modal fade slide-box plan-edit-box" style="display:none;">'+
    '  <div class="slide-close" data-dismiss="modal"><i class="fa fa-close" aria-hidden="true"></i></div>'+
    '  <div class="slide-content">'+
    '      <div class="modal-content">'+
    '        <div class="modal-body">'+
    '          <ul class="nav nav-tabs sub-nav-tabs" id="myTab">'+
    '            <li class="active">'+
    '              <a data-toggle="tab" href="#tab-edit-plan">Edit Audience Plan</a>'+
    '            </li>'+
    '          </ul>'+
    '          <div class="tab-content" id="myTabContent">'+
    '            <div class="tab-pane fade in active" id="tab-edit-plan">'+
    '              <div class="edit-container">'+
    '                <form class="form-horizontal" id="modifyForm" action="{{action}}" ref="adjust" method="post">'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Audience Plan Name</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '                        <input type="hidden" name="id" value="{{data.id}}" />'+
    '                        <input type="text" name="name" disabled value="{{data.name}}" />'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Status</label>'+
    '                    <div class="controls">'+
	'						<div class="dropdown modifylabel">'+
    '                         <input name="status" type="hidden" value="{{data.status}}"  />'+
    '                         <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                           Active'+
    '                           <span class="caret arrow-down"></span>'+
    '                         </button>'+
    '                         <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
    '                           <li data-value="ACTIVE"><a href="javascript:;">Active</a></li>'+
    '                           <li data-value="PAUSED"><a href="javascript:;">Paused</a></li>'+
    '                         </ul>'+
    '                       </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Account Rights</label>'+
    '                    <div class="controls">'+
    '						<div class="label-input" style="padding-top: 5px; margin-top: 0px; line-height: 18px;">'+
	'					      Agency'+
	'					    </div>'+
	'						<div class="dropdown modifylabel">'+
    '                         <input name="agency" type="hidden" value="{{data.agency}}" onchange="{{changeAgency}}"/>'+
    '                         <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                           Agency'+
    '                           <span class="caret arrow-down"></span>'+
    '                         </button>'+
    '                         <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
    '							{{#assist.accountRight}}'+
    '                              <li data-value="{{id}}"><a href="javascript:;">{{name}}</a></li>'+
    '							{{/assist.accountRight}}'+
    '                         </ul>'+
    '                       </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group" style="padding-top:0">'+
    '                    <div class="controls">'+
    '						<div class="label-input" style="padding-top: 5px; margin-top: 0px; line-height: 18px;">'+
	'					      Advertiser'+
	'					    </div>'+
	'						<div class="dropdown modifylabel">'+
    '                         <input name="advertiser" type="hidden" value="{{data.advertiser}}"  />'+
    '                         <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                           Active'+
    '                           <span class="caret arrow-down"></span>'+
    '                         </button>'+
    '                         <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
    '                         </ul>'+
    '                       </div>'+
    '                    </div>'+
    '                  </div>'+
    '                </form>'+
    '              </div>'+
    '              <div class="modal-footer slide-bottom">'+
    '                <button type="button" class="btn btn-success" onclick="{{saveFn}}">Save</button>'+
    '                <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>'+
    '              </div>'+
    '            </div>'+
    '          </div>'+
    '        </div>'+
    '    </div>'+
    '  </div>'+
    '</div>',
'editAdvertiserBox':
	'<div class="modal fade slide-box advertiser-edit-box" style="display:none;">'+
    '  <div class="slide-close" data-dismiss="modal"><i class="fa fa-close" aria-hidden="true"></i></div>'+
    '  <div class="slide-content">'+
    '      <div class="modal-content">'+
    '        <div class="modal-body">'+
    '          <ul class="nav nav-tabs sub-nav-tabs" id="myTab">'+
    '            <li class="active">'+
    '              <a data-toggle="tab" href="#tab-edit-advertiser">Edit Advertiser</a>'+
    '            </li>'+
    '          </ul>'+
    '          <div class="tab-content" id="myTabContent">'+
    '            <div class="tab-pane fade in active" id="tab-edit-advertiser">'+
    '              <div class="edit-container">'+
    '                <form class="form-horizontal" id="modifyForm" action="{{action}}" ref="adjust" method="post">'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Advertiser Name</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '                        <input type="hidden" name="id" value="{{data.id}}" />'+
    '                        <input type="text" name="name" disabled value="{{data.name}}" />'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Agency</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '                        <input type="hidden" name="agencyId" value="{{data.agencyId}}" />'+
    '                        <input type="text" name="agencyName" disabled value="{{data.agencyName}}" />'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Plan Limit</label>'+
    '                    <div class="controls">'+
    '						<div class="rangeBox">'+
    '                         <button class="btn minus" type="button" >'+
    '                           <i class="fa fa-minus"></i>'+
    '                         </button>'+
    '						  <input type="text" style="width:300px" value="{{data.planLimit}}" title="{{data.planLimit}}" name="planLimit">'+
    '                         <button class="btn plus" type="button" >'+
    '                           <i class="fa fa-plus"></i>'+
    '                         </button>'+
    '                       </div>'+
    '						<div class="label-input">'+
	'			        		Plan Usage: {{data.usage}} (You can add up to {{data.limit}} plans)'+
	'			      		</div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Start Date</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '						 <div class="date-range" style="width:380px;">'+
	'           			   <div class="date-range-ico"><i class="fa fa-calendar"></i></div> '+
	'           			   <input type="text" id="startDate" name="startDate" placeholder="please select a period" value="{{data.startDate}}" style="width:339px;" class="form-control date-range-input xmoCalendarInputSchedule">'+
	'           			    <span class="caret arrow-calendar"></span>'+
	'           			 </div>'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">End Date</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '                       <div class="clearfix">'+
    '						 <div class="date-range" style="width:380px;">'+
	'           			   <div class="date-range-ico"><i class="fa fa-calendar"></i></div> '+
	'           			   <input type="text" id="endDate" name="endDate" placeholder="please select a period" value="{{data.endDate}}" style="width:339px;" class="form-control date-range-input xmoCalendarInputSchedule">'+
	'           			    <span class="caret arrow-calendar"></span>'+
	'           			 </div>'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Status</label>'+
    '                    <div class="controls">'+
	'						<div class="dropdown modifylabel">'+
    '                         <input name="status" type="hidden" value="{{data.status}}"  />'+
    '                         <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                           Active'+
    '                           <span class="caret arrow-down"></span>'+
    '                         </button>'+
    '                         <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
    '                           <li data-value="ACTIVE"><a href="javascript:;">Active</a></li>'+
    '                           <li data-value="PAUSED"><a href="javascript:;">Paused</a></li>'+
    '                         </ul>'+
    '                       </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Account Rights</label>'+
    '                    <div class="controls">'+
    '                      <div class="">'+
    '                        <div class="table_white">'+
    '                          <table class="table table-bordered table-condensed width_100" cellspacing="0" width="100%">'+
    '                            <thead>'+
    '                                <tr>'+
    '                                    <th>User</th>'+
    '                                    <th>Added Date</th>'+
    '                                    <th style="width:50px;align:center">Action</th>'+
    '                                </tr>'+
    '                            </thead>'+
    '                            <tbody>'+
    '							{{#data.accountRights}}'+
    '								<tr>'+
    '									<td>{{name}}</td>'+
    '									<td>{{addDate}}</td>'+
    '									<td class="align_center">'+
    '										<a href="javascript:;" class="fa-icon-box" onclick="$(this).parent().parent().remove()">'+
    '                   					 <i class="fa fa-close"></i>'+
    '                  						</a>'+
    '                  					</td>'+
    '								</tr>'+
    '							{{/data.accountRights}}'+
    '							 </tbody>'+
    '                    </div>'+
    '                  </div>'+
    '                </form>'+
    '              </div>'+
    '              <div class="modal-footer slide-bottom">'+
    '                <button type="button" class="btn btn-success" onclick="{{saveFn}}">Save</button>'+
    '                <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>'+
    '              </div>'+
    '            </div>'+
    '          </div>'+
    '        </div>'+
    '    </div>'+
    '  </div>'+
    '</div>',
'editAgencyBox':
	'<div class="modal fade slide-box agency-edit-box" style="display:none;">'+
    '  <div class="slide-close" data-dismiss="modal"><i class="fa fa-close" aria-hidden="true"></i></div>'+
    '  <div class="slide-content">'+
    '      <div class="modal-content">'+
    '        <div class="modal-body">'+
    '          <ul class="nav nav-tabs sub-nav-tabs" id="myTab">'+
    '            <li class="active">'+
    '              <a data-toggle="tab" href="#tab-edit-agency">Edit Agency</a>'+
    '            </li>'+
    '          </ul>'+
    '          <div class="tab-content" id="myTabContent">'+
    '            <div class="tab-pane fade in active" id="tab-edit-agency">'+
    '              <div class="edit-container">'+
    '                <form class="form-horizontal" id="modifyForm" action="{{action}}" ref="adjust" method="post">'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Agency Name</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '                        <input type="hidden" name="id" value="{{data.id}}" />'+
    '                        <input type="text" name="name" disabled value="{{data.name}}" />'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Plan Type</label>'+
    '                    <div class="controls">'+
    '						<div class="dropdown modifylabel">'+
    '                         <input name="planType" type="hidden" value="{{data.planType}}"  />'+
    '                         <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                           Active'+
    '                           <span class="caret arrow-down"></span>'+
    '                         </button>'+
    '                         <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
    '							{{#assist.planTypes}}'+
    '                           	<li data-value="{{id}}"><a href="javascript:;">{{name}}</a></li>'+
    '							{{/assist.planTypes}}'+
    '                         </ul>'+
    '                       </div>'+
    '						<div class="label-input">'+
	'			        		Plan Limit: {{data.limit}} | Plan Usage: {{data.usage}}'+
	'			      		</div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Start Date</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '						 <div class="date-range" style="width:380px;">'+
	'           			   <div class="date-range-ico"><i class="fa fa-calendar"></i></div> '+
	'           			   <input type="text" id="startDate" placeholder="please select a period" value="{{data.startDate}}" style="width:339px;" class="form-control date-range-input xmoCalendarInputSchedule">'+
	'           			    <span class="caret arrow-calendar"></span>'+
	'           			 </div>'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">End Date</label>'+
    '                    <div class="controls">'+
    '                      <div class="clearfix">'+
    '                       <div class="clearfix">'+
    '						 <div class="date-range" style="width:380px;">'+
	'           			   <div class="date-range-ico"><i class="fa fa-calendar"></i></div> '+
	'           			   <input type="text" id="endDate" placeholder="please select a period" value="{{data.endDate}}" style="width:339px;" class="form-control date-range-input xmoCalendarInputSchedule">'+
	'           			    <span class="caret arrow-calendar"></span>'+
	'           			 </div>'+
    '                      </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Status</label>'+
    '                    <div class="controls">'+
	'						<div class="dropdown modifylabel">'+
    '                         <input name="status" type="hidden" value="{{data.status}}"  />'+
    '                         <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
    '                           Active'+
    '                           <span class="caret arrow-down"></span>'+
    '                         </button>'+
    '                         <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
    '                           <li data-value="ACTIVE"><a href="javascript:;">Active</a></li>'+
    '                           <li data-value="PAUSED"><a href="javascript:;">Paused</a></li>'+
    '                         </ul>'+
    '                       </div>'+
    '                    </div>'+
    '                  </div>'+
    '                  <div class="control-group">'+
    '                    <label class="control-label">Account Rights</label>'+
    '                    <div class="controls">'+
    '                      <div class="">'+
    '                        <div class="table_white">'+
    '                          <table class="table table-bordered table-condensed width_100" cellspacing="0" width="100%">'+
    '                            <thead>'+
    '                                <tr>'+
    '                                    <th>User</th>'+
    '                                    <th>Added Date</th>'+
    '                                    <th style="width:50px;align:center">Action</th>'+
    '                                </tr>'+
    '                            </thead>'+
    '                            <tbody>'+
    '							{{#data.accountRights}}'+
    '								<tr>'+
    '									<td>{{name}}</td>'+
    '									<td>{{addDate}}</td>'+
    '									<td class="align_center">'+
    '										<a href="javascript:;" class="fa-icon-box" onclick="$(this).parent().parent().remove()">'+
    '                   					 <i class="fa fa-close"></i>'+
    '                  						</a>'+
    '                  					</td>'+
    '								</tr>'+
    '							{{/data.accountRights}}'+
    '							 </tbody>'+
    '                    </div>'+
    '                  </div>'+
    '                </form>'+
    '              </div>'+
    '              <div class="modal-footer slide-bottom">'+
    '                <button type="button" class="btn btn-success" onclick="{{saveFn}}">Save</button>'+
    '                <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>'+
    '              </div>'+
    '            </div>'+
    '          </div>'+
    '        </div>'+
    '    </div>'+
    '  </div>'+
    '</div>',
}

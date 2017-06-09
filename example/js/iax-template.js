var IAX_TEMPLATE = {
	'notificationBox' :
		'<div id="notifications" onclick="$(this).remove()" class="notification-box message-{{type}}">'+
			'<i class="fa fa-times" aria-hidden="true"></i>'+
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
'	                	<td>'+
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
          				'{{#cancel}}<button type="button" class="btn btn-cancel" data-dismiss="modal">{{cancel}}</button>{{/cancel}}'+
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
'          <input type="text" name="competitorName" value="" placeholder="Enter brand names"/>'+
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
'      <label class="plan-label">Enter keywords that describes your competitor’s brand</label>'+
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
}

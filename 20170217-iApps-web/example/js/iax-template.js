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
'                 <div class="form-group">'+
'                   <div class="input-group">'+
'                      <span class="input-group-addon">'+
'                        <span class="fa fa-envelope"></span>'+
'                      </span>'+
'                      <input type="text" name="email" class="input-password form-control" placeholder="Email">'+
'                    </div>'+
'                 </div>'+
'                 <div class="form-group">'+
'                   <div class="input-group">'+
'                      <span class="input-group-addon">'+
'                        <span class="fa fa-lock"></span>'+
'                      </span>'+
'                      <input type="password" name="password" class="input-password form-control" placeholder="password">'+
'                    </div>'+
'                 </div>'+
'                 <div style="margin:10px 0 0px 0;">'+
'                   <p>Select app: <b>{{selectApp}}</b> | Price: <b>{{appPrice}}</b></p>'+
'                   <p>Account Balance: <b>{{accountBalance}}</b></p>'+
'                 </div>'+
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
'                    <input type="text" value="{{value}}" name="{{name}}">'+
'                  </div>'+
'                </div>'+
'              </div>'+
'								{{/input}}'+
'								{{/params}}'+
'            </form>'+
'          </div>'+
'        </div>'+
'        <div class="modal-footer">'+
'          <button type="button" class="btn btn-success" onclick="{{fn}}">{{save}}</button>'+
'          <button type="button" class="btn btn-cancel" data-dismiss="modal">{{cancel}}</button>'+
'        </div>'+
'      </div>'+
'    </div>'+
'  </div>'
}

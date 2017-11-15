var SORTTREETB = SORTTREETB || {};
(function(sort,window,document){
  sort.SORT=function(option){
    this.id=option.id;
    this.json= option.json;
    this.lang_opt = option.lang;
    this.selected_audiences = option.selected_audiences;
    this.can_edit_and_delete = option.can_edit_and_delete;
    this.url_lang = this.lang_opt == "_en" ? "/en" : "/zh-cn";
    this.edit_link = option.edit_link;
    this.delete_link = option.delete_link;
    this.html="";
    this.init();
    this.insertCheckbox();
  };
  sort.SORT.prototype={

    $:function(elemId){
      return document.getElementById(elemId);
    },
    sortTable:function(tableId, sortCol, sortType)  {
      var self=this;
      var oTbody = self.$(tableId).tBodies[0];//得到指定id的表格对象下的tbody

      var dataRows = oTbody.rows;
      var tdJsonArr = [];
      var tdJson={};
      var sortRows = [];
      /*直接对json进行排序
      for(var i=0; i<dataRows.length; i++){
        sortRows.push(dataRows[i]);
      }

      // sortRows.push(dataRows[i]);
      sortRows.sort(function(oTr1, oTr2){
        var cellVal1 = oTr1.cells[colIdx].textContent;//firstChild.nodeValue
        var cellVal2 = oTr2.cells[colIdx].textContent;

        return sortType=="asc"?self.compare(cellVal1, cellVal2):self.compare(cellVal2, cellVal1);
      });

      for(var j=0; j<sortRows.length; j++){
        oTbody.appendChild(sortRows[j]);
      }
      */
      self.sortTree(self.json,sortType,sortCol);

      self.html="";
      self.renderHtml(self.json);
      self.doTreeTable();
      self.insertCheckbox();
    },
    insertCheckbox:function(){
      var total = 0;
      var selected = 0;
      var self = this;
      var selected_audiences = self.selected_audiences
      $("#"+self.id).find('tr').each(function(){
        audience_and_bshare_id = $(this).find('td').eq(0).prop('className');
        if(typeof(audience_and_bshare_id) != "undefined"){
          var audience_num_show = $(this).find('td.align_right').html();
          audience_and_bshare_id = audience_and_bshare_id.split("_");
          audience_id = audience_and_bshare_id[0];
          bshare_audience_id = audience_and_bshare_id[1];
          is_checked =  $.inArray(parseInt(audience_id), selected_audiences) >= 0
          input_checked = is_checked ? "checked='checked'" : "";
          if(is_checked){selected += 1};
          total += 1;
          var insert_checkbox = "<td class='align_center' style='width:23px;'><div class='checkbox checkbox-primary'><input class='audience_chbx internal_interest_check' id='e_"+audience_id+ "' name='audience_id[]' type='checkbox'"+input_checked+" value= "+audience_id+ " bshare_audience_id=" + bshare_audience_id + " audience_num_show=" + audience_num_show +" /><label for='e_"+audience_id+ "'></label></div></td>";
          var insert_action = self.ActionTooltip(audience_id,bshare_audience_id);
          $(this).find('td').eq(0).before(insert_checkbox + insert_action);
        }
      });
      // this.SelectedAndTotal(selected, total);
    },
    ActionTooltip:function(audience_id,bshare_audience_id){
      var action_str = ""
      if(this.can_edit_and_delete){
           tooltip_edit_and_delete = "<p><a href='" + this.url_lang +"/bshare_audiences/" + bshare_audience_id+ "/edit' class=''>"+this.edit_link+"</a></p>";
           // tooltip_edit_and_delete += "<p><a style='cursor:pointer;' href='" + this.url_lang +"/audiences/" + audience_id+ "/internal_interest_delete' class='edit_link'>"+this.delete_link+"</a></p>";
           tooltip_edit_and_delete += "<p><a style='cursor:pointer;' href='javascript:void(0);' id='"+audience_id+ "'class='delete_link'>"+this.delete_link+"</a></p>"
           tooltip_str = '<div class="popover xmo-popover fade in"><div class="arrow"></div><div class="popover-inner xmo-popover-inner"><div class="popover-content" >'+ tooltip_edit_and_delete + '</div></div></div>';
           action_str = "<td class='align_center' style='width:18px;'><span data-position='right' data-offset='left_0' class='xmo-tooltip l_margin_0 l_padding_5' ><i class='icon-setup'>" + tooltip_str +"</i></span></td>";
       }
      return action_str
    },
    SelectedAndTotal:function(selected, total){
      var self = this;
      if (self.id == "mobile_internal_interest_audience") {
        content = $("#mobile_internal_count").html().replace(/(\D*)(\d+)(\D*)(\d+)/g, "$1"+selected + "$3" + total);
        $("#mobile_internal_count").html(content);
      } else {
        content = $("#internal_count").html().replace(/(\D*)(\d+)(\D*)(\d+)/g, "$1"+selected + "$3" + total);
        $("#internal_count").html(content);
      }
      if(selected == total && selected > 0){
        $("#select_all_internal_interest_audience").attr("checked", true);
      }
    },
    TrClass:function(){
      var self = this;
      $("#"+self.id).find('tr:visible').each(function(index){
        var trClass = index % 2 ? 'odd' : 'even';
        $(this).removeClass('odd').removeClass('even').addClass(trClass);
      })
    },
    sortTree:function(o,sortType,sortCol){
      var self =this;
      x = o.sort(self.sortJson(sortType,sortCol));
      for(var i=0;i<o.length;i++){
        if(o[i].children!=null && o[i].children.length>0){
          self.sortTree(o[i].children,sortType,sortCol);
        }
       }
    },
    sortJson:function(order, sortBy){
      var ordAlpah = (order == 'asc') ? '>' : '<';
        var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
        return sortFun;
    },
    init:function(){
      var self = this;
      if(self.id){
        self.renderHtml(self.json);
        self.doTreeTable();
        var sortType = "asc";
        $(".sorting").each(function(){
          var sortCol = this;
          $(sortCol).on("click",  function(){
            sortType = (sortType == "asc")?"desc":"asc";
            this.className = "sorting_" + sortType;
            self.sortTable(self.id, $(this).attr("alt"), sortType);
            self.TrClass();
          });
        })
      }

    },
    renderHtml:function(o){
      var self = this;
            var lang = self.lang_opt;
            for(var i=0;i<o.length;i++){
              var url,str = "";
              var audience_id = o[i]["audience_id"]
              var id = o[i]["bshare_id"];
              var bshare_audience_id = o[i]["bshare_audience_id"];
              var pid = o[i]["parent_audience_id"];
              var audience_num = parseInt(o[i]["audience_size"] / 1000);
              var audience_num_show = this.format_to_numeric(audience_num).replace(".00", "") + " K";
              var weekly_growth_rate = o[i]["weekly_growth_rate"] * 100;
              var monthly_growth_rate = o[i]["monthly_growth_rate"] * 100;
              var pHtml =  pid=="0"?"":"data-tt-parent-id="+pid;
              var evenOrOdd = i%2==0?"odd evenorodd ":"even evenorodd "
              var branchOrleaf = (o[i]["children"] != null && o[i]["children"].length>0)||pid==0;
              var trClass = branchOrleaf?"branch "+evenOrOdd:"leaf "+evenOrOdd;
              try{
                  if(false){
                    urlstr = "<tr data-tt-id='"+id+"' "+pHtml+" class='"+trClass+"expanded'><td class="+audience_id+"><span class='indenter' style='padding-left: 19px;'></span><label class='sub_txt inline'>"+ o[i]["name"+lang] +"</label>"
                    urlstr += "<span class='inline l_padding_5'><a href='" + this.url_lang +"/bshare_audiences/" +bshare_audience_id+ "/edit' class='edit_link'>["+this.edit_link+"]</a></span></td>"
                    urlstr += "<td class='align_right'>"+audience_num_show+"</td><td class='" + this.rate_class(weekly_growth_rate) + "'>"+this.format_to_numeric_rate(weekly_growth_rate)+"</td><td class='"+ this.rate_class(monthly_growth_rate) + "'>"+this.format_to_numeric_rate(monthly_growth_rate)+"</td>";
                    urlstr += "<td class='align_left align_top'><span><a href='" + this.url_lang +"/audiences/" +audience_id+ "/internal_interest_delete'><i class='icon-remove'></i></a></span></td>"
                  }else{
                    var tdclass= "'"+audience_id+"_"+bshare_audience_id+"'";
                    urlstr = "<tr data-tt-id='"+id+"' "+pHtml+" class='"+trClass+"expanded'><td class="+tdclass+"><span class='indenter' style='padding-left: 19px;'></span><label class='sub_txt inline'>"+ o[i]["name"+lang] +"</label></td><td class='align_right'>"+audience_num_show+"</td><td class='" + this.rate_class(weekly_growth_rate) + "'>"+this.format_to_numeric_rate(weekly_growth_rate)+"</td><td class='"+ this.rate_class(monthly_growth_rate) + "'>"+this.format_to_numeric_rate(monthly_growth_rate)+"</td></tr>";
                  }
                  // urlstr = "<tr data-tt-id='"+id+"' "+pHtml+" class='"+trClass+"expanded'><td class="+audience_id+"><span class='indenter' style='padding-left: 19px;'></span>"+ o[i]["name"+lang] +"</td><td>"+o[i]["name"+lang]+"</td><td>"+id+"</td><td>"+id+"</td></tr>";
                self.html += urlstr;
                if(branchOrleaf){
                  self.renderHtml(o[i]["children"]);
                }
              }catch(e){console.log(e)}
            }
        },
        doTreeTable:function(){
          var self = this;
          //console.log(self.html);
          $("#"+self.id).find("tbody").html(self.html);
          $("#"+self.id).treetable({ expandable: true},true);
          // $('#'+self.id).treetable("expandAll");
        },
        rate_class: function(rate){
          return (rate == 0 ? "align_right" : (rate > 0 ? "align_right green" : "align_right red_mark"));
        },
        format_to_numeric_rate: function(rate){
          return (rate == 0 ? rate : (rate > 0 ? "+" + this.format_to_numeric(rate) : "-" + this.format_to_numeric(Math.abs(rate)))) + '%' ;
        },
        format_to_numeric: function(str){
          str = this.format_to_machine_number(str);
          if(/^-?\d+(?:\.\d+)?/.test(str)){
          digitalGroup = /(\d)((\d{3}?)+)$/;
          var zhengshu = Math.floor(parseFloat(str)) + '';
          var xiaoshu = Math.floor(parseFloat(str) * 100 % 100) + '';
          while (digitalGroup.test(zhengshu)) {
            zhengshu = zhengshu.replace(digitalGroup, '$1' + "," + '$2');
          };
          if(parseInt(xiaoshu) < 10){
            xiaoshu = '0' + xiaoshu
          };
          str = zhengshu + "." + xiaoshu;

          while (digitalGroup.test(str)) {
            str = str.replace(digitalGroup, '$1' + "," + '$2');
          };
          if(/\.\d$/.test(str)){
            str += '0';
          }else if(/^[^\.]+$/.test(str)){
            str += '.00';
          }
        }
        return str;
        },
        format_to_machine_number: function(str){
          str += '';
          str = str.replace(/[^\d\.\,\-]/g,"");
          if(/^-?(?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d+)?/.test(str)){
            str = str.replace(/,/g,"").replace(/^0+/g,"0").replace(/^0(\d)/g, "$1");
            str = Math.round( parseFloat(str) * 100 )/ 100 + "";
            return str;
          }else{
            return str
          }
        }
  }

})(SORTTREETB,window,document);

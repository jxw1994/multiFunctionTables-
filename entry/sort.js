import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';

class Sort extends React.Component{
    constructor(props){
        super(props);  
        this.state={
            data:null,
            listInfo:"",          
            filterIndex:"",
            checked:true
        } 
        this.recoverListInfo=""
    }
       
    componentWillMount(){
        $.ajax({
            url:"/sort",
            type:"post",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
                if(data){
                  this.setState({
                    listInfo : data.data,
                  });
                  this.recoverListInfo = data.data                   
                }else{
                    listInfo:""
                }
            }.bind(this),
            error:function(){
                alert("请求失败");
            }
        });
    }    

    arraySort(arr, index, isReversed = false){
        arr = arr.sort(function(param1, param2){
            if (typeof param1[index] == "string" && typeof param2[index] == "string") {
              return param1[index].localeCompare(param2[index]);
            }
            //如果参数1为数字，参数2为字符串
            if (typeof param1[index] == "number" && typeof param2[index] == "string") {
              return -1;
            }
            //如果参数1为字符串，参数2为数字
            if (typeof param1[index] == "string" && typeof param2[index] == "number") {
              return 1;
            }
            //如果两个参数均为数字
            if (typeof param1[index] == "number" && typeof param2[index] == "number") {
              return param1[index] - param2[index];
            }
        });

        if (isReversed) {
            return arr.reverse()
        }
        return arr;
     }

    tableSort(index = 0, isReversed){
        let arr = this.state.listInfo;
        arr = this.arraySort(arr, index, isReversed);
        this.setState({
          listInfo:arr
        });
    }

    tableFilter(index){
    	var fc=$(".content>div");
    	fc.addClass("disblock");
	  	this.setState({
	  		filterIndex:index
	  	});

    }

    genRows(){
      let arr = this.state.listInfo;
      var i=0;
      var j=0;
      if(arr == "")
        return "";
      let rows = arr.map(function(data){
      	i++;
        let tds = data.map(function(data1){
        	j++;
          return <td key={j}>{data1}</td>
        })
         return (<tr key={i}>{tds}</tr>);
      });
      return rows;
    }

    genCheckboxRow(index){
    	var arr = this.recoverListInfo;      
     	var i=0;
  	    if(arr == "")
       		 return ""; 
      var  val=this.distinct(index).sort();
     	  //console.log(val);  
		  let checkboxes = val.map(function(row){  
			//console.log(row[index]);				
    			i++;
    			return ( 
    		 		<div key={i}>
    		 			<input type="checkbox" name="checkbox" value={row}/> <span>{row}</span>
    		 		</div>
    		 	);
  		});
      return checkboxes;
      // var divHeight=$(".filterContent").height();
      // console.log(divHeight);
      // var btnsTop=parseInt(divHeight-25);
      // $("#btns").css("top",btnsTop);		 
    }

    distinct(index){
    	var arr = this.recoverListInfo;      
  		if(arr == "")
        	return ""; 
	    var hash = {}; 

	    var column = arr.map(function(row){
	    	return row[index];
	    });
    	let newArrlist = column.filter(function(item){  	
    		//console.log(row[index]);
   			var key = typeof(item) + item;
            if(hash[key] !== 1){
                hash[key] = 1;
                //console.log(ret);
            	return true;
        	}
        	return false;
    	});
    	return newArrlist;
    }

    selectAll(){ 
  		if (this.state.checked) { //全选
  			$("input[name='checkbox']").each(function() {
  				$(this).prop('checked', true);
  			})
  			this.setState({
  				checked:false		
  			});
  		} else { //全不选			
  			$("input[name='checkbox']").each(function() {
  				$(this).prop('checked', false);
  			})			
  			this.setState({
  				checked:true		
  			});
  		}        
    }

    confirm(index){
    	index=this.state.filterIndex;
    	var checkedValueArr = []; //保存已选中项的值的数组
	    $("input[name='checkbox']").each(function(){
          if(this.checked)
          	checkedValueArr.push(this.value);  //把已选中的都push到数组里
    	})
        //console.log(checkedValueArr);
        var arr = this.recoverListInfo;
        var newArr=arr;
    	var newArr1 = newArr.filter(function(item){
    	 	for(var i=0;i<checkedValueArr.length;i++){
    	 		if(item[index] == checkedValueArr[i]){
    	 			return true;
    	 		}
			}	
			//console.log(item[index]);
		});
     	newArr1=newArr1.sort();    
     	this.setState({
	  		listInfo:newArr1
	  	});
        //点确定后筛选，该框隐藏
        var fc=$(".content>div");
    	fc.removeClass("disblock");
    }

    resetSel(){
    	$("[name='checkbox']").removeAttr("checked");
    	var arr = this.state.listInfo; 
    	this.setState({
	  		listInfo:arr
	  	});
    }
    
    render(){
        return(
          <div className="content">	          	 
	          <table style={{marginTop:15,marginLeft:15}}>
	             <thead>
	                  <tr>
	                    <th>姓名
	                    	<b className="up" onClick={this.tableSort.bind(this,0,false)}></b>
	                    	<b className="down" onClick={this.tableSort.bind(this,0,true)}></b>
	                    	<i className="filter" onClick={this.tableFilter.bind(this,0)}></i>
	                    </th>
	                    <th>年龄
	                        <b className="up" onClick={this.tableSort.bind(this,1,false)}></b>
	                        <b className="down" onClick={this.tableSort.bind(this,1,true)}></b>
	                        <i className="filter" onClick={this.tableFilter.bind(this,1)}></i>
                        </th>
	                    <th>学历
		                    <b className="up" onClick={this.tableSort.bind(this,2,false)}></b>
		                    <b className="down" onClick={this.tableSort.bind(this,2,true)}></b>
		                    <i className="filter" onClick={this.tableFilter.bind(this,2)}></i>
	                    </th>
	                  </tr>
	             </thead>
	             <tbody>
	                {this.genRows()}
	             </tbody>
	          </table>
	          <div className="filterContent">
                 <div className="title">筛选条件</div>
	          		 <input type="checkbox" onClick={this.selectAll.bind(this)}/>全选
	          		 <div  id="chk" >
                    {this.genCheckboxRow(this.state.filterIndex)}
                 </div>               
                 <div id="btns">
    	          		 <input type="button" value="确认" onClick={this.confirm.bind(this)}/>
    	          		 <input type="reset" value="取消" onClick={this.resetSel.bind(this)}/> 
                 </div>
	          </div>
	      </div>
        );    
    }
}
ReactDOM.render(
    <Sort />, 
    document.getElementById("table")  
);





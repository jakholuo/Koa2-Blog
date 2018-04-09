$(function(){
    var _upFile=document.getElementById("upFile");

    _upFile.addEventListener("change",function(){
  
    if (_upFile.files.length === 0) {  
        // alert("璇烽€夋嫨鍥剧墖");  
        return; }  
    var oFile = _upFile.files[0]; 
    //if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!"); return; }  
  
    /*  if(oFile.size>5*1024*1024){  
     message(myCache.par.lang,{cn:"鐓х墖涓婁紶锛氭枃浠朵笉鑳借秴杩�5MB!璇蜂娇鐢ㄥ閲忔洿灏忕殑鐓х墖銆�",en:"璇佷功涓婁紶锛氭枃浠朵笉鑳借秴杩�100K!"})  
     
     return;  
     }*/  
    if(!new RegExp("(jpg|jpeg|png)+","gi").test(oFile.type)){  
        // alert("鐓х墖涓婁紶锛氭枃浠剁被鍨嬪繀椤绘槸JPG銆丣PEG銆丳NG");  
        return;  
    }
  
            var reader = new FileReader();  
            reader.onload = function(e) {  
                var base64Img= e.target.result;
                //鍘嬬缉鍓嶉瑙�
                // $("#preview").attr("src",base64Img);  
  
                //--鎵цresize銆�  
                var _ir=ImageResizer({  
                        resizeMode:"auto"  
                        ,dataSource:base64Img  
                        ,dataSourceType:"base64"  
                        ,maxWidth:1200 //鍏佽鐨勬渶澶у搴�  
                        ,maxHeight:600 //鍏佽鐨勬渶澶ч珮搴︺€�  
                        ,onTmpImgGenerate:function(img){  
  
                        }  
                        ,success:function(resizeImgBase64,canvas){
                            //鍘嬬缉鍚庨瑙�
                            $("#nextview").attr("src",resizeImgBase64); 

                            //璧嬪€煎埌闅愯棌鍩熶紶缁欏悗鍙�
                            $('#img').val(resizeImgBase64.substr(23));

                            
  
                        }  
                        ,debug:true  
                });  
  
            };  
            reader.readAsDataURL(oFile);  
  
    },false);  

});
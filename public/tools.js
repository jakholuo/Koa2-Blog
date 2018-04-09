/** 
 * 杩欐槸鍩轰簬html5鐨勫墠绔浘鐗囧伐鍏凤紝鍘嬬缉宸ュ叿銆� 
 */  
var ImageResizer=function(opts){  
    var settings={  
        resizeMode:"auto"//鍘嬬缉妯″紡锛屾€诲叡鏈変笁绉�  auto,width,height auto琛ㄧず鑷姩鏍规嵁鏈€澶х殑瀹藉害鍙婇珮搴︾瓑姣斿帇缂╋紝width琛ㄧず鍙牴鎹搴︽潵鍒ゆ柇鏄惁闇€瑕佺瓑姣斾緥鍘嬬缉锛宧eight绫讳技銆�  
        ,dataSource:"" //鏁版嵁婧愩€傛暟鎹簮鏄寚闇€瑕佸帇缂╃殑鏁版嵁婧愶紝鏈変笁绉嶇被鍨嬶紝image鍥剧墖鍏冪礌锛宐ase64瀛楃涓诧紝canvas瀵硅薄锛岃繕鏈夐€夋嫨鏂囦欢鏃跺€欑殑file瀵硅薄銆傘€傘€�  
        ,dataSourceType:"image" //image  base64 canvas  
        ,maxWidth:150 //鍏佽鐨勬渶澶у搴�  
        ,maxHeight:200 //鍏佽鐨勬渶澶ч珮搴︺€�  
        ,onTmpImgGenerate:function(img){} //褰撲腑闂村浘鐗囩敓鎴愭椂鍊欑殑鎵ц鏂规硶銆傘€傝繖涓椂鍊欒涓嶈涔变慨鏀硅繖鍥剧墖锛屽惁鍒欎細鎵撲贡鍘嬬缉鍚庣殑缁撴灉銆�  
        ,success:function(resizeImgBase64,canvas){  
  
        }//鍘嬬缉鎴愬姛鍚庡浘鐗囩殑base64瀛楃涓叉暟鎹€�  
        ,debug:false //鏄惁寮€鍚皟璇曟ā寮忋€�  
  
    };  
    var appData={};  
    $.extend(settings,opts);  
  
    var _debug=function(str,styles){  
        if(settings.debug==true){  
            if(styles){  
                console.log(str,styles);  
            }  
            else{  
                console.log(str);  
            }  
        }  
    };  
var innerTools={  
        getBase4FromImgFile:function(file,callBack){  
  
            var reader = new FileReader();  
            reader.onload = function(e) {  
                var base64Img= e.target.result;  
                //var $img = $('<img>').attr("src", e.target.result)  
                //$('#preview').empty().append($img)  
                if(callBack){  
                    callBack(base64Img);  
                }  
            };  
            reader.readAsDataURL(file);  
        }  
  
    //--澶勭悊鏁版嵁婧愩€傘€傘€傘€傚皢鎵€鏈夋暟鎹簮閮藉鐞嗘垚涓哄浘鐗囧浘鐗囧璞★紝鏂逛究澶勭悊銆�  
        ,getImgFromDataSource:function(datasource,dataSourceType,callback){  
            var _me=this;  
            var img1=new Image();  
            if(dataSourceType=="img"||dataSourceType=="image"){  
            img1.src=$(datasource).attr("src");  
            if(callback){  
             callback(img1);  
            }  
            }  
            else if(dataSourceType=="base64"){  
                img1.src=datasource;  
            if(callback){  
             callback(img1);  
            }            }  
            else if(dataSourceType=="canvas"){  
            img1.src = datasource.toDataURL("image/jpeg");  
            if(callback){  
             callback(img1);  
            }  
            }  
            else if(dataSourceType=="file"){  
                _me.getBase4FromImgFile(function(base64str){  
                    img1.src=base64str;  
                    if(callback){  
                        callback(img1);  
                    }  
                });  
            }  
  
        }  
       //璁＄畻鍥剧墖鐨勯渶瑕佸帇缂╃殑灏哄銆傚綋鐒讹紝鍘嬬缉妯″紡锛屽帇缂╅檺鍒剁洿鎺ヤ粠setting閲岄潰鍙栧嚭鏉ャ€�  
    ,getResizeSizeFromImg:function(img){  
       var _img_info={  
                w:$(img)[0].naturalWidth,  
                h:$(img)[0].naturalHeight  
            };  
        console.log("鐪熷疄灏哄锛�");  
        console.log(_img_info);  
       var _resize_info={  
           w:0  
           ,h:0  
       };  
        if(_img_info.w<=settings.maxWidth&&_img_info.h<=settings.maxHeight){  
            return _img_info;  
        }  
        if(settings.resizeMode=="auto"){  
        var _percent_scale=parseFloat(_img_info.w/_img_info.h);  
            var _size1={  
                w:0  
                ,h:0  
            };  
            var _size_by_mw={  
                w:settings.maxWidth  
                ,h:parseInt(settings.maxWidth/_percent_scale)  
            };  
            var _size_by_mh={  
                w:parseInt(settings.maxHeight*_percent_scale)  
                ,h:settings.maxHeight  
            };  
            if(_size_by_mw.h<=settings.maxHeight){  
                return _size_by_mw;  
            }  
            if(_size_by_mh.w<=settings.maxWidth){  
                return _size_by_mh;  
            }  
  
            return {  
                w:settings.maxWidth  
                ,h:settings.maxHeight  
            };  
  
        }  
        if(settings.resizeMode=="width"){  
            if(_img_info.w<=settings.maxWidth){  
                return _img_info;  
            }  
            var _size_by_mw={  
                w:settings.maxWidth  
                ,h:parseInt(settings.maxWidth/_percent_scale)  
            };  
            return _size_by_mw;  
        }  
  
        if(settings.resizeMode=="height"){  
            if(_img_info.h<=settings.maxHeight){  
  
                return _img_info;  
            }  
            var _size_by_mh={  
                w:parseInt(settings.maxHeight*_percent_scale)  
                ,h:settings.maxHeight  
            };  
            return _size_by_mh;  
        }  
  
    }  
    //--灏嗙浉鍏冲浘鐗囧璞＄敾鍒癱anvas閲岄潰鍘汇€�  
    ,drawToCanvas:function(img,theW,theH,realW,realH,callback){  
  
    var canvas = document.createElement("canvas");  
        canvas.width=theW;  
        canvas.height=theH;  
        var ctx = canvas.getContext('2d');  
        ctx.drawImage(img,  
0,//sourceX,  
0,//sourceY,  
realW,//sourceWidth,  
realH,//sourceHeight,  
0,//destX,  
0,//destY,  
theW,//destWidth,  
theH//destHeight  
 );  
  
        //--鑾峰彇base64瀛楃涓插強canvas瀵硅薄浼犵粰success鍑芥暟銆�  
        var base64str=canvas.toDataURL("image/jpeg");  
        if(callback){  
            callback(base64str,canvas);  
        }  
    }  
    };  
  
    //--寮€濮嬪鐞嗐€�  
    (function(){  
        innerTools.getImgFromDataSource(settings.dataSource,settings.dataSourceType,function(_tmp_img){  

            setTimeout(function(){
                var __tmpImg=_tmp_img;  
                settings.onTmpImgGenerate(_tmp_img);  
                //--璁＄畻灏哄銆�  
                var _limitSizeInfo=innerTools.getResizeSizeFromImg(__tmpImg);  
                console.log(_limitSizeInfo);  
                var _img_info={  
                    w:$(__tmpImg)[0].naturalWidth,  
                    h:$(__tmpImg)[0].naturalHeight  
                };  
            
                innerTools.drawToCanvas(__tmpImg,_limitSizeInfo.w,_limitSizeInfo.h,_img_info.w,_img_info.h,function(base64str,canvas){  
                  settings.success(base64str,canvas);  
                }); 
            },1000);
             
  
        });  
    })();  
  
    var returnObject={  
  
  
    };  
  
    return returnObject;  
};  
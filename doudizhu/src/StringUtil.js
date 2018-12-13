
var totalData;
var StringUtil={

  LoadString:function(fc){



      var xmlFileName="res/strings.plist";
      var end;
      cc.loader.loadTxt(xmlFileName, function(err, txt){
          if(!err){
              var data = cc.plistParser.parse(txt);


              totalData=  data;

              fc();

          }
      });

       return end;
  },
   getString:function(data){

        return totalData[data];
    }

 };
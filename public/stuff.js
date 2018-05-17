exports.next = function (here) {
 
 
        //    console.log(here);
               var data=[];
               var c =0;
               // creates 3 sets of 4
               for (v=0; v<9; v++){
                   var x = 0;
                   var y = 0;
                   for (w=0+c;  w<9+c; w++) {
                       x += (here[w].x);
                       y += (here[w].y);
                   }
                   data.push({x, y});
                   data[v].x=data[v].x/10;
                   data[v].y=data[v].y/10;
                   c+=11;
               }
               console.log(data);
               return data;
   
           }
function Linear(price){
     n =price.length;
     m =price.length;
     var x = [n];
     var y =[m];
     var z = [m];
     var a = [m];
     var b = x;
     var c = y;
     x1,y1,x2,y2 =0;
     slope,constant = 0

     for(i=0;i<n;i++)
     {
         x1 =x[i]+x1;
         y1= y[i]+y1;
     }
     x1 = x1/n;
        y1= y1/n;
        for(j=0;j< n;j++)
        {
            x[j] = x[j]- x1;
            y[j] = y[j] -y1;
        }
        for(k=0;k< n;k++)
        {
           z[k]= x[k]*x[k];
//            y[j] = y[j] *y[j];
        }
        for(l=0;l< n;l++)
        {
            a[l]= x[l]*y[l];
        }
        for(t=0;t< n;t++)
        {
            x2 = a[t]+x2;
            y2 = z[t] +y2;
        }
        slope = x2/y2;
        constant = y1/(slope * x1);

        }


        function graph(b,c){

            var svg = d3.select("body")
                .append("svg")
                .attr("width", 250)
                .attr("height", 250)
               
                svg.selectAll("circle")
                .b(b).enter()
                .c(c).enter()
                .append("circle")
                .attr("cx", function(d) {return d[0]})
                .attr("cy", function(d) {return d[1]})
                .attr("r", 4)

            }
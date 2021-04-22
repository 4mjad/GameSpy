function Linear(price){
     n =price.length;
     //arrays to store the values of price fro the database
     var x = [n];
     var y =[n];
     var z = [n];
     var a = [n];
     var b = x;
     var c = y;
     x1,y1,x2,y2 =0;
     slope,constant = 0
     //get the sum of all the elements in the array
     for(i=0;i<n;i++)
     {
         x1 =x[i]+x1;
         y1= y[i]+y1;
     }
     //find the mean
     x1 = x1/n;
        y1= y1/n;
        //code for linear regression
        for(j=0;j< n;j++)
        {
            x[j] = x[j]- x1;
            y[j] = y[j] -y1;
        }
        for(k=0;k< n;k++)
        {
           z[k]= x[k]*x[k];

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
        //equation for slope
        slope = x2/y2;
        //to find the constant for the equation of the straight line
        constant = y1/(slope * x1);

        }
   
         
        // graph for the scatter plot for the prices using d3 library
        // https://gramener.github.io/d3js-playbook/scatter.html
        function graph(b,c){
            //svg element to render images and elements
            var svg = d3.select("body")
                .append("svg")
                //sets the coordinates
                .attr("width", 250)
                .attr("height", 250)
                 //for circles
                svg.selectAll("circle")
                .data(b).enter()
                .data(c).enter()
                .append("circle")
                .attr("cx", function(d) {return d[0]})
                .attr("cy", function(e) {return e[0]})
                .attr("r", 4)

            }
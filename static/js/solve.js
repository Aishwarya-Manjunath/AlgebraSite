function LinearSolve() {
    x1 = document.getElementById("Linear_x1").value;
    x2 = document.getElementById("Linear_x2").value;
    x3 = document.getElementById("Linear_x3").value;
    x4 = document.getElementById("Linear_x4").value;
    v1 = document.getElementById("Linear_v1").value;
    v2 = document.getElementById("Linear_v2").value;
    data_to_send = {"x1":x1,"x2":x2,"x3":x3,"x4":x4,"v1":v1,"v2":v2};
  
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
            value = xhr.response;
          res = document.getElementById("LinearResult");
          res.innerHTML = "x = " + value["x"] +" and y = " + value["y"];
      }
    }
    xhr.open('POST', '/solveLinear',true);
    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-Type", 'application/json');
    xhr.send(JSON.stringify(data_to_send));      
  }
  
  function QuadSolve() {
    x1 = document.getElementById("quad_x1").value;
    x2 = document.getElementById("quad_x2").value;
    x3 = document.getElementById("quad_x3").value;
    data_to_send = {"x1":x1,"x2":x2,"x3":x3};
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
  
        if (xhr.readyState == 4 && xhr.status == 200){
            value = xhr.response;
          res = document.getElementById("QuadResult");
          res.innerHTML = "x = " + xhr.response["x1"] + " and " + xhr.response["x2"]; 
      }
    }
    xhr.open('POST', '/solveQuad',true);
    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-Type", 'application/json');
    xhr.send(JSON.stringify(data_to_send));      
  }
  
  
  function Plot() {
    eqn = document.getElementById("plot_eqn").value;
    data_to_send = {"eqn":eqn};
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4 && xhr.status == 200){
          img = document.getElementById('img_plot');
          url = window.URL || window.webkitURL;
          img.src = url.createObjectURL(xhr.response);
          img.style.display = "inline";
  
          clear_button = document.getElementById("clear_button");
          clear_button.style.display = "inline";
  
         }
  }
  xhr.open('POST', '/solvePlot',true);
  xhr.responseType = 'blob';
  xhr.setRequestHeader("Content-Type", 'application/json');
  xhr.send(JSON.stringify(data_to_send));      
  }
  
  function ClearButton(){
      img = document.getElementById("img_plot");
      img.style.display = "none";
      clear_button = document.getElementById("clear_button");
      clear_button.style.display = "none";
  }
  
  function process_tesseract(url) {
      var img = document.getElementById("pic");
      Tesseract.recognize(img)
           .then(function(result) {
              document.getElementById("ocr_results")
                      .innerText = result.text;
                      eqn = result.text.split("\n");
                      if(eqn.length>3){
                          //linear
                          first = eqn[0].split("=");
                          v1 = first[1];
                          x1 = first[0].split("+")[0].split("x")[0];
                          x2 = first[0].split("+")[1].split("y")[0];
  
                          second = eqn[1].split("=");
                          v2 = second[1];
                          x3 = second[0].split("+")[0].split("x")[0];
                          x4 = second[0].split("+")[1].split("y")[0];
  
                          data_to_send = {"x1":x1,"x2":x2,"x3":x3,"x4":x4,"v1":v1,"v2":v2};
  
                          xhr = new XMLHttpRequest();
                          xhr.onreadystatechange = function(){
                          if (xhr.readyState == 4 && xhr.status == 200){
                                    value = xhr.response;
                                  res = document.getElementById("result_ocr");
                                  res.innerHTML = "Result on solving is : x = " + value["x"] +" and y = " + value["y"];
                              }
                          }
                          xhr.open('POST', '/solveLinear',true);
                          xhr.responseType = 'json';
                          xhr.setRequestHeader("Content-Type", 'application/json');
                          xhr.send(JSON.stringify(data_to_send));
  
                          }
                      else{
                          x1 = eqn[0].split("+")[0].split("x")[0];
                          x2 = eqn[0].split("+")[1].split("x")[0];
                          x3 = eqn[0].split("+")[2].split("=")[0];
                          data_to_send = {"x1":x1,"x2":x2,"x3":x3};
                          xhr = new XMLHttpRequest();
                          xhr.onreadystatechange = function(){
  
                          if (xhr.readyState == 4 && xhr.status == 200){
                                value = xhr.response;
                                  res = document.getElementById("result_ocr");
                                  res.innerHTML = "Result on solving is : x = " + xhr.response["x1"] + " and " + xhr.response["x2"]; 
                              }
                            }
                          xhr.open('POST', '/solveQuad',true);
                          xhr.responseType = 'json';
                          xhr.setRequestHeader("Content-Type", 'application/json');
                          xhr.send(JSON.stringify(data_to_send));
  
                      }
          }).progress(function(result) {
          document.getElementById("ocr_status")
          .innerText = result["status"] + " (" +
          (result["progress"] * 100) + "%)";
          });
  }
localStorage['text'] = '';

window.onbeforeunload = function(){
    notepad.sendToBackEnd();
    return 'Are you sure you want to leave?';
};

notepad = {
    saved: false,
    editContent: function(){
        document.getElementById("memo").contentEditable = true;
        document.getElementById("save").disabled = false;
        document.getElementById("edit").disabled = true;
        this.saved = false;
    },
    saveContent: function(){
        document.getElementById("memo").contentEditable = false;
        document.getElementById("edit").disabled = false;
        document.getElementById("save").disabled = true;
        this.storeContent();
    },
    storeContent: function(){
        var innerText = document.getElementById("memo").innerText;
        if(innerText[innerText.length-1] === '\n'){
            innerText = innerText.slice(0,-1) 
        }
        localStorage['text'] = innerText; 
        this.saved = true;
    },
    sendToBackEnd: function(){
        alert(this.saved);
        if(this.saved === false){
            return;
        }
        var req = new XMLHttpRequest();
        req.open('POST', '/memo', false);
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200) {
                console.log("DONE!");
            } 
            else {
                console.log("Trying..");
            }
        }
        req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        req.send("text=" + localStorage['text']); 
    }
};

setInterval(notepad.sendToBackEnd, 600000);

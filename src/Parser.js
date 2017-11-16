function _g(id) {
    return document.getElementById(id);
}

function Stack(){
    this.buff = [];
}
Stack.prototype.push = function(value) {
    this.buff.push(value);
}
Stack.prototype.pop = function() {
    if (this.buff.length == 0) {
        return null;
    }
    n = this.buff.length - 1;
    result = this.buff[n];
    this.buff.splice(n, 1);
    return result;
}
Stack.prototype.peek = function() {
    if (this.buff.length == 0) return null;
    return this.buff[this.buff.length - 1];
}

function calc(f) {
    err="この式はだめだ（′Д`;）";
    f = f.replace(/ |　/g, "");
    if (f.length == 0) {
        return "";
    }

    token = [];
    v = "";
    s = false;
    for (i = 0; i < f.length; i++) {
        c = f[i];
        if (c.match(/[0-9]/)) {
            v = v + c;
            s = false;
        } else if ((c == "+" || c == "-") && s == true) {
            v = (c == "-") ? "-" : v;
            s = false;
        } else {
            switch(c) {
                case "(":
                case "+":
                case "-":
                case "*":
                case "/":
                    s = true;
                case ")":
                    if (v.length > 0) {
                        token.push(v);
                        v = "";
                    }
                    token.push(c);
                    break;
                default:
                    return err;
            }
        }
    }
    if (v.length > 0) {
        token.push(v);
    }

    rf = [];
    st = new Stack();
    for (i = 0; i < token.length; i++) {
        t = token[i];
        if (t.match(/[0-9]/)) {
            rf.push(t);
        } else if (t == ")") {
            while(true) {
                v = st.pop();
                if (v == "(" || v == null) break;
                rf.push(v);
            }
        } else if (t == "(") {
            st.push(t);
        } else {
            while(true) {
                v = st.peek();
                if (v == null) {
                    st.push(t);
                    break;
                }
                if ((t == "+" || t == "-") && (v != "(" || v == ")")) rf.push(st.pop());
                else if ((t == "*" || t == "/") && (v == "*" || v == "/")) rf.push(st.pop());
                else {
                    st.push(t);
                    break;
                }
            }
        }
    }
    while((t = st.pop()) != null) rf.push(t);

    st = new Stack();
    for (i = 0; i < rf.length; i++) {
        t = rf[i];
        if (isNaN((n = parseInt(t, 10)))) {
            o2 = st.pop();
            o1 = st.pop();
            if (o1 == null || o2 == null) return err;
            var block = new Blockly.BlockSvg(workspace, "math_arithmetic");
            block.initSvg();
            block.render();
            o1.outputConnection.connect(block.inputList[0].connection);
            o2.outputConnection.connect(block.inputList[1].connection);
            switch(t) {
                case "+":
                    block.getField("OP").setValue("ADD");
                    st.push(block);
                    break;
                case "-":
                    block.getField("OP").setValue("MINUS");
                    st.push(block);
                    break;
                case "*":
                    block.getField("OP").setValue("MULTIPLY");
                    st.push(block);
                    break;
                case "/":
                    block.getField("OP").setValue("DIVIDE");
                    st.push(block);
                    break;
            }
        } else {
            var block = new Blockly.BlockSvg(workspace, "math_number");
            block.initSvg();
            block.render();

            block.inputList[0].fieldRow[0].setValue(n);
            st.push(block);
        }
    }
    return st.pop();
}

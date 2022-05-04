const pattern_class="class Stack{\r\n    constructor()\r\n    {\r\n        this.stack=null\r\n    }\r\n    Empty()\r\n    {\r\n        return this.stack==null\r\n    }\r\n    Push(value)\r\n    {\r\n        this.stack={\r\n            Value:value,\r\n            Last:this.stack\r\n        }\r\n    }\r\n    Pop()\r\n    {\r\n        var r=this.stack.Value\r\n        this.stack=this.stack.Last\r\n        return r\r\n    }\r\n\tTop()\r\n\t{\r\n\t\treturn this.stack.Value\r\n\t}\r\n}\r\nclass LR_Parser\r\n{\r\n    constructor()\r\n    {\r\n        this.StateStack=null\r\n        this.ValueStack=null\r\n    }\r\n    Init()\r\n    {\r\n        this.StateStack=new Stack()\r\n        this.ValueStack=new Stack()\r\n        this.StateStack.Push(0)\r\n    }\r\n    Error(token)\r\n    {\r\n        console.error(token)\r\n        return null\r\n    }\r\n    Pop(k)\r\n    {\r\n        var values=[]\r\n        for(var i=0;i<k;i++)\r\n        {\r\n            values[k-i-1]=this.ValueStack.Pop()\r\n            this.StateStack.Pop()\r\n        }\r\n        return values\r\n    }\r\n    Parse(tokenizor)\r\n    {\r\n        this.Init()\r\n        var token=tokenizor.Get()\r\n        var symbol=null\r\n        var goto=true\r\n        while(true)\r\n        {\r\n            if(goto){\r\n                switch(this.StateStack.Top())\r\n                {\r\n                    //ShiftCode\r\n                    default:\r\n                        return this.Error(token)\r\n                }\r\n            }\r\n            else\r\n            {\r\n                switch(this.StateStack.Top())\r\n                {\r\n                    //GotoCode\r\n                    default:\r\n                        return this.Error(token)\r\n                }\r\n            }\r\n        }\r\n    }\r\n    //Method\r\n}"

export default function Create_Parser(json,method)
{
    var states=json.States

    var terminals=json.Terminals

    var TerminalDeltas=json.TerminalDeltas

    var StateDeltas=json.StateDeltas

    var Deltas=json.Deltas

    function CreateShift(index)
    {
        var deltas=TerminalDeltas[index]
        var conditions=[]
        terminals.forEach(t=>{
            var delta=deltas.get(t)
            if(delta.Type=='Push'){
                if(index==1&&t=='EOF')conditions.push("if(token.Type=='EOF')return this.ValueStack.Top()")
                else conditions.push("if(token.Type=='"+t+"'){\n\t\t\t\t\t\t\tthis.StateStack.Push("+delta.State.toString()+")\n\t\t\t\t\t\t\tthis.ValueStack.Push(token)\n\t\t\t\t\t\t\tgoto=true\n\t\t\t\t\t\t\ttoken=tokenizor.Get()\n\t\t\t\t\t\t}")
            }
            else if(delta.Type=='Reduce')
            {
                var d=Deltas[delta.Delta]
                var cs=[]
                cs.push("var values=this.Pop("+d.Delta.length.toString()+")")
                cs.push("var $={}")
                cs.push(d.Action)
                cs.push("this.ValueStack.Push($)")
                cs.push('symbol="'+d.State+'"')
                cs.push("goto=false")
                conditions.push("if(token.Type=='"+t+"'){\n\t\t\t\t\t\t\t"+cs.join("\n\t\t\t\t\t\t\t")+"\n\t\t\t\t\t\t}")
            }
        })
        conditions.push("return this.Error(token)")
        return "\t\t\t\t\t\t"+conditions.join("\n\t\t\t\t\t\telse ")
    }

    function CreateGoTo(index)
    {
        var deltas=StateDeltas[index]
        var conditions=[]
        states.forEach(s=>{
            var delta=deltas.get(s)
            if(delta.Type=='Push')
                conditions.push('if(symbol=="'+s+'"){\n\t\t\t\t\t\t\tthis.StateStack.Push('+delta.State.toString()+')\n\t\t\t\t\t\t\tgoto=true\n\t\t\t\t\t\t}')
        })
        conditions.push("return this.Error(token)")
        return "\t\t\t\t\t\t"+conditions.join("\n\t\t\t\t\t\telse ")
    }

    var shift=[]
    var goto=[]
    for(var i=0;i<TerminalDeltas.length;i++)
    {
        shift[i]="case "+i.toString()+":\n"+CreateShift(i)+"\n\t\t\t\t\tbreak;"
        goto[i]="case "+i.toString()+":\n"+CreateGoTo(i)+"\n\t\t\t\t\tbreak;"
    }

    var code=pattern_class.replace("//ShiftCode",shift.join("\n\t\t\t\t\t")).replace("//GotoCode",goto.join("\n\t\t\t\t\t")).replace("//Method",method)
    return code
}
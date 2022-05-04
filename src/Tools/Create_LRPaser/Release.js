import fs from "fs"

var pattern_class=fs.readFileSync("Pattern_Class_Release.js").toString()

var json=JSON.parse(fs.readFileSync("LALR.json"))

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
        var delta=deltas[t]
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
        var delta=deltas[s]
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

var code=pattern_class.replace("//ShiftCode",shift.join("\n\t\t\t\t\t")).replace("//GotoCode",goto.join("\n\t\t\t\t\t"))
fs.writeFileSync("result.js",code)

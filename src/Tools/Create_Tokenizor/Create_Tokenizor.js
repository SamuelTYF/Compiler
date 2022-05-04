import fs from "fs"

var pattern_class=fs.readFileSync("Pattern_Class.js").toString()

var json=JSON.parse(fs.readFileSync("DFA.json"))

var statecount=json.StateCount
var states=json.States
var terminals=json.Terminals.sort()

function CreateState(index)
{
    var state=states[index]
    var deltas=json.Deltas[state]
    var end=json.Ends[state]
    var output=end==null?"return this.Error(char);":("var value=this.Value;"+end.Action+";return this.ReturnToken($);")
    var groups=new Map(states.map(s=>[s,[]]))
    for(var i=0;i<terminals.length;i++)
    if(deltas[terminals[i]]!==null)
    {
        var next=deltas[terminals[i]]
        var first=terminals[i]
        var last=terminals[i]
        for(var j=i+1;j<=terminals.length;j++)
        if(deltas[terminals[j]]!==null&&deltas[terminals[j]]==next&&terminals[j].codePointAt(0)==last.codePointAt(0)+1)
        {
            last=terminals[j]
            i++
        }
        if(first==last)
            groups.get(next).push("char=="+JSON.stringify(last))
        else groups.get(next).push("('"+first+"'<=char && char<='"+last+"')")
    }
    var conditions=[]
    if(index==0)
        conditions.push("if(char=='\0'){$.Type='EOF';return $}")
    for(var i=0;i<statecount;i++){
        var s=states[i]
        if(groups.get(s).length>0)
        {
            var code="if("+groups.get(s).join(" | ")+"){this.Push(char);this.State="+i.toString()+";this.Index++;}"
            conditions.push(code)
        }
    }
    conditions.push("{"+output+"}")
    return "\t\t\t\t\t"+conditions.join("\n\t\t\t\t\telse ")
}

var cases=[]
for(var i=0;i<statecount;i++)
{
    var code="case "+i.toString()+":\n"+CreateState(i)+"\n\t\t\t\tbreak;"
    cases[i]=code
}

var code=pattern_class.replace("//StateCode",cases.join("\n\t\t\t\t"))
fs.writeFileSync("result.js",code)

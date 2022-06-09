const charmap=new Map([
    ['\0','\\0'],
    ['\u0001','\\u0001'],
    ['\u0002','\\u0002'],
    ['\u0003','\\u0003'],
    ['\u0004','\\u0004'],
    ['\u0005','\\u0005'],
    ['\u0006','\\u0006'],
    ['\u0007','\\a'],
    ['\u0008','\\b'],
    ['\u0009','\\t'],
    ['\u000a','\\n'],
    ['\u000b','\\v'],
    ['\u000c','\\f'],
    ['\u000d','\\r'],
    ['\u000e','\\u000e'],
    ['\u000f','\\u000f'],
    ['\s','\\s']
])
export default function CreateGraph(json,method)
{
    console.log(json)

    var statecount=json.StateCount
    var states=json.States
    var terminals=json.Terminals.sort()
    var conditions=[]
    function GetCharMap(char)
    {
        if(charmap.has(char))return charmap.get(char)
        else return char
    }
    function CreateState(index)
    {
        var state=states[index]
        var deltas=json.Deltas[state]
        var end=json.Ends[state]
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
                    groups.get(next).push(GetCharMap(last))
                else groups.get(next).push(GetCharMap(first)+"-"+GetCharMap(last))
            }
        for(var i=0;i<statecount;i++){
            var s=states[i]
            if(groups.get(s).length>0)
            {
                var code="\t"+state+"->"+s+"; [label="+encodeURIComponent(JSON.stringify(groups.get(s).join("")))+"]"
                conditions.push(code)
            }
        }
    }
    for(var i=0;i<statecount;i++)
    CreateState(i)

    var dcs=states.filter(state=>json.Ends[state]!==null)
    var cs=states.filter(state=>json.Ends[state]===null)
    var dcstr="\tnode [width=1,height=1]\n\tnode [shape = doublecircle]\n\t"+dcs.join(",")+";"
    var cstr="\tnode [shape = circle]\n\t"+cs.join(",")+";"
    var cdstr=conditions.join("\n")
    var header="https://g.gravizo.com/svg?\n"+
    "digraph G {\n"+
    "    rankdir = LR\n"+
    "    node [shape = plaintext]\n"+
    "    start;"
    var end="    start -> S0;\n}"
    var code=[header,dcstr,cstr,cdstr,end].join("\n")
    console.log(code)
    return code
}
const pattern_class="class Tokenizor\r\n{\r\n    constructor()\r\n    {\r\n        this.Value=\"\"\r\n        this.String=\"\"\r\n        this.Length=0\r\n        this.Index=0\r\n        this.State=0\r\n    }\r\n    InitValue()\r\n    {\r\n        this.Value=\"\"\r\n    }\r\n    Push(char)\r\n    {\r\n        this.Value+=char\r\n    }\r\n    Error(char)\r\n    {\r\n        console.error(\"Tokenizor Error at State:%s Index:%d Char:%s\",this.State,this.Index,char)\r\n        return null\r\n    }\r\n    StartParse(str)\r\n    {\r\n        this.String=str\r\n        this.Length=str.length\r\n        this.Index=0\r\n        this.State=0\r\n        this.InitValue()\r\n    }\r\n    ReturnToken($)\r\n    {\r\n        this.State=0\r\n        this.InitValue()\r\n        return $\r\n    }\r\n    Get()\r\n    {\r\n        var $={}\r\n        while(this.Index<=this.Length)\r\n        {\r\n            var char=this.Index==this.Length?'\\0':this.String[this.Index]\r\n            switch(this.State)\r\n            {\r\n                //StateCode\r\n                default:\r\n                    return this.Error(char)\r\n            }\r\n        }\r\n    }\r\n    //Method\r\n}"

export default function CreateTokenizor(json,method)
{
    console.log(json)

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
                else groups.get(next).push("("+JSON.stringify(first)+"<=char && char<="+JSON.stringify(last)+")")
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
    var code=pattern_class.replace("//StateCode",cases.join("\n\t\t\t\t")).replace("//Method",method)
    return code
}
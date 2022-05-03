export default class OPG
{
    constructor(deltas)
    {
        var state_set=new Set(deltas.map(d=>d.State))
        console.log("States:",state_set)

        var terminal_set=new Set(Array.prototype.concat(...deltas.map(d=>d.Delta)).filter(t=>!state_set.has(t)))
        console.log("Terminals:",terminal_set)

        var states=Array.from(state_set)
        var terminals=Array.from(terminal_set)
        var state_last=new Map(states.map(s=>[s,new Set()]))
        var terminal_last=new Map(terminals.map(t=>[t,new Set()]))
        for(var i=0;i<deltas.length;i++)
        {
            var state=deltas[i].State
            var delta=deltas[i].Delta
            if(state_set.has(delta[delta.length-1]))
            {
                state_last.get(delta[delta.length-1]).add(state)
                if(delta.length>1&&terminal_set.has(delta[delta.length-2]))
                    terminal_last.get(delta[delta.length-2]).add(state)
            }
            else terminal_last.get(delta[delta.length-1]).add(state)
        }

        var last=new Map(states.map(s=>[s,[]]))
        for(var i=0;i<terminals.length;i++){
            var t=terminals[i]
            var stack=null
            var visit=new Map(states.map(s=>[s,true]))
            function push(value){
                if(visit.get(value))
                {
                    visit.set(value,false)
                    stack={
                        value:value,
                        last:stack
                    }
                }
            }
            function add(set){
                var array=Array.from(set)
                for(var j=0;j<array.length;j++)
                    push(array[j])
            }
            add(terminal_last.get(t))
            while(stack!==null)
            {
                var s=stack.value
                last.get(s).push(t)
                stack=stack.last
                add(state_last.get(s))
            }
        }
        console.log("Last:",last)

        var state_first=new Map(states.map(s=>[s,new Set()]))
        var terminal_first=new Map(terminals.map(t=>[t,new Set()]))
        for(var i=0;i<deltas.length;i++)
        {
            var state=deltas[i].State
            var delta=deltas[i].Delta
            if(state_set.has(delta[0]))
            {
                state_first.get(delta[0]).add(state)
                if(delta.length>1&&terminal_set.has(delta[1]))
                    terminal_first.get(delta[1]).add(state)
            }
            else terminal_first.get(delta[0]).add(state)
        }
        var first=new Map(states.map(s=>[s,[]]))
        for(var i=0;i<terminals.length;i++){
            var t=terminals[i]
            var stack=null
            var visit=new Map(states.map(s=>[s,true]))
            function push(value){
                if(visit.get(value))
                {
                    visit.set(value,false)
                    stack={
                        value:value,
                        first:stack
                    }
                }
            }
            function add(set){
                var array=Array.from(set)
                for(var j=0;j<array.length;j++)
                    push(array[j])
            }
            add(terminal_first.get(t))
            while(stack!==null)
            {
                var s=stack.value
                first.get(s).push(t)
                stack=stack.first
                add(state_first.get(s))
            }
        }
        console.log("First:",first)

        var ops=new Map(terminals.map(f=>[f,new Map(terminals.map(l=>[l,null]))]))

        console.log(ops)

        var error=false
        function SetOp(f,l,op)
        {
            if(ops.get(f).get(l)==null||ops.get(f).get(l)==op)
                ops.get(f).set(l,op)
            else error=true
        }

        for(var i=0;i<deltas.length;i++)
        {
            var state=deltas[i].State
            var delta=deltas[i].Delta
            if(delta.length<2)continue
            var a=delta[0]
            var b=delta[1]
            var index=2
            while(index<=delta.length){
                var c=index<delta.length?delta[index]:null
                if(terminal_set.has(a)&&terminal_set.has(c))
                    SetOp(a,c,'=')
                if(terminal_set.has(a)&&terminal_set.has(b))
                    SetOp(a,b,'=')
                if(terminal_set.has(a)&&state_set.has(b))
                {
                    var array=first.get(b)
                    for(var j=0;j<array.length;j++)
                        SetOp(a,array[j],"<")
                }
                if(state_set.has(a)&&terminal_set.has(b))
                {
                    var array=last.get(a)
                    for(var j=0;j<array.length;j++)
                        SetOp(array[j],b,">")
                }
                if(state_set.has(a)&&state_set.has(b))error=true
                a=b;
                b=c;
                index++;
            }
        }
        this.States=states;
        this.Terminals=terminals;
        this.Deltas=deltas;
        this.First=first;
        this.Last=last;
        this.Ops=ops;
        this.Error=error;
    }
    Print()
    {
        console.log("\t",this.Terminals.join("\t"))
        for(var j=0;j<this.Terminals.length;j++)
        {
            var array=[this.Terminals[j]]
            for(var t=0;t<this.Terminals.length;t++)
                array.push(this.Ops.get(this.Terminals[j]).get(this.Terminals[t]))
            console.log(array.join("\t"))
        }
    }
    GetMarkdown()
    {
        var lines=[]
        lines.push("|   | "+this.Terminals.join(" | ")+" |")
        lines.push("| - | "+this.Terminals.map(t=>"-").join(" | ")+" |")
        var map={
            "<":"$\\lessdot$",
            ">":"$\\gtrdot$",
            "=":"$\\equiv$"
        }
        for(var j=0;j<this.Terminals.length;j++)
        {
            var array=[this.Terminals[j]]
            for(var t=0;t<this.Terminals.length;t++)
                array.push(map[this.Ops.get(this.Terminals[j]).get(this.Terminals[t])])
                lines.push("| "+array.join(" | ")+" |")
        }
        return lines.join("\n")
    }
    ComputePriorityFunction()
    {
        var stack=null
        function Push(value)
        {
            stack={
                Value:value,
                Last:stack
            }
        }
        function Pop()
        {
            var value=stack.Value
            stack=stack.Last
            return value
        }
        var fps=this.Terminals.map(f=>{
            var count=0;
            this.Terminals.map(l=>{
                if(this.Ops.get(f).get(l)=='>')
                    count++;
            })
            var t={Type:'FP',Terminal:f,Count:count,Score:null,Max:null}
            if(count==0)Push(t)
            return t
        })
        var lps=this.Terminals.map(l=>{
            var count=0;
            this.Terminals.map(f=>{
                if(this.Ops.get(f).get(l)=='<')
                    count++;
            })
            var t={Type:'LP',Terminal:l,Count:count,Score:null,Max:null}
            if(count==0)Push(t)
            return t
        })
        console.log(fps)
        console.log(lps)
        while(stack!==null)
        {
            var t=Pop()
            if(t.Type=='FP')
            {
                if(t.Score==null)
                {
                    if(t.Max==null)t.Score=0
                    else t.Score=t.Max+1
                }
                lps.map(lp=>{
                    if(lp.Score==null)
                    {
                        if(this.Ops.get(t.Terminal).get(lp.Terminal)=='=')
                        {
                            lp.Score=t.Score
                        }
                        else if(this.Ops.get(t.Terminal).get(lp.Terminal)=='<')
                        {
                            if(lp.Max==null)lp.Max=t.Score
                            else if(lp.Max<t.Score)lp.Max=t.Score
                            if(--lp.Count==0)Push(lp)
                        }
                    }
                })
            }
            else
            {
                if(t.Score==null)
                {
                    if(t.Max==null)t.Score=0
                    else t.Score=t.Max+1
                }
                fps.map(fp=>{
                    if(fp.Score==null)
                    {
                        if(this.Ops.get(fp.Terminal).get(t.Terminal)=='=')
                        {
                            fp.Score=t.Score
                        }
                        else if(this.Ops.get(fp.Terminal).get(t.Terminal)=='>')
                        {
                            if(fp.Max==null)fp.Max=t.Score
                            else if(fp.Max<t.Score)fp.Max=t.Score
                            if(--fp.Count==0)Push(fp)
                        }
                    }
                })
            }
        }
        console.log(fps)
        console.log(lps)
        var FPs=new Map(fps.map(fp=>[fp.Terminal,fp.Score]))
        var LPs=new Map(lps.map(lp=>[lp.Terminal,lp.Score]))
        console.log(FPs)
        console.log(LPs)
        this.FPs=FPs
        this.LPs=LPs
    }
    GetMarkdownPriorityFunction()
    {
        var lines=[
            "| Type | "+this.Terminals.join(" | ")+" |",
            "| - | "+this.Terminals.map(t=>"-").join(" | ")+" |",
            "| First | "+this.Terminals.map(t=>this.FPs.get(t)).join(" | ")+" |",
            "| Last | "+this.Terminals.map(t=>this.LPs.get(t)).join(" | ")+" |"
        ]
        return lines.join("\n")
    }
    GetJson()
    {
        return {
            States:this.States,
            Terminals:this.Terminals,
            Deltas:this.Deltas,
            Ops:this.Ops
        }
    }
}
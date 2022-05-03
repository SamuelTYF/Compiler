export default class Reg{
    constructor()
    {
        this.StateCount=0;
        this.Deltas=[]
        this.Start=this.CreateState();
        this.End=this.CreateState();
        this.Parsers={
            Add:(start,end,node)=>this.Add(start,end,node),
            Mul:(start,end,node)=>this.Mul(start,end,node),
            Char:(start,end,node)=>this.Char(start,end,node),
            Closure:(start,end,node)=>this.Closure(start,end,node),
            PlusClosure:(start,end,node)=>this.PlusClosure(start,end,node),
            To:(start,end,node)=>this.To(start,end,node),
            Alpha:(start,end,node)=>this.Alpha(start,end,node)
        }
    }
    CreateState()
    {
        return "S"+(this.StateCount++).toString();
    }
    Store(start,terminal,end)
    {
        this.Deltas.push({
            start:start,
            terminal:terminal,
            end:end
        })
    }
    Parse(start,end,node)
    {
        this.Parsers[node.Type](start,end,node);
    }
    Add(start,end,node)
    {
        for(var i=0;i<node.Values.length;i++)
            this.Parse(start,end,node.Values[i]);
    }
    Mul(start,end,node)
    {
        var states=[start];
        for(var i=1;i<node.Values.length;i++)
            states.push(this.CreateState());
        states.push(end);
        for(var i=0;i<node.Values.length;i++)
            this.Parse(states[i],states[i+1],node.Values[i]);
    }
    Char(start,end,node)
    {
        this.Store(start,node.Value,end);
    }
    Closure(start,end,node)
    {
        var state=this.CreateState();
        this.Store(start,null,state);
        this.Parse(state,state,node.Value);
        this.Store(state,null,end);
    }
    PlusClosure(start,end,node)
    {
        var pre=this.CreateState();
        var post=this.CreateState();
        this.Store(start,null,pre);
        this.Parse(pre,post,node.Value);
        this.Store(post,null,pre);
        this.Store(post,null,end);
    }
    To(start,end,node)
    {
        var l=node.Left.Value.charCodeAt(0);
        var r=node.Right.Value.charCodeAt(0);
        for(var i=l;i<=r;i++)
            this.Store(start,String.fromCharCode(i),end);
    }
    Alpha(start,end,node)
    {
        for(var i=0;i<node.Values.length;i++)
            this.Parse(start,end,node.Values[i])
    }
    GetLG()
    {
        var rg=[]
        for(var i=0;i<this.Deltas.length;i++)
        rg.push("("+this.Deltas[i].start+","+this.Deltas[i].terminal+")->"+this.Deltas[i].end);
        return rg;
    }
}
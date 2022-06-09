export default class mDFA
{
    constructor(states,terminals,ends,delta)
    {
        this.States=states;
        this.StateCount=states.length
        this.Terminals=terminals;
        this.TerminalCount=terminals.length
        this.Ends=ends;
        var deltas={}
        for(var i=0;i<states.length;i++)
        {
            var d={}
            for(var j=0;j<terminals.length;j++)
                d[terminals[j]]=null
            deltas[states[i]]=d
        }
        for(var i=0;i<delta.length;i++)
        {
            var start=delta[i].start
            var terminal=delta[i].terminal
            var end=delta[i].end
            deltas[start][terminal]=end
        }
        this.Deltas=deltas;
    }
    LG()
    {
        var se={}
        for(var i=0;i<this.StateCount;i++)
            se[this.States[i]]=this.Ends[this.States[i]]!==null
        var e={}
        for(var i=0;i<this.StateCount;i++)
        {
            var count=0;
            for(var j=0;j<this.TerminalCount;j++)
                if(this.Deltas[this.States[i]][this.Terminals[j]]!==null)
                    count++;
            e[this.States[i]]=count;
        }
        var lg=[]
        for(var i=0;i<this.StateCount;i++)
        {
            var r=[]
            for(var j=0;j<this.TerminalCount;j++)
                if(this.Deltas[this.States[i]][this.Terminals[j]]!==null&&e[this.Deltas[this.States[i]][this.Terminals[j]]]!=0)
                    r.push(this.Terminals[j]+this.Deltas[this.States[i]][this.Terminals[j]])
            for(var j=0;j<this.TerminalCount;j++)
                if(this.Deltas[this.States[i]][this.Terminals[j]]!==null&&se[this.Deltas[this.States[i]][this.Terminals[j]]])
                    r.push(this.Terminals[j])
            if(r.length==0)continue
            if(this.Ends[i])lg.push("*"+this.States[i]+"->"+r.join("|"))
            else lg.push(this.States[i]+"->"+r.join("|"))
        }
        return{
            States:this.States.join(","),
            Terminals:this.Terminals.join(","),
            Deltas:lg,
            Ends:this.Ends
        }
    }
}
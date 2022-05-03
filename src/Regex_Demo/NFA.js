import DFA from "./DFA";
export default class NFA
{
    constructor(states,terminals,start,ends)
    {
        var deltas={}
        var statecount=states.length;
        var terminalcount=terminals.length;
        for(var i=0;i<statecount;i++)
        {
            var d={}
            for(var j=0;j<terminalcount;j++)
                d[terminals[j]]=[]
            deltas[states[i]]=d;
        }
        this.States=states;
        this.Terminals=terminals;
        this.Start=start;
        this.Ends=ends;
        this.StateCount=statecount;
        this.TerminalCount=terminalcount;
        this.Deltas=deltas;
    }
    set(start,terminal,end)
    {
        if(this.Deltas[start][terminal].indexOf(end)==-1)
            this.Deltas[start][terminal].push(end)
    }
    ToDFA()
    {
        var start=[this.Start]
        var hashs=[start.toString()]
        var stacks=[start]
        var delta=[]
        var states=["S0"]
        var ends=[this.Ends.indexOf(this.Start)!==-1]
        for(var i=0;i<stacks.length;i++)
        {
            var now=stacks[i];
            for(var j=0;j<this.TerminalCount;j++)
            {
                var t=this.Terminals[j];
                var s=[]
                for(var k=0;k<now.length;k++)
                    for(var p=0;p<this.Deltas[now[k]][t].length;p++)
                        if(s.indexOf(this.Deltas[now[k]][t][p])==-1)
                            s.push(this.Deltas[now[k]][t][p])
                if(s.length==0)continue
                s.sort();
                var index=hashs.indexOf(s.toString())
                if(index==-1)
                {
                    index=stacks.length
                    hashs.push(s.toString())
                    stacks.push(s)
                    var ended=false
                    for(var k=0;k<s.length;k++)
                        if(this.Ends.indexOf(s[k])!==-1)
                            ended=true;
                    ends.push(ended)
                    states.push("S"+index.toString())
                }
                delta.push({
                    start:"S"+i.toString(),
                    terminal:t,
                    end:"S"+index.toString()
                })
            }
        }
        return new DFA(states,this.Terminals,ends,delta)
    }
}
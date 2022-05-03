import NFA from "./NFA"
export default class ENFA
{
    constructor(Start,End,Deltas)
    {
        var states=[]
        var terminals=[]
        var deltas={}
        var nullclosure={}
        var nullback={}
        var connect={}
        for(var i=0;i<Deltas.length;i++)
        {
            var s=Deltas[i].start
            var t=Deltas[i].terminal
            var e=Deltas[i].end
            if(states.indexOf(s)==-1)
                states.push(s)
            if(states.indexOf(e)==-1)
                states.push(e)
            if(t!==null&&terminals.indexOf(t)==-1)
                terminals.push(t)
        }
        var statecount=states.length;
        var terminalcount=terminals.length;
        for(var i=0;i<statecount;i++){
            nullclosure[states[i]]=[states[i]]
            nullback[states[i]]=[states[i]]
            var c={}
            for(var j=0;j<statecount;j++)
                c[states[j]]=false;
            c[states[i]]=true;
            connect[states[i]]=c
            var d={}
            for(var j=0;j<terminalcount;j++)
                d[terminals[j]]=[];
            deltas[states[i]]=d
        }
        
        for(var i=0;i<Deltas.length;i++)
        {
            var s=Deltas[i].start
            var t=Deltas[i].terminal
            var e=Deltas[i].end
            if(t==null)
            {
                if(!connect[s][e])
                {
                    var backword=nullback[s]
                    var forword=nullclosure[e]
                    for(var j=0;j<backword.length;j++)
                    for(var k=0;k<forword.length;k++)
                    if(!connect[backword[j]][forword[k]])
                    {
                        connect[backword[j]][forword[k]]=true
                        nullclosure[backword[j]].push(forword[k])
                        nullback[forword[k]].push(backword[j])
                    }
                }
            }
            else
            {
                if(deltas[s][t].indexOf(e)==-1)
                    deltas[s][t].push(e)
            }
        }
        var ends=[]
        for(var i=0;i<End.length;i++)
        {
            var end=End[i];
            if(ends.indexOf(end)==-1)
            {
                ends.push(end)
                if(connect[Start][end]&&ends.indexOf(Start)==-1)
                    ends.push(Start)
            }
        }
        this.StateCount=statecount;
        this.TerminalCount=terminalcount;
        this.States=states;
        this.Terminals=terminals;
        this.Connnect=connect;
        this.Closure=nullclosure;
        this.Deltas=deltas;
        this.Start=Start;
        this.End=ends;
    }
    ToNFA()
    {
        var nfa=new NFA(this.States,this.Terminals,this.Start,this.End)
        for(var i=0;i<this.StateCount;i++)
            for(var j=0;j<this.TerminalCount;j++)
            {
                var delta=this.Deltas[this.States[i]][this.Terminals[j]];
                for(var k=0;k<delta.length;k++)
                {
                    var v=delta[k];
                    for(var m=0;m<this.Closure[v].length;m++)
                        nfa.set(this.States[i],this.Terminals[j],this.Closure[v][m])
                }
                var closure=this.Closure[this.States[i]];
                for(var k=0;k<closure.length;k++)
                {
                    var d=this.Deltas[closure[k]][this.Terminals[j]];
                    for(var m=0;m<d.length;m++)
                    {
                        var c=this.Closure[d[m]]
                        for(var n=0;n<c.length;n++)
                            nfa.set(this.States[i],this.Terminals[j],c[n])
                    }
                }
            }
        return nfa;
    }
}
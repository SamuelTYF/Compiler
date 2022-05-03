import RegParser from "../Version6/RegParser"
import NFA from "../Version2/NFA"
export default class Regs
{
    constructor(json)
    {
        var parser=new RegParser()
        var rules=[]
        for(var reg in json)
        {
            rules.push({
                dfa:parser.Parse(reg).dfas,
                action:json[reg]
            })
        }
        this.Rules=rules;
    }
    Build()
    {
        var count=0;
        var start="S"+(count++).toString();
        var states=[start]
        var ends={}
        ends[start]=null;
        var deltas=[]
        var terminals=[]
        for(var i=0;i<this.Rules.length;i++)
        {
            var rule=this.Rules[i];
            var dfa=rule.dfa;
            var map={};
            map[dfa.States[0]]=start;
            for(var j=0;j<dfa.TerminalCount;j++)
                if(terminals.indexOf(dfa.Terminals[j])==-1)
                    terminals.push(dfa.Terminals[j])
            for(var j=1;j<dfa.StateCount;j++)
            {
                var state="S"+(count++).toString();
                states.push(state);
                map[dfa.States[j]]=state;
                if(dfa.Ends[j])ends[state]={
                    Group:i,
                    Action:rule.action
                }
                else ends[state]=null
            }
            for(var j=0;j<dfa.StateCount;j++)
            for(var t=0;t<dfa.TerminalCount;t++)
            if(dfa.Deltas[dfa.States[j]][dfa.Terminals[t]]!==null)
                deltas.push({
                    Start:map[dfa.States[j]],
                    Terminal:dfa.Terminals[t],
                    End:map[dfa.Deltas[dfa.States[j]][dfa.Terminals[t]]]
                })
        }
        console.log(states)
        console.log(terminals)
        console.log(deltas)
        console.log(ends)
        var nfa=new NFA(states,terminals,start,ends);
        for(var i=0;i<deltas.length;i++)
            nfa.set(deltas[i].Start,deltas[i].Terminal,deltas[i].End);
        return nfa;
    }
}
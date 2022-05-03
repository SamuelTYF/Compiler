import Stack from "./Stack"
import State from "./State"
class ValueSet
{
    constructor()
    {
        this.Values=[]
    }
    Add(value)
    {
        if(this.Values.indexOf(value)==-1)
        {
            this.Values.push(value);
            return true;
        }else return false;
    }
    AddRange(values)
    {
        var update=false;
        for(var i=0;i<values.length;i++)
            update|=this.Add(values[i]);
        return update;
    }
}
export default class LR1{
    constructor(deltas)
    {
        this.Deltas=deltas

        var state_set=new Set(deltas.map(d=>d.State))
        console.log("States:",state_set)

        var terminal_set=new Set(Array.prototype.concat(...deltas.map(d=>d.Delta)).filter(t=>!state_set.has(t)))
        console.log("Terminals:",terminal_set)

        var states=Array.from(state_set)
        var terminals=Array.from(terminal_set)

        for(var i=0;i<deltas.length;i++){
            deltas[i].Index=i
            deltas[i].Closures=[]
            for(var j=0;j<=deltas[i].Delta.length;j++)
                deltas[i].Closures[j]=new Map(terminals.map(t=>[t,new Set()]))
        }

        var firsts={}
        var firststates={}
        for(var i=0;i<states.length;i++){
            firsts[states[i]]=new ValueSet()
            firststates[states[i]]=new ValueSet();
        }
        while(true)
        {
            var update=false;
            for(var i=0;i<deltas.length;i++)
            {
                var state=deltas[i].State;
                var set=firsts[state];
                var delta=deltas[i].Delta;
                if(terminal_set.has(delta[0]))
                {
                    if(set.Add(delta[0]))
                        update=true;
                }
                else
                {
                    if(set.AddRange(firsts[delta[0]].Values))
                        update=true;
                    if(firststates[state].Add(delta[0]))
                        update=true;
                    if(firststates[state].AddRange(firststates[delta[0]].Values))
                        update=true;
                }
            }
            if(!update)break;
        }
        console.log(firsts)
        var follows={}
        var followstates={}
        for(var i=0;i<states.length;i++){
            follows[states[i]]=new ValueSet();
            followstates[states[i]]=new ValueSet();
        }
        while(true)
        {
            var update=false;
            for(var i=0;i<deltas.length;i++)
            {
                var state=deltas[i].State;
                var delta=deltas[i].Delta;
                var last=new ValueSet();
                var laststate=new ValueSet();
                var sfollow=follows[state];
                last.AddRange(sfollow.Values);
                laststate.AddRange(followstates[state]);
                for(var j=delta.length-1;j>=0;j--)
                {
                    if(terminal_set.has(delta[j])){
                        last.Values=[delta[j]]
                        laststate.Values=[]
                    }
                    else
                    {
                        var first=firsts[delta[j]]
                        var follow=follows[delta[j]]
                        if(follow.AddRange(last.Values))update=true;
                        if(followstates[delta[j]].AddRange(laststate.Values))update=true
                        last.Values=[];
                        laststate.Values=[delta[j]]
                        last.AddRange(first.Values);
                        laststate.AddRange(firststates[delta[j]].Values)
                    }
                }
            }
            if(!update)break;
        }
        console.log(follows)

        var deltamap=new Map(states.map(s=>[s,deltas.filter(d=>d.State==s)]))

        var startstate=new State(deltas[0],0,null)

        var closures=[]

        class Closure
        {
            constructor(index)
            {
                this.Index=index
                this.visit=deltas.map(d=>new Map(terminals.map(t=>[t,true])))
                this.SuccessStates=[]
                this.TerminalStates=[]
                this.StateStates=[]
            }
            AddState(state)
            {
                if(state.Predict!==null)
                state.Closures[state.Offset].get(state.Predict).add(this.Index)
                if(state.End())
                    this.SuccessStates.push(state)
                else if(terminal_set.has(state.Next()))
                {
                    if(state.Offset==0)
                        this.visit[state.Index].push(state.Predict,false)
                    this.TerminalStates.push(state)
                }
                else
                {
                    if(state.Offset==0)
                        this.visit[state.Index].set(state.Predict,false)
                    this.StateStates.push(state)
                    var stack=new Stack()
                    deltamap.get(state.Next()).forEach(value=>{
                        var np=state.NextPredict(terminal_set,firsts)
                        for(var i=0;i<np.length;i++){
                            if(this.visit[value.Index].get(np[i])){
                                this.visit[value.Index].set(np[i],false)
                                stack.Push(new State(value,0,np[i]))
                            }
                        }
                    })
                    while(!stack.Empty())
                    {
                        state=stack.Pop()
                        if(terminal_set.has(state.First()))this.TerminalStates.push(state)
                        else
                        {
                            this.StateStates.push(state)
                            deltamap.get(state.First()).forEach(value=>{
                                var np=state.FirstPredict(terminal_set,firsts)
                                for(var i=0;i<np.length;i++)
                                    if(this.visit[value.Index].get(np[i])){
                                        this.visit[value.Index].set(np[i],false)
                                        stack.Push(new State(value,0,np[i]))
                                    }
                            })
                        }
                    }
                }
            }
            GetMap()
            {
                var statemap=new Map(states.map(s=>{
                    var states=Array.from(this.StateStates).filter(state=>state.Next()==s).map(state=>state.NextState())
                    if(states.length==0)return [s,null]
                    else{
                        var closure=CreateClosure(states)
                        return [s,closure]
                    }
                }))
                var terminalmap=new Map(terminals.map(t=>{
                    var states=Array.from(this.TerminalStates).filter(state=>state.Next()==t).map(state=>state.NextState())
                    if(states.length==0)return [t,null]
                    else{
                        var closure=CreateClosure(states)
                        return [t,closure]
                    }
                }))
                return [statemap,terminalmap,Array.from(this.SuccessStates)]
            }
            Print()
            {
                return Array.prototype.concat(
                    Array.from(this.SuccessStates).map(state=>state.Print()),
                    Array.from(this.StateStates).map(state=>state.Print()),
                    Array.from(this.TerminalStates).map(state=>state.Print())
                ).join("\n")
            }
        }

        function CreateClosure(states)
        {
            var set=closures.map(closure=>closure.Index)
            for(var i=0;i<states.length;i++)
            {
                var cs=states[i].Predict==null?new Set():states[i].CurrentClosure()
                set=set.filter(closure=>cs.has(closure))
            }
            if(set.length>1)console.log("Error",set)
            else if(set.length==1)return closures[set[0]]

            var closure=new Closure(closures.length)
            for(var i=0;i<states.length;i++)
                closure.AddState(states[i])
            closures.push(closure)
            return closure
        }

        CreateClosure([startstate])

        var closuremaps=[]

        for(var i=0;i<closures.length;i++)
            closuremaps.push(closures[i].GetMap())

        console.log(closuremaps)

        this.Terminals=terminals
        this.States=states

        this.TerminalDeltas=closuremaps.map(closuremap=>new Map(terminals.map(key=>{
            var value=closuremap[1].get(key)
            var su=closuremap[2].filter(s=>s.Predict==key)
            if(value==null){

                if(su.length==1)
                    return [key,{Type:"Reduce",Delta:su[0].Index}]
                else if(su.length>1)return [key,{Type:"Error",Info:"Conflict"}]
                else return [key,{Type:"Error"}]
            }
            else
            {
                if(su.length>0)
                    return [key,{Type:"Error",Info:"Conflict"}]
                else return [key,{Type:"Push",State:value.Index}]
            }
        })))
        
        this.StateDeltas=closuremaps.map(closuremap=>new Map(states.map(key=>{
            var value=closuremap[0].get(key)
            if(value==null)return [key,{Type:"Error"}]
            else return [key,{Type:"Push",State:value.Index}]
        })))

        this.Closures=closures
        this.Firsts=firsts
        this.FirstStates=firststates
        this.Follows=follows
        this.FollowStates=followstates
    }
    Print()
    {
        for(var i=0;i<this.Closures.length;i++)
            console.log(this.Closures[i].Print())
    }
    GetJson()
    {
        var StateDeltas=this.StateDeltas.map(deltas=>{
            var r={}
            this.States.map(s=>r[s]=deltas.get(s))
            return r
        })
        var TerminalDeltas=this.TerminalDeltas.map(deltas=>{
            var r={}
            this.Terminals.map(t=>r[t]=deltas.get(t))
            return r
        })
        var Deltas=this.Deltas.map(delta=>{
            return {
                State:delta.State,
                Delta:delta.Delta,
                Action:delta.Action
            }
        })
        return {
            States:this.States,
            Terminals:this.Terminals,
            StateDeltas:StateDeltas,
            TerminalDeltas:TerminalDeltas,
            Deltas:Deltas
        }
    }
}

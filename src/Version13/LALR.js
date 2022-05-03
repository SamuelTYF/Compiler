import Stack from "./Stack"
import State from "./State"
import ValueSet from "./ValueSet"

export default class LALR{
    constructor(deltas)
    {
        this.Deltas=deltas
        for(var i=0;i<deltas.length;i++){
            deltas[i].Index=i
            deltas[i].Closures=[]
            for(var j=0;j<=deltas[i].Delta.length;j++)
                deltas[i].Closures[j]=new Set()
        }

        var state_set=new Set(deltas.map(d=>d.State))
        console.log("States:",state_set)

        var terminal_set=new Set(Array.prototype.concat(...deltas.map(d=>d.Delta)).filter(t=>!state_set.has(t)))
        console.log("Terminals:",terminal_set)

        var states=Array.from(state_set)
        var terminals=Array.from(terminal_set)

        var firsts={}
        var firststates={}
        for(var i=0;i<states.length;i++){
            firsts[states[i]]=new ValueSet()
            firsts[states[i]].Epsilon=false;
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
                var epsilon=true;
                for(var j=0;j<delta.length;j++)
                {
                    if(terminal_set.has(delta[j]))
                    {
                        if(set.Add(delta[j]))
                            update=true;
                        epsilon=false;
                        break;
                    }
                    else
                    {
                        var t=firsts[delta[j]]
                        if(set.AddRange(t.Values))
                            update=true;
                        if(firststates[state].Add(delta[j]))
                            update=true;
                        if(firststates[state].AddRange(firststates[delta[j]].Values))
                            update=true;
                        if(!t.Epsilon){
                            epsilon=false;
                            break;
                        }
                    }
                }
                if(!set.Epsilon&&epsilon)
                {
                    set.Epsilon=true;
                    update=true;
                }
            }
            if(!update)break;
        }
        console.log(firsts)

        var deltamap=new Map(states.map(s=>[s,deltas.filter(d=>d.State==s)]))

        var closures=[]

        var statemap=deltas.map(d=>{
            var t=[]
            for(var i=0;i<=d.Delta.length;i++)
                t[i]=new Set()
            return t
        })

        class Closure
        {
            constructor(index)
            {
                this.Index=index
                this.SuccessStates=[]
                this.TerminalStates=[]
                this.StateStates=[]
                this.Length=0
            }
            AddState(ss)
            {
                var ds=deltas.map(d=>{
                    var t=[]
                    for(var i=0;i<=d.Delta.length;i++)
                        t[i]=null;
                    return t
                })
                var visit=deltas.map(_=>true)
                
                ss.forEach(s=>{
                    statemap[s.Index][s.Offset].add(this.Index)
                    ds[s.Index][s.Offset]=s
                    if(s.End())this.SuccessStates.push(s)
                    else if(terminal_set.has(s.Next()))this.TerminalStates.push(s)
                    else{
                        this.StateStates.push(s)
                        var stack=new Stack()
                        stack.Push(s)
                        while(!stack.Empty())
                        {
                            var state=stack.Pop();
                            if(!state.End()&&!terminal_set.has(state.Next())){
                                var nextpredict=state.NextPredict(terminal_set,firsts)
                                deltamap.get(state.Next()).map(d=>{
                                    if(ds[d.Index][0]==null)
                                    {
                                        var newstate=new State(d,0)
                                        newstate.Predicts.AddRange(nextpredict)
                                        statemap[d.Index][0].add(this.Index)
                                        ds[d.Index][0]=newstate
                                        if(newstate.End())this.SuccessStates.push(newstate)
                                        else if(terminal_set.has(newstate.Next()))this.TerminalStates.push(newstate)
                                        else this.StateStates.push(newstate)
                                        stack.Push(newstate)
                                    }
                                    else
                                    {
                                        if(ds[d.Index][0].Predicts.AddRange(nextpredict)&&visit[d.Index])
                                        {
                                            visit[d.Index]=false
                                            stack.Push(ds[d.Index][0])
                                        }
                                    }
                                    if(state.NextEnd()&&!state.Nexts.includes(ds[d.Index][0]))
                                    state.Nexts.push(ds[d.Index][0])
                                })
                            }
                            if(state.Offset==0)visit[state.Index]=true
                        }
                    }
                })
                this.Deltas=ds
                this.Length=this.SuccessStates.filter(state=>state.Offset!==0).length+this.StateStates.filter(state=>state.Offset!==0).length+this.TerminalStates.filter(state=>state.Offset!==0).length
            }
            GetMap()
            {
                var smap=new Map(states.map(s=>{
                    var states=Array.from(this.StateStates).filter(state=>state.Next()==s).map(state=>{
                        return{
                            Index:state.Index,
                            Offset:state.Offset+1,
                            Last:state
                        }
                    })
                    if(states.length==0)return [s,null]
                    else{
                        var closure=CreateClosure(states)
                        return [s,closure]
                    }
                }))
                var tmap=new Map(terminals.map(t=>{
                    var states=Array.from(this.TerminalStates).filter(state=>state.Next()==t).map(state=>{
                        return{
                            Index:state.Index,
                            Offset:state.Offset+1,
                            Last:state
                        }
                    })
                    if(states.length==0)return [t,null]
                    else{
                        var closure=CreateClosure(states)
                        return [t,closure]
                    }
                }))
                return [smap,tmap,Array.from(this.SuccessStates)]
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

        function CreateClosure(modes)
        {
            var set=closures.map(closure=>closure.Index)
            modes.forEach(mode=>{
                var cs=statemap[mode.Index][mode.Offset]
                set=set.filter(closure=>cs.has(closure))
            })
            var cs=set.map(index=>closures[index]).filter(c=>c.Length==modes.length)

            if(cs.length>1)console.log("Error",cs)
            else if(cs.length==1){
                var closure=cs[0]
                modes.forEach(mode=>{
                    var state=closure.Deltas[mode.Index][mode.Offset]
                    if(mode.Last!==null)
                        mode.Last.Nexts.push(state)
                })
                return closure
            }

            var states=modes.map(mode=>{
                var state=new State(deltas[mode.Index],mode.Offset)
                if(mode.Last!==null)
                    mode.Last.Nexts.push(state)
                return state
            })
            var closure=new Closure(closures.length)
            closure.AddState(states)
            closures.push(closure)
            return closure
        }

        CreateClosure([{
            Index:0,
            Offset:0,
            Last:null
        }])

        var closuremaps=[]

        for(var i=0;i<closures.length;i++)
            closuremaps.push(closures[i].GetMap())

        console.log(closuremaps)

        var stack=new Stack()

        var closurestates=Array.prototype.concat(...closures.map(c=>Array.prototype.concat(c.SuccessStates,c.TerminalStates,c.StateStates)))

        closurestates.forEach(c=>{
            if(c.Visit)
                c.Nexts.forEach(n=>{
                    if(n.Predicts.AddRange(c.Predicts.Values)&&n.Visit)
                    {
                        stack.Push(n)
                        n.Visit=false
                    }
                })
        })

        while(!stack.Empty())
        {
            var state=stack.Pop()
            state.Nexts.forEach(n=>{
                if(n.Predicts.AddRange(state.Predicts.Values)&&n.Visit)
                {
                    stack.Push(n)
                    n.Visit=false
                }
            })
            state.Visit=true
        }

        this.Terminals=terminals
        this.States=states

        this.TerminalDeltas=closuremaps.map(closuremap=>new Map(terminals.map(key=>{
            var value=closuremap[1].get(key)
            var su=closuremap[2].filter(s=>s.Predicts.Has(key))
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

        console.log(closures)
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

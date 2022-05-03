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
export default class LALR{
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
            for(var j=0;j<=deltas[i].Delta.length;j++){
                deltas[i].Closures[j]=new Map(terminals.map(t=>[t,new Set()]))
                deltas[i].Closures[j].set(null,new Set())
            }
        }

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
                state.Closures[state.Offset].get(state.Predict).add(this.Index)
                if(state.End())
                {
                    this.SuccessStates.push(state)
                    if(state.Epsilon())return
                }
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
                        if(state.End())this.SuccessStates.push(state)
                        else if(terminal_set.has(state.First()))this.TerminalStates.push(state)
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
                    Array.from(this.SuccessStates),
                    Array.from(this.StateStates),
                    Array.from(this.TerminalStates)
                ).sort((a,b)=>{
                    if(a.Offset==b.Offset)
                        return a.Indeb.Index?1:-1
                    else return a.Offset>b.Offset?1:-1
                }).map(s=>s.Print()).join("\n")
            }
            GetStateCount()
            {
                var visit=deltas.map(delta=>{
                    var r=[]
                    for(var i=0;i<=delta.Delta.length;i++)
                        r[i]=true
                    return r
                })
                var count=0;
                var ss=Array.prototype.concat(this.StateStates,this.SuccessStates,this.TerminalStates)
                ss.forEach(s=>{
                    if(visit[s.Index][s.Offset])
                    {
                        count++;
                        visit[s.Index][s.Offset]=false
                    }
                })
                return count
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

        console.log(closures)

        var closuretype=closures.map(closure=>-1)

        var lalrclosure=[]

        class LALRClosure{
            constructor(index,closures)
            {
                console.log(index,closures)
                this.Index=index
                this.SourceClosures=closures
                var visit=deltas.map(delta=>{
                    var r=[]
                    for(var i=0;i<=delta.Delta.length;i++)
                    {
                        r[i]=new Map(terminals.map(t=>[t,true]))
                        r[i].set(null,true)
                    }
                    return r
                })
                var ls=[]
                closures.map(closure=>{
                    var ss=Array.prototype.concat(closure.StateStates,closure.SuccessStates,closure.TerminalStates)
                    ss.forEach(s=>{
                        if(visit[s.Index][s.Offset].get(s.Predict))
                        {
                            ls.push(new State(deltas[s.Index],s.Offset,s.Predict))
                            visit[s.Index][s.Offset].set(s.Predict,false)
                        }
                    })
                })
                this.States=ls
            }
            Print()
            {
                return this.States.map(state=>state.Print()).join("\n")
            }
        }

        function ToLALRClosure(index,closureindexs)
        {
            return new LALRClosure(index,closureindexs.map(closureindex=>closures[closureindex]))
        }

        function GetClosure(state)
        {
            var m=state.Closures[state.Offset]
            var keys=Array.from(m.keys())
            return Array.prototype.concat(...keys.map(key=>Array.from(m.get(key))))
        }

        function CreateLALRClosure(closure)
        {
            var ss=Array.prototype.concat(closure.StateStates,closure.SuccessStates,closure.TerminalStates).filter(s=>s.Offset!==0)
            ss.sort((a,b)=>{
                if(a.Index==b.Index)return a.Offset<b.Offset?1:-1
                else return a.Index<b.Index?1:-1
            })
            var lastindex=ss[0].Index
            var lastoffset=ss[0].Offset
            var tc=new ValueSet()
            var cs=new Set(closures.map(closure=>closure.Index))
            tc.AddRange(Array.from(GetClosure(ss[0])))
            for(var i=1;i<ss.length;i++)
                if(ss[i].Index!==lastindex||ss[i].Offset!==lastoffset)
                {
                    cs=new Set(tc.Values.filter(t=>cs.has(t)))
                    tc=new ValueSet()
                    tc.AddRange(Array.from(GetClosure(ss[0])))
                }
                else tc.AddRange(Array.from(GetClosure(ss[i])))
            cs=tc.Values.filter(t=>cs.has(t))
            cs=cs.filter(c=>closures[c].GetStateCount()==closure.GetStateCount())
            cs.forEach(c=>closuretype[c]=lalrclosure.length)
            lalrclosure.push(ToLALRClosure(lalrclosure.length,cs))
        }

        lalrclosure.push(ToLALRClosure(0,[0]))

        closuretype[0]=0

        for(var i=1;i<closures.length;i++)
            if(closuretype[i]==-1)
                CreateLALRClosure(closures[i])

        console.log(lalrclosure)

        var lalrclosuremap=[]

        for(var i=0;i<lalrclosure.length;i++)
        {
            var maps=lalrclosure[i].SourceClosures.map(closure=>closuremaps[closure.Index])
            console.log(maps)
            var tmap=new Map(terminals.map(t=>[t,null]))
            var smap=new Map(states.map(s=>[s,null]))
            var ss=[]
            var visit=deltas.map(delta=>{
                var r=[]
                for(var i=0;i<=delta.Delta.length;i++)
                {
                    r[i]=new Map(terminals.map(t=>[t,true]))
                    r[i].set(null,true)
                }
                return r
            })
            maps.map(m=>{
                terminals.forEach(t=>{
                    if(m[1].get(t)!==null)
                    {
                        if(tmap.get(t)==null)tmap.set(t,lalrclosure[closuretype[m[1].get(t).Index]])
                        else{
                            if(tmap.get(t).Index!==closuretype[m[1].get(t).Index])
                                console.error(tmap.get(t).Index,closuretype[m[1].get(t).Index])
                        }
                    }
                })
                states.forEach(s=>{
                    if(m[0].get(s)!==null)
                    {
                        if(smap.get(s)==null)smap.set(s,lalrclosure[closuretype[m[0].get(s).Index]])
                        else{
                            if(smap.get(s).Index!==closuretype[m[0].get(s).Index])
                                console.error(smap.get(0).Index,closuretype[m[0].get(s).Index])
                        }
                    }
                })
                m[2].forEach(s=>{
                    if(visit[s.Index][s.Offset].get(s.Predict))
                    {
                        ss.push(s)
                        visit[s.Index][s.Offset].set(s.Predict,false)
                    }
                })
            })
            lalrclosuremap[i]=[smap,tmap,ss]
        }

        console.log(lalrclosuremap)


        closures=lalrclosure
        closuremaps=lalrclosuremap

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

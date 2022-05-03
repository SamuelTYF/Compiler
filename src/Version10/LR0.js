import Stack from "./Stack"
import State from "./State"
export default class LR0{
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

        var deltamap=new Map(states.map(s=>[s,deltas.filter(d=>d.State==s)]))

        var startstate=new State(deltas[0],0)

        var closures=[]

        class Closure
        {
            constructor(index)
            {
                this.Index=index
                this.visit=deltas.map(d=>true)
                this.SuccessStates=new Set()
                this.TerminalStates=new Set()
                this.StateStates=new Set()
            }
            AddState(state)
            {
                console.log("Add",this.Index,state)
                state.Closures[state.Offset].add(this.Index)
                if(state.End())
                    this.SuccessStates.add(state)
                else if(terminal_set.has(state.Next()))
                {
                    if(state.Offset==0)this.visit[state.Index]=false
                    this.TerminalStates.add(state)
                }
                else
                {
                    if(state.Offset==0)this.visit[state.Index]=false
                    this.StateStates.add(state)
                    var stack=new Stack()
                    deltamap.get(state.Next()).forEach(value=>{
                        if(this.visit[value.Index]){
                            this.visit[value.Index]=false
                            stack.Push(new State(value,0))
                        }
                    })
                    while(!stack.Empty())
                    {
                        state=stack.Pop()
                        if(terminal_set.has(state.First()))this.TerminalStates.add(state)
                        else
                        {
                            this.StateStates.add(state)
                            deltamap.get(state.First()).forEach(value=>{
                                if(this.visit[value.Index]){
                                    this.visit[value.Index]=false
                                    stack.Push(new State(value,0))
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
                var cs=states[i].CurrentClosure()
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
            if(value==null){
                if(closuremap[2].length==1)
                    return [key,{Type:"Reduce",Delta:closuremap[2][0].Index}]
                else return [key,{Type:"Error"}]
            }
            else return [key,{Type:"Push",State:value.Index}]
        })))
        
        this.StateDeltas=closuremaps.map(closuremap=>new Map(states.map(key=>{
            var value=closuremap[0].get(key)
            if(value==null){
                if(closuremap[2].length==1)
                    return [key,{Type:"Reduce",Delta:closuremap[2][0].Index}]
                else return [key,{Type:"Error"}]
            }
            else return [key,{Type:"Push",State:value.Index}]
        })))

        this.Closures=closures
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
                Delta:delta.Delta
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

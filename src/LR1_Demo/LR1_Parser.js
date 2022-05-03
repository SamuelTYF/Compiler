export default class LR1_Parser{
    constructor(json)
    {
        this.States=json.States
        this.Terminals=json.Terminals
        this.StateDeltas=json.StateDeltas
        this.TerminalDeltas=json.TerminalDeltas
        this.Deltas=json.Deltas
        this.InnerAction=false
    }
    Build()
    {
        this.InnerAction=true
        function Create_Action(count,action)
        {
            var s="($0";
            for(var i=1;i<count;i++)
                s+=",$"+i.toString()
            s+=")=>{"+action+";}"
            return eval(s);
        }
        for(var i=0;i<this.Deltas.length;i++)
        {
            var delta=this.Deltas[i]
            delta.InnerAction=Create_Action(delta.Delta.length,delta.Action)
        }
    }
    Push(symbol,state)
    {
        this.Stack={
            Symbol:symbol,
            State:state,
            Last:this.Stack
        }
    }
    Pop()
    {
        var symbol=this.Stack.Symbol
        var state=this.Stack.State
        this.Stack=this.Stack.Last
        return {
            Symbol:symbol,
            State:state
        }
    }
    Pops(k)
    {
        var r=[]
        for(var i=1;i<=k;i++)
            r[k-i]=this.Pop().Symbol
        return r
    }
    Insert(type,token)
    {
        
        console.log("Insert",type)
        var delta=this.TerminalDeltas[this.Stack.State][type]
        if(delta.Type=='Error')return false
        if(delta.Type=='Push')
        {
            console.log("Push",delta.State)
            this.Push(token,delta.State)
            return true
        }
        var Delta=this.Deltas[delta.Delta]
        console.log("Reduce",Delta)
        var value=this.InnerAction?Delta.InnerAction(...this.Pops(Delta.Delta.length)):{
            Type:Delta.State,
            Values:this.Pops(Delta.Delta.length)
        }
        if(!this.InsertState(Delta.State,value))return false
        return this.Insert(type,token)
    }
    InsertState(type,token)
    {
        console.log("InsertState",type)
        var delta=this.StateDeltas[this.Stack.State][type]
        if(delta.Type=='Error')return false
        if(delta.Type=='Push')
        {
            console.log("Push",delta.State)
            this.Push(token,delta.State)
            return true
        }
        var Delta=this.Deltas[delta.Delta]
        console.log("Reduce",Delta)
        var value=this.InnerAction?Delta.InnerAction(...this.Pops(Delta.Delta.length)):{
            Type:Delta.State,
            Values:this.Pops(Delta.Delta.length)
        }
        if(!this.InsertState(Delta.State,value))return false
        return this.Insert(type,token)
    }
    Parse(tokenizor)
    {
        this.Stack={
            Symbol:"EOF",
            State:0,
            Last:null
        }
        while(true)
        {
            var token=tokenizor.Get()
            console.log("Read",token)
            if(token==null)return null
            if(!this.Insert(token.Type,token))return null
            if(token.Type=='EOF')return this.Stack.Last.Symbol
        }
    }
}

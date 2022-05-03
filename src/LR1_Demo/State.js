export default class State{
    constructor(delta,offset,predict)
    {
        this.State=delta.State
        this.Delta=delta.Delta
        this.Index=delta.Index
        this.Closures=delta.Closures
        this.Offset=offset
        this.Predict=predict
    }
    Epsilon()
    {
        return this.Delta.length==0
    }
    End()
    {
        return this.Delta.length==this.Offset
    }
    Next()
    {
        return this.Delta[this.Offset]
    }
    NextPredict(terminal_set,firsts)
    {
        if(this.Offset+1==this.Delta.length)return [this.Predict]
        else if(terminal_set.has(this.Delta[this.Offset+1]))return [this.Delta[this.Offset+1]]
        else return firsts[this.Delta[this.Offset+1]].Values
    }
    FirstPredict(terminal_set,firsts)
    {
        if(1==this.Delta.length)return [this.Predict]
        else if(terminal_set.has(this.Delta[1]))return [this.Delta[1]]
        else return firsts[this.Delta[1]].Values
    }
    First()
    {
        return this.Delta[0]
    }
    NextState()
    {
        return new State(this,this.Offset+1,this.Predict)
    }
    CurrentClosure()
    {
        return this.Closures[this.Offset].get(this.Predict)
    }
    Print()
    {
        return this.State+"->"+this.Delta.slice(0,this.Offset).join("")+"."+this.Delta.slice(this.Offset,this.Delta.length).join("")+","+this.Predict
    }
}
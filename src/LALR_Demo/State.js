import ValueSet from "./ValueSet"

export default class State{
    constructor(delta,offset)
    {
        this.State=delta.State
        this.Delta=delta.Delta
        this.Index=delta.Index
        this.Closures=delta.Closures
        this.Offset=offset
        this.Predicts=new ValueSet()
        this.Nexts=[]
        this.Visit=true
    }
    End()
    {
        return this.Delta.length==this.Offset
    }
    NextEnd()
    {
        return this.Delta.length==this.Offset+1
    }
    Next()
    {
        return this.Delta[this.Offset]
    }
    First()
    {
        return this.Delta[0]
    }
    NextState()
    {
        return new State(this,this.Offset+1)
    }
    CurrentClosure()
    {
        return this.Closures[this.Offset]
    }
    NextPredict(terminal_set,firsts)
    {
        if(this.NextEnd())return this.Predicts.Values
        else if(terminal_set.has(this.Delta[this.Offset+1]))return [this.Delta[this.Offset+1]]
        else return firsts[this.Delta[this.Offset+1]].Values
    }
    Print()
    {
        return this.State+"->"+this.Delta.slice(0,this.Offset).join("")+"."+this.Delta.slice(this.Offset,this.Delta.length).join("")+","+this.Predicts.Values.join(" ")
    }
}
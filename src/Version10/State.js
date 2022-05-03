export default class State{
    constructor(delta,offset)
    {
        this.State=delta.State
        this.Delta=delta.Delta
        this.Index=delta.Index
        this.Closures=delta.Closures
        this.Offset=offset
    }
    End()
    {
        return this.Delta.length==this.Offset
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
    Print()
    {
        return this.State+"->"+this.Delta.slice(0,this.Offset).join("")+"."+this.Delta.slice(this.Offset,this.Delta.length).join("")
    }
}
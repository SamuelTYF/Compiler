export default class Stack{
    constructor()
    {
        this.stack=null
    }
    Empty()
    {
        return this.stack==null
    }
    Push(value)
    {
        this.stack={
            Value:value,
            Last:this.stack
        }
    }
    Pop()
    {
        var r=this.stack.Value
        this.stack=this.stack.Last
        return r
    }
}
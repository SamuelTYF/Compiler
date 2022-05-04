class Stack{
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
	Top()
	{
		return this.stack.Value
	}
}
class LR_Parser
{
    constructor()
    {
        this.StateStack=null
        this.ValueStack=null
    }
    Init()
    {
        this.StateStack=new Stack()
        this.ValueStack=new Stack()
        this.StateStack.Push(0)
    }
    Error(token)
    {
        console.error(token)
        return null
    }
    Pop(k)
    {
        var values=[]
        for(var i=0;i<k;i++)
        {
            values[k-i-1]=this.ValueStack.Pop()
            this.StateStack.Pop()
        }
        return values
    }
    Parse(tokenizor)
    {
        this.Init()
        var token=tokenizor.Get()
        var symbol=null
        var goto=true
        while(true)
        {
            if(goto){
                switch(this.StateStack.Top())
                {
                    //ShiftCode
                    default:
                        return this.Error(token)
                }
            }
            else
            {
                switch(this.StateStack.Top())
                {
                    //GotoCode
                    default:
                        return this.Error(token)
                }
            }
        }
    }
    //Method
}
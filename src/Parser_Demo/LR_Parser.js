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
export default class LR_Parser
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
    Parse(tokenizer)
    {
        this.Init()
        var token=tokenizer.Get()
        var symbol=null
        var goto=true
        while(true)
        {
            if(goto){
                switch(this.StateStack.Top())
                {
                    case 0:
						if(token.Type=='State'){
							this.StateStack.Push(2)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 1:
						if(token.Type=='EOF')return this.ValueStack.Top()
						else return this.Error(token)
					break;
					case 2:
						if(token.Type=='->'){
							this.StateStack.Push(4)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 3:
						return this.Error(token)
					break;
					case 4:
						if(token.Type=='EOF'){
							var values=this.Pop(2)
							var $={}
							$.State=values[0].Name;$.Delta=[]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='State'){
							this.StateStack.Push(6)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='Action'){
							this.StateStack.Push(7)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='Terminal'){
							this.StateStack.Push(8)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 5:
						if(token.Type=='State'){
							this.StateStack.Push(9)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='Action'){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='Terminal'){
							this.StateStack.Push(11)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 6:
						if(token.Type=='State'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Name]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Action'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Name]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Terminal'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Name]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else return this.Error(token)
					break;
					case 7:
						if(token.Type=='EOF'){
							var values=this.Pop(3)
							var $={}
							$.State=values[0].Name;$.Delta=[];$.Action=values[2].Value
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else return this.Error(token)
					break;
					case 8:
						if(token.Type=='State'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Name]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Action'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Name]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Terminal'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Name]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else return this.Error(token)
					break;
					case 9:
						if(token.Type=='State'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.push(values[1].Name);
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Action'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.push(values[1].Name);
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Terminal'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.push(values[1].Name);
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else return this.Error(token)
					break;
					case 10:
						if(token.Type=='EOF'){
							var values=this.Pop(4)
							var $={}
							$.State=values[0].Name;$.Delta=values[2];$.Action=values[3].Value
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else return this.Error(token)
					break;
					case 11:
						if(token.Type=='State'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.push(values[1].Name);
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Action'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.push(values[1].Name);
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Terminal'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.push(values[1].Name);
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else return this.Error(token)
					break;
                    default:
                        return this.Error(token)
                }
            }
            else
            {
                switch(this.StateStack.Top())
                {
                    case 0:
						if(symbol=="S"){
							this.StateStack.Push(1)
							goto=true
						}
						else return this.Error(token)
					break;
					case 1:
						return this.Error(token)
					break;
					case 2:
						return this.Error(token)
					break;
					case 3:
						return this.Error(token)
					break;
					case 4:
						if(symbol=="E"){
							this.StateStack.Push(5)
							goto=true
						}
						else return this.Error(token)
					break;
					case 5:
						return this.Error(token)
					break;
					case 6:
						return this.Error(token)
					break;
					case 7:
						return this.Error(token)
					break;
					case 8:
						return this.Error(token)
					break;
					case 9:
						return this.Error(token)
					break;
					case 10:
						return this.Error(token)
					break;
					case 11:
						return this.Error(token)
					break;
                    default:
                        return this.Error(token)
                }
            }
        }
        
    }
}
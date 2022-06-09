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
						if(token.Type=='EOF'){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else return this.Error(token)
					break;
					case 1:
						if(token.Type=='EOF')return this.ValueStack.Top()
						else if(token.Type=='Char'){
							this.StateStack.Push(7)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='('){
							this.StateStack.Push(8)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='['){
							this.StateStack.Push(9)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 2:
						if(token.Type=='EOF'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else return this.Error(token)
					break;
					case 3:
						if(token.Type=='EOF'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='*'){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='+'){
							this.StateStack.Push(11)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='Char'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(2)
							var $={}
							$=values[0];$.Values.push(values[1])
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else return this.Error(token)
					break;
					case 4:
						if(token.Type=='EOF'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='*'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='+'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else return this.Error(token)
					break;
					case 5:
						if(token.Type=='EOF'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='*'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='+'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else return this.Error(token)
					break;
					case 6:
						return this.Error(token)
					break;
					case 7:
						if(token.Type=='EOF'){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='*'){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='+'){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="S"
							goto=false
						}
						else return this.Error(token)
					break;
					case 8:
						if(token.Type=='Char'){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else return this.Error(token)
					break;
					case 9:
						if(token.Type=='Char'){
							this.StateStack.Push(15)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type==']'){
							this.StateStack.Push(16)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 10:
						if(token.Type=='EOF'){
							var values=this.Pop(2)
							var $={}
							$.Type='Closure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(2)
							var $={}
							$.Type='Closure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(2)
							var $={}
							$.Type='Closure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(2)
							var $={}
							$.Type='Closure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(2)
							var $={}
							$.Type='Closure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(2)
							var $={}
							$.Type='Closure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else return this.Error(token)
					break;
					case 11:
						if(token.Type=='EOF'){
							var values=this.Pop(2)
							var $={}
							$.Type='PlusClosure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(2)
							var $={}
							$.Type='PlusClosure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(2)
							var $={}
							$.Type='PlusClosure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(2)
							var $={}
							$.Type='PlusClosure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(2)
							var $={}
							$.Type='PlusClosure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(2)
							var $={}
							$.Type='PlusClosure';$.Value=values[0]
							this.ValueStack.Push($)
							symbol="E"
							goto=false
						}
						else return this.Error(token)
					break;
					case 12:
						if(token.Type=='Char'){
							this.StateStack.Push(7)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='('){
							this.StateStack.Push(8)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type==')'){
							this.StateStack.Push(18)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='|'){
							this.StateStack.Push(19)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='['){
							this.StateStack.Push(9)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 13:
						if(token.Type=='EOF'){
							var values=this.Pop(2)
							var $={}
							$=values[1]
							this.ValueStack.Push($)
							symbol="Range"
							goto=false
						}
						else if(token.Type=='*'){
							var values=this.Pop(2)
							var $={}
							$=values[1]
							this.ValueStack.Push($)
							symbol="Range"
							goto=false
						}
						else if(token.Type=='+'){
							var values=this.Pop(2)
							var $={}
							$=values[1]
							this.ValueStack.Push($)
							symbol="Range"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(2)
							var $={}
							$=values[1]
							this.ValueStack.Push($)
							symbol="Range"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(2)
							var $={}
							$=values[1]
							this.ValueStack.Push($)
							symbol="Range"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(2)
							var $={}
							$=values[1]
							this.ValueStack.Push($)
							symbol="Range"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(2)
							var $={}
							$=values[1]
							this.ValueStack.Push($)
							symbol="Range"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(2)
							var $={}
							$=values[1]
							this.ValueStack.Push($)
							symbol="Range"
							goto=false
						}
						else return this.Error(token)
					break;
					case 14:
						if(token.Type=='Char'){
							this.StateStack.Push(15)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type==']'){
							this.StateStack.Push(16)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 15:
						if(token.Type=='Char'){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="RangeItem"
							goto=false
						}
						else if(token.Type==']'){
							var values=this.Pop(1)
							var $={}
							$.Type='Char';$.Value=values[0].Char
							this.ValueStack.Push($)
							symbol="RangeItem"
							goto=false
						}
						else if(token.Type=='-'){
							this.StateStack.Push(21)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 16:
						if(token.Type=='EOF'){
							var values=this.Pop(1)
							var $={}
							$.Type='Range';$.Values=[]
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='*'){
							var values=this.Pop(1)
							var $={}
							$.Type='Range';$.Values=[]
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='+'){
							var values=this.Pop(1)
							var $={}
							$.Type='Range';$.Values=[]
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(1)
							var $={}
							$.Type='Range';$.Values=[]
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(1)
							var $={}
							$.Type='Range';$.Values=[]
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(1)
							var $={}
							$.Type='Range';$.Values=[]
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(1)
							var $={}
							$.Type='Range';$.Values=[]
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(1)
							var $={}
							$.Type='Range';$.Values=[]
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else return this.Error(token)
					break;
					case 17:
						if(token.Type=='EOF'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add"
							goto=false
						}
						else if(token.Type=='*'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add"
							goto=false
						}
						else if(token.Type=='+'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add"
							goto=false
						}
						else return this.Error(token)
					break;
					case 18:
						if(token.Type=='EOF'){
							var values=this.Pop(1)
							var $={}
							$.Type='Add';$.Values=[]
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='*'){
							var values=this.Pop(1)
							var $={}
							$.Type='Add';$.Values=[]
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='+'){
							var values=this.Pop(1)
							var $={}
							$.Type='Add';$.Values=[]
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(1)
							var $={}
							$.Type='Add';$.Values=[]
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(1)
							var $={}
							$.Type='Add';$.Values=[]
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(1)
							var $={}
							$.Type='Add';$.Values=[]
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(1)
							var $={}
							$.Type='Add';$.Values=[]
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(1)
							var $={}
							$.Type='Add';$.Values=[]
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else return this.Error(token)
					break;
					case 19:
						if(token.Type=='Char'){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(0)
							var $={}
							$.Type='Mul';$.Values=[]
							this.ValueStack.Push($)
							symbol="R"
							goto=false
						}
						else return this.Error(token)
					break;
					case 20:
						if(token.Type=='EOF'){
							var values=this.Pop(2)
							var $={}
							$=values[1];$.Values.push(values[0])
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='*'){
							var values=this.Pop(2)
							var $={}
							$=values[1];$.Values.push(values[0])
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='+'){
							var values=this.Pop(2)
							var $={}
							$=values[1];$.Values.push(values[0])
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(2)
							var $={}
							$=values[1];$.Values.push(values[0])
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(2)
							var $={}
							$=values[1];$.Values.push(values[0])
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(2)
							var $={}
							$=values[1];$.Values.push(values[0])
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(2)
							var $={}
							$=values[1];$.Values.push(values[0])
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(2)
							var $={}
							$=values[1];$.Values.push(values[0])
							this.ValueStack.Push($)
							symbol="Range'"
							goto=false
						}
						else return this.Error(token)
					break;
					case 21:
						if(token.Type=='Char'){
							this.StateStack.Push(23)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 22:
						if(token.Type=='Char'){
							this.StateStack.Push(7)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='('){
							this.StateStack.Push(8)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type==')'){
							this.StateStack.Push(18)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='|'){
							this.StateStack.Push(19)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else if(token.Type=='['){
							this.StateStack.Push(9)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizer.Get()
						}
						else return this.Error(token)
					break;
					case 23:
						if(token.Type=='Char'){
							var values=this.Pop(3)
							var $={}
							$.Type='To';$.Left=values[0].Char;$.Right=values[2].Char
							this.ValueStack.Push($)
							symbol="RangeItem"
							goto=false
						}
						else if(token.Type==']'){
							var values=this.Pop(3)
							var $={}
							$.Type='To';$.Left=values[0].Char;$.Right=values[2].Char
							this.ValueStack.Push($)
							symbol="RangeItem"
							goto=false
						}
						else return this.Error(token)
					break;
					case 24:
						if(token.Type=='EOF'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='*'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='+'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='Char'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='('){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type==')'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='|'){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add'"
							goto=false
						}
						else if(token.Type=='['){
							var values=this.Pop(3)
							var $={}
							$.Type='Add';$.Values=Array.prototype.concat([values[1]],values[2].Values)
							this.ValueStack.Push($)
							symbol="Add'"
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
						if(symbol=="R"){
							this.StateStack.Push(1)
							goto=true
						}
						else return this.Error(token)
					break;
					case 1:
						if(symbol=="E"){
							this.StateStack.Push(2)
							goto=true
						}
						else if(symbol=="S"){
							this.StateStack.Push(3)
							goto=true
						}
						else if(symbol=="Add"){
							this.StateStack.Push(4)
							goto=true
						}
						else if(symbol=="Range"){
							this.StateStack.Push(5)
							goto=true
						}
						else return this.Error(token)
					break;
					case 2:
						return this.Error(token)
					break;
					case 3:
						return this.Error(token)
					break;
					case 4:
						return this.Error(token)
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
						if(symbol=="R"){
							this.StateStack.Push(12)
							goto=true
						}
						else return this.Error(token)
					break;
					case 9:
						if(symbol=="Range'"){
							this.StateStack.Push(13)
							goto=true
						}
						else if(symbol=="RangeItem"){
							this.StateStack.Push(14)
							goto=true
						}
						else return this.Error(token)
					break;
					case 10:
						return this.Error(token)
					break;
					case 11:
						return this.Error(token)
					break;
					case 12:
						if(symbol=="E"){
							this.StateStack.Push(2)
							goto=true
						}
						else if(symbol=="S"){
							this.StateStack.Push(3)
							goto=true
						}
						else if(symbol=="Add"){
							this.StateStack.Push(4)
							goto=true
						}
						else if(symbol=="Add'"){
							this.StateStack.Push(17)
							goto=true
						}
						else if(symbol=="Range"){
							this.StateStack.Push(5)
							goto=true
						}
						else return this.Error(token)
					break;
					case 13:
						return this.Error(token)
					break;
					case 14:
						if(symbol=="Range'"){
							this.StateStack.Push(20)
							goto=true
						}
						else if(symbol=="RangeItem"){
							this.StateStack.Push(14)
							goto=true
						}
						else return this.Error(token)
					break;
					case 15:
						return this.Error(token)
					break;
					case 16:
						return this.Error(token)
					break;
					case 17:
						return this.Error(token)
					break;
					case 18:
						return this.Error(token)
					break;
					case 19:
						if(symbol=="R"){
							this.StateStack.Push(22)
							goto=true
						}
						else return this.Error(token)
					break;
					case 20:
						return this.Error(token)
					break;
					case 21:
						return this.Error(token)
					break;
					case 22:
						if(symbol=="E"){
							this.StateStack.Push(2)
							goto=true
						}
						else if(symbol=="S"){
							this.StateStack.Push(3)
							goto=true
						}
						else if(symbol=="Add"){
							this.StateStack.Push(4)
							goto=true
						}
						else if(symbol=="Add'"){
							this.StateStack.Push(24)
							goto=true
						}
						else if(symbol=="Range"){
							this.StateStack.Push(5)
							goto=true
						}
						else return this.Error(token)
					break;
					case 23:
						return this.Error(token)
					break;
					case 24:
						return this.Error(token)
					break;
                    default:
                        return this.Error(token)
                }
            }
        }
        
    }
}
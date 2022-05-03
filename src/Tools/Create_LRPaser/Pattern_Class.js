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
            console.log(goto,this.StateStack.Top(),token,symbol)
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
}

class Tokenizor
{
    constructor()
    {
        this.Value=""
        this.String=""
        this.Length=0
        this.Index=0
        this.State=0
    }
    InitValue()
    {
        this.Value=""
    }
    Push(char)
    {
        this.Value+=char
    }
    Error(char)
    {
        console.error("Tokenizor Error at State:%s Index:%d Char:%s",this.State,this.Index,char)
        return null
    }
    StartParse(str)
    {
        this.String=str
        this.Length=str.length
        this.Index=0
        this.State=0
        this.InitValue()
    }
    ReturnToken($)
    {
        this.State=0
        this.InitValue()
        return $
    }
    Get()
    {
        var token=this._Get()
        console.log(token)
        return token
    }
    _Get()
    {
        var $={}
        while(this.Index<=this.Length)
        {
            var char=this.Index==this.Length?null:this.String[this.Index]
            switch(this.State)
            {
                case 0:
					if(char==null){$.Type='EOF';return $}
					else if(char==" " | char=="\"" | char=="$" | char=="'" | char=="," | ('0'<=char && char<='>') | ('A'<=char && char<='Z') | char=="_" | ('a'<=char && char<='z')){this.Push(char);this.State=1;this.Index++;}
					else if(char=="\\"){this.Push(char);this.State=2;this.Index++;}
					else if(char=="["){this.Push(char);this.State=3;this.Index++;}
					else if(char=="]"){this.Push(char);this.State=4;this.Index++;}
					else if(char=="("){this.Push(char);this.State=5;this.Index++;}
					else if(char==")"){this.Push(char);this.State=6;this.Index++;}
					else if(char=="+"){this.Push(char);this.State=7;this.Index++;}
					else if(char=="-"){this.Push(char);this.State=8;this.Index++;}
					else if(char=="*"){this.Push(char);this.State=9;this.Index++;}
					else if(char=="|"){this.Push(char);this.State=10;this.Index++;}
					else {return this.Error(char);}
				break;
				case 1:
					{var value=this.Value;$.Char=value;$.Type='Char';return this.ReturnToken($);}
				break;
				case 2:
					if(char=="n"){this.Push(char);this.State=11;this.Index++;}
					else if(char=="s"){this.Push(char);this.State=12;this.Index++;}
					else if(char=="t"){this.Push(char);this.State=13;this.Index++;}
					else if(char=="u"){this.Push(char);this.State=14;this.Index++;}
					else if(char=="\\"){this.Push(char);this.State=15;this.Index++;}
					else if(char=="["){this.Push(char);this.State=16;this.Index++;}
					else if(char=="]"){this.Push(char);this.State=17;this.Index++;}
					else if(char=="{"){this.Push(char);this.State=18;this.Index++;}
					else if(char=="}"){this.Push(char);this.State=19;this.Index++;}
					else if(char=="("){this.Push(char);this.State=20;this.Index++;}
					else if(char==")"){this.Push(char);this.State=21;this.Index++;}
					else if(char=="+"){this.Push(char);this.State=22;this.Index++;}
					else if(char=="-"){this.Push(char);this.State=23;this.Index++;}
					else if(char=="*"){this.Push(char);this.State=24;this.Index++;}
					else if(char=="|"){this.Push(char);this.State=25;this.Index++;}
					else if(char=="."){this.Push(char);this.State=26;this.Index++;}
					else {return this.Error(char);}
				break;
				case 3:
					{var value=this.Value;$.Type='[';return this.ReturnToken($);}
				break;
				case 4:
					{var value=this.Value;$.Type=']';return this.ReturnToken($);}
				break;
				case 5:
					{var value=this.Value;$.Type='(';return this.ReturnToken($);}
				break;
				case 6:
					{var value=this.Value;$.Type=')';return this.ReturnToken($);}
				break;
				case 7:
					{var value=this.Value;$.Type='+';return this.ReturnToken($);}
				break;
				case 8:
					{var value=this.Value;$.Type='-';return this.ReturnToken($);}
				break;
				case 9:
					{var value=this.Value;$.Type='*';return this.ReturnToken($);}
				break;
				case 10:
					{var value=this.Value;$.Type='|';return this.ReturnToken($);}
				break;
				case 11:
					{var value=this.Value;$.Char='\n';$.Type='Char';return this.ReturnToken($);}
				break;
				case 12:
					{var value=this.Value;$.Char=' ';$.Type='Char';return this.ReturnToken($);}
				break;
				case 13:
					{var value=this.Value;$.Char='\t';$.Type='Char';return this.ReturnToken($);}
				break;
				case 14:
					if(('0'<=char && char<='9')){this.Push(char);this.State=27;this.Index++;}
					else {return this.Error(char);}
				break;
				case 15:
					{var value=this.Value;$.Char='\\';$.Type='Char';return this.ReturnToken($);}
				break;
				case 16:
					{var value=this.Value;$.Char='[';$.Type='Char';return this.ReturnToken($);}
				break;
				case 17:
					{var value=this.Value;$.Char=']';$.Type='Char';return this.ReturnToken($);}
				break;
				case 18:
					{var value=this.Value;$.Char='{';$.Type='Char';return this.ReturnToken($);}
				break;
				case 19:
					{var value=this.Value;$.Char='}';$.Type='Char';return this.ReturnToken($);}
				break;
				case 20:
					{var value=this.Value;$.Char='(';$.Type='Char';return this.ReturnToken($);}
				break;
				case 21:
					{var value=this.Value;$.Char=')';$.Type='Char';return this.ReturnToken($);}
				break;
				case 22:
					{var value=this.Value;$.Char='+';$.Type='Char';return this.ReturnToken($);}
				break;
				case 23:
					{var value=this.Value;$.Char='-';$.Type='Char';return this.ReturnToken($);}
				break;
				case 24:
					{var value=this.Value;$.Char='*';$.Type='Char';return this.ReturnToken($);}
				break;
				case 25:
					{var value=this.Value;$.Char='|';$.Type='Char';return this.ReturnToken($);}
				break;
				case 26:
					{var value=this.Value;$.Char='.';$.Type='Char';return this.ReturnToken($);}
				break;
				case 27:
					if(('0'<=char && char<='9')){this.Push(char);this.State=27;this.Index++;}
					else {var value=this.Value;$.Char=String.fromCharCode(parseInt(value.slice(2)));$.Type='Char';return this.ReturnToken($);}
				break;
                default:
                    return this.Error(char)
            }
        }
    }
}

var tokenizor=new Tokenizor()
tokenizor.StartParse("[\\u012-\\u020]*")
var parser=new LR_Parser()
console.log(JSON.stringify(parser.Parse(tokenizor),null,2))
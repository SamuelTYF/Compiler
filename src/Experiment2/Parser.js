import fs from "fs"

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
        var $={}
        while(this.Index<=this.Length)
        {
            var char=this.Index==this.Length?'\0':this.String[this.Index]
            switch(this.State)
            {
                case 0:
					if(char=='\0'){$.Type='EOF';return $}
					else if(("A"<=char && char<="Z") | ("a"<=char && char<="z")){this.Push(char);this.State=1;this.Index++;}
					else if(char=="0"){this.Push(char);this.State=2;this.Index++;}
					else if(("1"<=char && char<="9")){this.Push(char);this.State=3;this.Index++;}
					else if(char=="@"){this.Push(char);this.State=4;this.Index++;}
					else if(char=="." | char=="?"){this.Push(char);this.State=5;this.Index++;}
					else if(char=="%" | ("("<=char && char<="*") | char=="," | char=="/" | (":"<=char && char<=";") | char=="[" | ("]"<=char && char<="^") | char=="{" | char=="}"){this.Push(char);this.State=6;this.Index++;}
					else if(char=="|"){this.Push(char);this.State=7;this.Index++;}
					else if(char=="!" | ("<"<=char && char<=">")){this.Push(char);this.State=8;this.Index++;}
					else if(char=="-"){this.Push(char);this.State=9;this.Index++;}
					else if(char=="+"){this.Push(char);this.State=10;this.Index++;}
					else if(("\t"<=char && char<="\n") | char=="\r" | char==" "){this.Push(char);this.State=11;this.Index++;}
					else {return this.Error(char);}
				break;
				case 1:
					if(("0"<=char && char<="9") | ("A"<=char && char<="Z") | ("a"<=char && char<="z")){this.Push(char);this.State=1;this.Index++;}
					else {var value=this.Value;if(this.IsKey(value)){$.Type=value}else{$.Type='Symbol';$.Value=value};return this.ReturnToken($);}
				break;
				case 2:
					if(char=="x"){this.Push(char);this.State=12;this.Index++;}
					else if(("0"<=char && char<="7")){this.Push(char);this.State=13;this.Index++;}
					else {var value=this.Value;$.Type='UInt';$.Value=parseInt(value);return this.ReturnToken($);}
				break;
				case 3:
					if(("0"<=char && char<="9")){this.Push(char);this.State=3;this.Index++;}
					else {var value=this.Value;$.Type='UInt';$.Value=parseInt(value);return this.ReturnToken($);}
				break;
				case 4:
					if(char=="@"){this.Push(char);this.State=6;this.Index++;}
					else if(("0"<=char && char<="9") | ("A"<=char && char<="Z") | ("a"<=char && char<="z")){this.Push(char);this.State=14;this.Index++;}
					else {var value=this.Value;$.Type=value;return this.ReturnToken($);}
				break;
				case 5:
					if(char=="?"){this.Push(char);this.State=6;this.Index++;}
					else {var value=this.Value;$.Type=value;return this.ReturnToken($);}
				break;
				case 6:
					{var value=this.Value;$.Type=value;return this.ReturnToken($);}
				break;
				case 7:
					if(char=="|"){this.Push(char);this.State=6;this.Index++;}
					else {var value=this.Value;$.Type=value;return this.ReturnToken($);}
				break;
				case 8:
					if(char=="="){this.Push(char);this.State=6;this.Index++;}
					else {var value=this.Value;$.Type=value;return this.ReturnToken($);}
				break;
				case 9:
					if(char=="-"){this.Push(char);this.State=6;this.Index++;}
					else {var value=this.Value;$.Type=value;return this.ReturnToken($);}
				break;
				case 10:
					if(char=="+"){this.Push(char);this.State=6;this.Index++;}
					else {var value=this.Value;$.Type=value;return this.ReturnToken($);}
				break;
				case 11:
					if(("\t"<=char && char<="\n") | char=="\r" | char==" "){this.Push(char);this.State=11;this.Index++;}
					else {var value=this.Value;$.Type=' ';return this.ReturnToken($);}
				break;
				case 12:
					if(("0"<=char && char<="9") | ("A"<=char && char<="F") | ("a"<=char && char<="f")){this.Push(char);this.State=15;this.Index++;}
					else {return this.Error(char);}
				break;
				case 13:
					if(("0"<=char && char<="7")){this.Push(char);this.State=13;this.Index++;}
					else {var value=this.Value;$.Type='UInt';var r=0;for(var i=1;i<value.length;i++)r=r*8+(value.charCodeAt(i)^48);$.Value=r;return this.ReturnToken($);}
				break;
				case 14:
					if(("0"<=char && char<="9") | ("A"<=char && char<="Z") | ("a"<=char && char<="z")){this.Push(char);this.State=14;this.Index++;}
					else {var value=this.Value;if(this.IsKey(value)){$.Type='Symbol';$.Value=value.splice(1)}else{$=null};return this.ReturnToken($);}
				break;
				case 15:
					if(("0"<=char && char<="9") | ("A"<=char && char<="F") | ("a"<=char && char<="f")){this.Push(char);this.State=15;this.Index++;}
					else {var value=this.Value;$.Type='UInt';$.Value=parseInt(value);return this.ReturnToken($);}
				break;
                default:
                    return this.Error(char)
            }
        }
    }
    keys=new Set(["for","while","do","if","else","int","float","namespace","using","class","public","private","interval","static","readonly"])
	IsKey(value)
	{
	    return this.keys.has(value)
	}
}

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
                    case 0:
						if(token.Type=='using'){
							var values=this.Pop(0)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="FileHeader"
							goto=false
						}
						else if(token.Type=='namespace'){
							var values=this.Pop(0)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="FileHeader"
							goto=false
						}
						else return this.Error(token)
					break;
					case 1:
						if(token.Type=='EOF')return this.ValueStack.Top()
						else return this.Error(token)
					break;
					case 2:
						if(token.Type=='using'){
							this.StateStack.Push(7)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='namespace'){
							this.StateStack.Push(8)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 3:
						return this.Error(token)
					break;
					case 4:
						if(token.Type==' '){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='using'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='namespace'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 5:
						if(token.Type=='EOF'){
							var values=this.Pop(2)
							var $={}
							$.Type='File';$.Headers=values[0];$.Body=values[1]
							this.ValueStack.Push($)
							symbol="File"
							goto=false
						}
						else return this.Error(token)
					break;
					case 6:
						if(token.Type=='EOF'){
							var values=this.Pop(1)
							var $={}
							$=[values[0]]
							this.ValueStack.Push($)
							symbol="FileBody"
							goto=false
						}
						else if(token.Type==' '){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='namespace'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 7:
						if(token.Type==' '){
							this.StateStack.Push(12)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 8:
						if(token.Type==' '){
							this.StateStack.Push(13)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 9:
						if(token.Type=='using'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[1])
							this.ValueStack.Push($)
							symbol="FileHeader"
							goto=false
						}
						else if(token.Type=='namespace'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[1])
							this.ValueStack.Push($)
							symbol="FileHeader"
							goto=false
						}
						else return this.Error(token)
					break;
					case 10:
						if(token.Type=='using'){
							var values=this.Pop(1)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='Symbol'){
							var values=this.Pop(1)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='namespace'){
							var values=this.Pop(1)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='{'){
							var values=this.Pop(1)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='}'){
							var values=this.Pop(1)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='class'){
							var values=this.Pop(1)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='public'){
							var values=this.Pop(1)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='int'){
							var values=this.Pop(1)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 11:
						if(token.Type=='namespace'){
							this.StateStack.Push(8)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 12:
						if(token.Type=='Symbol'){
							this.StateStack.Push(16)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 13:
						if(token.Type=='Symbol'){
							this.StateStack.Push(16)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 14:
						if(token.Type=='EOF'){
							var values=this.Pop(3)
							var $={}
							$=Array.prototype.concat([values[0]],values[2])
							this.ValueStack.Push($)
							symbol="FileBody"
							goto=false
						}
						else return this.Error(token)
					break;
					case 15:
						if(token.Type==';'){
							this.StateStack.Push(18)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='.'){
							this.StateStack.Push(19)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 16:
						if(token.Type==' '){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Value]
							this.ValueStack.Push($)
							symbol="NamespaceName"
							goto=false
						}
						else if(token.Type==';'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Value]
							this.ValueStack.Push($)
							symbol="NamespaceName"
							goto=false
						}
						else if(token.Type=='.'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Value]
							this.ValueStack.Push($)
							symbol="NamespaceName"
							goto=false
						}
						else return this.Error(token)
					break;
					case 17:
						if(token.Type==' '){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='.'){
							this.StateStack.Push(19)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='{'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 18:
						if(token.Type==' '){
							var values=this.Pop(4)
							var $={}
							$=this.LoadAssemble(values[2])
							this.ValueStack.Push($)
							symbol="UsingNamespace"
							goto=false
						}
						else return this.Error(token)
					break;
					case 19:
						if(token.Type=='Symbol'){
							this.StateStack.Push(21)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 20:
						if(token.Type=='{'){
							this.StateStack.Push(22)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 21:
						if(token.Type==' '){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[2].Value)
							this.ValueStack.Push($)
							symbol="NamespaceName"
							goto=false
						}
						else if(token.Type==';'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[2].Value)
							this.ValueStack.Push($)
							symbol="NamespaceName"
							goto=false
						}
						else if(token.Type=='.'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[2].Value)
							this.ValueStack.Push($)
							symbol="NamespaceName"
							goto=false
						}
						else return this.Error(token)
					break;
					case 22:
						if(token.Type==' '){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='}'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='class'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='public'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 23:
						if(token.Type=='}'){
							var values=this.Pop(1)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="NamespaceItem"
							goto=false
						}
						else if(token.Type=='class'){
							var values=this.Pop(1)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="NamespaceItem"
							goto=false
						}
						else if(token.Type=='public'){
							var values=this.Pop(1)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="NamespaceItem"
							goto=false
						}
						else return this.Error(token)
					break;
					case 24:
						if(token.Type=='}'){
							this.StateStack.Push(27)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='class'){
							var values=this.Pop(0)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="ClassProperty"
							goto=false
						}
						else if(token.Type=='public'){
							var values=this.Pop(0)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="ClassProperty"
							goto=false
						}
						else return this.Error(token)
					break;
					case 25:
						if(token.Type==' '){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='}'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='class'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='public'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 26:
						if(token.Type=='class'){
							this.StateStack.Push(29)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='public'){
							this.StateStack.Push(30)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 27:
						if(token.Type=='EOF'){
							var values=this.Pop(7)
							var $={}
							$.Name=values[2];$.Items=values[5]
							this.ValueStack.Push($)
							symbol="DefineNamespace"
							goto=false
						}
						else if(token.Type==' '){
							var values=this.Pop(7)
							var $={}
							$.Name=values[2];$.Items=values[5]
							this.ValueStack.Push($)
							symbol="DefineNamespace"
							goto=false
						}
						else return this.Error(token)
					break;
					case 28:
						if(token.Type=='}'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[1])
							this.ValueStack.Push($)
							symbol="NamespaceItem"
							goto=false
						}
						else if(token.Type=='class'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[1])
							this.ValueStack.Push($)
							symbol="NamespaceItem"
							goto=false
						}
						else if(token.Type=='public'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[1])
							this.ValueStack.Push($)
							symbol="NamespaceItem"
							goto=false
						}
						else return this.Error(token)
					break;
					case 29:
						if(token.Type==' '){
							this.StateStack.Push(31)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 30:
						if(token.Type==' '){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='class'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='public'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 31:
						if(token.Type=='Symbol'){
							this.StateStack.Push(34)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 32:
						if(token.Type=='class'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push('public')
							this.ValueStack.Push($)
							symbol="ClassProperty"
							goto=false
						}
						else if(token.Type=='public'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push('public')
							this.ValueStack.Push($)
							symbol="ClassProperty"
							goto=false
						}
						else return this.Error(token)
					break;
					case 33:
						if(token.Type==' '){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='.'){
							this.StateStack.Push(36)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='{'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 34:
						if(token.Type==' '){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Value]
							this.ValueStack.Push($)
							symbol="ClassName"
							goto=false
						}
						else if(token.Type=='.'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Value]
							this.ValueStack.Push($)
							symbol="ClassName"
							goto=false
						}
						else return this.Error(token)
					break;
					case 35:
						if(token.Type=='{'){
							this.StateStack.Push(37)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 36:
						if(token.Type=='Symbol'){
							this.StateStack.Push(38)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 37:
						if(token.Type==' '){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='Symbol'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='}'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='int'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 38:
						if(token.Type==' '){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[2].Value)
							this.ValueStack.Push($)
							symbol="ClassName"
							goto=false
						}
						else if(token.Type=='.'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[2].Value)
							this.ValueStack.Push($)
							symbol="ClassName"
							goto=false
						}
						else return this.Error(token)
					break;
					case 39:
						if(token.Type=='Symbol'){
							var values=this.Pop(1)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="ClassItem"
							goto=false
						}
						else if(token.Type=='}'){
							var values=this.Pop(1)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="ClassItem"
							goto=false
						}
						else if(token.Type=='int'){
							var values=this.Pop(1)
							var $={}
							$=[]
							this.ValueStack.Push($)
							symbol="ClassItem"
							goto=false
						}
						else return this.Error(token)
					break;
					case 40:
						if(token.Type=='Symbol'){
							this.StateStack.Push(45)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='}'){
							this.StateStack.Push(46)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='int'){
							this.StateStack.Push(47)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 41:
						if(token.Type==' '){
							this.StateStack.Push(10)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else if(token.Type=='Symbol'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='}'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else if(token.Type=='int'){
							var values=this.Pop(0)
							var $={}
							$=null
							this.ValueStack.Push($)
							symbol="Space"
							goto=false
						}
						else return this.Error(token)
					break;
					case 42:
						if(token.Type==' '){
							this.StateStack.Push(49)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 43:
						if(token.Type==' '){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="Type"
							goto=false
						}
						else return this.Error(token)
					break;
					case 44:
						if(token.Type==' '){
							var values=this.Pop(1)
							var $={}
							$=values[0]
							this.ValueStack.Push($)
							symbol="Type"
							goto=false
						}
						else if(token.Type=='.'){
							this.StateStack.Push(50)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 45:
						if(token.Type==' '){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Value]
							this.ValueStack.Push($)
							symbol="UserType"
							goto=false
						}
						else if(token.Type=='.'){
							var values=this.Pop(1)
							var $={}
							$=[values[0].Value]
							this.ValueStack.Push($)
							symbol="UserType"
							goto=false
						}
						else return this.Error(token)
					break;
					case 46:
						if(token.Type==' '){
							var values=this.Pop(8)
							var $={}
							$.Property=values[0];$.Name=values[3];$.Items=values[6]
							this.ValueStack.Push($)
							symbol="DefineClass"
							goto=false
						}
						else return this.Error(token)
					break;
					case 47:
						if(token.Type==' '){
							var values=this.Pop(1)
							var $={}
							$=['System','Int32']
							this.ValueStack.Push($)
							symbol="InternalType"
							goto=false
						}
						else return this.Error(token)
					break;
					case 48:
						if(token.Type=='Symbol'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[1])
							this.ValueStack.Push($)
							symbol="ClassItem"
							goto=false
						}
						else if(token.Type=='}'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[1])
							this.ValueStack.Push($)
							symbol="ClassItem"
							goto=false
						}
						else if(token.Type=='int'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[1])
							this.ValueStack.Push($)
							symbol="ClassItem"
							goto=false
						}
						else return this.Error(token)
					break;
					case 49:
						if(token.Type=='Symbol'){
							this.StateStack.Push(51)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 50:
						if(token.Type=='Symbol'){
							this.StateStack.Push(52)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 51:
						if(token.Type==';'){
							this.StateStack.Push(53)
							this.ValueStack.Push(token)
							goto=true
							token=tokenizor.Get()
						}
						else return this.Error(token)
					break;
					case 52:
						if(token.Type==' '){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[2].Value)
							this.ValueStack.Push($)
							symbol="UserType"
							goto=false
						}
						else if(token.Type=='.'){
							var values=this.Pop(3)
							var $={}
							$=values[0];$.push(values[2].Value)
							this.ValueStack.Push($)
							symbol="UserType"
							goto=false
						}
						else return this.Error(token)
					break;
					case 53:
						if(token.Type==' '){
							var values=this.Pop(4)
							var $={}
							$.Type=values[0];$.Name=values[2].Value
							this.ValueStack.Push($)
							symbol="Field"
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
						if(symbol=="File"){
							this.StateStack.Push(1)
							goto=true
						}
						else if(symbol=="FileHeader"){
							this.StateStack.Push(2)
							goto=true
						}
						else return this.Error(token)
					break;
					case 1:
						return this.Error(token)
					break;
					case 2:
						if(symbol=="UsingNamespace"){
							this.StateStack.Push(4)
							goto=true
						}
						else if(symbol=="FileBody"){
							this.StateStack.Push(5)
							goto=true
						}
						else if(symbol=="DefineNamespace"){
							this.StateStack.Push(6)
							goto=true
						}
						else return this.Error(token)
					break;
					case 3:
						return this.Error(token)
					break;
					case 4:
						if(symbol=="Space"){
							this.StateStack.Push(9)
							goto=true
						}
						else return this.Error(token)
					break;
					case 5:
						return this.Error(token)
					break;
					case 6:
						if(symbol=="Space"){
							this.StateStack.Push(11)
							goto=true
						}
						else return this.Error(token)
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
						if(symbol=="FileBody"){
							this.StateStack.Push(14)
							goto=true
						}
						else if(symbol=="DefineNamespace"){
							this.StateStack.Push(6)
							goto=true
						}
						else return this.Error(token)
					break;
					case 12:
						if(symbol=="NamespaceName"){
							this.StateStack.Push(15)
							goto=true
						}
						else return this.Error(token)
					break;
					case 13:
						if(symbol=="NamespaceName"){
							this.StateStack.Push(17)
							goto=true
						}
						else return this.Error(token)
					break;
					case 14:
						return this.Error(token)
					break;
					case 15:
						return this.Error(token)
					break;
					case 16:
						return this.Error(token)
					break;
					case 17:
						if(symbol=="Space"){
							this.StateStack.Push(20)
							goto=true
						}
						else return this.Error(token)
					break;
					case 18:
						return this.Error(token)
					break;
					case 19:
						return this.Error(token)
					break;
					case 20:
						return this.Error(token)
					break;
					case 21:
						return this.Error(token)
					break;
					case 22:
						if(symbol=="Space"){
							this.StateStack.Push(23)
							goto=true
						}
						else if(symbol=="NamespaceItem"){
							this.StateStack.Push(24)
							goto=true
						}
						else return this.Error(token)
					break;
					case 23:
						return this.Error(token)
					break;
					case 24:
						if(symbol=="DefineClass"){
							this.StateStack.Push(25)
							goto=true
						}
						else if(symbol=="ClassProperty"){
							this.StateStack.Push(26)
							goto=true
						}
						else return this.Error(token)
					break;
					case 25:
						if(symbol=="Space"){
							this.StateStack.Push(28)
							goto=true
						}
						else return this.Error(token)
					break;
					case 26:
						return this.Error(token)
					break;
					case 27:
						return this.Error(token)
					break;
					case 28:
						return this.Error(token)
					break;
					case 29:
						return this.Error(token)
					break;
					case 30:
						if(symbol=="Space"){
							this.StateStack.Push(32)
							goto=true
						}
						else return this.Error(token)
					break;
					case 31:
						if(symbol=="ClassName"){
							this.StateStack.Push(33)
							goto=true
						}
						else return this.Error(token)
					break;
					case 32:
						return this.Error(token)
					break;
					case 33:
						if(symbol=="Space"){
							this.StateStack.Push(35)
							goto=true
						}
						else return this.Error(token)
					break;
					case 34:
						return this.Error(token)
					break;
					case 35:
						return this.Error(token)
					break;
					case 36:
						return this.Error(token)
					break;
					case 37:
						if(symbol=="Space"){
							this.StateStack.Push(39)
							goto=true
						}
						else if(symbol=="ClassItem"){
							this.StateStack.Push(40)
							goto=true
						}
						else return this.Error(token)
					break;
					case 38:
						return this.Error(token)
					break;
					case 39:
						return this.Error(token)
					break;
					case 40:
						if(symbol=="Field"){
							this.StateStack.Push(41)
							goto=true
						}
						else if(symbol=="Type"){
							this.StateStack.Push(42)
							goto=true
						}
						else if(symbol=="InternalType"){
							this.StateStack.Push(43)
							goto=true
						}
						else if(symbol=="UserType"){
							this.StateStack.Push(44)
							goto=true
						}
						else return this.Error(token)
					break;
					case 41:
						if(symbol=="Space"){
							this.StateStack.Push(48)
							goto=true
						}
						else return this.Error(token)
					break;
					case 42:
						return this.Error(token)
					break;
					case 43:
						return this.Error(token)
					break;
					case 44:
						return this.Error(token)
					break;
					case 45:
						return this.Error(token)
					break;
					case 46:
						return this.Error(token)
					break;
					case 47:
						return this.Error(token)
					break;
					case 48:
						return this.Error(token)
					break;
					case 49:
						return this.Error(token)
					break;
					case 50:
						return this.Error(token)
					break;
					case 51:
						return this.Error(token)
					break;
					case 52:
						return this.Error(token)
					break;
					case 53:
						return this.Error(token)
					break;
                    default:
                        return this.Error(token)
                }
            }
        }
    }
    LoadAssemble(assmble)
	{
	    console.log(assmble)
	    return assmble.join(".")
	}
}

var test=fs.readFileSync("Test.cs").toString()

var tokenizor=new Tokenizor()
tokenizor.StartParse(test)
var parser=new LR_Parser()

console.log(JSON.stringify(parser.Parse(tokenizor),null,2))

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
    keys=new Set(["for","while","do","if","else","int","float","namespace","using","class","public","private","interval"])
	IsKey(value)
	{
	    return this.keys.has(value)
	}
}

var test=fs.readFileSync("Test.cs").toString()

var tokenizor=new Tokenizor()
tokenizor.StartParse(test)
var tokens=[]
while(true)
{
    var token=tokenizor.Get()
    console.log(token)
    tokens.push(token)
    if(token==null||token.Type=='EOF')break;
}

fs.writeFileSync("Tokens.json",JSON.stringify(tokens,null,2))


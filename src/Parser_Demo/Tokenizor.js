export default class Tokenizor
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
					else if(char=="<"){this.State=1;this.Index++;}
					else if(char=="'"){this.State=2;this.Index++;}
					else if(char=="-"){this.State=3;this.Index++;}
					else if(char==":"){this.State=4;this.Index++;}
					else {return this.Error(char);}
				break;
				case 1:
					if(char=="'" | ("A"<=char && char<="Z") | ("a"<=char && char<="z")){this.Push(char);this.State=5;this.Index++;}
					else {return this.Error(char);}
				break;
				case 2:
					if(char==" " | char==";" | char=="." | ("("<=char && char<="-") | ("0"<=char && char<=":") | ("<"<=char && char<=">") | ("A"<=char && char<="]") | ("a"<=char && char<="}")){this.Push(char);this.State=2;this.Index++;}
					else if(char=="'"){this.State=6;this.Index++;}
					else {return this.Error(char);}
				break;
				case 3:
					if(char==">"){this.State=7;this.Index++;}
					else {return this.Error(char);}
				break;
				case 4:
					if(char==" " | char=="$" | ("'"<=char && char<=")") | ("+"<=char && char<=",") | char=="." | ("0"<=char && char<=">") | ("A"<=char && char<="[") | char=="]" | ("a"<=char && char<="{") | char=="}"){this.Push(char);this.State=8;this.Index++;}
					else {return this.Error(char);}
				break;
				case 5:
					if(char=="'" | ("A"<=char && char<="Z") | ("a"<=char && char<="z")){this.Push(char);this.State=5;this.Index++;}
					else if(char==">"){this.State=9;this.Index++;}
					else {return this.Error(char);}
				break;
				case 6:
					{var value=this.Value;$.Name=value;$.Type='Terminal';return this.ReturnToken($);}
				break;
				case 7:
					{var value=this.Value;$.Type='->';return this.ReturnToken($);}
				break;
				case 8:
					if(char==" " | char=="$" | ("'"<=char && char<=")") | ("+"<=char && char<=",") | char=="." | ("0"<=char && char<=">") | ("A"<=char && char<="[") | char=="]" | ("a"<=char && char<="{") | char=="}"){this.Push(char);this.State=8;this.Index++;}
					else {var value=this.Value;$.Value=value;$.Type='Action';return this.ReturnToken($);}
				break;
				case 9:
					{var value=this.Value;$.Name=value;$.Type='State';return this.ReturnToken($);}
				break;
                default:
                    return this.Error(char)
            }
        }
    }
}
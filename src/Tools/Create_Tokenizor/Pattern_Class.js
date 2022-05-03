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
            var char=this.Index==this.Length?null:this.String[this.Index]
            switch(this.State)
            {
                //StateCode
                default:
                    return this.Error(char)
            }
        }
    }
}

var tokenizor=new Tokenizor()
tokenizor.StartParse("[0-9a-zA-Z\s<>\:=_;'$,\"]")
var t
do{
	t=tokenizor.Get()
	console.log(t)
}while(t!==null&&t.Type!=='EOF');
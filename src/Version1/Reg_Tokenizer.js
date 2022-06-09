export default class Reg_Tokenizer
{
    constructor(json)
    {
        function create_action(action)
        {
            var text="(value,$)=>{"+action+";return $;}"
            console.log(text)
            return eval(text);
        }
        var rules=[]
        for(var key in json)
            rules.push({
                Rule:new RegExp(key),
                Action:create_action(json[key])
            });
        this.Rules=rules
    }
    encode(text)
    {
        var result=[]
        do{
            var tf=false;
            for(var i=0;i<this.Rules.length;i++)
            {
                var p=this.Rules[i];
                var r=p.Rule.exec(text);
                if(r!==null&&r.index==0)
                {
                    text=text.substr(r[0].length,text.length-r[0].length);
                    var $={Type:"Error"};
                    result.push(p.Action(r[0],$));
                    tf=true;
                    break;
                }
            }
        }while(tf);
        result.push({Type:'EOF'})
        return result
    }
}
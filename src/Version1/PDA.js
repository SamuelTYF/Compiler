import Stack from "./Stack";
export default class PDA{
    constructor(json)
    {
        function Create_Action(count,action)
        {
            var s="(Parse,$$,$";
            for(var i=0;i<count;i++)
                s+=",$"+i.toString()
            s+=")=>{"+action+";}"
            return eval(s);
        }
        var stackcount=json.stack.length
        var dmap={};
        var amap={};
        var imap={};
        for(var i=0;i<stackcount;i++){
            dmap[json.stack[i]]={};
            amap[json.stack[i]]={};
            imap[json.stack[i]]={};
        }
        for(var i=0;i<json.production.length;i++){
            var deltas=[]
            var actions=[]
            for(var j=0;j<json.production[i].Delta.length;j++)
            {
                var m=[]
                for(var k=0;k<json.production[i].Delta[j].Push.length;k++)
                    m[k]=json.production[i].Delta[j].Push[k]
                deltas[j]=m
                actions[j]=Create_Action(json.production[i].Delta[j].Push.length,json.production[i].Delta[j].Action)
            }
            dmap[json.production[i].Stack][json.production[i].Terminal]=deltas
            amap[json.production[i].Stack][json.production[i].Terminal]=actions
            imap[json.production[i].Stack][json.production[i].Terminal]=json.production[i].Delta
        }
        this.AMap=amap;
        this.DMap=dmap;
        this.IMap=imap;
    }
    parse(tokens)
    {
        var stack={
            value:"E",
            last:null
        }
        if(this.test(stack,tokens,0))return stack;
        else return null;
    }
    encode(tree)
    {
        var stack=new Stack()
        function Parse(node)
        {
            console.log("Parse",node)
            node.action(Parse,stack,node.terminal,...node.values);
            console.log("Parsed",node)
            console.log(stack)
        }
        Parse(tree);
        return stack.Result
    }
    test(stack,tokens,index)
    {
        if(tokens.length==index)return stack==null;
        if(stack==null)return false;
        stack.terminal=tokens[index];
        var deltas=this.DMap[stack.value][tokens[index].Type];
        var actions=this.AMap[stack.value][tokens[index].Type];
        var infos=this.IMap[stack.value][tokens[index].Type];
        if(deltas==null)return false;
        for(var i=0;i<deltas.length;i++)
        {
            var last=stack.last;
            var delta=deltas[i];
            stack.values=[]
            stack.action=actions[i];
            stack.info=infos[i];
            for(var j=delta.length-1;j>=0;j--)
                last=stack.values[j]={
                    value:delta[j],
                    last:last
                }
            if(this.test(last,tokens,index+1))return true;
        }
        return false;
    }
}
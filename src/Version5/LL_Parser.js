import Stack from "../Version1/Stack"
export default class LL_Parser
{
    constructor(json)
    {
        this.States=json.States
        this.Terminals=json.Terminals
        this.Selections=json.Selections
        this.Deltas=json.Deltas
        this.Start=json.States[0]
        function Create_Action(count,action)
        {
            var s="(Parse,$$";
            for(var i=0;i<count;i++)
                s+=",$"+i.toString()
            s+=")=>{"+action+";}"
            console.log(s)
            return eval(s);
        }
        this.Actions=this.Deltas.map(delta=>Create_Action(delta.Delta.length,delta.Action))
    }
    Parse(tokenizer)
    {
        this.Tokenizer=tokenizer;
        this.State=this.Start;
        this.Stack=this.Top={
            Data:this.Start,
            Last:null
        }
        while(this.Stack!==null)
        {
            var token=tokenizer.Get();
            console.log("Read",token);
            if(token==null)return null;
            if(!this.Expand(token))return false;
            if(this.Stack.Data==token.Type)
            {
                this.Stack.Value=token;
                this.Stack=this.Stack.Last;
            }
        }
        return this.Top;
    }
    Expand(token)
    {
        while(true)
        {
            var stack=this.Stack;
            if(stack==null)return false;
            if(this.Terminals.indexOf(stack.Data)!==-1)return true;
            console.log(stack)
            var index=this.Selections[stack.Data][token.Type]
            if(index==-1)return false;
            var delta=this.Deltas[index].Delta
            console.log(delta)
            stack.Values=[]
            stack.Action=this.Actions[index]
            this.Stack=this.Stack.Last
            for(var j=delta.length-1;j>=0;j--)
                stack.Values[j]=this.Stack={
                    Data:delta[j],
                    Last:this.Stack
                };
        }
    }
    Encode(tree)
    {
        var stack=new Stack()
        function Parse(node)
        {
            console.log("Parse",node,node.Action)
            node.Action(Parse,stack,...node.Values);
            console.log("Parsed",node)
            console.log(stack)
        }
        Parse(tree);
        console.log(stack)
        return stack.Result
    }
    GetADT(result)
    {
        var t={text:result.Data}
        console.log(result.Values)
        if(typeof result.Values!=='undefined')t.children=result.Values.length==0?[{
            text:"ε",
            children:[],
            shape:"Star"
        }]:result.Values.map(value=>this.GetADT(value))
        else{
            var s=[]
            for(var k in result.Value)
                s.push(k+":"+result.Value[k])
            t.children=[{
                text:s.join("\n"),
                children:[],
                shape:"Rectangle"
            }]
        }
        return t
    }
}
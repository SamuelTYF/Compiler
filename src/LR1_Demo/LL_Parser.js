import ParseingStack from "./ParseingStack"
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
            return eval(s);
        }
        this.Actions=this.Deltas.map(delta=>Create_Action(delta.Delta.length,delta.Action))
    }
    Parse(tokenizor)
    {
        this.Tokenizor=tokenizor;
        this.State=this.Start;
        this.Stack=this.Top={
            Data:this.Start,
            Last:null
        }
        while(this.Stack!==null)
        {
            var token=tokenizor.Get();
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
            var index=this.Selections[stack.Data][token.Type]
            if(index==-1)return false;
            var delta=this.Deltas[index].Delta
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
        var stack=new ParseingStack()
        function Parse(node)
        {
            node.Action(Parse,stack,...node.Values);
        }
        Parse(tree);
        return stack.Result
    }
}
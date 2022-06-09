function create_action(action)
{
    var text="(value,$)=>{"+action+";}"
    return eval(text);
}

export default function Create_DFA_Tokenizer(json)
{
    var dfa={};
    dfa.json=json;
    dfa.States=json.States;
    dfa.StateCount=json.StateCount;
    dfa.Terminals=json.Terminals;
    dfa.TerminalCount=json.TerminalCount;
    dfa.Deltas=json.Deltas;
    dfa.Ends={};
    for(var state in json.Ends)
    {
        var end=json.Ends[state];
        if(end==null)dfa.Ends[state]=null;
        else dfa.Ends[state]=create_action(end.Action);
    }
    dfa.StartParse=text=>{
        dfa.Index=0;
        dfa.Stack=[];
        dfa.Text=text;
        dfa.Length=text.length;
        dfa.State=dfa.States[0];
    }
    dfa.Get=()=>{
        while(true){
            if(dfa.Index==dfa.Length)
            {
                var end=dfa.Ends[dfa.State]
                if(dfa.Ends[dfa.State]!==null)
                {
                    var result={};
                    end(dfa.Stack,result);
                    dfa.State=dfa.States[0];
                    dfa.Stack=[]
                    return result;
                }
                else return {Type:"EOF"};
            }
            var terminal=dfa.Text[dfa.Index];
            var next=dfa.Deltas[dfa.State][terminal];
            if(next==null)
            {
                var end=dfa.Ends[dfa.State];
                if(end==null)return null;
                else
                {
                    var result={};
                    end(dfa.Stack,result);
                    dfa.State=dfa.States[0];
                    dfa.Stack=[]
                    return result;
                }
            }
            else
            {
                dfa.Stack+=terminal;
                dfa.Index++;
                dfa.State=next;
            }
        }
    }
    return dfa;
}
import LL_Parser from "./LL_Parser";
class ValueSet
{
    constructor()
    {
        this.Values=[]
    }
    Add(value)
    {
        if(this.Values.indexOf(value)==-1)
        {
            this.Values.push(value);
            return true;
        }else return false;
    }
    AddRange(values)
    {
        var update=false;
        for(var i=0;i<values.length;i++)
            update|=this.Add(values[i]);
        return update;
    }
}

export default class LL1
{
    constructor(json)
    {
        this.States=json.States;
        this.Terminals=json.Terminals;
        this.Deltas=json.Deltas;
        var firsts={}
        for(var i=0;i<this.States.length;i++){
            var set=new ValueSet();
            set.Epsilon=false;
            firsts[this.States[i]]=set
        }
        while(true)
        {
            var update=false;
            for(var i=0;i<this.Deltas.length;i++)
            {
                var state=this.Deltas[i].State;
                var set=firsts[state];
                var delta=this.Deltas[i].Delta;
                var epsilon=true;
                for(var j=0;j<delta.length;j++)
                {
                    if(this.States.indexOf(delta[j])==-1)
                    {
                        if(set.Add(delta[j]))
                            update=true;
                        epsilon=false;
                        break;
                    }
                    else
                    {
                        var t=firsts[delta[j]]
                        if(set.AddRange(t.Values))
                            update=true;
                        if(!t.Epsilon){
                            epsilon=false;
                            break;
                        }
                    }
                }
                if(!set.Epsilon&&epsilon)
                {
                    set.Epsilon=true;
                    update=true;
                }
            }
            if(!update)break;
        }
        console.log(firsts)
        var follows={}
        for(var i=0;i<this.States.length;i++)
            follows[this.States[i]]=new ValueSet();
        while(true)
        {
            var update=false;
            for(var i=0;i<this.Deltas.length;i++)
            {
                var state=this.Deltas[i].State;
                var delta=this.Deltas[i].Delta;
                var last=new ValueSet();
                var epsilon=true;
                var sfollow=follows[state];
                last.AddRange(sfollow.Values);
                for(var j=delta.length-1;j>=0;j--)
                {
                    if(this.States.indexOf(delta[j])==-1){
                        last.Values=[delta[j]]
                        epsilon=false;
                    }
                    else
                    {
                        var first=firsts[delta[j]]
                        var follow=follows[delta[j]]
                        if(follow.AddRange(last.Values))update=true;
                        last.Values=[];
                        last.AddRange(first.Values);
                        if(first.Epsilon)last.AddRange(follow.Values)
                        else epsilon=false;
                        if(epsilon)last.AddRange(sfollow.Values)
                    }
                }
            }
            if(!update)break;
        }
        console.log(follows)
        var selections={}
        for(var i=0;i<this.States.length;i++)
        {
            var s={}
            for(var j=0;j<this.Terminals.length;j++)
                s[this.Terminals[j]]=-1;
            selections[this.States[i]]=s;
        }
        var valid=true;
        for(var i=0;i<this.Deltas.length;i++)
        {
            var state=this.Deltas[i].State;
            var delta=this.Deltas[i].Delta;
            var follow=follows[state];
            if(delta.length==0)
                for(var j=0;j<follow.Values.length;j++){
                    if(selections[state][follow.Values[j]]!==-1)
                    {
                        console.log("Error1",state,follow.Values[j],selections[state][follow.Values[j]])
                        valid=false;
                    }
                    else selections[state][follow.Values[j]]=i
                }
            else if(this.Terminals.indexOf(delta[0])!==-1){
                if(selections[state][delta[0]]!==-1)
                {
                    console.log("Error2",state,delta[0],selections[state][delta[0]])
                    valid=false;
                }
                else selections[state][delta[0]]=i
            }
            else
            {
                var first=firsts[delta[0]]
                for(var j=0;j<first.Values.length;j++){
                    if(selections[state][first.Values[j]]!==-1)
                    {
                        console.log("Error3",state,first.Values[j],selections[state][first.Values[j]])
                        valid=false;
                    }
                    else selections[state][first.Values[j]]=i
                }
            }
        }
        console.log(selections)
        this.Firsts=firsts;
        this.Follows=follows;
        this.Selections=selections;
        this.Valid=valid;
    }
    GetJson()
    {
        return {
            States:this.States,
            Terminals:this.Terminals,
            Selections:this.Selections,
            Deltas:this.Deltas
        }
    }
    CreateParse()
    {
        return new LL_Parser(this.GetJson())
    }
}
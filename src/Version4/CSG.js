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
export default class CSG
{
    constructor(json)
    {
        this.States=json.States;
        this.Terminals=json.Terminals;
        this.Deltas=json.Deltas;
        for(var i=0;i<this.Deltas.length;i++)
            for(var j=0;j<this.Deltas[i].Delta.length;j++)
                if(this.States.indexOf(this.Deltas[i].Delta[j])==-1)
                this.Deltas[i].Delta[j]={
                    Type:"Terminal",
                    Terminal:this.Deltas[i].Delta[j]
                }
                else this.Deltas[i].Delta[j]={
                    Type:"State",
                    State:this.Deltas[i].Delta[j]
                }
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
                    if(delta[j].Type=="Terminal")
                    {
                        if(set.Add(delta[j].Terminal))
                            update=true;
                        epsilon=false;
                        break;
                    }
                    else
                    {
                        var t=firsts[delta[j].State]
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
                    if(delta[j].Type=="Terminal"){
                        last.Values=[delta[j].Terminal]
                        epsilon=false;
                    }
                    else
                    {
                        var first=firsts[delta[j].State]
                        var follow=follows[delta[j].State]
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
                s[this.Terminals[j]]=[];
            selections[this.States[i]]=s;
        }
        for(var i=0;i<this.Deltas.length;i++)
        {
            var state=this.Deltas[i].State;
            var delta=this.Deltas[i].Delta;
            var follow=follows[state];
            if(delta.length==0)
                for(var j=0;j<follow.Values.length;j++)
                    selections[state][follow.Values[j]].push({Delta:this.Deltas[i].Delta,Type:"Delta"})
            else 
            {
                for(var t=0;t<delta.length;t++){
                    if(delta[t].Type=="Terminal"){
                        selections[state][delta[t].Terminal].push({Delta:this.Deltas[i].Delta,Type:"Delta"})
                        break
                    }
                    else
                    {
                        var first=firsts[delta[t].State]
                        for(var j=t;j<first.Values.length;j++)
                            selections[state][first.Values[j]].push({Delta:this.Deltas[i].Delta,Type:"Delta"})
                        if(!first.Epsilon)break;
                    }
                }
            }
        }
        // for(var i=0;i<this.States.length;i++)
        // {
        //     var state=this.States[i];
        //     for(var j=0;j<follow.Values.length;j++)
        //         selections[state][follow.Values[j]].push({Type:"Synch"})
        // }
        console.log(selections)
        this.Firsts=firsts;
        this.Follows=follows;
        this.Selections=selections;
    }
}
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
    constructor(states,terminals,deltas)
    {
        this.States=states;
        this.Terminals=terminals;
        this.Deltas=deltas;
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
                var delta=this.Deltas[i].Values;
                var epsilon=true;
                for(var j=0;j<delta.length;j++)
                {
                    if(delta[j].Type=="Terminal")
                    {
                        if(set.Add(delta[j].Value))
                            update=true;
                        epsilon=false;
                        break;
                    }
                    else
                    {
                        var t=firsts[delta[j].Value]
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
                var delta=this.Deltas[i].Values;
                var last=new ValueSet();
                var epsilon=true;
                var sfollow=follows[state];
                last.AddRange(sfollow.Values);
                for(var j=delta.length-1;j>=0;j--)
                {
                    if(delta[j].Type=="Terminal"){
                        last.Values=[delta[j].Value]
                        epsilon=false;
                    }
                    else
                    {
                        var first=firsts[delta[j].Value]
                        var follow=follows[delta[j].Value]
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
            var delta=this.Deltas[i].Values;
            var follow=follows[state];
            if(delta.length==0)
                for(var j=0;j<follow.Values.length;j++)
                    selections[state][follow.Values[j]].push(this.Deltas[i])
            else if(delta[0].Type=="Terminal")
                selections[state][delta[0].Value].push(this.Deltas[i])
            else
            {
                var first=firsts[delta[0].Value]
                for(var j=0;j<first.Values.length;j++)
                    selections[state][first.Values[j]].push(this.Deltas[i])
            }
        }
        console.log(selections)
        this.Firsts=firsts;
        this.Follows=follows;
        this.Selections=selections;
        this.Error=[]
        for(var i=0;i<this.States.length;i++)
            for(var j=0;j<this.Terminals.length;j++)
                if(this.Selections[this.States[i]][this.Terminals[j]].length>1)
                this.Error.push({
                    State:this.States[i],
                    Terminal:this.Terminals[j],
                    Deltas:this.Selections[this.States[i]][this.Terminals[j]]
                })
        console.log(this.Error)
    }
}
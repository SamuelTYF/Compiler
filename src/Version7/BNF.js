import CSG from "./CSG";

export default class BNF
{
    constructor(trees)
    {
        console.log(trees)
        var states=[]
        var totals={}
        for(var i=0;i<trees.length;i++)
            if(states.indexOf(trees[i].Delta.State)==-1){
                states.push(trees[i].Delta.State)
                totals[trees[i].Delta.State]=[]
            }
        var terminals=[]
        var tempcount=0;
        //*+
        var Replaces={}
        Replaces["State"]=node=>{
            node.InnerAction=index=>"Parse($"+index.toString()+");"
            return [node];
        }
        Replaces["Terminal"]=node=>{
            if(terminals.indexOf(node.Value)==-1)
                terminals.push(node.Value)
            node.InnerAction=index=>"$$.Push({Type:'Terminal',Value:$"+index.toString()+"});"
            return [node];
        }
        Replaces["Epsilon"]=node=>[]
        Replaces["Closure"]=function(node)
        {
            var ts="Temp"+(tempcount++).toString();
            states.push(ts)
            totals[ts]=[{
                Type:"Delta",
                State:ts,
                Values:[],
            },
            {
                Type:"Delta",
                State:ts,
                Values:Array.prototype.concat(
                        ...Replace(node.Value),
                        {
                            Type:"State",
                            Value:ts,
                            InnerAction:index=>"$$.Push({Type:'ClosureItem',Values:$$.Down()});$$.Up();Parse($"+index.toString()+");"
                        }
                    ),
            }]
            return[{
                Type:"State",
                Value:ts,
                InnerAction:index=>"$$.Up();$$.Up();Parse($"+index.toString()+");$$.Down();$$.Push({Type:'Closure',Values:$$.Down()});"
            }]
        }
        Replaces["PlusClosure"]=function(node)
        {
            var ts="Temp"+(tempcount++).toString();
            states.push(ts)
            var r=Replace(node.Value);
            totals[ts]=[{
                Type:"Delta",
                State:ts,
                Values:r
            },
            {
                Type:"Delta",
                State:ts,
                Values:Array.prototype.concat(
                    ...r,
                    {
                        Type:"State",
                        Value:ts,
                        InnerAction:index=>"$$.Push({Type:'PlusClosureItem',Values:$$.Down()});$$.Up();Parse($"+index.toString()+");"
                    }
                )
            }]
            return[{
                Type:"State",
                Value:ts,
                InnerAction:index=>"$$.Up();$$.Up();Parse($"+index.toString()+");$$.Push({Type:'PlusClosureItem',Values:$$.Down()});$$.Up();$$.Push({Type:'PlusClosure',Values:$$.Down()});"
            }]
        }
        Replaces["Add"]=function(node)
        {
            if(node.Values.length==1)return [Replace(node.Values[0])];
            else
            {
                var ts="Temp"+(tempcount++).toString();
                states.push(ts)
                totals[ts]=[]
                for(var i=0;i<node.Values.length;i++)
                    totals[ts][i]={
                        Type:"Delta",
                        State:ts,
                        Values:Replace(node.Values[i])
                    }
                return[{
                    Type:"State",
                    Value:ts,
                    InnerAction:index=>"Parse($"+index.toString()+");"
                }];
            }
        }
        Replaces["Mul"]=function(node)
        {
            if(node.Values.length==1)
                return Replace(node.Values[0]);
            else
            {
                for(var i=0;i<node.Values.length;i++)
                    node.Values[i]=Replace(node.Values[i]);
                return Array.prototype.concat(...node.Values);
            }
        }
        Replaces["Delta"]=function(node)
        {
            var value=Replace(node.Value)
            delete node.Value
            node.Values=value
            return value
        }
        function Replace(node)
        {
            console.log(node.Type)
            var r=Replaces[node.Type](node);
            console.log(node.Type,r);
            return r;
        }
        for(var i=0;i<trees.length;i++)
        {
            var delta=trees[i].Delta;
            totals[delta.State].push(delta)
            delta.Action=trees[i].Action;
            delta=Replace(delta)
        }
        console.log(states)
        console.log(terminals)
        console.log(totals)
        function ClearSimply(state)
        {
            if(totals[state].length!=1)return;
            console.log("Changing",state)
            var d=totals[state][0].Values
            var tc=false
            var dchanged=false
            for(var s in totals)
            {
                for(var i=0;i<totals[s].length;i++)
                {
                    var delta=totals[s][i].Values
                    var changed=false;
                    var result=[]
                    console.log(delta)
                    for(var j=0;j<delta.length;j++){
                        if(delta[j].Type=='State'&&delta[j].Value==state)
                        {
                            changed=true
                            if(changed&&!dchanged)
                            {
                                dchanged=true;
                                if(!state.startsWith("Temp"))
                                {
                                    if(d.length==1){
                                        var iastart=d[0].InnerAction
                                        d[0].InnerAction=index=>"$$.Up();"+iastart(index)
                                    }
                                    else{
                                        var iastart=d[1].InnerAction
                                        d[1].InnerAction=index=>"var t=$$.Pop();$$.Up();$$.Push(t);"+iastart(index)
                                    }
                                    var iaend=d[d.length-1].InnerAction
                                    d[d.length-1].InnerAction=index=>iaend(index)+"$$.Push({Type:'"+state+"',Values:$$.Down()});"
                                }
                            }
                            for(var t=0;t<d.length;t++)
                                result.push(d[t])
                        }
                        else result.push(delta[j])
                    }
                    if(changed){
                        tc=true
                        console.log("Changed",totals[s][i])
                        totals[s][i].Values=result
                    }
                }
            }
            if(tc){
                var index=states.indexOf(state)
                states.splice(index,1)
                console.log("Delete",state,states)
                delete totals[state]
            }
        }
        for(var state in totals)
            ClearSimply(state)
        console.log("Changed States",states)
        console.log("Changed Totals",totals)
        while(true){
            var ts=[]
            for(var state in totals)
                ts.push(totals[state])
            var csg=new CSG(states,terminals,Array.prototype.concat(...ts));
            console.log(csg)
            if(csg.Error.length==0)break;
            var changed=false;
            for(var i=0;i<csg.Error.length;i++){
                var error=csg.Error[i]
                var first=error.Deltas[0].Values[0].Value
                var success=true
                for(var j=1;j<error.Deltas.length;j++)
                    if(first!=error.Deltas[j].Values[0].Value)
                    {
                        success=false;
                        break;
                    }
                console.log(error,success)
                if(!success)continue;
                var ts="Temp"+(tempcount++).toString();
                totals[ts]=[]
                states.push(ts)
                for(var j=0;j<error.Deltas.length;j++)
                {
                    console.log("Change",error)
                    totals[ts][j]={
                        Type:"Delta",
                        State:ts,
                        Values:error.Deltas[j].Values.slice(1,error.Deltas[j].Values.length)
                    }
                }
                totals[error.State]=[{
                    Type:"Delta",
                    State:error.State,
                    Values:[
                        error.Deltas[0].Values[0],
                        {
                            Type:"State",
                            Value:ts,
                            InnerAction:index=>"Parse($"+index.toString()+");",
                        }
                    ]
                }]
                ClearSimply(error.State)
                changed=true;
                break;
            }
            if(!changed)break;
        }
        var csg=new CSG(states,terminals,Array.prototype.concat(...ts));
        console.log(csg)
        console.log(states)
        console.log(terminals)
        console.log(totals)
        for(var state in totals)
            for(var i=0;i<totals[state].length;i++){
                var delta=totals[state][i].Values;
                var a=""
                if(!state.startsWith("Temp"))
                a="$$.Up();"
                var d=""
                for(var j=0;j<delta.length;j++){
                    a+=delta[j].InnerAction(j)
                    if(delta[j].Type=="Terminal")
                        d+="'"+delta[j].Value+"'"
                    else d+="<"+delta[j].Value+">"
                }
                if(!state.startsWith("Temp"))
                a+="$$.Push({Type:'"+state+"',Values:$$.Down()});"
                totals[state][i].InnerAction=a;
                totals[state][i].DeltaString=d;
                console.log(state+"->"+d)
                console.log(a)
            }
        console.log(totals)
        this.States=states
        this.Terminals=terminals
        this.Deltas=[]
        for(var state in totals)
        for(var j=0;j<totals[state].length;j++)
        this.Deltas.push({
            State:state,
            Delta:totals[state][j].Values.map(d=>d.Value),
            Action:totals[state][j].InnerAction
        })
    }
    
}
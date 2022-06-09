export default class DFA
{
    constructor(states,terminals,ends,delta)
    {
        this.States=states;
        this.StateCount=states.length
        this.Terminals=terminals;
        this.TerminalCount=terminals.length
        this.Ends=ends;
        var deltas={}
        for(var i=0;i<states.length;i++)
        {
            var d={}
            for(var j=0;j<terminals.length;j++)
                d[terminals[j]]=null
            deltas[states[i]]=d
        }
        for(var i=0;i<delta.length;i++)
        {
            var start=delta[i].start
            var terminal=delta[i].terminal
            var end=delta[i].end
            deltas[start][terminal]=end
        }
        this.Deltas=deltas;
    }
    Simplify()
    {
        var ends=[]
        var nends=[]
        for(var i=0;i<this.Ends.length;i++)
            if(this.Ends[i])ends.push(this.States[i])
            else nends.push(this.States[i])
        var same={}
        for(var i=0;i<this.States.length;i++)
        {
            var s={}
            for(var j=0;j<this.States.length;j++)
                s[this.States[j]]=false
            same[this.States[i]]=s
        }
        for(var i=0;i<ends.length;i++)
        for(var j=0;j<nends.length;j++)
        {
            same[ends[i]][nends[j]]=true
            same[nends[j]][ends[i]]=true
        }
        var links={}
        for(var i=0;i<this.States.length;i++)
        {
            var l={}
            for(var j=0;j<this.States.length;j++)
                l[this.States[j]]={
                    X:this.States[i],
                    Y:this.States[j],
                    Last:null
                }
            links[this.States[i]]=l
        }
        for(var i=0;i<ends.length;i++)
        for(var j=0;j<ends.length;j++)
        if(i!==j)
        {
            var s=false;
            for(var k=0;k<this.TerminalCount;k++)
            {
                var di=this.Deltas[ends[i]][this.Terminals[k]]
                var dj=this.Deltas[ends[j]][this.Terminals[k]]
                if(di==null&&dj==null)continue
                if(di==null||dj==null||same[di][dj])
                {
                    s=true
                    break
                }
            }
            if(s)
            {
                var link=links[ends[i]][ends[j]]
                while(link!==null)
                {
                    same[link.X][link.Y]=true
                    same[link.Y][link.X]=true
                    link=link.Last
                }
            }
            else
            {
                for(var k=0;k<this.TerminalCount;k++)
                {
                    var di=this.Deltas[ends[i]][this.Terminals[k]]
                    var dj=this.Deltas[ends[j]][this.Terminals[k]]
                    if(di!==null&&dj!==null&&di!==dj)
                    {
                        if(ends[i]==di&&ends[j]==dj)continue
                        if(ends[j]==di&&ends[i]==dj)continue
                        links[di][dj].Last=links[ends[i]][ends[j]]
                        links[dj][di].Last=links[ends[j]][ends[i]]
                    }
                }
            }
        }
        for(var i=0;i<nends.length;i++)
        for(var j=0;j<nends.length;j++)
        if(i!==j)
        {
            var s=false;
            for(var k=0;k<this.TerminalCount;k++)
            {
                var di=this.Deltas[nends[i]][this.Terminals[k]]
                var dj=this.Deltas[nends[j]][this.Terminals[k]]
                if(di==null&&dj==null)continue
                if(di==null||dj==null||same[di][dj])
                {
                    s=true
                    break
                }
            }
            if(s)
            {
                var link=links[nends[i]][nends[j]]
                while(link!==null)
                {
                    same[link.X][link.Y]=true
                    same[link.Y][link.X]=true
                    link=link.Last
                }
            }
            else
            {
                for(var k=0;k<this.TerminalCount;k++)
                {
                    var di=this.Deltas[nends[i]][this.Terminals[k]]
                    var dj=this.Deltas[nends[j]][this.Terminals[k]]
                    if(di!==null&&dj!==null&&di!==dj)
                    {
                        if(nends[i]==di&&nends[j]==dj)continue
                        if(nends[j]==di&&nends[i]==dj)continue
                        links[di][dj].Last=links[nends[i]][nends[j]]
                        links[dj][di].Last=links[nends[j]][nends[i]]
                    }
                }
            }
        }
        var r={}
        for(var i=0;i<this.StateCount;i++)
            r[this.States[i]]=-1
        var rl=0
        var result=[]
        var rends=[]
        var rstates=[]
        var rdeltas=[]
        for(var i=0;i<this.StateCount;i++)
        if(r[this.States[i]]<0)
        {
            var t=[]
            for(var j=0;j<this.StateCount;j++)
            if(!same[this.States[i]][this.States[j]])
            {
                r[this.States[j]]=rl
                t.push(this.States[j])
            }
            // rstates.push("S"+rl.toString())
            rstates.push(String.fromCharCode('A'.charCodeAt(0)+rl))
            result.push(t)
            rends.push(ends.indexOf(this.States[i])!==-1)
            rl++
        }
        for(var i=0;i<this.StateCount;i++)
        for(var j=0;j<this.TerminalCount;j++)
        if(this.Deltas[this.States[i]][this.Terminals[j]]!==null)
        {
            var from=rstates[r[this.States[i]]]
            var to=rstates[r[this.Deltas[this.States[i]][this.Terminals[j]]]]
            rdeltas.push({
                start:from,
                terminal:this.Terminals[j],
                end:to
            })
        }
        return new DFA(rstates,this.Terminals,rends,rdeltas)
    }
    LG()
    {
        var se={}
        for(var i=0;i<this.StateCount;i++)
            se[this.States[i]]=this.Ends[i]
        var e={}
        for(var i=0;i<this.StateCount;i++)
        {
            var count=0;
            for(var j=0;j<this.TerminalCount;j++)
                if(this.Deltas[this.States[i]][this.Terminals[j]]!==null)
                    count++;
            e[this.States[i]]=count;
        }
        var lg=[]
        for(var i=0;i<this.StateCount;i++)
        {
            var r=[]
            var re=[]
            for(var j=0;j<this.TerminalCount;j++)
                if(this.Deltas[this.States[i]][this.Terminals[j]]!==null&&e[this.Deltas[this.States[i]][this.Terminals[j]]]!=0)
                    r.push(this.Terminals[j]+this.Deltas[this.States[i]][this.Terminals[j]])
            for(var j=0;j<this.TerminalCount;j++)
                if(this.Deltas[this.States[i]][this.Terminals[j]]!==null&&se[this.Deltas[this.States[i]][this.Terminals[j]]])
                    r.push(this.Terminals[j])
            if(r.length==0)continue
            if(this.Ends[i])lg.push("*"+this.States[i]+"->"+r.join("|"))
            else lg.push(this.States[i]+"->"+r.join("|"))
        }
        return{
            States:this.States.join(","),
            Terminals:this.Terminals.join(","),
            Deltas:lg
        }
    }
}
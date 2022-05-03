import Node from "./Node"
import SelfConnection from "./SelfConnection"
import Connection from "./Connection"

export default class Circle
{
    constructor(nodes,selfconntection,connections)
    {
        this.R=100/(1-Math.cos(Math.PI*2/nodes.length))
        this.Margin=100
        var nodecount=nodes.length
        this.Nodes={}
        for(var i=0;i<nodecount;i++)
            this.Nodes[nodes[i]]=new Node("Node"+i.toString(),nodes[i],this.R,this.Margin,Math.PI*2*i/nodecount)
        this.SelfConnections=[]
        for(var i=0;i<selfconntection.length;i++)
            this.SelfConnections[i]=new SelfConnection(this.Nodes[selfconntection[i].Node],selfconntection[i].Text)
        this.Connections=[]
        for(var i=0;i<connections.length;i++)
            this.Connections[i]=new Connection(this.Nodes[connections[i].From],this.Nodes[connections[i].To],connections[i].Text)
        this.Width=this.Height=(this.Margin+this.R)*2
    }
    getnodes()
    {
        var r=[]
        for(var k in this.Nodes)
            r.push(this.Nodes[k].get())
        return r
    }
    getconnections()
    {
        var r=[]
        for(var i=0;i<this.SelfConnections.length;i++)
            r[i]=this.SelfConnections[i].get()
        for(var i=0;i<this.Connections.length;i++)
            r[this.SelfConnections.length+i]=this.Connections[i].get()
        return r
    }
    static FromDFA(dfa)
    {
        var connections={}
        for(var i=0;i<dfa.States.length;i++){
            var state=dfa.States[i];
            var cs={}
            for(var j=0;j<dfa.States.length;j++)
                cs[dfa.States[j]]=[]
            connections[state]=cs
        }
        for(var i=0;i<dfa.States.length;i++){
            var state=dfa.States[i];
            for(var j=0;j<dfa.Terminals.length;j++)
            {
                var t=dfa.Terminals[j];
                var d=dfa.Deltas[state][t];
                if(d!==null)connections[state][d].push(t)
            }
        }
        var self=[]
        var cross=[]
        for(var i=0;i<dfa.States.length;i++){
            var state=dfa.States[i];
            for(var j=0;j<dfa.States.length;j++){
                if(connections[state][dfa.States[j]].length>0)
                {
                    var c=connections[state][dfa.States[j]]
                    c.sort()
                    var s=[]
                    var from=c[0],to=c[0]
                    for(var t=1;t<c.length;t++)
                    if(c[t].charCodeAt()==to.charCodeAt()+1)to=c[t]
                    else {
                        if(from==to)s.push(from)
                        else s.push(from+"-"+to)
                        from=to=c[t]
                    }
                    if(from==to)s.push(from)
                    else s.push(from+"-"+to)
                    console.log(s)
                    if(i==j)
                        self.push({
                            Node:state,
                            Text:s.join(" ")
                        })
                    else
                        cross.push({
                            From:state,
                            To:dfa.States[j],
                            Text:s.join(" ")
                        })
                }
            }
        }
        return new Circle(dfa.States,self,cross)
    }
}
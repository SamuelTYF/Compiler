class TrieTreeNode
{
    constructor(keys)
    {
        this.Values=new Map(keys.map(k=>[k,null]))
        this.Value=null
    }
}
class TrieTree
{
    constructor(keys)
    {
        this.Keys=keys
        this.Values=new Map(keys.map(k=>[k,null]))
    }
    find(keys)
    {
        var node=this
        for(var i=0;i<keys.length;i++)
        {
            if(node.Values.get(keys[i])==null)
                node.Values.set(keys[i],new TrieTreeNode(this.Keys))
            node=node.Values.get(keys[i])
        }
        return node
    }
    set(keys,value)
    {
        var node=this.find(keys)
        node.Value=value
    }
    get(keys)
    {
        return this.find(keys).Value
    }
}
export class OPG_Parser
{
    constructor(json)
    {
        this.States=json.States
        this.Terminals=json.Terminals
        this.TrieTree=new TrieTree(Array.prototype.concat(json.States,json.Terminals))
        this.Deltas=json.Deltas
        json.Deltas.map(delta=>this.TrieTree.set(delta.Delta,delta))
        this.Map=new Map(json.Deltas.map(delta=>[delta.Delta,delta]))
        this.Ops=json.Ops
    }
    Push(value)
    {
        this.Stack={
            Value:value,
            Last:this.Stack
        }
    }
    Pop()
    {
        var value=this.Stack.Value
        this.Stack=this.Stack.Last
        return value
    }
    Reduce()
    {
        var array=[]
        var types=[]
        if(this.States.includes(ct))
        {
            var value=this.Pop()
            array.push(value)
            types.push(value.Type)
        }
        var ct=this.Stack.Value.Type
        {
            var value=this.Pop()
            array.push(value)
            types.push(value.Type)
        }
        while(this.Stack!==null)
        {
            console.log(this.Stack.Value)
            if(this.States.includes(this.Stack.Value.Type))
            {
                var value=this.Pop()
                array.push(value)
                types.push(value.Type)
            }
            else{
                var op=this.Ops.get(this.Stack.Value.Type).get(ct)
                if(op==null||op=='>')
                    return false
                if(op=='<')
                {
                    console.log("Find",types.reverse())
                    var delta=this.TrieTree.get(types.reverse())
                    console.log("Reduce",delta)
                    var value={Type:delta.State,Values:array.reverse()}
                    while(true)
                    {
                        var node=this.TrieTree.find([value.Type])
                        if(node.Value==null)break
                        else{
                            delta=node.Value
                            console.log("Reduce",delta)
                            value={Type:delta.State,Values:array.reverse()}
                        }
                    }
                    this.CurrentP=this.Stack.Value.Type
                    this.Push({Type:delta.State,Values:array.reverse()})
                    return true
                }
                else
                {
                    var value=this.Pop()
                    ct=value.Type
                    array.push(value)
                    types.push(ct)
                }
            }
        }
    }
    Parse(tokenizer)
    {
        this.Stack={
            Value:{Type:"EOF"},
            Last:null
        }
        this.CurrentP=this.Stack.Value.Type
        while(true)
        {
            var t=tokenizer.Get()
            console.log("Get Token ",t)
            if(t==null)return null
            while(true)
            {
                console.log(this.Stack)
                var op=this.Ops.get(this.CurrentP).get(t.Type)
                console.log(this.CurrentP,op,t.Type)
                if(op==null)return null
                if(op=='>')
                {
                    if(!this.Reduce())return null
                }
                else
                {
                    console.log("Push Token",t)
                    this.Push(t)
                    this.CurrentP=t.Type
                    break
                }
            }
            if(t.Type=='EOF')
            {
                if(this.Stack==null||this.Stack.Last!==null)return null
                else return this.Stack.Value
            }
        }
    }
}
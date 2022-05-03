import Node from "./Node";
export default class Manager
{
    constructor()
    {
        this.Names=[]
        this.Nodes={}
        this.Connections=[]
    }
    RegisterNode(node)
    {
        this.Names.push(node.Name);
        this.Nodes[node.Name]=node;
    }
    RegisterConnection(connection)
    {
        this.Connections.push(connection)
    }
    getnodes()
    {
        return this.Names.map(name=>this.Nodes[name].get())
    }
    getconnections()
    {
        return this.Connections.map(connection=>connection.get())
    }
}
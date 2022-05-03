import Port from "./Port";
export default class Node
{
    Name;
    Text;
    X;
    Y;
    InputPort;
    OutputPort;
    constructor(name,text,x,y,shape="Ellipse")
    {
        this.Name=name;
        this.Text=text;
        this.X=x;
        this.Y=y;
        this.InputPort=[new Port(this,0,false,0.5,0)];
        this.OutputPort=[new Port(this,0,true,0.5,1)];
        this.Shape=shape;
    }
    get()
    {
        return {
            id: this.Name,
            offsetX: this.X,
            offsetY: this.Y,
            annotations: [{ content: this.Text,style :{
                bold: true,
                fontSize: 20,
                color: "black"
            }}],
            ports: Array.prototype.concat(this.InputPort,this.OutputPort).map(p=>p.get()),
            shape : { type: "Basic", shape: this.Shape },
            height : 100,
            width : 100,
            style : { fill: "#ebf8fb", strokeColor: "#baeaf5" }
        }
    }
}
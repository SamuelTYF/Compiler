import { PortVisibility } from "@syncfusion/ej2-react-diagrams";
export default class Port
{
    Node;
    Index;
    Output;
    X;
    Y;
    constructor(node,index,output,x,y)
    {
        this.Node=node;
        this.Index=index;
        this.Output=output;
        this.X=x;
        this.Y=y;
    }
    get()
    {
        this.Name=this.Node.Name+"_P"+(this.Output?"O":"I")+this.Index.toString();
        return {
            id: this.Name,
            shape: "Circle",
            offset: { x: this.X, y: this.Y },
            height: 8,
            width: 8,
            visibility: PortVisibility.Hidden,
            style : { fill: "#366f8c", strokeColor: "#366f8c" }
        }
    }
}
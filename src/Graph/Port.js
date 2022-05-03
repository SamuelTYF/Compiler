import { PortVisibility } from "@syncfusion/ej2-react-diagrams";
export default class Port
{
    Node;
    Index;
    R;
    Theta;
    constructor(node,index,r,theta)
    {
        this.Node=node;
        this.Index=index;
        this.R=r;
        this.Theta=theta;
    }
    get()
    {
        this.Name=this.Node.Name+"_P"+this.Index.toString();
        return {
            id: this.Name,
            shape: "Circle",
            offset: { x:0.5+0.5*Math.cos(this.Theta), y: 0.5+0.5*Math.sin(this.Theta) },
            height: 8,
            width: 8,
            visibility: PortVisibility.Hidden,
            style : { fill: "#366f8c", strokeColor: "#366f8c" }
        }
    }
}
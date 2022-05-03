import Port from "./Port";
export default class Node
{
    constructor(name,text,r,margin,theta)
    {
        this.Name=name;
        this.Text=text;
        this.R=r;
        this.Margin=margin
        this.Theta=theta;
        this.Port=new Port(this,0,1,Math.PI+theta)
        this.PortIn=new Port(this,1,1,Math.PI*5/3+theta)
        this.PortOut=new Port(this,2,1,Math.PI*7/3+theta)
    }
    get()
    {
        return {
            id: this.Name,
            offsetX: this.Margin+this.R+this.R*Math.cos(this.Theta),
            offsetY: this.Margin+this.R+this.R*Math.sin(this.Theta),
            annotations: [{ content: this.Text,style :{
                bold: true,
                fontSize: 20,
                color: "black"
            }}],
            ports: [this.Port,this.PortIn,this.PortOut].map(p=>p.get()),
            shape : { type: "Basic", shape: "Ellipse" },
            height : 100,
            width : 100,
            style : { fill: "#ebf8fb", strokeColor: "#baeaf5" }
        }
    }
}
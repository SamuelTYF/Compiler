import Node from "./Node";
export default class Connection
{
    constructor(from,to,text)
    {
        this.From=from;
        this.To=to;
        this.Text=text;
    }
    get()
    {
        this.Name="Connection_"+this.From.Name+"_"+this.To.Name;
        return {
            id: this.Name,
            sourceID: this.From.Name,
            sourcePortID:this.From.OutputPort[0].Name,
            targetID: this.To.Name,
            targetPortID:this.To.InputPort[0].Name,
            type : "Bezier",
            segments:[
                {
                    type : "Bezier",
                    vector1:{
                        angle:90,
                        distance:80
                    },
                    vector2:{
                        angle:-90,
                        distance:80
                    }
                }
            ],
            style : { strokeColor: "#8cdcef", strokeWidth: 1 },
            annotations:[{content:this.Text}],
            targetDecorator : {
                width: 10,
                height: 10,
                style: { fill: "#8cdcef", strokeColor: "#8cdcef", strokeWidth: 2 },
                shape: "Arrow"
            }
        }
    }
}
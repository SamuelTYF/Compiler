export default class SelfConnection
{
    constructor(node,text)
    {
        this.Node=node;
        this.Text=text;
    }
    get()
    {
        this.Name="Connection_"+this.Node.Name;
        return {
            id: this.Name,
            sourceID: this.Node.Name,
            sourcePortID:this.Node.PortOut.Name,
            targetID: this.Node.Name,
            targetPortID:this.Node.PortIn.Name,
            type : "Bezier",
            segments:[
                {
                    type : "Bezier",
                    vector1:{
                        angle:this.Node.Theta*180/Math.PI+30,
                        distance:150
                    },
                    vector2:{
                        angle:this.Node.Theta*180/Math.PI-30,
                        distance:150
                    }
                }
            ],
            style : { strokeColor: "#8cdcef", strokeWidth: 1 },
            annotations:[{content:this.Text,style :{
                fontSize: 20,
                color: "black"
            }}],
            targetDecorator : {
                width: 10,
                height: 10,
                style: { fill: "#8cdcef", strokeColor: "#8cdcef", strokeWidth: 2 },
                shape: "Arrow"
            }
        }
    }
}
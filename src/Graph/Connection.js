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
            targetID: this.To.Name,
            // type : "Bezier",
            // segments:[
            //     {
            //         type : "Bezier",
            //         vector1:{
            //             angle:(this.From.Theta+this.To.Theta)*180/Math.PI/2+90,
            //             distance:150
            //         },
            //         vector2:{
            //             angle:(this.From.Theta+this.To.Theta)*180/Math.PI/2-90,
            //             distance:150
            //         }
            //     }
            // ],
            type:"Straight",
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
import Connection from "./Connection";
import Node from "./Node";
export default class Tree
{
    Width;
    Height;
    Value;
    Children;
    Options;
    GlobalOptions;
    constructor(globaloptions,options)
    {
        this.Options=options;
        this.GlobalOptions=globaloptions;
        this.Children=options.children.map(option=>new Tree(globaloptions,option));
        if(this.Children.length==0)
        {
            this.Width=globaloptions.width;
            this.Height=globaloptions.height;
        }
        else
        {
            this.Width=(this.Children.length-1)*globaloptions.marginx;
            this.Height=0;
            this.Children.map(node=>{
                this.Width+=node.Width;
                if(node.Height>this.Height)
                    this.Height=node.Height;
            });
            this.Height+=globaloptions.height+globaloptions.marginy;
        }
    }
    render(manager,offsetx,offsety)
    {
        if(this.Children.length==0)
        {
            var index=manager.Names.length;
            var name="Node"+index.toString();
            this.Value=new Node(name,this.Options.text,offsetx,offsety,this.Options.shape);
            manager.RegisterNode(this.Value);
        }
        else
        {
            var index=manager.Names.length;
            var name="Node"+index.toString();
            this.Value=new Node(name,this.Options.text,offsetx+(this.Width-this.GlobalOptions.width)/2,offsety,this.Options.shape);
            manager.RegisterNode(this.Value);
            var offset=offsetx
            this.Children.map(node=>{
                node.render(manager,offset,offsety+this.GlobalOptions.height+this.GlobalOptions.marginy);
                var connection=new Connection(this.Value,node.Value);
                manager.RegisterConnection(connection);
                offset+=node.Width+this.GlobalOptions.marginx;
            });
        }
    }
}
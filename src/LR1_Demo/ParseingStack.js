export default class ParseingStack{
    constructor()
    {
        this.Stacks=[[]]
        this.Indexs=[0]
        this.Level=0;
    }
    Pop()
    {
        return this.Stacks[this.Level][--this.Indexs[this.Level]];
    }
    Push(value)
    {
        if(this.Level==-1)this.Result=value;
        else this.Stacks[this.Level][this.Indexs[this.Level]++]=value;
    }
    Up()
    {
        this.Level++
        this.Stacks[this.Level]=[]
        this.Indexs[this.Level]=0
    }
    Down()
    {
        var result=this.Stacks[this.Level].slice(0,this.Indexs[this.Level]);
        this.Indexs[this.Level]=0;
        this.Stacks[this.Level]=[]
        this.Level--;
        return result;
    }
}
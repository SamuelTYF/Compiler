export default class ValueSet
{
    constructor()
    {
        this.Values=[]
    }
    Add(value)
    {
        if(!this.Values.includes(value))
        {
            this.Values.push(value);
            return true;
        }else return false;
    }
    AddRange(values)
    {
        var update=false;
        for(var i=0;i<values.length;i++)
            update|=this.Add(values[i]);
        return update;
    }
    Has(value)
    {
        return this.Values.includes(value)
    }
}
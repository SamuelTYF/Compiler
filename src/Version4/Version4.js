import { Component } from "react";
import regex_json from "./Regex.json"
import test_json from "./Test.json"
import CSG from "./CSG";

export default class Version4 extends Component
{
  constructor(props)
  {
    super(props)
    this.csg=new CSG(test_json)
    console.log(this.csg)
    var table={}
    for(var i=0;i<this.csg.States.length;i++)
    {
      var r={}
      var s=this.csg.Selections[this.csg.States[i]]
      for(var j=0;j<this.csg.Terminals.length;j++)
      {
        var t=this.csg.Terminals[j];
        var tt=[]
        for(var kk=0;kk<s[t].length;kk++)
        {            
          console.log(s[t][kk])
          if(s[t][kk].Type=="Synch"){
            tt[kk]="Synch"
        }
          else
          {
            var l=[]
            var d=s[t][kk].Delta
            for(var k=0;k<d.length;k++)
            if(d[k].Type=="Terminal")l.push(d[k].Terminal);
            else l.push(d[k].State)
            tt[kk]=l.join("");
          }
        }
        r[t]=JSON.stringify(tt,null,2)
      }
      table[this.csg.States[i]]=r
    }
    console.log(table)
    this.state={
      States:this.csg.States,
      Terminals:this.csg.Terminals,
      Selections:table
    }
  }
  render()
  {
    return(
      <div>
        <table width="100%" border="2px" style={{borderSpacing:"0px",textAlign:"center"}}>
          <thead>
            <td width={(100.0/(this.state.Terminals.length+1)).toString()+"%"}></td>
            {
              this.state.Terminals.map(terminal=>{
                return <td width={(100.0/(this.state.Terminals.length+1)).toString()+"%"}>{terminal}</td>
              })
            }
          </thead>
          <tbody>
            {
              this.state.States.map(state=>{
                return (<tr>
                  <td>{state}</td>
                  {
                    this.state.Terminals.map(terminal=>{
                      return <td>{this.state.Selections[state][terminal]}</td>
                    })
                  }
                </tr>)
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}
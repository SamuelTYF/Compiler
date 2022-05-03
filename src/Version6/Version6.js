import { Component } from "react";
import RegParser from "./RegParser";

export default class Version6 extends Component
{
  constructor(props)
  {
    super(props)

    this.RegParser=new RegParser()

    var text="(1|2*)+";

    var result=this.RegParser.Parse(text);

    this.state={
        text:text,
        enfa:result.enfa==null?"Error":JSON.stringify(result.enfa,null,2),
        nfa:result.nfa==null?"Error":JSON.stringify(result.nfa,null,2),
        dfa:result.dfa==null?"Error":JSON.stringify(result.dfa.LG(),null,2),
        dfas:result.dfas==null?"Error":JSON.stringify(result.dfas.LG(),null,2)
    }
  }
  change()
  {
    var text=this.textbox.value;
    
    var result=this.RegParser.Parse(text);

    this.setState({
        text:text,
        enfa:result.enfa==null?"Error":JSON.stringify(result.enfa,null,2),
        nfa:result.nfa==null?"Error":JSON.stringify(result.nfa,null,2),
        dfa:result.dfa==null?"Error":JSON.stringify(result.dfa.LG(),null,2),
        dfas:result.dfas==null?"Error":JSON.stringify(result.dfas.LG(),null,2)
    })

  }
  render()
  {
    return(
      <div>
        <input ref={text=>(this.textbox=text)} type="text" value={this.state.text} onChange={this.change.bind(this)}></input>
        <table width="100%">
            <thead>
                <tr>
                    <td width="20%">ENFA</td>
                    <td width="20%">NFA</td>
                    <td width="50%"><div>DFA</div><div>Simplified DFA</div></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td valign="top"><div style={{whiteSpace:"pre"}}>{this.state.enfa}</div></td>
                    <td valign="top"><div style={{whiteSpace:"pre"}}>{this.state.nfa}</div></td>
                    <td valign="top">
                        <div style={{whiteSpace:"pre"}}>{this.state.dfa}</div>
                        <div style={{whiteSpace:"pre"}}> {this.state.dfas}</div>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    )
  }
}
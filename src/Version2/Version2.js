import { Component } from "react";
import Regs from "./Regs";
import token_json from "../Version1/Token.json"

export default class Version2 extends Component
{
  constructor(props)
  {
    super(props)
    var regs=new Regs(token_json);
    var nfa=regs.Build();
    console.log(nfa)
    var dfa=nfa.ToDFA();
    console.log(dfa);
    this.state={
      rules:regs.Rules,
      nfa:nfa,
      dfa:dfa
    }
  }
  render()
  {
    return(
      <div style={{display:"flex"}}>
        <div style={{whiteSpace:"pre"}}>
          {JSON.stringify(this.state.dfa,null,2)}
        </div>
        <div>
          {
            this.state.rules.map(rule=>{
              return (<div key={rule}>
                <div style={{whiteSpace:"pre"}}>{rule.dfa==null?"Error":JSON.stringify(rule.dfa.LG(),null,2)}</div>
                <div>{rule.action}</div>
              </div>)
            })
          }
        </div>
      </div>
    )
  }
}
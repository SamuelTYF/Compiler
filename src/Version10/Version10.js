import { Component } from "react";
import lr0_json from "./lr0.json";
import LR0 from "./LR0";
import LR0_Parser from "./LR0_Parser";
import Regs from "../Version7/Regs";
import Create_DFA_Tokenizor from "../Version5/DFA_Tokenizor";
import lr0_token from "./lr0_token.json"
import { Markdown } from "../Markdown";
import SLR1 from "./SLR1";

export default class Version10 extends Component
{
  constructor(props)
  {
    super(props)
    var lr0=new SLR1(lr0_json)
    console.log(lr0)
    lr0.Print()
    var parser=new LR0_Parser(lr0.GetJson())
    console.log(parser)

    var regs=new Regs(lr0_token);
    var nfa=regs.Build();
    console.log(nfa)
    var dfa=nfa.ToDFA();
    console.log(dfa);
    var tokenizor=Create_DFA_Tokenizor(dfa)
    tokenizor.StartParse("a=**a")
    var result=parser.Parse(tokenizor)
    console.log(result)

    this.state={
      lr0:lr0
    }
  }
  readerAction(action)
  {
    return <div>
      {<div>{action.Type}</div>}
      {action.Type=="Reduce"?<div>{this.state.lr0.Deltas[action.Delta].State+"->"+this.state.lr0.Deltas[action.Delta].Delta.join("")}</div>:null}
      {action.Type=="Push"?<div>{action.State}</div>:null}
    </div>
  }
  render() {
    return (
    <div>
      <table border="2px" style={{borderSpacing:"0px"}}>
        <thead>
          <td width={100}>Index</td>
          <td width={100}>Closure</td>
          {
            this.state.lr0.Terminals.map(t=><td width={100}>{t}</td>)
          }
          {
            this.state.lr0.States.map(s=><td width={100}>{s}</td>)
          }
        </thead>
        <tbody>
          {
            this.state.lr0.Closures.map(closure=><tr key={closure.Index}>
              <td>{closure.Index}</td>
              <td><pre>{closure.Print()}</pre></td>
              {
                this.state.lr0.Terminals.map(t=><td>{this.readerAction(this.state.lr0.TerminalDeltas[closure.Index].get(t))}</td>)
              }
              {
                this.state.lr0.States.map(s=><td>{this.readerAction(this.state.lr0.StateDeltas[closure.Index].get(s))}</td>)
              }
            </tr>)
          }
        </tbody>
      </table>
      <Markdown children={"```javascript\n"+JSON.stringify(this.state.lr0.GetJson(),null,2)+"\n```"}></Markdown>
    </div>
    )
  }
}
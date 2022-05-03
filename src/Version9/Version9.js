import { Component } from "react";
import Create_DFA_Tokenizor from "../Version5/DFA_Tokenizor";
import lr_json from "./lr.json"
import { Markdown } from "../Markdown";
import OPG from "./OPG";
import { OPG_Parser } from "./OPG_Parser";
import opg_token from "./opg_token.json"
import Regs from "../Version7/Regs";

export default class Version9 extends Component
{
  constructor(props)
  {
    super(props)
    var opg=new OPG(lr_json)
    console.log(opg.GetMarkdown())
    opg.ComputePriorityFunction()
    console.log(opg.GetJson())
    var parser=new OPG_Parser(opg.GetJson())
    console.log(parser)

    var regs=new Regs(opg_token);
    var nfa=regs.Build();
    console.log(nfa)
    var dfa=nfa.ToDFA();
    console.log(dfa);
    var tokenizor=Create_DFA_Tokenizor(dfa)
    tokenizor.StartParse("(a+a)")
    var result=parser.Parse(tokenizor)
    console.log(result)
    this.state={
      opg:opg,
      json:JSON.stringify(opg.GetJson(),null,2)
    }
  }
  render() {
    return (
    <div style={{fontSize:20}}>
      <Markdown children={this.state.opg.GetMarkdown()}></Markdown>
      <Markdown children={this.state.opg.GetMarkdownPriorityFunction()}></Markdown>
      <Markdown children={"```json\n"+this.state.json+"\n```"}></Markdown>
    </div>
    )
  }
}
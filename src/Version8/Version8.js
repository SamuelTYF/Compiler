import { Component } from "react";
import LL1 from "../Version5/LL1";
import token_json from "./BNF_Token.json"
import bnf_json from "./BNF.json"
import Create_DFA_Tokenizor from "../Version5/DFA_Tokenizor";

export default class Version8 extends Component
{
  constructor(props)
  {
    super(props)
    this.text="<Start>->'State''->'<S>'EOF'"
    this.tokenizor=Create_DFA_Tokenizor(token_json)
    this.ll1=new LL1(bnf_json)
    this.parser=this.ll1.CreateParse()
    console.log(this.text);
    console.log(this.tokenizor);
    console.log(this.ll1);
    console.log(this.parser)
    this.tokenizor.StartParse(this.text);
    var result=this.parser.Parse(this.tokenizor);
    console.log(result);
    var tree=this.parser.Encode(result)
    console.log(tree)
  }
  render() {
    return (
    <div>
      
    </div>)
  }
}
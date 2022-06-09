import { Component } from "react";
import Regs from "./Regs";
import bnf_json from "./BNF_Token.json"
import test_json from "./Test.json"
import ll1_json from "./BNF_LL1.json"
import Create_DFA_Tokenizer from "../Version5/DFA_Tokenizer";
import LL1 from "../Version5/LL1";
import regex_text from "./Regex.json"
import BNF from "./BNF";

export default class Version7 extends Component
{
  constructor(props)
  {
    super(props)
    console.log(test_json)
    var regs=new Regs(bnf_json);
    var nfa=regs.Build();
    console.log(nfa)
    var dfa=nfa.ToDFA();
    console.log(dfa);
    this.tokenizer=Create_DFA_Tokenizer(dfa)
    this.ll1=new LL1(ll1_json)
    this.parser=this.ll1.CreateParse()
    console.log(this.text);
    console.log(this.tokenizer);
    console.log(this.ll1);
    console.log(this.parser)
    this.state={
      dfa:dfa,
      parser:this.parser,
      bnf:null,
      ll1_parser:null
    }
  }
  parse()
  {
    var trees=[]
    for(var text in test_json){
      console.log(text)
      this.tokenizer.StartParse(text);
      var tree=this.parser.Parse(this.tokenizer);
      console.log(tree);
      var result=this.parser.Encode(tree);
      console.log(result)
      trees.push({
        Delta:result,
        Action:test_json[text]
      })
    }
    console.log(trees)
    var bnf=new BNF(trees)
    var ll1=new LL1(bnf)
    this.setState({
      bnf:bnf,
      ll1_parser:ll1.GetJson()
    })
  }
  render()
  {
    return(
    <div>
      <button onClick={this.parse.bind(this)}>Parse</button>
      <div style={{display:"flex"}}>
        <div style={{whiteSpace:"pre"}}>
          {JSON.stringify(this.state.dfa,null,2)}
        </div>
        <div style={{whiteSpace:"pre"}}>
          {JSON.stringify(this.state.parser,null,2)}
        </div>
        <div style={{whiteSpace:"pre"}}>
          {JSON.stringify(this.state.bnf,null,2)}
        </div>
        <div style={{whiteSpace:"pre"}}>
          {JSON.stringify(this.state.ll1_parser,null,2)}
        </div>
      </div>
    </div>
    )
  }
}
import { Component, createRef } from "react";
import { TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import CFG_Token from "./CFG_Token.json"
import Regs from "./Regs";
import Create_DFA_Tokenizer from "./DFA_Tokenizer";
import CFG_Grammar from "./CFG_Grammar.json"
import LALR from "./LALR"
import LR1_Parser from "./LR1_Parser";
import { Markdown } from "../Markdown";
import "@syncfusion/ej2-react-inputs/styles/bootstrap.css"
import Grammar from "./Grammar.json"
import Token from "./Token.json"
import { ButtonComponent, CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import "@syncfusion/ej2-react-buttons/styles/bootstrap.css"
import "@syncfusion/ej2-base/styles/bootstrap.css"
import Tokenizer from "../Parser_Demo/Tokenizer"

export default class LALR_Demo extends Component
{
  constructor(props)
  {
    super(props)
    this.GrammarBox=createRef()
    this.TokenBox=createRef()
    this.TextBox=createRef()

    this.Tokenizer=new Tokenizer()
    var grammar=new LALR(CFG_Grammar)
    console.log(grammar)
    this.Parser=new LR1_Parser(grammar.GetJson())
    this.Parser.Build()
    console.log(this.Parser)

    var lr1=new LALR(CFG_Grammar)
    this.InitGrammar=lr1.Deltas.map(d=>"<"+d.State+">->"+d.Delta.map(value=>lr1.States.includes(value)?"<"+value+">":"'"+value+"'").join("")+(typeof(d.Action)=="undefined"?"":":"+d.Action)).join("\n")
    this.InitToken=""
    for(var key in Token)
      this.InitToken+=key+"\n"+Token[key]+"\n"
    this.state={
      Parseing:false,
      Tokenizer:this.BuildTokenizer(Token),
      LR1:lr1,
      PredictionTable:false,
      TokenJson:false,
      GrammarJson:false,
      ResultJson:true,
      Build:false,
      result:null
    }
  }
  BuildTokenizer(json)
  {
    var regs=new Regs(json);
    var nfa=regs.Build();
    var dfa=nfa.ToDFA();
    var Tokenizer=Create_DFA_Tokenizer(dfa)
    console.log(Tokenizer)
    return Tokenizer
  }
  CreateTokenizer()
  {
    var texts=this.TokenBox.current.value.split("\n")
    texts=texts.filter(value=>value.length>0)
    if(texts.length%2==1)
    {
      console.log("Error",texts.length)
      return
    }
    var json={}
    for(var i=0;i<texts.length;i+=2)
      json[texts[i]]=texts[i+1]
    var tokenizer=this.BuildTokenizer(json)
    this.setState({
      Tokenizer:tokenizer
    })
  }
  CreateParser()
  {
    var texts=this.GrammarBox.current.value.split("\n")
    texts=texts.filter(value=>value.length>0)
    var deltas=texts.map(text=>{
      this.Tokenizer.StartParse(text)
      var result=this.Parser.Parse(this.Tokenizer)
      return result
    }).filter(value=>value!==null)
    console.log(deltas)
    var lr1=new LALR(deltas)
    console.log(lr1)
    this.setState({
      LR1:lr1
    })
  }
  Parse()
  {
    var text=this.TextBox.current.value
    this.state.Tokenizer.StartParse(text)
    var Parser=new LR1_Parser(this.state.LR1.GetJson())
    if(this.state.Build)
      Parser.Build()
    var result=Parser.Parse(this.state.Tokenizer)
    console.log(result)
    this.setState({
      result:result
    })
  }
  textChange(e)
  {
    var texts=e.value.split("\n")
    e.target.addAttributes({rows:texts.length+2})
  }
  readerAction(action)
  {
    return <div>
      {/* {<div>{action.Type}</div>} */}
      {action.Type=="Reduce"?<div style={{textAlign:"left"}}>{this.state.LR1.Deltas[action.Delta].State+"->"+this.state.LR1.Deltas[action.Delta].Delta.map(value=>this.state.LR1.States.includes(value)?"<"+value+">":"'"+value+"'").join("")}</div>:null}
      {action.Type=="Push"?<div>{action.State}</div>:null}
      {action.Type=="Error"?<div style={{color:'red'}}>{action.Info}</div>:null}
    </div>
  }
  check(e)
  {
    console.log(e.target)
    var a={}
    a[e.target.value]=e.target.checked
    this.setState(a)
  }
  render() {
    return (
        <div>
            <ButtonComponent onClick={this.CreateTokenizer.bind(this)}>CreateTokenizer</ButtonComponent>
            <ButtonComponent onClick={this.CreateParser.bind(this)}>CreateParser</ButtonComponent>
            <ButtonComponent onClick={this.Parse.bind(this)}>Parse</ButtonComponent>
            <CheckBoxComponent label="Build" value={"Build"} checked={this.state.Build} onChange={this.check.bind(this)}></CheckBoxComponent>
            <CheckBoxComponent label="Prediction Table" value="PredictionTable" checked={this.state.PredictionTable} onChange={this.check.bind(this)}></CheckBoxComponent>
            <CheckBoxComponent label="TokenJson" value="TokenJson" checked={this.state.TokenJson} onChange={this.check.bind(this)}></CheckBoxComponent>
            <CheckBoxComponent label="GrammarJson" value="GrammarJson" checked={this.state.GrammarJson} onChange={this.check.bind(this)}></CheckBoxComponent>
            <CheckBoxComponent label="ResultJson" value="ResultJson" checked={this.state.ResultJson} onChange={this.check.bind(this)}></CheckBoxComponent>
            <TextBoxComponent htmlAttributes={{rows:this.InitToken.split("\n").length+2}} multiline={true} floatLabelType="Auto" value={this.InitToken} placeholder="Enter The Token" ref={this.TokenBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <TextBoxComponent htmlAttributes={{rows:this.InitGrammar.split("\n").length+2}} multiline={true} floatLabelType="Auto" value={this.InitGrammar} placeholder="Enter The Grammar" ref={this.GrammarBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <TextBoxComponent htmlAttributes={{rows:2}} multiline={true} floatLabelType="Auto" placeholder="Enter The Text" ref={this.TextBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            {
                this.state.LR1==null?<div>Error</div>:(
                    <div>
                        <table border="2px" style={{borderSpacing:"0px",textAlign:"center"}} hidden={!this.state.PredictionTable}>
                            <thead>
                            <td width="auto" style={{minWidth:100}}>Index</td>
                            <td width="auto" style={{minWidth:100}}>Closure</td>
                            {
                                this.state.LR1.Terminals.map(t=><td width="auto" style={{minWidth:100}}>{t}</td>)
                            }
                            {
                                this.state.LR1.States.map(s=><td width="auto" style={{minWidth:100}}>{s}</td>)
                            }
                            </thead>
                            <tbody>
                            {
                                this.state.LR1.Closures.map(closure=><tr key={closure.Index}>
                                <td>{closure.Index}</td>
                                <td><div style={{whiteSpace:"pre",textAlign:"left"}}>{closure.Print()}</div></td>
                                {
                                    this.state.LR1.Terminals.map(t=><td>{this.readerAction(this.state.LR1.TerminalDeltas[closure.Index].get(t))}</td>)
                                }
                                {
                                    this.state.LR1.States.map(s=><td>{this.readerAction(this.state.LR1.StateDeltas[closure.Index].get(s))}</td>)
                                }
                                </tr>)
                            }
                            </tbody>
                        </table>
                        <div hidden={!this.state.TokenJson}>
                          <Markdown children={"```json\n"+JSON.stringify(this.state.Tokenizer.json,null,2)+"\n```"}></Markdown>
                        </div>
                        <div hidden={!this.state.GrammarJson}>
                          <Markdown children={"```json\n"+JSON.stringify(this.state.LR1.GetJson(),null,2)+"\n```"}></Markdown>
                        </div>
                        <div hidden={!this.state.ResultJson}>
                          <Markdown children={"```json\n"+JSON.stringify(this.state.result,null,2)+"\n```"}></Markdown>
                        </div>
                    </div>
                )
            }
        </div>
    )
  }
}
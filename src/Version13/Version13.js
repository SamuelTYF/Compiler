import { Component, createRef } from "react";
import { TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import CFG_Token from "../Version11/CFG_token.json"
import Regs from "../Version7/Regs";
import Create_DFA_Tokenizer from "../Version5/DFA_Tokenizer";
import CFG_Grammar from "../Version11/CFG_Grammar.json"
import SLR1 from "../Version10/SLR1"
import LALR from "./LALR";
import LR0_Parser from "../Version10/LR0_Parser";
import { Markdown } from "../Markdown";
import "@syncfusion/ej2-react-inputs/styles/bootstrap.css"
import Grammar from "./Grammar.json"
import { ButtonComponent, CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import "@syncfusion/ej2-react-buttons/styles/bootstrap.css"

export default class Version13 extends Component
{
  constructor(props)
  {
    super(props)
    this.InputBox=createRef()

    var regs=new Regs(CFG_Token);
    var nfa=regs.Build();
    var dfa=nfa.ToDFA();
    this.Tokenizer=Create_DFA_Tokenizer(dfa)
    console.log(this.Tokenizer)
    var grammar=new SLR1(CFG_Grammar)
    console.log(grammar)
    this.Parser=new LR0_Parser(grammar.GetJson())
    this.Parser.Build()
    console.log(this.Parser)
    var lr0=new LALR(Grammar)
    this.InitText=lr0.Deltas.map(d=>"<"+d.State+">->"+d.Delta.map(value=>lr0.States.includes(value)?"<"+value+">":"'"+value+"'").join("")+":"+d.Action).join("\n")
    this.state={
      Parseing:false,
      LR0:lr0,
      FollowTable:true,
      PredictionTable:true,
      JsonTable:true
    }
  }
  CreateParser()
  {
    var texts=this.InputBox.current.value.split("\n")
    texts=texts.filter(value=>value.length>0)
    var deltas=texts.map(text=>{
      this.Tokenizer.StartParse(text)
      var result=this.Parser.Parse(this.Tokenizer)
      return result
    }).filter(value=>value!==null)
    console.log(deltas)
    var lr0=new LALR(deltas)
    console.log(lr0)
    this.setState({
      LR0:lr0
    })
  }
  Parse()
  {

  }
  textChange(e)
  {
    var texts=e.value.split("\n")
    this.InputBox.current.addAttributes({rows:texts.length+2})
  }
  readerAction(action)
  {
    return <div>
      {/* {<div>{action.Type}</div>} */}
      {action.Type=="Reduce"?<div style={{textAlign:"left"}}>{this.state.LR0.Deltas[action.Delta].State+"->"+this.state.LR0.Deltas[action.Delta].Delta.map(value=>this.state.LR0.States.includes(value)?"<"+value+">":"'"+value+"'").join("")}</div>:null}
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
            <ButtonComponent onClick={this.CreateParser.bind(this)}>CreateParser</ButtonComponent>
            <ButtonComponent onClick={this.Parse.bind(this)}>Parse</ButtonComponent>
            <CheckBoxComponent label="Follow Table" value={"FollowTable"} checked={this.state.FollowTable} onChange={this.check.bind(this)}></CheckBoxComponent>
            <CheckBoxComponent label="Prediction Table" value="PredictionTable" checked={this.state.PredictionTable} onChange={this.check.bind(this)}></CheckBoxComponent>
            <CheckBoxComponent label="Json" value="JsonTable" checked={this.state.JsonTable} onChange={this.check.bind(this)}></CheckBoxComponent>
            <TextBoxComponent htmlAttributes={{rows:this.InitText.split("\n").length+2}} multiline={true} floatLabelType="Auto" value={this.InitText} placeholder="Enter The Grammar" ref={this.InputBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            {
                this.state.LR0==null?<div>Error</div>:(
                    <div>
                        <table border="2px" style={{borderSpacing:"0px",textAlign:"center"}} hidden={!this.state.PredictionTable}>
                            <thead>
                            <td width="auto" style={{minWidth:100}}>Index</td>
                            <td width="auto" style={{minWidth:100}}>Closure</td>
                            {
                                this.state.LR0.Terminals.map(t=><td width="auto" style={{minWidth:100}}>{t}</td>)
                            }
                            {
                                this.state.LR0.States.map(s=><td width="auto" style={{minWidth:100}}>{s}</td>)
                            }
                            </thead>
                            <tbody>
                            {
                                this.state.LR0.Closures.map(closure=><tr key={closure.Index}>
                                <td>{closure.Index}</td>
                                <td><div style={{whiteSpace:"pre",textAlign:"left"}}>{closure.Print()}</div></td>
                                {
                                    this.state.LR0.Terminals.map(t=><td>{this.readerAction(this.state.LR0.TerminalDeltas[closure.Index].get(t))}</td>)
                                }
                                {
                                    this.state.LR0.States.map(s=><td>{this.readerAction(this.state.LR0.StateDeltas[closure.Index].get(s))}</td>)
                                }
                                </tr>)
                            }
                            </tbody>
                        </table>
                        <div hidden={!this.state.JsonTable}>
                          <Markdown children={"```json\n"+JSON.stringify(this.state.LR0.GetJson(),null,2)+"\n```"}></Markdown>
                        </div>
                    </div>
                )
            }
        </div>
    )
  }
}
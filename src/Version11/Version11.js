import { Component, createRef, useState } from "react";
import { TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import CFG_Token from "./CFG_token.json"
import Regs from "../Version7/Regs";
import Create_DFA_Tokenizor from "../Version5/DFA_Tokenizor";
import CFG_Grammar from "./CFG_Grammar.json"
import SLR1 from "../Version10/SLR1";
import LR0_Parser from "../Version10/LR0_Parser";
import { Markdown } from "../Markdown";
import "../../node_modules/@syncfusion/ej2-react-inputs/styles/bootstrap.css"
import Grammar from "./Grammar.json"

export default class Version11 extends Component
{
  constructor(props)
  {
    super(props)
    this.InputBox=createRef()

    var regs=new Regs(CFG_Token);
    var nfa=regs.Build();
    var dfa=nfa.ToDFA();
    this.Tokenizor=Create_DFA_Tokenizor(dfa)
    console.log(this.Tokenizor)
    var grammar=new SLR1(CFG_Grammar)
    console.log(grammar)
    this.Parser=new LR0_Parser(grammar.GetJson())
    this.Parser.Build()
    console.log(this.Parser)
    var lr0=new SLR1(Grammar)
    this.InitText=lr0.Deltas.map(d=>"<"+d.State+">->"+d.Delta.map(value=>lr0.States.includes(value)?"<"+value+">":"'"+value+"'").join("")+":"+d.Action).join("\n")
    this.state={
      LR0:lr0
    }
  }
  parse(text)
  {
    this.Tokenizor.StartParse(text)
    var result=this.Parser.Parse(this.Tokenizor)
    return result
  }
  textChange(e)
  {
    var texts=e.value.split("\n")
    this.InputBox.current.addAttributes({rows:texts.length+2})
    texts=texts.filter(value=>value.length>0)
    var deltas=texts.map(text=>this.parse(text)).filter(value=>value!==null)
    console.log(deltas)
    var lr0=new SLR1(deltas)
    console.log(lr0)
    this.setState({
      LR0:lr0
    })
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
  render() {
    return (
        <div>
            <TextBoxComponent htmlAttributes={{rows:this.InitText.split("\n").length+2}} multiline={true} floatLabelType="Auto" value={this.InitText} placeholder="Enter The Grammar" ref={this.InputBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            {
                this.state.LR0==null?<div>Error</div>:(
                    <div>
                        <table border="2px" style={{borderSpacing:"0px",textAlign:"center"}}>
                          <thead>
                            <td width="auto" style={{minWidth:100}}>States</td>
                            <td width="auto" style={{minWidth:100}}>First</td>
                            <td width="auto" style={{minWidth:100}}>FirstState</td>
                            <td width="auto" style={{minWidth:100}}>Follow</td>
                            <td width="auto" style={{minWidth:100}}>FollowState</td>
                          </thead>
                          <tbody>
                            {
                              this.state.LR0.States.map(s=><tr>
                                 <td>{s}</td>
                                 <td>{this.state.LR0.Firsts[s].Values.join(" ")}</td>
                                 <td>{this.state.LR0.FirstStates[s].Values.join(" ")}</td>
                                 <td>{this.state.LR0.Follows[s].Values.join(" ")}</td>
                                 <td>{this.state.LR0.FollowStates[s].Values.join(" ")}</td>
                                </tr>
                              )
                            }
                          </tbody>
                        </table>
                        <table border="2px" style={{borderSpacing:"0px",textAlign:"center"}}>
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
                        <Markdown children={"```json\n"+JSON.stringify(this.state.LR0.GetJson(),null,2)+"\n```"}></Markdown>
                    </div>
                )
            }
        </div>
    )
  }
}
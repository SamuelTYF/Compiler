import { Component, createRef } from "react";
import { TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import { Markdown } from "../Markdown";
import "@syncfusion/ej2-react-inputs/styles/bootstrap.css"
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import "@syncfusion/ej2-react-buttons/styles/bootstrap.css"
import "@syncfusion/ej2-base/styles/bootstrap.css"
import LR_Parser from "./LR_Parser"
import Tokenizor from "./Tokenizor";
import LALR from "../LALR_Demo/LALR";
import Create_Parser from "./Create_Parser"

export default class Parser_Demo extends Component
{
  constructor(props)
  {
    super(props)
    this.GrammarBox=createRef()
    this.MethodBox=createRef()
    this.TokenBox=createRef()

    this.Tokenizor=new Tokenizor()
    this.Parser=new LR_Parser()

    this.state={
      tokens:[],
      code:"",
      result:null
    }
  }
  CreateParser()
  {
    var texts=this.GrammarBox.current.value.split("\n")
    texts=texts.filter(value=>value.length>0)
    var deltas=texts.map(text=>{
      this.Tokenizor.StartParse(text)
      var result=this.Parser.Parse(this.Tokenizor)
      return result
    }).filter(value=>value!==null)
    console.log(deltas)
    var lr1=new LALR(deltas)
    console.log(lr1)
    var code=Create_Parser(lr1,this.MethodBox.current.value.split("\n").join("\n\t"))
    this.setState({
      code:code
    })
  }
  Parse()
  {
    var tokens=JSON.parse(this.TokenBox.current.value)
    console.log(tokens)
    var parser=eval(this.state.code+"\nnew LR_Parser()")
    var arraytokeniozr={
      tokens:tokens,
      index:0,
      length:tokens.length,
      Get:()=>arraytokeniozr.index>=arraytokeniozr.length?null:arraytokeniozr.tokens[arraytokeniozr.index++]
    }
    var result=parser.Parse(arraytokeniozr)
    this.setState({
      result:result
    })
  }
  textChange(e)
  {
    var texts=e.value.split("\n")
    e.target.addAttributes({rows:texts.length+2})
  }
  async Copy()
  {
    await navigator.clipboard.writeText(this.state.code)
  }
  render() {
    return (
        <div>
            <ButtonComponent onClick={this.CreateParser.bind(this)}>CreateParser</ButtonComponent>
            <ButtonComponent onClick={this.Copy.bind(this)}>Copy Code</ButtonComponent>
            <TextBoxComponent htmlAttributes={{rows:2}} multiline={true} value={""} floatLabelType="Auto" placeholder="Enter The Method" ref={this.MethodBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <TextBoxComponent htmlAttributes={{rows:2}} multiline={true} floatLabelType="Auto" placeholder="Enter The Grammar" ref={this.GrammarBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <Markdown children={"```javascript\n"+this.state.code+"\n```"}/>
            <ButtonComponent onClick={this.Parse.bind(this)}>Parse</ButtonComponent>
            <TextBoxComponent htmlAttributes={{rows:2}} multiline={true} floatLabelType="Auto" placeholder="Enter The Tokens" ref={this.TokenBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <Markdown children={"```json\n"+JSON.stringify(this.state.result,null,2)+"\n```"}/>
        </div>
    )
  }
}
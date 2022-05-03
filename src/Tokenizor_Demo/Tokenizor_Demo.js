import { Component, createRef } from "react";
import { TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import Regs from "./Regs";
import Create_Tokenizor from "./Create_Tokenizor";
import { Markdown } from "../Markdown";
import "@syncfusion/ej2-react-inputs/styles/bootstrap.css"
import { ButtonComponent, CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import "@syncfusion/ej2-react-buttons/styles/bootstrap.css"
import "@syncfusion/ej2-base/styles/bootstrap.css"

export default class Tokenizor_Demo extends Component
{
  constructor(props)
  {
    super(props)
    this.TokenBox=createRef()
    this.SentenceBox=createRef()

    this.state={
      tokens:[],
      code:""
    }
  }
  BuildTokenizor(json)
  {
    var regs=new Regs(json)
    var nfa=regs.Build()
    var dfa=nfa.ToDFA()
    console.log(dfa)
    var code=Create_Tokenizor(dfa)
    console.log(code)
    var Tokenizor=eval(code+"new Tokenizor()");
    console.log(Tokenizor);
    this.setState({
      code:code,
      Tokenizor:Tokenizor
    })
    return null
  }
  CreateTokenizor()
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
    this.BuildTokenizor(json)
  }
  textChange(e)
  {
    var texts=e.value.split("\n")
    e.target.addAttributes({rows:texts.length+2})
  }
  Tokenize()
  {
    var text=this.SentenceBox.current.value.trim()
    this.state.Tokenizor.StartParse(text)
    var r=[]
    while(true)
    {
      var token=this.state.Tokenizor.Get()
      r.push(token)
      if(token==null||token.Type=='EOF')break;
    }
    this.setState({
      tokens:r
    })
  }
  render() {
    return (
        <div>
            <ButtonComponent onClick={this.CreateTokenizor.bind(this)}>CreateTokenizor</ButtonComponent>
            <TextBoxComponent htmlAttributes={{rows:2}} multiline={true} floatLabelType="Auto" placeholder="Enter The Token" ref={this.TokenBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <Markdown children={"```javascript\n"+this.state.code+"\n```"}/>
            <ButtonComponent onClick={this.Tokenize.bind(this)}>Tokenize</ButtonComponent>
            <TextBoxComponent htmlAttributes={{rows:2}} multiline={true} floatLabelType="Auto" placeholder="Enter The Sentence" ref={this.SentenceBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <Markdown children={"```json\n"+JSON.stringify(this.state.tokens,null,2)+"\n```"}/>
        </div>
    )
  }
}
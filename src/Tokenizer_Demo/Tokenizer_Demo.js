import { Component, createRef } from "react";
import { TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import Regs from "./Regs";
import Create_Tokenizer from "./Create_Tokenizer";
import { Markdown } from "../Markdown";
import "@syncfusion/ej2-react-inputs/styles/bootstrap.css"
import { ButtonComponent, CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import "@syncfusion/ej2-react-buttons/styles/bootstrap.css"
import "@syncfusion/ej2-base/styles/bootstrap.css"
import CreateGraph from "./Create_Graph";

export default class Tokenizer_Demo extends Component
{
  constructor(props)
  {
    super(props)
    this.TokenBox=createRef()
    this.MethodBox=createRef()
    this.SentenceBox=createRef()

    this.state={
      tokens:[],
      code:"",
      url:""
    }
  }
  BuildTokenizer(json)
  {
    var regs=new Regs(json)
    var nfa=regs.Build()
    var dfa=nfa.ToDFA()
    console.log(dfa)
    var url=CreateGraph(dfa)
    var code=Create_Tokenizer(dfa,this.MethodBox.current.value.split("\n").join("\n\t"))
    console.log(code)
    var Tokenizer=eval(code+"\nnew Tokenizer()");
    console.log(Tokenizer);
    this.setState({
      code:code,
      Tokenizer:Tokenizer,
      url:url
    })
    return null
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
    this.BuildTokenizer(json)
  }
  textChange(e)
  {
    var texts=e.value.split("\n")
    e.target.addAttributes({rows:texts.length+2})
  }
  Tokenize()
  {
    var text=this.SentenceBox.current.value.trim()
    this.state.Tokenizer.StartParse(text)
    console.log(this.state.Tokenizer)
    var r=[]
    while(true)
    {
      var token=this.state.Tokenizer.Get()
      console.log(token)
      r.push(token)
      if(token==null||token.Type=='EOF')break;
    }
    this.setState({
      tokens:r
    })
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
            <TextBoxComponent htmlAttributes={{rows:2}} value={""} multiline={true} floatLabelType="Auto" placeholder="Enter The Method" ref={this.MethodBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <TextBoxComponent htmlAttributes={{rows:2}} multiline={true} floatLabelType="Auto" placeholder="Enter The Token" ref={this.TokenBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <Markdown children={"```javascript\n"+this.state.code+"\n```"}/>
            <ButtonComponent onClick={this.Tokenize.bind(this)}>Tokenize</ButtonComponent>
            <TextBoxComponent htmlAttributes={{rows:2}} multiline={true} floatLabelType="Auto" placeholder="Enter The Sentence" ref={this.SentenceBox} onChange={this.textChange.bind(this)}></TextBoxComponent>
            <Markdown children={"```json\n"+JSON.stringify(this.state.tokens,null,2)+"\n```"}/>
            <img src={this.state.url}></img>
        </div>
    )
  }
}
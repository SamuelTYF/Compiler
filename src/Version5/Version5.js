import { Component } from "react";
import regex_json from "../Version4/Regex.json"
import LL1 from "./LL1";
import dfa_json from "../Version3/DFA.json"
import Create_DFA_Tokenizer from "./DFA_Tokenizer";
import Manager from "../Tree/Manager"
import Tree from "../Tree/Tree"
import {PrintAndExport,DiagramComponent, Inject } from "@syncfusion/ej2-react-diagrams";
import {ToolbarComponent,ItemsDirective,ItemDirective} from "@syncfusion/ej2-react-navigations";


import "./font.css"
import "../../node_modules/@syncfusion/ej2-react-navigations/styles/bootstrap.css"

let diagramInstance;
let Nodes;
let MainTree;
let globaloptions={
    width:100,
    height:100,
    marginx:100,
    marginy:100,
}

export default class Version5 extends Component
{
  constructor(props)
  {
    super(props)
    this.text="(1|2*3)+"
    this.tokenizer=Create_DFA_Tokenizer(dfa_json)
    this.ll1=new LL1(regex_json)
    this.parser=this.ll1.CreateParse()
    console.log(this.text);
    console.log(this.tokenizer);
    console.log(this.ll1);
    console.log(this.parser)
    this.tokenizer.StartParse(this.text);
    var result=this.parser.Parse(this.tokenizer);
    console.log(result);
    Nodes=new Manager();
    var options=this.parser.GetADT(result);
    console.log(options)
    MainTree=new Tree(globaloptions,options);
    MainTree.render(Nodes,50,50);
    this.state={
      ll_json:JSON.stringify(this.ll1.GetJson(),null,2)
    }
  }
  componentDidMount()
  {
    diagramInstance.fitToPage();
  }
  render() {
    return (
    <div>
      <ToolbarComponent style={{ width: "100%", height: "10%", marginTop: "10px" }} id="toolbar_diagram" clicked={this.onclick}>
        <ItemsDirective>
          <ItemDirective type="Button" text="Export" prefixIcon="e-diagram-icons e-diagram-export">
          </ItemDirective>
        </ItemsDirective>
      </ToolbarComponent>
      <DiagramComponent 
        id="diagram"
        ref={diagram => (diagramInstance = diagram)} 
        width={MainTree.Width} height={MainTree.Height} 
        pageSettings={{ width: MainTree.Width,height:MainTree.Height, multiplePage:false }}
        nodes={Nodes.getnodes()} 
        connectors={Nodes.getconnections()} 
        snapSettings={{ constraints: 0 }} >
        <Inject services={[PrintAndExport]}/>
      </DiagramComponent>
      <pre>
        {this.state.ll_json}
      </pre>
    </div>)
  }
  onclick(args) {
    let exportOptions = {};
    exportOptions.format="JPG"
    exportOptions.mode = "Download";
    exportOptions.region = "PageSettings";
    exportOptions.multiplePage=false;
    exportOptions.fileName = "Export.jpg";
    exportOptions.margin = { left: 0, top: 0, bottom: 0, right: 0 };
    var t=diagramInstance.exportDiagram(exportOptions);
    console.log(t)
    function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
    
    function downloadFile(url,name='Export'){
        var a = document.createElement("a")
        a.setAttribute("href",url)
        a.setAttribute("download",name)
        a.setAttribute("target","_blank")
        let clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent("click", true, true);  
        a.dispatchEvent(clickEvent);
    }
    
    function downloadFileByBase64(base64,name){
        var myBlob = dataURLtoBlob(base64)
        var myUrl = URL.createObjectURL(myBlob)
        downloadFile(myUrl,name)
    }
    downloadFileByBase64(t,"Export")
  }
}
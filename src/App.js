import { Component } from "react";
import { Route, Routes } from 'react-router';
import { Container } from "reactstrap";
import Version1 from "./Version1/Version1";
import Version2 from "./Version2/Version2";
import Version3 from "./Version3/Version3";
import Version4 from "./Version4/Version4";
import Version5 from "./Version5/Version5";
import Version6 from "./Version6/Version6";
import Version7 from "./Version7/Version7";
import Version8 from "./Version8/Version8";
import Version9 from "./Version9/Version9";
import Version10 from "./Version10/Version10";
import Version11 from "./Version11/Version11";
import Version12 from "./Version12/Version12";
import Version13 from "./Version13/Version13";
import LR1_Demo from "./LR1_Demo/LR1_Demo";
import LALR_Demo from "./LALR_Demo/LALR_Demo"
import Regex_Demo from "./Regex_Demo/Regex_Demo"
import Token_Demo from "./Token_Demo/Token_Demo";
import Tokenizor_Demo from "./Tokenizor_Demo/Tokenizor_Demo";
import Parser_Demo from "./Parser_Demo/Parser_Demo"

export default class App extends Component
{
  constructor(props)
  {
      super(props)
  }
  render()
  {
    return(
        <Container>
            <Routes>
                <Route exact path='/' element={<Parser_Demo/>} />
                <Route path="/version1" element={<Version1/>}></Route>
                <Route path="/version2" element={<Version2/>}></Route>
                <Route path="/version3" element={<Version3/>}></Route>
                <Route path="/version4" element={<Version4/>}></Route>
                <Route path="/version5" element={<Version5/>}></Route>
                <Route path="/version6" element={<Version6/>}></Route>
                <Route path="/version7" element={<Version7/>}></Route>
                <Route path="/version8" element={<Version8/>}></Route>
                <Route path="/version9" element={<Version9/>}></Route>
                <Route path="/version10" element={<Version10/>}></Route>
                <Route path="/version11" element={<Version11/>}></Route>
                <Route path="/version12" element={<Version12/>}></Route>
                <Route path="/version13" element={<Version13/>}></Route>
                <Route path="/LR1" element={<LR1_Demo/>}></Route>
                <Route path="/LALR" element={<LALR_Demo/>}></Route>
                <Route path="/Regex" element={<Regex_Demo/>}></Route>
                <Route path="/Token" element={<Token_Demo/>}></Route>
                <Route path="/Tokenizor" element={<Tokenizor_Demo/>}></Route>
                <Route path="/Parser" element={<Parser_Demo/>}></Route>
            </Routes>
        </Container>
    )
  }
}
import Create_DFA_Tokenizor from "./DFA_Tokenizor";
import PDA from "../Version1/PDA";
import Reg from "../Version1/Reg";
import ENFA from "../Version1/ENFA";
import DFA from "./DFA.json"
import pda_json from "../Version1/PDA.json"
export default class RegParser
{
    constructor()
    {
        this.tokenizor=Create_DFA_Tokenizor(DFA)

        this.pda=new PDA(pda_json);
    }
    Parse(text)
    {
        var result={}

        try {
            result["tokens"]=this.tokenizor.Encode(text);
      
            result["tree"]=this.pda.parse(result["tokens"]);
        
            var r=this.pda.encode(result["tree"]);
        
            var reg=new Reg();
        
            reg.Parse(reg.Start,reg.End,r);
        
            result["enfa"]=new ENFA(reg.Start,[reg.End],reg.Deltas);
        
            result["nfa"]=result["enfa"].ToNFA();
        
            result["dfa"]=result["nfa"].ToDFA();
        
            result["dfas"]=result["dfa"].Simplify();

        } catch (error) {
            result["error"]=error
        }
        return result
    }
}
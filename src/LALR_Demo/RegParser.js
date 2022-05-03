import Create_DFA_Tokenizor from "./DFA_Tokenizor";
import Reg from "./Reg";
import ENFA from "./ENFA";
import DFA from "./DFA.json"
import LL_Parser from "./LL_Parser";
import ll1_json from "./LL1.json"
export default class RegParser
{
    constructor()
    {
        this.tokenizor=Create_DFA_Tokenizor(DFA)

        this.ll=new LL_Parser(ll1_json)
    }
    Parse(text)
    {
        var result={}

        try {

            this.tokenizor.StartParse(text);
      
            result["tree"]=this.ll.Parse(this.tokenizor);
        
            var r=this.ll.Encode(result["tree"]);
        
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
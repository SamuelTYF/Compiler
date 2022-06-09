import DFA_Tokenizer from "./DFA_Tokenizer";
import Reg from "./Reg";
import ENFA from "./ENFA";
import LR_Parser from "./LR_Parser"
export default class RegParser
{
    constructor()
    {
        this.tokenizer=new DFA_Tokenizer()

        this.ll=new LR_Parser()

        console.log(this.ll)
    }
    Parse(text)
    {
        var result={}

        try {

            this.tokenizer.StartParse(text);
      
            result["tree"]=this.ll.Parse(this.tokenizer);
    
            var reg=new Reg();
        
            reg.Parse(reg.Start,reg.End,result["tree"]);
        
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
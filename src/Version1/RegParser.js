import Reg_Tokenizer from "./Reg_Tokenizer";
import PDA from "./PDA";
import Reg from "./Reg";
import ENFA from "./ENFA";
import pda_json from "./PDA.json"
import token_json from "./Token.json"
export default class RegParser
{
    constructor()
    {
        console.log(token_json)
        
        this.tokenizer=new Reg_Tokenizer(token_json);
        this.pda=new PDA(pda_json);
    }
    Parse(text)
    {
        var result={}

        try {
            result["tokens"]=this.tokenizer.encode(text);
      
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
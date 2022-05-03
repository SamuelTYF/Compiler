import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import atomDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark'
import "katex/dist/katex.css"
import "prism-themes/themes/prism-atom-dark.css"
import { Component } from "react";

export class Markdown extends Component
{
    constructor(props)
    {
        super(props)
    }
    render()
    {
        return(
            <ReactMarkdown
                children={this.props.children}
                remarkPlugins={[remarkGfm,remarkMath]}
                rehypePlugins={[rehypeKatex]}
                style={{width:"100%"}}
                components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return (
                        <SyntaxHighlighter
                          children={children}
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        />
                      )
                    }
                  }}
            >
            </ReactMarkdown>
        )
    }
}
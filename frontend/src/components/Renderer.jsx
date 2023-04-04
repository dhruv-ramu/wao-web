import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import MathJax from 'react-mathjax';

const Markdown = props => (
  <ReactMarkdown
    {...props}
    remarkPlugins={[RemarkMathPlugin, remarkGfm]}
    rehypePlugins={[[rehypeKatex,{
      output: 'mathml',
    }]]}
  />
);

export default Markdown;

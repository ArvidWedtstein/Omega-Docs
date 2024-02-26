<template>
  <figure class="mb-0">
    <figcaption
      class="d-flex justify-content-between px-2 py-1 align-items-center bg-black text-light fw-semibold text-start h-100"
      v-if="filename"
    >
      <span>{{ filename }}</span>

      <button
        class="btn d-inline-flex justify-content-center align-items-center text-light"
        style="width: 40px; height: 40px"
        type="button"
        @click="onCopy"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          fill="currentColor"
        >
          <path
            d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"
          />
        </svg>
      </button>
    </figcaption>

    <div v-else class="toolbar d-flex flex-row gap-2 align-items-center">
      <span v-if="language" class="d-inline-block badge rounded-pill bg-warning text-dark" style="opacity: 50%;">{{ language }}</span>
      <div class="d-inline-block" v-if="!disableCopy">
        <button
          class="btn d-inline-flex justify-content-center align-items-center text-light"
          style="
            width: 40px;
            height: 40px;
          "
          type="button"
          @click="onCopy"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="currentColor"
          >
            <path
              d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"
            />
          </svg>
        </button>
      </div>
    </div>


    <div class="d-flex">
      <div v-if="linenumbers" class="me-2 line-numbers">
        <div
          v-for="(vLine, vIndex) in vLines"
          :key="vIndex"
          class="line-number"
          style="user-select: none"
        >
          {{ vIndex + 1 }}
        </div>
      </div>
      <div class="text-start flex-grow-1 w-100 overflow-auto" ref="vCodeRef">
        <pre
          v-if="code"
          class="mb-0"
          :class=" [`language-${language}`]"
          style="margin-top: 0; overflow-x: hidden; max-width: 100%;"
        ><code contenteditable="false" style="overflow-x: hidden" :class=" [language ? `language-${language}` : 'language-html']" tabindex="0" spellcheck="false">{{ jsonToFormattedText(convertHTMLToAST(code) || []) }}</code></pre>

        <slot v-else name="code"></slot>
      </div>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { ref, computed, withDefaults } from "vue";

export interface Props {
  filename?: string;
  language?: string;
  linenumbers?: boolean;
  code?: string;
  disableCopy?: boolean
}
const vProps = withDefaults(defineProps<Props>(), {
  filename: "",
  linenumbers: false,
  language: "html",
  disableCopy: false
});


const vLines = computed(() => {
  return vCodeRef.value && vProps.linenumbers
    ? vCodeRef.value["children"][0]["children"][0].innerText.split("\n")
    : [];
});
const vCodeRef = ref();

const onCopy = () => {
  navigator.clipboard.writeText(
    vCodeRef.value["children"][0]["children"][0].innerText,
  );

  alert("Copied!");
};


type ASTNode = {
  tagName: string;
  attributes: Record<string, string | null>;
  children: ASTNode[];
  isSelfClosing: boolean;
  content: string | null;
}
const convertHTMLToAST = (pHTML: string, pTestMode: boolean = false) => {
    // Regular expression to match tags and attributes
    const tagRegex = /<([a-zA-Z0-9\-]+)([^>]*)>(.*?)<\/\1>|<([a-zA-Z0-9\-]+)([^>]*)\/?>|([^<>]+)/g;
    const attrRegex = /([^\s=]+)(?:\s*=\s*(['"])(.*?)\2)?/g;

    const fixCase = (pText: string, pHTMLString: string = pHTML) => {
        const vRegex = new RegExp(pText, 'i');
        const vMatch = pHTMLString.match(vRegex);
        return vMatch ? vMatch[0] : pText;
    }
    
    // Function to parse attributes
    const parseAttributes = (pAttributeString: string) => {
        const attributes: any = {};
        let match;
        while ((match = attrRegex.exec(pAttributeString)) !== null) {
          const [, attributeName, _, attributeValue] = match;
          if (attributeName !== "/") {
            attributes[attributeName] = attributeValue === undefined ? null : attributeValue;
          }
        }
        return attributes;
    }



    // Recursive function to parse nodes
    let loops = 0
    const parseNodes = (pHTML: string): ASTNode[] | null => {
        if (loops > 50) return null

        let json: ASTNode[] = [];
        let match;

        while ((match = tagRegex.exec(pHTML)) !== null) {
          const vTag = match[1] || match[4]; // Check which capture group matched
          const attributes = match[2] || match[5] ? parseAttributes(match[2] || match[5]) : {};
          const content = match[3] || ''; // Inner content if available
          const isTextNode = (!!match[6] || !content.startsWith('<')) && !vTag;
          const isSelfClosing = !!match[5]
          
          if (pTestMode) console.log(vTag, content, isTextNode)

          if (vTag) {
              let node: ASTNode = {
                  tagName: fixCase(vTag.toLowerCase(), match[0]),
                  attributes: attributes,
                  children: [],
                  isSelfClosing: isSelfClosing,
                  content: null
              };

              if (content && content !== "") {
                
                if (!content.startsWith('<') && !content.includes('<') ) {
                  node.children = [{
                    tagName: 'TextNode',
                    attributes: {},
                    children: [],
                    isSelfClosing: isSelfClosing,
                    content: content.trim()
                  }]
                } else {
                  if (pTestMode) console.log(content.split(/(?=<[^/])/).flatMap(parseNodes))

                  node.children = (content.split(/(?=<[^/])/).flatMap(parseNodes).filter(vNode => vNode !== null) as ASTNode[]);
                  node.children = (content.split(/(?=<[^/])/).flatMap(parseNodes).filter(vNode => vNode !== null) as ASTNode[]);
                }
              }

              json.push(node);
          } else if (isTextNode) { // Text node
              // Trim whitespace from text nodes
              const textNode = match[6].trim();
              if (textNode) {
                json.push({
                  tagName: 'TextNode',
                  attributes: {},
                  children: [],
                  isSelfClosing: isSelfClosing,
                  content: textNode
                });
              }
          }
        } 
        loops++;

        return json.length > 0 ? json.slice(0, json.some((vNode) => vNode.content !== null) ? 2 : 1) : null
    }

    return parseNodes(pHTML);
}

const jsonToFormattedText = (json: ASTNode[], pIndentLevel = 0) => {
    const indent = ' '.repeat(2); // 2 spaces for each indent level
    let text = '';

    const addIndentation = (pIndentLevel: number) => indent.repeat(pIndentLevel);

    function processNode(pNode: ASTNode, depth: number) {
      if (pNode.tagName === "TextNode") {
          text += addIndentation(depth) + pNode.content + '\n';
      } else {
          text += addIndentation(depth) + `<${pNode.tagName}`;
          if (pNode.attributes) {
              Object.keys(pNode.attributes).forEach(attr => {
                  text += ` ${attr}${pNode.attributes[attr] !== null ? `="${pNode.attributes[attr]}"` : ''}`;
              });
          }

          if (pNode.isSelfClosing) {
            text += ' />\n';
          } else {
            text += '>\n';
            if (pNode.children) {
                pNode.children.forEach((child) => {
                    processNode(child, depth + 1);
                });
            }

            text += addIndentation(depth) + `</${pNode.tagName}>\n`; 
          }
      }
    }

    json.forEach(vNode => processNode(vNode, pIndentLevel));
    return text;
}

</script>

<style scoped>
/* Code Block*/
figure {
  position: relative;
  display: block;
  width: 100%;
  color: #f8f8f2;
  border: 1px solid #111;
  border-radius: 0.25rem;
  /* background: rgb(55, 55, 55); */
}
figure .toolbar  {
  position: absolute;
  right: 0.2em;
  top: 0.3em;
  opacity: 0;
  transition: all 100ms ease-in;
}

figure:hover .toolbar {
  opacity: 100;
}

.line-numbers {
  counter-reset: line;
  padding: 0 0.3rem 0 0;
  border-right: 1px solid #ddd;
}
.line-number {
  counter-increment: line;
  line-height: 1.77;
  font-size: 0.75rem;
}


</style>

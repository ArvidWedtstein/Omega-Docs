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


    <div class="d-flex h-100">
      <div v-if="linenumbers" class="me-2 line-numbers bg-dark">
        <div
          v-for="(vLine, vIndex) in vLines"
          :key="vIndex"
          class="line-number"
          style="user-select: none"
        >
          {{ vIndex + 1 }}
        </div>
      </div>
      <div class="text-start flex-grow-1 overflow-auto" ref="vCodeRef">
        <pre
          v-if="code"
          class="mb-0 h-100 hljs p-2"
          :class="[`language-${language}`]"
          style="margin-top: 0; max-width: 100%;"
          v-html="hljs.highlight(disableCodeFormatting ? code : jsonToFormattedText(parseHTML(code)), { language: vProps.language }).value"
        ></pre>

        <slot v-else name="code"></slot>
      </div>
    </div>
  </figure>
</template>


<script setup lang="ts">
import { ref, computed, withDefaults, onMounted } from "vue";
import hljs from 'highlight.js';

export interface Props {
  filename?: string;
  language?: string;
  linenumbers?: boolean;
  code?: string;
  disableCopy?: boolean;
  disableCodeFormatting?: boolean;
}
const vProps = withDefaults(defineProps<Props>(), {
  filename: "",
  linenumbers: false,
  language: "html",
  disableCopy: false,
  disableCodeFormatting: false,
});


const vCodeRef = ref();
const vLines = computed(() => {
  return vCodeRef.value && vCodeRef?.value["children"].length ? vCodeRef?.value["children"][0]["children"][0].innerText.split('\n') : [] || [];
});

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

function parseHTML(htmlString: string) {
    const root = { tagName: 'root', attributes: {}, children: [], isSelfClosing: false, content: '' };
    const stack: ASTNode[] = [root];
    let currentNode: any = root;

    for (let i = 0; i < htmlString.length; i++) {
        const char = htmlString[i];

        if (char === '<') {
            const tagStart = i;
            let tagEnd = htmlString.indexOf('>', tagStart);
            
            if (tagEnd === -1) {
                // Invalid HTML, tag not closed properly
                continue;
            }

            const tagContent = htmlString.substring(tagStart + 1, tagEnd);
            const isClosingTag = tagContent.startsWith('/');

            if (isClosingTag) {
                stack.pop();
                currentNode = stack[stack.length - 1];
            } else {
                const [tagName, rawAttributes] = tagContent.split(/\s(.+)?/);
                const attributes = parseAttributes(rawAttributes);
                const newElement: ASTNode = { tagName, attributes, children: [], isSelfClosing: isSelfClosingTag(tagName, htmlString, tagEnd), content: null };

                currentNode.children.push(newElement);

                if (!isSelfClosingTag(tagName, htmlString, tagEnd)) {
                    stack.push(newElement);
                    currentNode = newElement;
                }
            }

            i = tagEnd; // Move index to the end of the tag
        } else {
          if (currentNode.content === null) {
            currentNode.content = char;
          } else {
            currentNode.content += char;
          }
        }
    }

    return root.children;
}

function parseAttributes(rawAttributes: any) {
    const attributes: any = {};
    if (!rawAttributes) {
        return attributes;
    }
    const vAttributeRegex = /([^\s=]+)(?:\s*=\s*(['"])(.*?)\2)?/g; // /([\w-]+)\s*=\s*["']([^"']*)["']/g
    let match;

    while ((match = vAttributeRegex.exec(rawAttributes)) !== null) {
      const [, attributeName, _, attributeValue] = match;
      if (attributeName !== "/") {
        attributes[attributeName] = attributeValue === undefined ? null : attributeValue;
      }
    }

    return attributes;
}

function isSelfClosingTag(tagName: string, htmlString: string, tagEnd: number) {
    const selfClosingTags = ['br', 'img', 'input', 'hr', 'meta'];
    const tagContent = htmlString.substring(tagEnd - tagName.length - 1, tagEnd).trim();

    return tagContent.endsWith('/') || selfClosingTags.includes(tagName);
}




const jsonToFormattedText = (pJSON: ASTNode[], pIndentLevel = 0) => {
    const indent = ' '.repeat(2); // 2 spaces for each indent level
    let vText = '';

    const addIndentation = (pIndentLevel: number) => indent.repeat(pIndentLevel);

    const processNode = (pNode: ASTNode, depth: number) => {
      if (pNode.tagName === "TextNode") {
        vText += addIndentation(depth) + pNode.content + '\n';
      } else {
        vText += addIndentation(depth) + `<${pNode.tagName}`;
          if (pNode.attributes) {
              Object.keys(pNode.attributes).forEach(attr => {
                vText += `${Object.keys(pNode.attributes).length > 3 ? `\n${addIndentation(depth +1)}` : ' '}${attr}${pNode.attributes[attr] !== null ? `="${pNode.attributes[attr]}"` : ''}`;
              });
              if (Object.keys(pNode.attributes).length > 3) {
                vText += `\n${addIndentation(depth)}`
              }
          }


          if (pNode.isSelfClosing) {
            vText += '/>\n';
          } else {
            vText += '>\n';
            if (pNode.children) {
                pNode.children.forEach((child) => {
                    processNode(child, depth + 1);
                });

                // Only for parseHTML function
                if (pNode.content !== null) {
                  vText += addIndentation(depth +1) + pNode.content + '\n';
                }
            }

            vText += addIndentation(depth) + `</${pNode.tagName}>\n`; 
          }
      }
    }

    pJSON.forEach(vNode => processNode(vNode, pIndentLevel));
    return vText;
}


function formatSQL(rawSQL: string) {
    // Split the SQL string into individual tokens
    const tokens = rawSQL
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .split(/([\s(),;])/) // Split by spaces, commas, parentheses, and semicolons while preserving delimiters

    // Define indentation and current indentation level
    let indent = '    ';
    let indentationLevel = 0;

    // Initialize formatted SQL string
    let formattedSQL = '';

    // Iterate over each token
    tokens.forEach(token => {
        // Ignore empty tokens
        if (!token.trim()) return;

        // Increase indentation level for each opening parenthesis
        if (token === '(') {
            formattedSQL += '\n' + indent.repeat(indentationLevel);
            indentationLevel++;
        }

        // Decrease indentation level for each closing parenthesis
        if (token === ')') {
            indentationLevel--;
            formattedSQL += '\n' + indent.repeat(indentationLevel);
        }

        // Append token to formatted SQL string with proper indentation
        formattedSQL += token;

        // Add newline and proper indentation after comma or semicolon
        if (token === ',' || token === ';') {
            formattedSQL += '\n' + indent.repeat(indentationLevel);
        }
    });

    return formattedSQL.trim(); // Trim any leading/trailing whitespace
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
  /* padding: 0 0.3rem 0 0; */
  /* border-right: 1px solid #ddd; */
}
.line-number {
  counter-increment: line;
  line-height: 1.75;
  font-family: 'Consolas';
  font-size: 0.75em;
}

pre {
  border-radius: 0;
  /* background-color: #1b1d1eb3; */
}

</style>

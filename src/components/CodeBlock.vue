<template>
  <figure class="mb-0 overflow-auto bg-dark border border-secondary position-relative">
    <figcaption
      class="position-sticky top-0 left-0 right-0 row m-0 bg-dark"
    >
      <div class="col-6 mt-0 px-0 d-flex gap-3 user-select-none">
        <div class="btn-group">
          <span v-if="filename" class="p-2 text-start fw-semibold">{{ filename }}</span>
        </div>
        <slot name="toolbar"></slot>
      </div>

      <div class="col-6 mt-0 px-0 d-flex justify-content-end">
        <div class="btn-group">
          <div class="d-flex justify-content-center align-items-center px-2 py-1" v-if="language">
            <span class="badge text-bg-warning opacity-50">{{ language }}</span>
          </div>
          <button type="button" class="btn text-light" style="border-radius: 0;  max-height: 40px" @click="onCopy">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="currentColor"
              width="16" height="16"
              v-if="!vCopiedCode"
            >
              <path
                d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"
              />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
            </svg>
          </button>
        </div>
      </div>
    </figcaption>
    
    <div class="d-flex w-100 h-100 flex-grow-1">
      <pre
        ref="vCodeRef"
        class="mb-0 h-100 hljs p-2 text-start flex-grow-1"
        :class="[`language-${language}`]"
        style="margin-top: 0; max-width: 100%;"
        v-html="formattedCode"
      ></pre>
    </div>
  </figure>
</template>


<script setup lang="ts">
import { ref, computed, withDefaults } from "vue";
import hljs from 'highlight.js';


export interface Props {
  filename?: string;
  language?: string;
  code?: string;
  disableCopy?: boolean;
  disableCodeFormatting?: boolean;
}
const vProps = withDefaults(defineProps<Props>(), {
  filename: "",
  language: "html",
  disableCopy: false,
  disableCodeFormatting: false,
});

const vCopiedCode = ref<boolean>(false);

const vCodeRef = ref<HTMLPreElement>();

const onCopy = () => {
  vCopiedCode.value = true;
  navigator.clipboard.writeText(
    vCodeRef.value?.innerText || vProps.code || '',
  );

  setTimeout(() => {
    vCopiedCode.value = false
  }, 3000)
};

const formattedCode = computed(() => {
  if (!vProps.code) return '';
  if (vProps.disableCodeFormatting) return hljs.highlight(vProps.code, { language: vProps.language }).value;

  return hljs.highlight(vProps.language.includes('sql') ? formatSQL(vProps.code) : jsonToFormattedText(parseHTML(vProps.code)), { language: vProps.language }).value;
});



type ASTNode = {
  tagName: string;
  attributes: Record<string, string | null>;
  children: ASTNode[];
  isSelfClosing: boolean;
  content: string | null;
}

const parseHTML = (pHtmlString: string) => {
    const root = { tagName: 'root', attributes: {}, children: [], isSelfClosing: false, content: '' };
    const stack: ASTNode[] = [root];
    let currentNode: ASTNode = root;

    for (let i = 0; i < pHtmlString.length; i++) {
        const char = pHtmlString[i];

        if (char === '<') {
            const tagStart = i;
            let tagEnd = pHtmlString.indexOf('>', tagStart);
            
            if (tagEnd === -1) {
                // Invalid HTML, tag not closed properly
                continue;
            }

            const tagContent = pHtmlString.substring(tagStart + 1, tagEnd);
            const isClosingTag = tagContent.startsWith('/');

            if (isClosingTag) {
                stack.pop();
                currentNode = stack[stack.length - 1];
            } else {
                const [tagName, rawAttributes] = tagContent.split(/\s(.+)?/);
                const attributes = parseAttributes(rawAttributes);
                const newElement: ASTNode = { tagName, attributes, children: [], isSelfClosing: isSelfClosingTag(tagName, pHtmlString, tagEnd), content: null };

                currentNode.children.push(newElement);

                if (!isSelfClosingTag(tagName, pHtmlString, tagEnd)) {
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

</style>

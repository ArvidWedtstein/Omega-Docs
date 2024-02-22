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
      <div class="d-inline-block">
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
      <div class="text-start flex-grow-1" ref="vCodeRef">
        <slot name="code"></slot>
       
        <pre
          v-if="code"
          class="mb-0"
          :class=" [language ? `language-${language}` : 'language-html']"
          style="margin-top: 0;"
        ><code contenteditable="false" :class=" [language ? `language-${language}` : 'language-html']" tabindex="0" spellcheck="false">{{ formatSnippet(code) }}</code></pre>
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
}
const vProps = withDefaults(defineProps<Props>(), {
  filename: "",
  linenumbers: false,
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


function formatSnippet(snippet: string) {
  // Use a simple approach for formatting, you can use libraries like prettier for more advanced formatting
  let formattedSnippet = '';
  let indentationLevel = 0;
  

  // Iterate through each match of opening tags
  const tagRegex = /<(\/?)([a-zA-Z0-9\-_]+)([^>]*)>([^<]*)/g;



  // Iterate through each match of tags
  let match;
  while ((match = tagRegex.exec(snippet)) !== null) {
      const [, isClosingTag, tagName, attributes, content] = match;

      // Add proper indentation
    if (!isClosingTag) {
          formattedSnippet += '  '.repeat(indentationLevel);
      }

      if (!isClosingTag && content.trim() !== '') {
          // Add indentation for content
          formattedSnippet += match[0].replace(content, '\n' + '  '.repeat(indentationLevel + 1) + content.trim());
          indentationLevel++;
      } else {
          // Check if it's a self-closing tag
          const isSelfClosingTag = attributes.trim().endsWith('/');
          if (isSelfClosingTag) {
              formattedSnippet += match[0];
          } else {
              formattedSnippet += (!isClosingTag ? '' : '  '.repeat(Math.max(0,indentationLevel -1))) + match[0];
              if (!isClosingTag) indentationLevel++;
          }

      }

      if (isClosingTag) {
          indentationLevel = Math.max(0, indentationLevel - 1);
      }



      // Append newline character after each tag
      formattedSnippet += '\n';
  }

  return formattedSnippet //.replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

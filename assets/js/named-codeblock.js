// deprecated!!
// use the plugin _plugins/named_codeblock_hook.rb

function insert_filename(to_insert, filename){
  var div = document.createElement("div");
  div.textContent = filename;
  div.classList.add("named-block-filename");
  to_insert.insertBefore(div, to_insert.firstChild);
}

document.addEventListener("DOMContentLoaded", () => {
  const filename_attr = "filename"
  // highlight タグ
  const blocks_tag = document.querySelectorAll(`figure.highlight[${filename_attr}]`);
  Array.from(blocks_tag).forEach(block => {
    const filename = block.getAttribute(filename_attr);
    insert_filename(block, filename);
  });
  // fenced code block (backquote 3つ)
  const blocks_fenced = document.querySelectorAll(`div.highlighter-rouge[${filename_attr}]`);
  Array.from(blocks_fenced).forEach(block => {
    const filename = block.getAttribute(filename_attr);
    const div_to_insert = block.querySelector("div.highlight");
    insert_filename(div_to_insert, filename)
  });
});

export default function render(el, template) {
  console.log('template===>>>>', template);
  el = el || (this && this.document);
  if (!el) {
    console.info("需要在浏览器环境执行");
    return;
  }
  el.write(template);
}

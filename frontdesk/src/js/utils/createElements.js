export const createEl = (tag, className, text, id) => {
  const el = document.createElement(tag)
  if (className) el.classList.add(className)
  if (text) el.innerText = text
  if (id) el.id = id
  return el
}

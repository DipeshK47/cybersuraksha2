const textSources = new WeakMap<Text, { source: string; displayed: string }>();
const attributeSources = new WeakMap<Element, Map<string, { source: string; displayed: string }>>();
const pinnedOptions = new WeakMap<HTMLOptionElement, string>();
const attributes = ['title', 'alt', 'placeholder', 'aria-label', 'aria-description', 'aria-valuetext'];
const excluded = 'script,style,code,pre,textarea,svg,math,[translate="no"],[data-no-translate],[data-teaching-language="en"] [data-learning-example]';

export function originalText(element: Element | null): string | undefined {
  if (!element) return undefined;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let result = ''; let node: Node | null;
  while ((node = walker.nextNode())) result += textSources.get(node as Text)?.source ?? node.textContent ?? '';
  return result;
}

export function createPageLocalizer(translate: (source: string) => string) {
  let hindi = false;
  let queued = false;
  let disposed = false;
  const observer = new MutationObserver(() => {
    if (!queued) {
      queued = true;
      queueMicrotask(() => { queued = false; if (!disposed && hindi) scan(); });
    }
  });

  function scan() {
    observer.disconnect();
    const root = document.documentElement;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let next: Node | null;
    while ((next = walker.nextNode())) {
      const node = next as Text;
      if (!node.parentElement || node.parentElement.closest(excluded)) continue;
      const saved = textSources.get(node);
      if (!saved || node.data !== saved.displayed) textSources.set(node, { source: node.data, displayed: node.data });
      nodes.push(node);
    }
    // An option without a value uses its text as its submitted value. Pin its
    // original value before translation, preserving existing answer comparisons.
    for (const option of document.querySelectorAll('option')) {
      if (option.closest(excluded)) continue;
      const pinned = pinnedOptions.get(option);
      if (pinned !== undefined && option.getAttribute('value') !== pinned) pinnedOptions.delete(option);
      if (hindi && (!option.hasAttribute('value') || pinnedOptions.has(option))) {
        const source = (originalText(option) ?? '').replace(/[\t\n\f\r ]+/g, ' ').replace(/^ | $/g, '');
        option.setAttribute('value', source); pinnedOptions.set(option, source);
      }
    }
    const groups = new Map<Element, Text[]>();
    for (const node of nodes) {
      const parent = node.parentElement!;
      if (hindi && parent.childElementCount === 0) {
        const group = groups.get(parent) ?? [];
        group.push(node); groups.set(parent, group);
        continue;
      }
      const saved = textSources.get(node)!;
      const displayed = hindi ? translate(saved.source) : saved.source;
      if (node.data !== displayed) node.data = displayed;
      saved.displayed = displayed;
    }
    // React often splits “Scene {n} of {total}” into several text nodes. Translate
    // it as one sentence while retaining every original node for reconciliation.
    for (const group of groups.values()) {
      const displayed = translate(group.map(node => textSources.get(node)!.source).join(''));
      group.forEach((node, index) => {
        const value = index === 0 ? displayed : '';
        if (node.data !== value) node.data = value;
        textSources.get(node)!.displayed = value;
      });
    }
    for (const element of root.querySelectorAll(attributes.map(attribute => `[${attribute}]`).join(','))) {
      if (element.closest(excluded)) continue;
      const saved = attributeSources.get(element) ?? new Map();
      attributeSources.set(element, saved);
      for (const attribute of attributes) {
        const current = element.getAttribute(attribute);
        if (current === null) { saved.delete(attribute); continue; }
        let entry = saved.get(attribute);
        if (!entry || current !== entry.displayed) { entry = { source: current, displayed: current }; saved.set(attribute, entry); }
        entry.displayed = hindi ? translate(entry.source) : entry.source;
        if (current !== entry.displayed) element.setAttribute(attribute, entry.displayed);
      }
    }
    if (!hindi) {
      for (const option of document.querySelectorAll('option')) {
        if (pinnedOptions.has(option)) { option.removeAttribute('value'); pinnedOptions.delete(option); }
      }
    } else {
      observer.observe(root, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: attributes });
    }
  }
  return {
    setLanguage(language: 'en' | 'hi') { disposed = false; hindi = language === 'hi'; document.documentElement.lang = language; scan(); },
    dispose() { disposed = true; observer.disconnect(); },
  };
}

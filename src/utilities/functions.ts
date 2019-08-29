import _ from "lodash";

export const hasClassName = (node: HTMLElement, className: string): boolean => {
  if (node.classList) {
    return node.classList.contains(className);
  } else {
    const regcss = new RegExp(className, "g");
    return regcss.test(node.className);
  }
};

export const addClassName = (node: HTMLElement, className: string): void => {
  if (!hasClassName(node, className)) {
    if (node.classList) {
      node.classList.add(className);
    } else {
      if (typeof node.className === "undefined" || node.className === null) {
        node.className = "";
      }
      node.className += (node.className ? " " : "") + className;
    }
  }
};

export const removeClassName = (node: HTMLElement, className: string): void => {
  if (hasClassName(node, className)) {
    if (node.classList) {
      node.classList.remove(className);
    } else {
      const regcss = new RegExp(className, "g");
      node.className = node.className.replace(regcss, "");
    }
  }
};

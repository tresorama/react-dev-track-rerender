import React from "react";

/**
 * Function that receive:
 * - `child` a `React.ReactNode` that must contain a single React Component
 * - `childrenToAppend` an array of `React.ReactNode` to append to `child`
 */
export function appendChildrenToFirstChildren(
  child: React.ReactNode,
  childrenToAppend: React.ReactNode[]
): React.ReactNode {

  // 1. child must be a single react comp
  if (React.Children.count(child) > 1) {
    throw new Error("appendChildrenToFirstChildren only accepts a single react comp as `child`");
  }

  // 2. get the react child to need to be updated
  const reactChild = React.Children.toArray(child)[0];
  if (!reactChild) {
    throw new Error("appendChildrenToFirstChildren only accepts a single react comp as `child`");
  }
  if (
    typeof reactChild === 'string'
    ||
    typeof reactChild === 'number'
    ||
    typeof reactChild === 'bigint'
    ||
    !('props' in reactChild)
  ) {
    throw new Error("appendChildrenToFirstChildren only accepts a single react comp as `child`, and the child cannot be string|number|bigint. It must be a react comp");
  }

  debugger;

  // 3. recreate the react component with the appended children
  const finalChild = React.cloneElement(
    // react comp
    reactChild,
    // added props (these are meged with existing props)
    {},
    // new children (these override existing children)
    // @ts-expect-error ERROR: children do not exist in {} WHY IT WORKS: because we know it's a react comp
    ...React.Children.toArray(reactChild.props?.children ?? {}),
    ...childrenToAppend,
  );

  return finalChild;

}
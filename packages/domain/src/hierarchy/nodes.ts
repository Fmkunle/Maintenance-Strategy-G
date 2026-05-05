import type { HierarchyNodeInfo, HierarchyNodeLike } from "@maint/contracts"

const STRATEGY_HIERARCHY_NODE_TYPES = new Set(["function", "functionalFailure", "cause", "effect", "cm", "ins", "pm"])

/**
 * Shared tree lookup helper for the productization effort.
 *
 * The current UI still has several inline hierarchy utilities. Moving the canonical
 * versions into the domain package gives us a clean target for future extraction
 * without forcing the rest of the UI to migrate in one risky step.
 */
export const findNodeInfo = <TNode extends HierarchyNodeLike>(
  nodes: TNode[],
  nodeId: string,
  parent: TNode | null = null,
  path: TNode[] = []
): HierarchyNodeInfo<TNode> | null => {
  for (const node of nodes) {
    const nextPath = [...path, node]

    if (node.id === nodeId) {
      return {
        node,
        parent,
        path: nextPath
      }
    }

    const childMatch = findNodeInfo((node.children || []) as TNode[], nodeId, node, nextPath)
    if (childMatch) {
      return childMatch
    }
  }

  return null
}

/**
 * Returns the first leafward node used by the legacy host when it needs a safe
 * fallback selection after a deletion or workspace reset.
 */
export const getFirstNode = <TNode extends HierarchyNodeLike>(nodes: TNode[]): TNode | null => {
  if (!nodes.length) {
    return null
  }

  let current = nodes[0]
  while ((current.children || []).length) {
    current = (current.children || [])[0] as TNode
  }

  return current
}

/**
 * Removes a node from the hierarchy while preserving the rest of the tree shape.
 *
 * This stays pure so the legacy runtime can keep owning state updates while the
 * reusable tree surgery logic lives in the domain package.
 */
export const removeNodeFromHierarchy = <TNode extends HierarchyNodeLike>(nodes: TNode[], nodeId: string): TNode[] =>
  nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: removeNodeFromHierarchy((node.children || []) as TNode[], nodeId)
    }))

/**
 * Treat obvious uppercase asset-location values as already-code-like segments.
 *
 * The legacy app uses this to decide when it can infer a local code segment from
 * entered code/name/description values without introducing extra UI-specific rules.
 */
export const isCodeLikeHierarchyValue = (value: unknown): boolean =>
  /^[A-Z0-9]+(?:[._-][A-Z0-9]+)*$/.test(String(value || "").trim())

/**
 * Strategy nodes use dotted sub-codes while physical hierarchy levels use hyphens.
 * Keeping that rule in one place avoids subtle code inheritance drift later on.
 */
export const getHierarchySeparatorForType = (nodeType: string): "." | "-" =>
  STRATEGY_HIERARCHY_NODE_TYPES.has(nodeType) ? "." : "-"

/**
 * Builds a full inherited code by appending a child segment with the correct
 * separator for that node type.
 */
export const joinInheritedCode = (parentFullCode: string, childSegment: string, childType = ""): string => {
  const parentValue = String(parentFullCode || "").trim()
  const childValue = String(childSegment || "").trim()

  if (!parentValue) {
    return childValue
  }
  if (!childValue) {
    return parentValue
  }

  return `${parentValue}${getHierarchySeparatorForType(childType)}${childValue}`
}

/**
 * Extracts the local code segment from a user-entered inherited code.
 *
 * The comparison is case-insensitive so the domain helper matches the current
 * browser behavior even when users paste mixed-case values.
 */
export const extractLocalCodeSegment = (value: string, parentFullCode = "", childType = ""): string => {
  const rawValue = String(value || "").trim()
  const parentValue = String(parentFullCode || "").trim()

  if (!rawValue) {
    return ""
  }

  if (!parentValue) {
    return rawValue
  }

  const parentUpper = parentValue.toUpperCase()
  const rawUpper = rawValue.toUpperCase()
  if (rawUpper === parentUpper) {
    return ""
  }

  const expectedPrefix = `${parentUpper}${getHierarchySeparatorForType(childType)}`
  if (rawUpper.startsWith(expectedPrefix)) {
    return rawValue.slice(parentValue.length + 1).trim()
  }

  return rawValue
}

/**
 * Rebuilds the full functional location code for a node path.
 */
export const getFullCodeFromPath = <TNode extends HierarchyNodeLike>(path: TNode[]): string =>
  path.reduce((fullCode, node) => joinInheritedCode(fullCode, String(node?.code || "").trim(), node?.type || ""), "")

/**
 * Returns the parent path for a selected node path.
 */
export const getParentPath = <TNode extends HierarchyNodeLike>(path: TNode[]): TNode[] =>
  Array.isArray(path) && path.length > 1 ? path.slice(0, -1) : []

/**
 * Convenience helper for flows that only need the inherited parent code context.
 */
export const getParentFullCodeFromPath = <TNode extends HierarchyNodeLike>(path: TNode[]): string =>
  getFullCodeFromPath(getParentPath(path))

/**
 * Finds the nearest ancestor of a given type from a resolved node path.
 */
export const getNearestAncestorNodeFromPath = <TNode extends HierarchyNodeLike>(path: TNode[], type: string): TNode | null =>
  Array.isArray(path) ? [...path].reverse().find((node) => node.type === type) || null : null

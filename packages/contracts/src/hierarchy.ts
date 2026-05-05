/**
 * Minimal shared hierarchy node contract for the productization migration.
 *
 * We intentionally keep this shape small so the pure hierarchy helpers can be
 * reused by both the legacy browser runtime and future typed modules without
 * pulling UI state or config-heavy node payloads across the boundary.
 */
export interface HierarchyNodeLike {
  id: string
  type: string
  code?: string | null
  name?: string | null
  description?: string | null
  children?: HierarchyNodeLike[]
}

/**
 * Describes a resolved node together with the ancestry context that produced it.
 */
export interface HierarchyNodeInfo<TNode extends HierarchyNodeLike = HierarchyNodeLike> {
  node: TNode
  parent: TNode | null
  path: TNode[]
}

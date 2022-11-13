import React, { useEffect, useState } from 'react';
import { CdsTree, CdsTreeItem } from '@cds/react/tree-view';
import { CdsTreeItem as CoreCdsTreeItem } from '@cds/core/tree-view';

type props = { data: TreeItem[]; onSelectedChange?: (e: string) => void };
type state = Record<
  string,
  Omit<TreeItem, 'children' | 'lazy'> & {
    children: string[];
    lazy: () => Promise<state>;

    // NOTE: following meta information are used for filtering & rendering
    _parent?: string;
    _expandable: boolean;
    _selected: boolean;
  }
>;

/**
 * Converts a DynamicNode into an exploitable `state` object recursively
 *
 * @param node the node to convert
 * @param parentUid uid of the parent node
 * @returns full state representation of the given node
 */
function convert(node: TreeItem, parentUid?: string): state {
  const uid: string = Math.random().toString(16).slice(2);
  const state: state = (node.children ?? [])
    .map((node) => convert(node, uid))
    .reduce((acc, state): state => {
      return { ...acc, ...state };
    }, {});
  const children = Object.keys(state).filter(
    (_uid: any) => state[_uid]._parent === uid
  );

  return {
    ...state,
    [uid]: {
      ...node,
      children: children,
      // NOTE: a promise is created here to avoid concurrency (promise is called only once)
      lazy: (function (): () => Promise<state> {
        return (): Promise<state> => {
          if (node.lazy === undefined) {
            return Promise.resolve({});
          }

          return node.lazy!().then((nodes): state => {
            const state = nodes
              .map((node) => convert(node, uid))
              .reduce((acc, state): state => {
                return { ...acc, ...state };
              }, {});
            const nchildren = Object.keys(state).filter(
              (_uid: any) => state[_uid]._parent === uid
            );

            return {
              ...state,
              [uid]: {
                ...node,
                children: [...children, ...nchildren],
                lazy: () => Promise.resolve<state>({}),
                _parent: parentUid,
                _expandable: children.length + nchildren.length > 0,
                _selected: false,
              },
            };
          });
        };
      })(),
      _parent: parentUid,
      _expandable: children.length > 0 || node.lazy !== undefined,
      _selected: false,
    },
  };
}

/**
 * DynamicNode contains all payload use to generate dynamically CdsTree.
 */
export interface TreeItem {
  text: JSX.Element;
  value: string;
  unselectable?: boolean;

  children?: TreeItem[];
  lazy?: () => Promise<TreeItem[]>;
}

/**
 * Tree view is a hierarchical component that gives users access to a hierarchical
 * set of objects displayed in a the parent-child relationship.
 * The difference between this one and the one from Clarity Design is the data prop;
 * this allows us to easily define a simple tree with a lazy function that will be
 * called if the tree element is expanded.
 *
 * ```jsx
 *    <CdsDynamicTree
 *      data={[
 *        { id: "aaa", value: "aaa" },
 *        {
 *          id: "bbb",
 *          value: "bbb",
 *          children: [{ id: "bbb/aaa", value: "aaa" }],
 *        },
 *        {
 *          id: "ccc",
 *          value: "ccc",
 *          lazy: () => {
 *            return Promise.resolve([{ id: "ccc/aaa", value: "aaa" }]);
 *          },
 *        },
 *      ]}
 *    ></CdsDynamicTree>
 * ```
 *
 * @element cds-dynamic-tree
 * @param data Object definition of the tree
 */
export function CdsDynamicTree({ data, onSelectedChange }: props): JSX.Element {
  const [tree, updateTree] = useState<state>({});
  const [jsx, updateJSX] = useState<JSX.Element[]>([]);

  /**
   * render all CdsTreeItem recursivelly based on the given tree.
   */
  const render = (tree: state, uid: string): JSX.Element => {
    const node = tree[uid];
    if (node === undefined) {
      return <></>;
    }

    return (
      <CdsTreeItem
        key={uid}
        expandable={node._expandable}
        selected={node._selected}
        onExpandedChange={(e: Event) => {
          const event = e as CustomEvent<boolean>;
          (e.target as CoreCdsTreeItem).expanded = event.detail;
          (e.target as CoreCdsTreeItem).loading = true;

          node
            .lazy()
            .then((updated: state) => {
              updateTree((old): state => ({ ...old, ...updated }));
            })
            .then(() => ((e.target as CoreCdsTreeItem).loading = false));
        }}
        onSelectedChange={(e: Event) => {
          if (node.unselectable) return;

          updateTree(
            (old): state =>
            ({
              ...Object.keys(old)
                .map((uid) => ({ [uid]: { ...old[uid], _selected: false } }))
                .reduce((acc: state, state): state => {
                  return { ...acc, ...state };
                }, {}),
              [uid]: { ...old[uid], _selected: true },
            } as state)
          );
          if (onSelectedChange) onSelectedChange(node.value);
        }}
      >
        {node.text}
        {node.children?.map((uid: string) => render(tree, uid)) ?? []}
      </CdsTreeItem>
    );
  };

  // NOTE: we regenerate the CdsTree on each changes. This is not really optimised but
  //       I didn't found any other way to dynamically update the JSX without generating
  //       everything.
  //       However, in our case, this should not be too heavy unless the user has a high
  //       number of dataset.
  useEffect(() => {
    const jsx = Object.keys(tree)
      .filter((n: string) => !tree[n]._parent)
      .map((n: string) => render(tree, n));
    updateJSX(jsx);
  }, [tree]);

  // NOTE: initialise the tree from the given data
  useEffect(() => {
    const state = data
      .map((node): state => convert(node))
      .reduce((acc, state): state => {
        return { ...acc, ...state };
      }, {});
    updateTree(state);
  }, [data]);

  return <CdsTree>{jsx}</CdsTree>;
}

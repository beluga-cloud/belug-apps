import React, { ReactNode } from 'react';
import {
  ClarityIcons,
  errorStandardIcon,
  errorStandardIconName,
  eyeIcon,
  eyeIconName,
  infoStandardIcon,
  infoStandardIconName,
  layersIcon,
  layersIconName,
  storageIcon,
  storageIconName,
  successStandardIcon,
  successStandardIconName,
} from '@cds/core/icon';
import { CdsTreeItem as CoreCdsTreeItem } from '@cds/core/tree-view';
import { CdsIcon } from '@cds/react/icon';
import { CdsTag } from '@cds/react/tag';
import { CdsTree, CdsTreeItem } from '@cds/react/tree-view';

import * as TrueNAS from './truenas.types';
import { ComponentParamProps } from './types.interface';
import { BytesToString, ReducerMergeObject } from './utils';

// load all used icons
const _ = ClarityIcons.addIcons(
  errorStandardIcon,
  eyeIcon,
  infoStandardIcon,
  layersIcon,
  storageIcon,
  successStandardIcon
);

// ignored datasets
const ignoredDatasets = [
  'ix-applications', // all 'íx-appplications' datasets will be ignored to avoid any issues with TrueNAS applications
];

/**
 * DatasetsTreeView parameter comming from the custom component configuration
 * @property {string} apiURL  the API URL used to generate dynamically the dataset
 */
export interface DatasetsTreeViewParam {
  type: 'truenas.datasets';
  apiURL?: string;
}

/**
 * This tree view is a hierarchical component that gives users access to a hierarchical set of datasets displayed in
 * a the parent-child relationship.
 * @element DatasetsTreeView
 * @param param         tree view configuration
 * @param currentValue  current dataset selected
 * @param onValueChange callback called when a dataset is selected
 * @param onError       callback called when an error occurs
 */
export default class DatasetsTreeView extends React.Component<
  ComponentParamProps<DatasetsTreeViewParam>,
  {
    pools: Record<string, TrueNAS.ZFSPool>;
    loaded: Record<string, boolean>;
  }
> {
  constructor(props: ComponentParamProps<DatasetsTreeViewParam>) {
    super(props);

    this.state = { pools: {}, loaded: {} };
    this.initializeZFSPools();
  }

  /**
   * Fetch from TrueNAS url the list of pool or dataset, depending on the given URL.
   * @param url API url to fetch
   * @returns the list of ZFS pool or dataset fetched
   */
  private static async fetchAPI<
    T extends TrueNAS.ZFSPool[] | TrueNAS.ZFSDataset[]
  >(url: string): Promise<T> {
    const resp = await fetch(url, { redirect: 'follow' });
    if (!resp.ok) {
      throw new Error(`TrueNAS API returns ${resp.status}: ${JSON.stringify(await resp.body)}`);
    }
    return (await resp.json()) as T;
  }

  /**
   * Initialize the tree view with existing TrueNAS ZFS pools.
   */
  private async initializeZFSPools() {
    try {
      const url = `${this.props.param.apiURL ?? ""}/api/v2.0/pool`;
      const pools = await DatasetsTreeView.fetchAPI<TrueNAS.ZFSPool[]>(url);

      this.setState({
        pools: pools
          .map((pool) => ({ [pool.name]: pool }))
          .reduce(ReducerMergeObject, {}),

        loaded: pools
          .map((pool) => ({ [pool.name]: false }))
          .reduce(ReducerMergeObject, {}),
      });
    } catch (e) {
      this.props.onError(`Failed to list pools: ${e.toString()}`);
    }
  }

  /**
   * Fetch all TrueNAS ZFS dataset located on the given pool.
   * @param pool name of the pool where datasets are located
   */
  private async fetchZFSDatasets(pool: string) {
    try {
      const url = `${this.props.param.apiURL ?? ""}/api/v2.0/pool/dataset?pool=${pool}`;
      const datasets = await DatasetsTreeView.fetchAPI<TrueNAS.ZFSDataset[]>(
        url
      );

      if (datasets.length == 0) throw new Error(`no dataset found`);

      this.setState((state) => ({
        ...state,
        pools: {
          ...state.pools,
          [pool]: {
            ...state.pools[pool],
            children: datasets[0].children,
          },
        },
      }));
    } catch (e) {
      this.props.onError(
        `Failed to list datasets of pool "${pool}": ${e.toString()}`
      );
    }
  }

  render(): ReactNode {
    return (
      <CdsTree>
        {Object.keys(this.state.pools)
          .map((pool) => this.state.pools[pool])
          .map((pool) => (
            <CdsTreeItem
              expandable={
                pool.status === 'ONLINE' &&
                (!this.state.loaded[pool.name] || pool.children.length > 0)
              }
              onExpandedChange={async (e: Event) => {
                const event = e as CustomEvent<boolean>;
                (e.target as CoreCdsTreeItem).expanded = event.detail;

                if (this.state.loaded[pool.name]) return;

                (e.target as CoreCdsTreeItem).loading = true;
                await this.fetchZFSDatasets(pool.name);
                (e.target as CoreCdsTreeItem).loading = false;

                this.setState((state) => ({
                  ...state,
                  loaded: {
                    ...state.loaded,
                    [pool.name]: true,
                  },
                }));
              }}
            >
              <Pool pool={pool} />
              <Datasets
                datasets={pool.children ?? []}
                currentValue={this.props.currentValue}
                onValueChange={this.props.onValueChange}
              />
            </CdsTreeItem>
          ))}
      </CdsTree>
    );
  }
}

/**
 * React component rendering a TrueNAS ZFS pool.
 * @param pool  pool definition
 */
function Pool({ pool }: { pool: TrueNAS.ZFSPool }) {
  const online = pool.status === 'ONLINE';
  const healthy = pool.healthy && !pool.warning;

  const status = online ? (healthy ? 'success' : 'warning') : 'danger';
  const statusIcon =
    online && healthy ? successStandardIconName : errorStandardIconName;

  return (
    <>
      <CdsIcon shape={storageIconName} />
      {pool.name}

      {/* How much capacity remains? */}
      {pool.free === null ? undefined : (
        <CdsTag readonly color="gray">
          {BytesToString(pool.free)}
        </CdsTag>
      )}

      {/* Is pool online? */}
      <CdsTag readonly status={status}>
        <CdsIcon shape={statusIcon} />
        {pool.status}
      </CdsTag>
    </>
  );
}

/**
 * React component rendering a list of TrueNAS ZFS datasets.
 * @param datasets      list of ZFS datasets to render
 * @param currentValue  current dataset selected
 * @param onValueChange callback called when a dataset is selected
 */
function Datasets({
  datasets,
  currentValue,
  onValueChange,
}: { datasets: TrueNAS.ZFSDataset[] } & Pick<
  ComponentParamProps<null>,
  'currentValue' | 'onValueChange'
>) {
  return (
    <>
      {datasets
        .filter(
          (dataset) =>
            !ignoredDatasets.includes(dataset.name.split('/').reverse()[0])
        )
        .map((dataset) => (
          <CdsTreeItem
            expandable={(dataset.children?.length ?? 0) > 0}
            onExpandedChange={(e: Event) => {
              (e.target as CoreCdsTreeItem).expanded = (
                e as CustomEvent<boolean>
              ).detail;
            }}
            selected={dataset.name === currentValue}
            onSelectedChange={(e: Event) => {
              onValueChange(dataset.name);
            }}
          >
            <Dataset dataset={dataset} />
            <Datasets
              datasets={dataset.children ?? []}
              currentValue={currentValue}
              onValueChange={onValueChange}
            />
          </CdsTreeItem>
        ))}
    </>
  );
}

/**
 * React component rendering a TrueNAS ZFS dataset.
 * @param dataset dataset definition
 */
function Dataset({ dataset }: { dataset: TrueNAS.ZFSDataset }) {
  return (
    <>
      <CdsIcon shape={layersIconName} />
      {dataset.name.split('/').reverse()[0]}

      {/* How much capacity remains? */}
      <CdsTag readonly color="gray">
        {dataset.available.value}
      </CdsTag>

      {/* Is dataset encrypted? */}
      {dataset.encrypted ? (
        <CdsTag readonly color="gray">
          <CdsIcon shape={infoStandardIconName} />
          ENCRYPTED
        </CdsTag>
      ) : undefined}

      {/* Is dataset read only? */}
      {dataset.readonly.parsed ? (
        <CdsTag readonly color="gray">
          <CdsIcon shape={eyeIconName} />
          READ ONLY
        </CdsTag>
      ) : undefined}
    </>
  );
}

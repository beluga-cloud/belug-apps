import React, { useState, useEffect } from 'react';
import { ClarityIcons } from '@cds/core/icon';

import { CdsDynamicTree, TreeItem } from './cds/x/dynamic-tree-view';
import { ComponentParamProps } from './types.interface';
import { Dataset, Icons, Pool } from './truenas.datasets.atom';
import { ZFSDataset, ZFSPool } from './truenas.datasets.types';

/**
 * Custom React component to choose a TrueNAS datasets (tree view).
 */
export default function DatasetsTreeView({
  param,
  onValueChange,
  onError,
  value,
}: ComponentParamProps) {
  const [nodes, setNodes] = useState<TreeItem[]>([]);

  const listDatasets = async (pool: string): Promise<TreeItem[]> => {
    try {
      const resp = await fetch(
        `${param.apiURL}/api/v2.0/pool/dataset?pool=${pool}`,
        { redirect: 'follow' }
      );
      if (!resp.ok) {
        onError(`TrueNAS API returns ${resp.status}`);
        return [];
      }

      const datasets: ZFSDataset[] = await resp.json();
      if (datasets.length === 0) return [];

      // convert a list of dataset into a list of TreeItem recursively
      const convert = (datasets: ZFSDataset[]): TreeItem[] => {
        return datasets
          .filter((dataset) => dataset.name !== `${pool}/ix-applications`)
          .map((dataset) => ({
            text: (
              <Dataset
                dataset={dataset}
              ></Dataset>
            ),
            value: dataset.name,
            children: convert(dataset.children),
          }));
      };
      return convert(datasets[0].children);
    } catch (e) {
      onError(e);
      return [];
    }
  };

  const listPools = async (): Promise<TreeItem[]> => {
    try {
      const resp = await fetch(`${param.apiURL}/api/v2.0/pool`, {
        redirect: 'follow',
      });
      if (!resp.ok) {
        onError(`TrueNAS API returns ${resp.status}`);
        return [];
      }

      const pools: ZFSPool[] = await resp.json();
      return pools.map(
        (pool): TreeItem => ({
          text: <Pool pool={pool}></Pool>,
          value: pool.name,
          unselectable: true,

          lazy:
            pool.status !== 'ONLINE'
              ? undefined
              : () => listDatasets(pool.name),
        })
      );
    } catch (e) {
      onError(e);
      return [];
    }
  };

  useEffect(() => {
    // setup Clarity icons used inside tree items
    ClarityIcons.addIcons(...Icons);
    listPools().then(setNodes);
  }, []);

  return (
    <CdsDynamicTree
      data={nodes}
      onSelectedChange={onValueChange}
      value={value}
    ></CdsDynamicTree>
  );
}

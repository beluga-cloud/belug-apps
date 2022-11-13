import React, { useState, useEffect } from 'react';
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
import { CdsIcon } from '@cds/react/icon';
import { CdsTag } from '@cds/react/tag';

import { CdsDynamicTree, TreeItem } from './cds/x/dynamic-tree-view';
import { ComponentParamProps } from './index';

/**
 * ZFS Pool object based on the JSON returned by TrueNAS API. Only required
 * properties are kept.
 * @property {string}   name      Pool name
 * @property {string}   status    Is the pool ONLINE/OFFLINE?
 * @property {boolean}  healthy   Is the pool healthy?
 * @property {boolean}  warning   Did the pool have any warnings?
 * @property {number}   free      Remaining pool capacity
 */
interface ZFSPool {
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  healthy: boolean;
  warning: boolean;
  free: number;
}
/**
 * ZFS Dataset object based on the JSON returned by TrueNAS API. Only required
 * properties are kept.
 * @property {string}       name            Dataset path
 * @property {boolean}      encrypted       Is the dataset encrypted?
 * @property {ZFSDataset[]} children        Sub-datasets list
 * @property {boolean}      readonly.parsed Is the dataset readonly?
 * @property {string}       available.value Remaining dataset capacity
 */
interface ZFSDataset {
  name: string;
  encrypted: boolean;
  children: ZFSDataset[];
  readonly: { parsed: boolean };
  available: { value: string };
}

// source: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function bytesPrettier(a: number) {
  let b = 0;
  for (; a > 1024 && ++b;) a /= 1024;
  return a.toFixed(a <= 10 && b > 0 ? 1 : 0) + ['', 'K', 'M', 'G', 'T', 'P'][b];
}

/**
 * Custom React component to choose a TrueNAS datasets (tree view).
 */
export default function DatasetsTreeView({
  param,
  onValueChange,
  value,
}: ComponentParamProps) {
  const [nodes, setNodes] = useState<TreeItem[]>([]);

  ClarityIcons.addIcons(
    errorStandardIcon,
    eyeIcon,
    infoStandardIcon,
    layersIcon,
    storageIcon,
    successStandardIcon
  );

  useEffect(() => {
    fetch('http://localhost:8080/api/v2.0/pool')
      .then((resp: Response) => {
        if (resp.status !== 200)
          throw new Error(`API call returns ${resp.status}`);
        return resp.json();
      })
      .then((pools: ZFSPool[]) => {
        return pools.map(
          (pool): TreeItem => ({
            text: (
              <>
                <CdsIcon shape={storageIconName} />
                {pool.name}
                {pool.free === null ? undefined : (
                  <CdsTag readonly color="gray">
                    {bytesPrettier(pool.free)}
                  </CdsTag>
                )}
                <CdsTag
                  readonly
                  status={
                    pool.status === 'ONLINE'
                      ? pool.healthy && !pool.warning
                        ? 'success'
                        : 'warning'
                      : 'danger'
                  }
                >
                  <CdsIcon
                    shape={
                      pool.status === 'ONLINE' && pool.healthy && !pool.warning
                        ? successStandardIconName
                        : errorStandardIconName
                    }
                  />
                  {pool.status}
                </CdsTag>
              </>
            ),
            value: pool.name,
            unselectable: true,

            lazy:
              pool.status !== 'ONLINE'
                ? undefined
                : () => {
                  return fetch(
                    `http://localhost:8080/api/v2.0/pool/dataset?pool=${pool.name}`
                  )
                    .then((resp: Response) => {
                      if (resp.status !== 200)
                        throw new Error(`API call returns ${resp.status}`);
                      return resp.json();
                    })
                    .then((datasets: ZFSDataset[]): TreeItem[] => {
                      if (datasets.length === 0) return [];

                      const convert = (
                        datasets: ZFSDataset[]
                      ): TreeItem[] => {
                        return datasets
                          .filter(
                            (dataset) =>
                              dataset.name !== `${pool.name}/ix-applications`
                          )
                          .map((dataset) => ({
                            text: (
                              <>
                                <CdsIcon shape={layersIconName} />
                                {dataset.name.split('/').reverse()[0]}
                                <CdsTag readonly color="gray">
                                  {dataset.available.value}
                                </CdsTag>
                                {dataset.encrypted ? (
                                  <CdsTag readonly color="gray">
                                    <CdsIcon shape={infoStandardIconName} />
                                    ENCRYPTED
                                  </CdsTag>
                                ) : undefined}
                                {dataset.readonly.parsed ? (
                                  <CdsTag readonly color="gray">
                                    <CdsIcon shape={eyeIconName} />
                                    READ ONLY
                                  </CdsTag>
                                ) : undefined}
                              </>
                            ),
                            value: dataset.name,
                            children: convert(dataset.children),
                          }));
                      };

                      return convert(datasets[0].children);
                    });
                },
          })
        );
      })
      .then(setNodes);
  }, []);

  return (
    <CdsDynamicTree
      data={nodes}
      onSelectedChange={onValueChange}
    ></CdsDynamicTree>
  );
}

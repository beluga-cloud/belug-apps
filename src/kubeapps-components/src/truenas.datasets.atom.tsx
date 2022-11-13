import React from 'react';
import {
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
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { CdsIcon } from '@cds/react/icon';
import { CdsTag } from '@cds/react/tag';

import { ZFSPool, ZFSDataset } from './truenas.datasets.types';
import { BytesToString } from './utils';

export const Icons: IconShapeTuple[] = [
  errorStandardIcon,
  eyeIcon,
  infoStandardIcon,
  layersIcon,
  storageIcon,
  successStandardIcon,
];

/**
 * React component representing a ZFS dataset.
 */
export function Dataset({ dataset }: { dataset: ZFSDataset }) {
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

/**
 * React component representing a ZFS pool.
 */
export function Pool({ pool }: { pool: ZFSPool }) {
  const isOnline = pool.status === 'ONLINE';
  const isHealthy = pool.healthy && !pool.warning;

  const poolStatus = isOnline ? (isHealthy ? 'success' : 'warning') : 'danger';
  const poolStatusIcon =
    isOnline && isHealthy ? successStandardIconName : errorStandardIconName;

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
      <CdsTag readonly status={poolStatus}>
        <CdsIcon shape={poolStatusIcon} />
        {pool.status}
      </CdsTag>
    </>
  );
}

import React, {useEffect, useState, type ReactNode} from 'react';
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
import {type CdsTreeItem as CoreCdsTreeItem} from '@cds/core/tree-view';
import {CdsIcon} from '@cds/react/icon';
import {CdsTag} from '@cds/react/tag';
import {CdsTree, CdsTreeItem} from '@cds/react/tree-view';

import type * as TrueNAS from './truenas.types';
import {type ComponentParamProps} from './types.interface';
import {bytesToString, reducerMergeObject} from './utils';

// Load all used icons
// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
const _ = ClarityIcons.addIcons(
	errorStandardIcon,
	eyeIcon,
	infoStandardIcon,
	layersIcon,
	storageIcon,
	successStandardIcon,
);

// ignored datasets
const ignoredDatasets = [
	'ix-applications', // All 'íx-appplications' datasets will be ignored to avoid any issues with TrueNAS applications
];

/**
 * DatasetsTreeView parameter comming from the custom component configuration
 * @property {string} apiURL  the API URL used to generate dynamically the dataset
 */
export type DatasetsTreeViewParam = {
	type: 'truenas.datasets';
	apiURL?: string;
};

/**
 * This tree view is a hierarchical component that gives users access to a hierarchical set of datasets displayed in
 * a the parent-child relationship.
 * @element DatasetsTreeView
 * @param param         tree view configuration
 * @param currentValue  current dataset selected
 * @param onValueChange callback called when a dataset is selected
 * @param onError       callback called when an error occurs
 */
export default function DatasetsTreeView({
	param,
	currentValue,
	onValueChange,
	onError,
}: ComponentParamProps<DatasetsTreeViewParam>) {
	const [pools, setPools] = useState<Record<string, TrueNAS.ZfsPool & {loaded: boolean}>>({});

	/**
	 * Fetch from TrueNAS url the list of pool or dataset, depending on the given URL.
	 * @param url API url to fetch
	 * @returns the list of ZFS pool or dataset fetched
	 */
	const fetchApi = async <T extends TrueNAS.ZfsPool[] | TrueNAS.ZfsDataset[]>(url: string) => {
		const resp = await fetch(url, {redirect: 'follow'});
		if (!resp.ok) {
			throw new Error(`TrueNAS API returns ${resp.status}: ${await resp.text()}`);
		}

		return (await resp.json()) as T;
	};

	const onExpandedChange = (pool: TrueNAS.ZfsPool) =>
		async (e: Event) => {
			const event = e as CustomEvent<boolean>;
			(e.target as CoreCdsTreeItem).expanded = event.detail;

			if (pools[pool.name].loaded) {
				return;
			}

			(e.target as CoreCdsTreeItem).loading = true;
			try {
				const url = `${param.apiURL ?? ''}/truenas/api/v2.0/pool/dataset?pool=${pool.name}`;
				const datasets = await fetchApi<TrueNAS.ZfsDataset[]>(
					url,
				);

				if (datasets.length === 0) {
					throw new Error('no dataset found');
				}

				setPools(pools => ({
					...pools,
					[pool.name]: {
						...pools[pool.name],
						children: datasets[0].children,
						loaded: true,
					},
				}));
			} catch (e: unknown) {
				onError(
					`Failed to list datasets of pool "${pool.name}": ${JSON.stringify(e)}`,
				);
			}

			(e.target as CoreCdsTreeItem).loading = false;
		};

	useEffect(() => {
		const url = `${param.apiURL ?? ''}/truenas/api/v2.0/pool`;
		fetchApi<TrueNAS.ZfsPool[]>(url)
			.then(pools => {
				setPools(pools.map(pool => ({[pool.name]: {...pool, loaded: false}})).reduce(reducerMergeObject, {}));
			})
			.catch((e: unknown) => {
				onError(`Failed to list pools: ${JSON.stringify(e)}`);
			});
	}, []);

	return (
		<CdsTree>
			{Object.keys(pools)
				.map(pool => pools[pool])
				.map(pool => (
					<CdsTreeItem
						key={pool.name}
						expandable={
							pool.status === 'ONLINE'
							&& (!pools[pool.name].loaded || pool.children?.length > 0)
						}
						onExpandedChange={onExpandedChange(pool)}
					>
						<Pool pool={pool} />
						<Datasets
							datasets={pool.children ?? []}
							currentValue={currentValue}
							onValueChange={onValueChange}
						/>
					</CdsTreeItem>
				))}
		</CdsTree>
	);
}

/**
 * React component rendering a TrueNAS ZFS pool.
 * @param pool  pool definition
 */
function Pool({pool}: {pool: TrueNAS.ZfsPool}) {
	const online = pool.status === 'ONLINE';
	const healthy = pool.healthy && !pool.warning;

	const status = online ? (healthy ? 'success' : 'warning') : 'danger';
	const statusIcon
		= online && healthy ? successStandardIconName : errorStandardIconName;

	return (
		<>
			<CdsIcon shape={storageIconName} />
			{pool.name}

			{/* How much capacity remains? */}
			{pool.free === null ? undefined : (
				<CdsTag readonly color='gray'>
					{bytesToString(pool.free)}
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
}: {datasets: TrueNAS.ZfsDataset[]} & Pick<
ComponentParamProps<undefined>,
'currentValue' | 'onValueChange'
>) {
	return (
		<>
			{datasets
				.filter(
					dataset =>
						!ignoredDatasets.includes(dataset.name.split('/').reverse()[0]),
				)
				.map(dataset => (
					<CdsTreeItem
						key={dataset.name}
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
function Dataset({dataset}: {dataset: TrueNAS.ZfsDataset}) {
	return (
		<>
			<CdsIcon shape={layersIconName} />
			{dataset.name.split('/').reverse()[0]}

			{/* How much capacity remains? */}
			<CdsTag readonly color='gray'>
				{dataset.available.value}
			</CdsTag>

			{/* Is dataset encrypted? */}
			{dataset.encrypted ? (
				<CdsTag readonly color='gray'>
					<CdsIcon shape={infoStandardIconName} />
					ENCRYPTED
				</CdsTag>
			) : undefined}

			{/* Is dataset read only? */}
			{dataset.readonly.parsed ? (
				<CdsTag readonly color='gray'>
					<CdsIcon shape={eyeIconName} />
					READ ONLY
				</CdsTag>
			) : undefined}
		</>
	);
}

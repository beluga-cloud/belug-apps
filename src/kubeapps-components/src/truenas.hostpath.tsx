import React, {useState} from 'react';
import {
	ClarityIcons,
	folderIcon,
	folderIconName,
} from '@cds/core/icon';
import {type CdsTreeItem as CoreCdsTreeItem} from '@cds/core/tree-view';
import {CdsIcon} from '@cds/react/icon';
import {CdsTag} from '@cds/react/tag';
import {CdsTree, CdsTreeItem} from '@cds/react/tree-view';

import type * as TrueNAS from './truenas.types';
import {type ComponentParamProps} from './types.interface';
import {reducerMergeObject} from './utils';

// Load all used icons
// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
const _ = ClarityIcons.addIcons(folderIcon);

// Default hostdir path
const DefaultHostdir = '/mnt';

/**
 * HostpathTreeView parameter comming from the custom component configuration
 * @property {string} path    the path where the tree view starts
 * @property {string} apiURL  the API URL used to list directory from TrueNAS host
 */
export type HostpathTreeViewParam = {
	type: 'truenas.hostpath';
	path?: string;
	apiURL?: string;
};

/**
 * This tree view is a hierarchical component that gives users access to a hierarchical set of directory displayed in
 * a the parent-child relationship.
 * @element HostpathTreeView
 * @param param         tree view configuration
 * @param currentValue  current path selected
 * @param onValueChange callback called when a directory is selected
 * @param onError       callback called when an error occurs
 */
export default function HostpathTreeView({
	param,
	currentValue,
	onValueChange,
	onError,
}: ComponentParamProps<HostpathTreeViewParam>) {
	const [root, setRoot] = useState<TrueNAS.Directory>({
		name: (param.path ?? DefaultHostdir).split('/').reverse()[0],
		path: param.path ?? DefaultHostdir,
		type: 'DIRECTORY',
		acl: false,
		subdir: undefined,
	});

	/**
	 * List all directories inside the given path and update the existing tree.
	 * @param path path where to list all directories
	 */
	const listDir = async (path: string) => {
		const url = `${param?.apiURL ?? ''}/truenas/api/v2.0/filesystem/listdir`;
		try {
			const resp = await fetch(url, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({path}),
				redirect: 'follow',
			});
			if (!resp.ok) {
				throw new Error(
					`TrueNAS API returns ${resp.status}: ${await resp.text()}`,
				);
			}

			const directories = ((await resp.json()) as TrueNAS.File[]).filter(
				file => file.type === 'DIRECTORY',
			) as TrueNAS.Directory[];

			setRoot(root => {
				let dirptr = root;

				// NOTE: find the current directory based on current path
				if (path.substring(dirptr.path.length) !== '') {
					for (const dirname of path.substring(dirptr.path.length).split('/')) {
						if (dirname === '') {
							continue;
						}

						if (dirptr.subdir === undefined) {
							onError(
								`Failed to generate tree for ${path}: ${dirptr.path} should have subdirectories`,
							);
							return root;
						}

						if (!dirptr.subdir[dirname]) {
							onError(
								`Failed to generate tree for ${path}: ${dirptr.path} should have subdirectory ${dirname}`,
							);
							return root;
						}

						dirptr = dirptr.subdir[dirname];
					}
				}

				dirptr.subdir = directories
					.map(dir => ({[dir.name]: dir}))
					.reduce(reducerMergeObject, {});
				return {...root};
			});
		} catch (e: unknown) {
			onError(`Failed to list directory "${path}": ${JSON.stringify(e)}`);
		}
	};

	return (
		<CdsTree>
			<Directory
				directory={root}
				currentValue={currentValue}
				onValueChange={onValueChange}
				onExpandedChange={async (path: string) => listDir(path)}
			/>
		</CdsTree>
	);
}

/**
 * React component rendering a directory.
 * @param datasets			list of ZFS datasets to render
 * @param currentValue		current dataset selected
 * @param onValueChange		callback called when a dataset is selected
 * @param onExpandedChange	function used to update the list of directory with the given path
 */
function Directory({
	directory,
	currentValue,
	onValueChange,
	onExpandedChange,
}: Pick<ComponentParamProps<undefined>, 'currentValue' | 'onValueChange'> & {
	directory: TrueNAS.Directory;
	onExpandedChange: (path: string) => Promise<void>;
}) {
	return (
		<CdsTreeItem
			key={directory.path}
			expandable={
				directory.subdir === undefined
				|| Object.keys(directory.subdir).length > 0
			}
			onExpandedChange={async (e: Event) => {
				const event = e as CustomEvent<boolean>;
				(e.target as CoreCdsTreeItem).expanded = event.detail;

				if (directory.subdir !== undefined) {
					return;
				}

				(e.target as CoreCdsTreeItem).loading = true;
				await onExpandedChange(directory.path);
				(e.target as CoreCdsTreeItem).loading = false;
			}}
			selected={directory.path === currentValue}
			onSelectedChange={(e: Event) => {
				onValueChange(directory.path);
			}}
		>
			<CdsIcon shape={folderIconName} />
			{directory.name}

			{/* Does the file have ACLs? */}
			{directory.acl ? (
				<CdsTag readonly color='gray'>
					ACL
				</CdsTag>
			) : undefined}

			{Object.keys(directory.subdir ?? {})
				.map(dirname => directory.subdir[dirname])
				.map(directory => (
					<Directory
						key={directory.path}
						directory={directory}
						currentValue={currentValue}
						onValueChange={onValueChange}
						onExpandedChange={onExpandedChange}
					/>
				))}
		</CdsTreeItem>
	);
}

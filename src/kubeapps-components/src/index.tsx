import React, {type ReactNode, useEffect, useState} from 'react';
import {CdsControlMessage} from '@cds/react/forms';

import {stringify} from './utils';
import DatasetsTreeView, {type DatasetsTreeViewParam} from './truenas.datasets';
import HostpathTreeView, {type HostpathTreeViewParam} from './truenas.hostpath';
import {type CustomParamProps, type BelugappsComponentUnion} from './types.interface';

/**
 * Implements Kubeapps custom components. Because we can only export one custom
 * component, this component returns the right component based on the type
 * parameter.
 */
export default function CustomComponents({
	param,
	handleBasicFormParamChange,
}: CustomParamProps<BelugappsComponentUnion>) {
	const [error, setError] = useState<string>('');
	const [isValueModified, setIsValueModified] = useState(false);
	const [timeout, setThisTimeout] = useState({} as NodeJS.Timeout);
	const [value, setValue] = useState<string>(param.currentValue);

	// NOTE: this is used to keep the value updated if the user changed
	//       something inside the YAML editor.
	useEffect(() => {
		setValue(param.currentValue);
	}, [param.currentValue]);

	useEffect(() => {
		setIsValueModified(stringify(value) !== stringify(param.currentValue));
	}, [value]);

	const onValueChange = (update: string) => {
		const func = handleBasicFormParamChange(param);
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		const event = {
			currentTarget: {
				value: update,
				type: param.type,
			},
		} as React.FormEvent<
		HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>;

		setValue(update);
		clearTimeout(timeout);
		setThisTimeout(setTimeout(() => {
			func(event);
		}, 500));
	};

	const renderComponent = (): ReactNode => {
		switch (param.customComponent?.type ?? '') {
			case 'truenas.datasets':
				return (
					<DatasetsTreeView
						param={param.customComponent as DatasetsTreeViewParam}
						onValueChange={onValueChange}
						onError={e => {
							setError(`${e}`);
						}}
						currentValue={value}
					></DatasetsTreeView>
				);
			case 'truenas.hostpath':
				return (
					<HostpathTreeView
						param={param.customComponent as HostpathTreeViewParam}
						onValueChange={onValueChange}
						onError={e => {
							setError(`${e}`);
						}}
						currentValue={value}
					></HostpathTreeView>
				);
			default:
				setError(
					`Component "${param.customComponent.type}" is not managed by Belug-Apps extension. Please contact the chart maintainers to fix this issue.`,
				);
		}
	};

	return (
		<>
			{error === '' ? (
				<>
					{renderComponent()}
					<CdsControlMessage>
						{isValueModified ? 'Unsaved' : ''}
					</CdsControlMessage>
				</>
			) : (
				<CdsControlMessage status='error'>{error}</CdsControlMessage>
			)}
		</>
	);
}

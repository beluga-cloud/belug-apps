import React, { useEffect, useState } from 'react';
import { CdsControlMessage } from '@cds/react/forms';

import { CustomParamProps } from './types.interface';
import DatasetsTreeView from './truenas.datasets';
import { Stringify } from './utils';

// source: https://github.com/vmware-tanzu/kubeapps/blob/cc9eddb78cf8e3611e0d50daed4fe6ca73418530/dashboard/src/components/DeploymentForm/DeploymentFormBody/BasicDeploymentForm/TabularSchemaEditorTable/TabularSchemaEditorTableRenderer.tsx#L14
const MAX_LENGTH = 60;

/**
 * Implements Kubeapps custom components. Because we can only export one custom
 * component, this component returns the right component based on the type
 * parameter.
 */
export default function CustomComponents({
  param,
  handleBasicFormParamChange,
}: CustomParamProps) {
  const [isValueModified, setIsValueModified] = useState(false);
  const [value, setValue] = useState<any>(param.currentValue);
  const [timeout, setThisTimeout] = useState({} as NodeJS.Timeout);
  console.log(param);

  // NOTE: this is used to keep the value updated if the user changed
  //       something inside the YAML editor.
  useEffect(() => {
    setValue(param.deployedValue);
  }, [param.deployedValue]);

  // NOTE: handleBasicFormParamChange is heavier than expected and we need to
  //       "debounce" its call (it tooks ~1s on my browser to run...).
  const onValueChange = (update: any) => {
    setValue(update);
    setIsValueModified(Stringify(update) !== Stringify(param.currentValue));

    clearTimeout(timeout);
    const func = handleBasicFormParamChange(param);

    const event = {
      currentTarget: {
        value: update,
        type: param.type,
      },
    } as React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >;
    setThisTimeout(setTimeout(() => func(event), 500));
  };

  return (
    <>
      {/* All components are managed here, depending on the given `type` value */}
      {(param.customComponent?.type ?? '') === 'truenas.datasets' ? (
        <DatasetsTreeView
          param={param.customComponent}
          onValueChange={onValueChange}
        ></DatasetsTreeView>
      ) : (
        <CdsControlMessage status="error">
          Component "{param.customComponent.type}" is not managed by Belug-Apps
          extension.{' '}
          <b>Please contact the chart maintainers to fix this issue.</b>
        </CdsControlMessage>
      )}
      <CdsControlMessage>{isValueModified ? 'Unsaved' : ''}</CdsControlMessage>
    </>
  );
}

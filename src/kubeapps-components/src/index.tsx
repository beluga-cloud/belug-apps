import React, { useEffect, useState } from 'react';
import { CdsControlGroup, CdsControlMessage } from '@cds/react/forms';
import { debounce } from 'ts-debounce';

import DatasetsTreeView from './truenas.datasets';

// NOTE: following types and interface comes from a quick reverse engineering
//       of what Kubeapps send to the custom module.
interface ParamProps {
  type: 'string';
  form: true;

  title: string;
  description: string;
  path: string;
  value: any;

  customComponent: {
    type: 'truenas.datasets';
  };
}

interface CustomParamProps {
  param: ParamProps;
  handleBasicFormParamChange: (
    p: ParamProps
  ) => (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

// source: https://github.com/vmware-tanzu/kubeapps/blob/cc9eddb78cf8e3611e0d50daed4fe6ca73418530/dashboard/src/components/DeploymentForm/DeploymentFormBody/BasicDeploymentForm/TabularSchemaEditorTable/TabularSchemaEditorTableRenderer.tsx#L14
const MAX_LENGTH = 60;

/**
 * Properties used by other components.
 * @property {ParamProps}       param         CustomComponent properties given by Kubeapps
 * @property {(e: any) => void} onValueChange Handler to call when the target must be updated
 * @property {any}              value         Synced value
 */
export interface ComponentParamProps {
  param: ParamProps;
  onValueChange: (e: any) => void;
  value: any;
}

/**
 * Implements Kubeapps custom components. Because we can only export one custom
 * component, this component returns the right component based on the type
 * parameter.
 */
export default function CustomComponents({
  param,
  handleBasicFormParamChange,
}: CustomParamProps) {
  const [value, setValue] = useState<any>(param.value);
  console.log(param);

  // NOTE: this is used to keep the value updated if the user changed
  //       something inside the YAML editor.
  useEffect(() => {
    setValue(param.value);
  }, [param.value]);

  // NOTE: handleBasicFormParamChange is heavier than expected and we need to
  //       "debounce" its call (it tooks ~1s on my browser to run...).
  const onValueChange = (update: any) => {
    setValue(update);

    const event = {
      currentTarget: {
        value: update,
        type: param.type,
      },
    } as React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >;
    handleBasicFormParamChange(param)(event);
  };

  return (
    <CdsControlGroup>
      <label className="centered deployment-form-label">{param.title}</label>

      {/* All components are managed here, depending on the given `type` value */}
      {(param.customComponent?.type ?? '') === 'truenas.datasets' ? (
        <DatasetsTreeView
          param={param}
          onValueChange={debounce(onValueChange, 2500)}
          value={value}
        ></DatasetsTreeView>
      ) : (
        <CdsControlMessage status="error">
          Component "{param.customComponent.type}" is not managed by
          Belug-Apps extension.{' '}
          <b>Please contact the chart maintainers to fix this issue.</b>
        </CdsControlMessage>
      )}

      {param.description ? (
        <span className="description">{param.description}</span>
      ) : undefined}
    </CdsControlGroup>
  );
}

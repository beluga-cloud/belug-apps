import { JSONSchemaType, ErrorObject } from "ajv";

import { DatasetsTreeViewParam } from "./truenas.datasets.types";

/**
 * Params used by Kubeapps to render each parameter in the user interface, based
 * on Kubeapps source code.
 * https://github.com/vmware-tanzu/kubeapps/blob/cc9eddb78cf8e3611e0d50daed4fe6ca73418530/dashboard/src/shared/types.ts#L404
 */
type IBasicFormParam = JSONSchemaType<any> & {
  key: string;
  title: string;
  hasProperties: boolean;
  params?: IBasicFormParam[];
  enum?: string[];
  isRequired: boolean;
  defaultValue: any;
  deployedValue: any;
  currentValue: any;
  schema: JSONSchemaType<any>;
  isCustomComponent?: boolean;
};

/**
 * Params used by BelugApps components.
 */
type BelugappsComponentParam = DatasetsTreeViewParam & {
  type: "truenas.datasets" | "truenas.hostpath";
};

/**
 * Params used by Kubeapps to render each parameter in the user interface. Some
 * of these values are modified depending on what I've seen during runtime
 * executions.
 */
export type KubeappsComponentParam = Omit<
  IBasicFormParam,
  "isCustomComponent"
> & {
  type: "string";

  isCustomComponent?: BelugappsComponentParam;
  customComponent: BelugappsComponentParam;
};

/**
 * Param used by Kubeapps custom components (remote React components).
 * @property {KubeappsComponentParam} param                       Component params
 * @property {function}               handleBasicFormParamChange  Handler to call when the component value change
 */
export interface CustomParamProps {
  param: KubeappsComponentParam;
  handleBasicFormParamChange: (
    p: KubeappsComponentParam
  ) => (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

/**
 * Properties used by other components.
 * @property {BelugappsComponentParam}  param         Param required to configure a component
 * @property {function}                 onValueChange Handler to call when the target must be updated
 */
export interface ComponentParamProps {
  param: BelugappsComponentParam;
  onValueChange: (e: any) => void;
}

import { JSONSchemaType } from "ajv";

import { DatasetsTreeViewParam } from "./truenas.datasets";
import { HostpathTreeViewParam } from "./truenas.hostpath";

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
 * Params used by Kubeapps to render each parameter in the user interface. Some
 * of these values are modified depending on what I've seen during runtime
 * executions.
 */
export type KubeappsComponentParam<T extends BelugappsComponentUnion> = Omit<
  IBasicFormParam,
  "isCustomComponent"
> & {
  type: "string";

  isCustomComponent?: T;
  customComponent: T;
};

/**
 * Param used by Kubeapps custom components (remote React components).
 * @property {KubeappsComponentParam} param                       Component params
 * @property {function}               handleBasicFormParamChange  Handler to call when the component value change
 */
export interface CustomParamProps<C extends BelugappsComponentUnion> {
  param: KubeappsComponentParam<C>;
  handleBasicFormParamChange: (
    p: KubeappsComponentParam<C>
  ) => (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

/**
 * Properties used by other components.
 * @property {BelugappsComponentParam}  param         param required to configure a component
 * @property {string}                   currentValue  value selected by the user
 * @property {function}                 onValueChange callback to call when the target must be updated
 * @property {function}                 onError       callback to call when an error occurs
 */
export interface ComponentParamProps<T extends BelugappsComponentUnion> {
  param: T;
  currentValue: string;

  onValueChange: (e: string) => void;
  onError: (e: string) => void;
}

/**
 * Union of all existing Belug-Apps component parameters
 */
export type BelugappsComponentUnion =
  | DatasetsTreeViewParam
  | HostpathTreeViewParam;

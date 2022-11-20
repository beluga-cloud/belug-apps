/**
 * ZFS Pool object based on the JSON returned by TrueNAS API. Only required
 * properties are kept.
 * @property {string}   name      pool name
 * @property {string}   status    is the pool ONLINE/OFFLINE?
 * @property {boolean}  healthy   is the pool healthy?
 * @property {boolean}  warning   did the pool have any warnings?
 * @property {number}   free      remaining pool capacity
 */
export interface ZFSPool {
  name: string;
  status: "ONLINE" | "OFFLINE";
  healthy: boolean;
  warning: boolean;
  free: number;

  children: ZFSDataset[];
}

/**
 * ZFS Dataset object based on the JSON returned by TrueNAS API. Only required
 * properties are kept.
 * @property {string}       name            dataset path
 * @property {boolean}      encrypted       is the dataset encrypted?
 * @property {ZFSDataset[]} children        sub-datasets list
 * @property {boolean}      readonly.parsed is the dataset readonly?
 * @property {string}       available.value remaining dataset capacity
 */
export interface ZFSDataset {
  name: string;
  encrypted: boolean;
  children: ZFSDataset[];
  readonly: { parsed: boolean };
  available: { value: string };
}

/**
 * File object based on the JSON returned by TrueNAS API. Only required
 * properties are kept.
 */
export interface File {
  name: string;
  path: string;
  type: "DIRECTORY" | "FILE" | "SYMLINK";
  acl: boolean;
}

export type Directory = File & {
  type: "DIRECTORY";
  subdir: Record<string, Directory>;
};
export type Symlink = File & { type: "SYMLINK" };

/**
 * Convert the given number to an human readable number with the right
 * binary prefix.
 * @see {@link https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript|stackoverflow}
 * for the implementation details
 * @param a - the number of bytes to convert
 * @returns an human redable string of the given number of bytes
 */
export function bytesToString(a: number) {
	if (a === null) {
		return 'NaN';
	}

	let b = 0;
	for (; a > 1024 && ++b;) {
		a /= 1024;
	}

	return a.toFixed(a <= 10 && b > 0 ? 1 : 0) + ['', 'K', 'M', 'G', 'T', 'P'][b];
}

/**
 * Return a string representing the given value
 * @see {@link https://github.com/vmware-tanzu/kubeapps/blob/cc9eddb78cf8e3611e0d50daed4fe6ca73418530/dashboard/src/shared/utils.ts#L42}
 * for the implementation source
 * @param value - value to strigify
 * @returns the string representation of the value
 */
export function stringify(value: any): string {
	if (['array', 'object'].includes(typeof value)) {
		try {
			return JSON.stringify(value);
		} catch (e: unknown) {
			return '';
		}
	}

	return '';
}

/**
 * Reducer used to merge a list of object into a single one.
 * @param acc     accumulator when previous object are merged
 * @param current current object to merge into the accumulator
 * @returns an object composed the given list of objects
 */
export function reducerMergeObject<AccT, T>(acc: AccT, current: T): AccT {
	return {...acc, ...current};
}

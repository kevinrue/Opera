import 'moment/locale/en-gb';

// TODO: Generic function duplicate of RawFastqRecordSingle
	// Day-precision Date() from moment
export function	momentToDate (moment) {
	// console.log(moment);
	return(
		new Date(moment.year(), moment.month(), moment.date())
	);
}
	
/* Danish locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.da = {};

Flatpickr.l10ns.da.weekdays = {
	shorthand: ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'],
	longhand: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag']
};

Flatpickr.l10ns.da.months = {
	shorthand: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
	longhand: ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december']
};

Flatpickr.l10ns.da.ordinal = function () {
	return ".";
};

Flatpickr.l10ns.da.firstDayOfWeek = 1 // monday

if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10ns;
}
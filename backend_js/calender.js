var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./visualisationController", "./sankeyBar"], function (require, exports, visualisationController_1, sankeyBar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let jq = window["$"];
    jq(function () {
        jq('input[name="daterange"]').daterangepicker({
            "locale": {
                "format": "YYYY/MM/DD",
                "separator": " - ",
                "applyLabel": "Apply",
                "cancelLabel": "Cancel",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "Custom",
                "weekLabel": "W",
                "daysOfWeek": [
                    "Su",
                    "Mo",
                    "Tu",
                    "We",
                    "Th",
                    "Fr",
                    "Sa"
                ],
                "monthNames": [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ],
                "firstDay": 1
            },
            // start and end date of the selection
            "startDate": "2000/03/01",
            "endDate": "2001/03/01",
            "showDropdowns": true,
            "showWeekNumbers": true
        }, function (start, end) {
            return __awaiter(this, void 0, void 0, function* () {
                yield new Promise(resolve => setTimeout(resolve, 500));
                window["startDate"] = start._d;
                window["endDate"] = end._d;
                visualisationController_1.updateMainChord();
                sankeyBar_1.default();
                if (!window["full-alluvial"]) {
                    visualisationController_1.updateSankey();
                }
            });
        });
    });
    // alert user to change to a bigger screen
    if (/Mobi|Android/i.test(navigator.userAgent) || /Mobi/.test(navigator.userAgent)) {
        alert('Your device\'s screen might be to small to view this project at its best performance. Please switch to a larger screen and continue.');
    }
});

/* eslint-disable no-control-regex */
class RegexUtils {

	constructor() {
		this.validateLinkRegex = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');

/* 		this.numberCommasRegex = /\B(?=(\d{3})+(?!\d))/g;
		this.splitWords = /(?=[A-Z])|[\s, _.-]+/;
		this.clearNoneAlphabets = /[^A-Za-z'`]/g; */
	}
}

module.exports = new RegexUtils();
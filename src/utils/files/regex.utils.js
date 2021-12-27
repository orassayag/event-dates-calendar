/* eslint-disable no-control-regex */
class RegexUtils {

	constructor() {
		this.validateLinkRegex = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
		this.findDateRegex = /(((0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/](19|20)?[0-9]{2})*$)|((0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])*$)/i;
	}
}

export default new RegexUtils();
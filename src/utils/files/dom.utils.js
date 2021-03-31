const jsdom = require('jsdom');
const { JSDOM } = jsdom;

class DOMUtils {

    constructor() { }

    async getDOMfromURL(url) {
        let dom = null;
        try {
            dom = await JSDOM.fromURL(url);
            dom.serialize();
        }
        catch (error) {}
        return dom;
    }
}

module.exports = new DOMUtils();
        /*         const jsdom = require('jsdom');
const { JSDOM } = jsdom; */
/*         console.log(dom.window.document.getElementsByClassName('holhamoed')[0].textContent); */
/*         let dom = null;
        try {
            const res = await axios.get(url);
            dom = new JSDOM(res.data);
        }
        catch (error) { }
        return dom; */
/* const axios = require('axios'); */
/*             console.log(resp.data); */
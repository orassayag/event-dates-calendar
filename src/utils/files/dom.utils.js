import jsdom from 'jsdom';

const { JSDOM } = jsdom;

class DOMUtils {
  constructor() {}

  async getDOMFromURL(url) {
    let dom = null;
    try {
      dom = await JSDOM.fromURL(url);
      dom.serialize();
    } catch (error) {}
    return dom;
  }
}

export default new DOMUtils();

module.exports = class Link {

  constructor(linkHeader) {
    linkHeader.split(', ').forEach(value => {
      let [urlPart, relPart] = value.split('; ');
      this[relPart.match(/rel="(.*)"/)[1] + 'Url'] = urlPart.replace(/[<>]/g, '');
    });
  }

}
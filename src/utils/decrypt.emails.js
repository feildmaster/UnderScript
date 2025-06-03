const selector = 'a[href="/cdn-cgi/l/email-protection"]';

function hexAt(str = '', index = 0) {
  const r = str.substring(index, index + 2);
  return parseInt(r, 16);
}

function decrypt(ciphertext) {
  let output = '';
  const key = hexAt(ciphertext, 0);
  for (let i = 2; i < ciphertext.length; i += 2) {
    const plaintext = hexAt(ciphertext, i) ^ key;
    output += String.fromCharCode(plaintext);
  }
  return decodeURIComponent(escape(output));
}

export default function decode(doc) {
  if (typeof jQuery === 'function' && doc instanceof jQuery) {
    doc.find(selector).replaceWith(function decryption() {
      return decrypt(this.dataset.cfemail);
    });
  } else {
    [...doc.querySelectorAll(selector)].forEach(function decryption(el) {
      el.replaceWith(decrypt(el.dataset.cfemail));
    });
  }
  return doc;
}

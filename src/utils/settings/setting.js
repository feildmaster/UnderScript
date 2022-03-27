/**
 * Base setting type used by UnderScript settings.
 */
export default class SettingType {
  constructor(name) {
    const isString = typeof name === 'string';
    /**
     * @type {String}
     */
    this.name = name && isString ? name.trim() : name;
    if (!isString || !this.name) throw new Error('Name not provided');
  }

  /**
   * Convert data into processed value. Can be the `default` value, or the encoded string
   * @param {*} val Raw data to convert
   * @returns {*} value
   */
  value(val) {
    throw new Error('Value not implemented');
  }

  /**
   * Encode value to make it safe for storage. By default it stringifies Objects, otherwise it returns itself.
   *
   * Override this function to encode differently
   * @param {*} value object to encode
   * @returns encoded object
   */
  encode(value) {
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  }

  /**
   * Get default value for setting type.
   * @param {*} data Optional data of the setting
   * @returns {* | null} default value for setting
   */
  default(data = undefined) {
    return null;
  }

  /**
   * Create element
   * @param {*} value current value to generate document element
   * @param {Function} update set the value of the setting. Pass `undefined` to delete the value from storage
   * @param {*} data Optional data attached to setting
   * @param {Boolean} remove true if expects "undefined" on removal
   * @param {HTMLElement | JQuery} container child container you can manipulate, placed after main setting
   * @param {String} key setting key, for use in `container`
   * @returns {HTMLElement | JQueryElement} element that controls the setting
   */
  element(value, update, {
    data = undefined,
    remove = false,
    container,
    key = '',
  }) {
    throw new Error('Element not implemented');
  }

  /**
   * Styles to apply on settings
   * @returns {String[]} styles to apply on registration
   */
  styles() {
    return [];
  }

  /**
   * Controls if element label is prepended or appended
   * @returns {Boolean} True (default) if label is prepended to element
   */
  labelFirst() {
    return true;
  }
}

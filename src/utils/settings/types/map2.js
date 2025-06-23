import Translation from 'src/structures/constants/translation';
import Setting from './map.js';
import SettingType from './setting.js';
import { getSettingType, isSettingType } from '../settingRegistry.js';

const mapTypes = new Set();
let baseRegistered = false;

export default class AdvancedMap extends Setting {
  /**
   * @type {SettingType}
   */
  #keyType;
  /**
   * @type {SettingType}
   */
  #valueType;
  #name;

  constructor(keyType = 'text', valueType = keyType) {
    super('advancedMap');
    this.#keyType = getSettingType(keyType);
    this.#valueType = getSettingType(valueType);
    if (!isSettingType(this.#keyType) || !isSettingType(this.#valueType)) throw new Error('AdvancedMap requires setting types');
    const uniqueTypes = [...new Set([this.#keyType, this.#valueType])];
    // const invalidTypes = uniqueTypes.filter((type) => !type.isBasic);
    // if (invalidTypes.length) throw new Error(`AdvancedMap can only use basic setting types. (invalid: ${invalidTypes.join(', ')})`);
    this.#name = uniqueTypes.join('_').replaceAll(' ', '-');
    if (baseRegistered) {
      this.name += `_${this.#name}`;
    }
  }

  /**
   * @param {Map<any, any>} val
   */
  element(val, update, {
    container, data: mapData = {}, disabled, key, name, untilClose,
  } = {}) {
    // TODO: validate that disabled propagates properly
    const data = [...val.entries()];
    const dataKey = getData(mapData);
    const dataValue = getData(mapData, true);
    let entries = data.length;
    const add = (lineValue, id) => {
      function save(remove) {
        if (remove) data.splice(data.indexOf(lineValue), 1);
        const ret = data.filter(([_]) => _);
        update(ret);
      }
      const line = $('<div class="item">');
      const options = { container: $('<div>'), name, disabled, remove: false, removeSetting() {}, key: `${key}.${id}`, child: true };
      const left = $(this.#keyType.element(this.#keyValue(lineValue[0], dataKey), (newValue) => {
        const [keyValue] = lineValue;
        const isInvalid = this.#isInvalid(data, keyValue, newValue);
        line.toggleClass('error', isInvalid);
        if (isInvalid || newValue === keyValue) return;
        lineValue[0] = newValue;
        cacheLeftValue();
        save();
      }, {
        ...options,
        data: dataKey,
      }));
      const right = $(this.#valueType.element(this.#value(lineValue[1], dataValue), (newValue) => {
        if (newValue === lineValue[1]) return;
        lineValue[1] = newValue;
        save();
      }, {
        ...options,
        data: dataValue,
        key: `${options.key}.value`,
      }));
      const button = $('<button class="btn btn-danger glyphicon glyphicon-trash">').on('click', () => {
        save(true);
        line.remove();
      });
      let leftValue;
      const warning = $('<div class="warning clickable">')
        .text(Translation.Setting('map.duplicate'))
        .on('click', () => left.val(leftValue)
          .parent().removeClass('error'));
      function refresh() {
        left.prop('disabled', disabled);
        right.prop('disabled', disabled);
        button.prop('disabled', disabled);
      }
      let simpleLookup = false;
      function cacheLeftValue() {
        leftValue = simpleLookup ?
          left.val() :
          left.find(`#${options.key}`).val();
      }
      if (!left.find(`#${options.key}`).length) {
        left.attr('id', options.key);
        simpleLookup = true;
      }
      if (!right.find(`#${options.key}.value`).length) {
        right.attr('id', `${options.key}.value`);
      }
      cacheLeftValue();
      refresh();
      untilClose(`refresh:${key}`, refresh, `create:${key}`);
      container.append(line.append(left, ' : ', right, button, warning));
    };
    data.forEach(add);
    const { defaultKey, defaultValue } = mapData;
    return $('<button class="btn btn-success glyphicon glyphicon-plus">').on('click', () => {
      const item = [
        defaultKey ?? this.#keyType.default(dataKey) ?? '',
        defaultValue ?? this.#valueType.default(dataValue) ?? '',
      ];
      data.push(item);
      add(item, entries);
      entries += 1;
    });
  }

  encode(value = []) {
    if (value instanceof Map) {
      return super.encode(this.#encodeEntries([...value.entries()]));
    }
    return super.encode(this.#encodeEntries(value));
  }

  styles() {
    return [...new Set([
      ...super.styles(),
      ...this.#keyType.styles(),
      ...this.#valueType.styles(),
    ]).values()];
  }

  #keyValue(value, data) {
    return this.#keyType.value(value, data);
  }

  #value(value, data) {
    return this.#valueType.value(value, data);
  }

  #encodeEntries(data = []) {
    return data.map(([key, val]) => ([
      this.#keyType.encode(key),
      this.#valueType.encode(val),
    ]));
  }

  #isInvalid(data, oldValue, newValue) {
    if (newValue === oldValue) return false;
    const encodedKeyValue = this.#keyType.encode(newValue);
    if (encodedKeyValue === this.#keyType.encode(oldValue)) return false;
    return data.some(
      ([keyValue]) => this.#keyType.encode(keyValue) === encodedKeyValue,
    );
  }

  get isRegistered() {
    const registered = mapTypes.has(this.#name);
    if (!registered) {
      mapTypes.add(this.#name);
      baseRegistered = true;
    }
    return registered;
  }
}

function getData({ dataKey, dataValue, key, keyData, leftData, value, valueData, rightData } = {}, secondary = false) {
  if (secondary) {
    return value || dataValue || valueData || rightData;
  }
  return key || dataKey || keyData || leftData;
}

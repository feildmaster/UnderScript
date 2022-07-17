import axios from 'axios';
import { global } from './global';
import * as api from './4.api';
import eventManager from './eventManager';
import sleep from './sleep';

let selfData;
export function self() {
  if (!selfData) {
    selfData = Object.freeze({
      id: global('selfId'),
      username: global('selfUsername'),
      mainGroup: global('selfMainGroup'),
    });
  }
  return selfData;
}

export function name(user) {
  return user.username;
}

export function isMod(user) {
  return isPriority(user, 4);
}

export function isStaff(user) {
  return isPriority(user, 6);
}

function isPriority(user, priority) {
  if (!user || !user.mainGroup || typeof user.mainGroup.priority !== 'number') throw new Error('Invalid user');
  return user.mainGroup.priority <= priority;
}

export function getCollection() {
  return getDeckConfig().then(({ collection: data }) => parse(data));
}

export function getDecks() {
  return getDeckConfig().then(({ decks: data }) => parse(data));
}

export function getArtifacts() {
  return getDeckConfig().then(({ artifacts: data }) => parse(data));
}

export function getAllArtifacts() {
  return getDeckConfig().then(({ allArtifacts: data }) => parse(data));
}

function getDeckConfig() {
  return new Promise((res) => {
    eventManager.on('Deck:Loaded', (data) => res(data));
    sleep(500).then(() => res());
  }).then((res) => {
    if (res) return res;
    return axios.get('DecksConfig').then(({ data }) => {
      eventManager.singleton.emit('Deck:Loaded', data);
      return data;
    });
  });
}

function parse(data) {
  return typeof data === 'string' ? JSON.parse(data) : data;
}

const user = api.mod.user;
user.isMod = isMod;
user.isStaff = isStaff;
user.getCollection = getCollection;
user.getDecks = getDecks;
user.getArtifacts = getArtifacts;
user.getAllArtifacts = getAllArtifacts;

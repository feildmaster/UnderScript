import luxon from 'luxon';
import tippy from 'tippy.js';
import axios from 'axios';
import showdown from 'showdown';
import * as api from '../../utils/4.api.js';

const lib = api.mod.lib;
lib.tippy = tippy;
lib.axios = axios;
lib.luxon = luxon;
lib.showdown = showdown;

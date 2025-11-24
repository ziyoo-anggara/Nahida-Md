import makeWASocket, {
    extractMessageContent,
    proto,
    prepareWAMessageMedia,
    downloadContentFromMessage,
    getBinaryNodeChild,
    jidDecode,
    useMultiFileAuthState,
    areJidsSameUser,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    getContentType,
    delay,
    makeCacheableSignalKeyStore,
    WAMessageStubType,
    WA_DEFAULT_EPHEMERAL
} from '@breakbeat/baileys';

import { toAudio, toPTT, toVideo } from './converter.js';
import chalk from 'chalk';
import PhoneNumber from 'awesome-phonenumber';
import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import pino from 'pino';
import axios from 'axios';

import {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid
} from './exif.js';

import { sizeFormatter } from 'human-readable';
import { Boom } from "@hapi/boom";
import os from 'node-os-utils';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

export const getGroupAdmins = (participants) => {
  return participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);
}


export const getBuffer = async (url, options = {}) => {
    try {
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options
        });
        return res.data;
    } catch (err) {
        return err;
    }
};

export async function uploadUguu(buffer, filename = 'file.jpg') {
    const form = new FormData();
    form.append('files[]', buffer, {
        filename,
        contentType: 'application/octet-stream'
    });

    const res = await fetch('https://uguu.se/upload?output=json', {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
    });

    return await res.json();
}

export const bytesToSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const checkBandwidth = async () => {
    let ind = 0;
    let out = 0;
    for (let i of await os.netstat.stats()) {
        ind += parseInt(i.inputBytes);
        out += parseInt(i.outputBytes);
    }
    return {
        download: bytesToSize(ind),
        upload: bytesToSize(out),
    };
};

export const formatSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

export const Fetch = {
    get: async (url, options = {}) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                },
                ...options
            });
            return res.data;
        } catch (err) {
            return { error: true, message: err.message };
        }
    },
    post: async (url, data = {}, options = {}) => {
        try {
            const res = await axios.post(url, data, {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                },
                ...options
            });
            return res.data;
        } catch (err) {
            return { error: true, message: err.message };
        }
    }
};

export const isUrl = (url) => {
    return url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi);
};

export const jsonformat = (string) => {
    return JSON.stringify(string, null, 2);
};

export const nganuin = async (url, options = {}) => {
    try {
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            ...options
        });
        return res.data;
    } catch (err) {
        return err;
    }
};

export const pickRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
};

export const runtime = function(seconds) {
    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600 * 24));
    let h = Math.floor(seconds % (3600 * 24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);
    return [
        d ? `${d} days` : "",
        h ? `${h} hours` : "",
        m ? `${m} minutes` : "",
        s ? `${s} seconds` : ""
    ].join(' ').trim();
};

export const shorturl = async (longUrl) => {
    try {
        const res = await axios.post('https://shrtrl.vercel.app/', {
            url: longUrl
        });
        return res.data.data.shortUrl;
    } catch (error) {
        return error;
    }
};

export const formatp = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`
});

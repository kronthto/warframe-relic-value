import fetch from 'node-fetch';

import { readFile, writeFile, stat } from 'fs/promises';

import crypto from 'crypto';

const hash = str => {
    let shasum = crypto.createHash('sha1')
    shasum.update(str)
    return shasum.digest('hex')
}

const _makeReqAndSave = async (url, urlhash) => {
    console.log(url);
    let data = await fetch(url).then(res => {
        if (!res.ok) {
            throw Error(url+' '+res.status);
        }
        return res.text();
    });

    await writeFile('./cache/'+urlhash, data);
    await sleep(210);

    return data;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

const makeReq = async (url) => {
    let urlhash = hash(url);
    let statRes;
    try {
        statRes = await stat('./cache/'+urlhash);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return _makeReqAndSave(url, urlhash);
        }
        throw err;
    }
    
    if (Date.now() - statRes.mtimeMs > 9*3600*1000) {
        return _makeReqAndSave(url, urlhash);
    }

    let data = await readFile('./cache/'+urlhash);

    return data;
}

export default makeReq;

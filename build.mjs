import makeReq from './requests.mjs';
import { readFile, writeFile } from 'fs/promises';

const items = JSON.parse(await readFile('./warframe-items/data/json/All.json'));

let res = {};
let relics = {};
let compNames = {};

const banned = ['Requiem', 'Flawless', 'Radiant', 'Exceptio'];

items.forEach(item => {
    if (item.type === 'Relic') {
        let normalizedName = item.name.replace(' Intact', ' Relic');

        if (banned.some(banW => normalizedName.includes(banW))) return;

        relics[normalizedName] = {
            name: normalizedName,
            uniqueName: item.uniqueName,
            comps: new Set()
        }
        return;
    }

    if (!('components' in item)) return;

    item.components.forEach(comp => {

        if (comp.masteryReq) return; // Component is other finished weapon (may also list parts as drops recursively - we only want direct drops though)
        // Are there other "non-component" drops that'd need to be excluded? 

        if (!('drops' in comp)) return;

        comp.drops.forEach(drop => {
            if (!(drop.chance > 0.0)) return;

            let normalizedName = drop.location.replace(' Intact', ' Relic');

            if (normalizedName.includes('Requiem')) return;

            if (normalizedName.endsWith(' Relic')) {

                compNames[comp.uniqueName] = drop.type;

                if (!(comp.uniqueName in res)) {
                    res[comp.uniqueName] = new Set();
                }

                res[comp.uniqueName].add(drop.location);
            }
        });

    });
});

let resEnha = [];
Object.keys(res).forEach(compUnique => {
    let comp = {
        uniqueName: compUnique,
        name: compNames[compUnique]
    };
    resEnha.push({
        component: comp,
        relics: [...res[compUnique]].map(rel => {
            if (!(rel in relics)) {
                console.error(rel);
                throw new Error("oo");
            }
            relics[rel].comps.add(comp);
            return relics[rel];
        })
    })
});


const buildItemDb = async () => {
    const resData = JSON.parse(await makeReq('https://api.warframe.market/v1/items')).payload.items;
    const map = {};
    resData.forEach(row => {
        map[row.item_name] = row.url_name;
    });
    return map;
}

const marketItemMap = await buildItemDb();

const getPrice = async (marketUrlName) => {
    const resData = JSON.parse(await makeReq('https://api.warframe.market/v1/items/'+marketUrlName+'/statistics'));

    const ninety = resData.payload.statistics_closed['90days'];

    let acc = 0;
    let vol = 0;
    for (let i = 1; i <= 3; i++) {
        let checkIdx = ninety.length - i;
        if (checkIdx >= 0) {
            acc += ninety[checkIdx].wa_price * ninety[checkIdx].volume;
            vol += ninety[checkIdx].volume;
        }
    }

    return acc / vol;
}

for (let index = 0; index < resEnha.length; index++) {
    let row = resEnha[index];
    let market_url_name = marketItemMap[row.component.name];

    if (!market_url_name) {
        market_url_name = marketItemMap[row.component.name.replace(' Blueprint', '')];
    }

    if (!market_url_name) {
        console.error(row);
        throw Error("ooo");
    }
    row.component.marketUrlName = market_url_name;

    row.component.plat = await getPrice(market_url_name);
}

let relicsWithPlat = [];

Object.keys(relics).forEach(relName => {
    let relic = relics[relName];

    relic.plat = 0;

    relic.comps.forEach(comp => {
        relic.plat += comp.plat;
    });

    relic.comps = [...relic.comps];

    relicsWithPlat.push(relic);
});

relicsWithPlat = relicsWithPlat.sort((a,b) => b.plat-a.plat);

writeFile('public/data.json', JSON.stringify(relicsWithPlat, 0 ,2));

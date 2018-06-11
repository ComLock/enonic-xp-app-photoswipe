import {assetUrl} from '/lib/xp/portal';

export function responseFilter(req, res) {
    log.info(`pageContributions:${JSON.stringify(res.pageContributions, null, 4)}`);
    const htmlStr = `<script type="text/javascript" src="${assetUrl({path:'photoswipe.js'})}"></script>`;
    if (!res.pageContributions) {
        res.pageContributions = {
            bodyEnd: [htmlStr]
        }
    } else if (!res.pageContributions.bodyEnd) {
        res.pageContributions.bodyEnd = [htmlStr];
    } else if (Array.isArray(res.pageContributions.bodyEnd)) {
        res.pageContributions.bodyEnd.push(htmlStr);
    } else {
        res.pageContributions.bodyEnd = [res.pageContributions.bodyEnd, htmlStr];
    }
    return res;
}

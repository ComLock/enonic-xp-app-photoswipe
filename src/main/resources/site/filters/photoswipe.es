import {assetUrl} from '/lib/xp/portal';

export function responseFilter(req, res) {
    log.info(`pageContributions:${JSON.stringify(res.pageContributions, null, 4)}`);
    const headEndHtmlStr = `<link rel="stylesheet" href="${assetUrl({path:'photoswipe.css'})}"></link>`;
    const bodyEndHtmlStr = `<script type="text/javascript" src="${assetUrl({path:'photoswipe.js'})}"></script>`;
    if (!res.pageContributions) {
        res.pageContributions = {
            headEnd: [headEndHtmlStr],
            bodyEnd: [bodyEndHtmlStr]
        }
        return res;
    }

    if (!res.pageContributions.headEnd) {
        res.pageContributions.headEnd = [headEndHtmlStr];
    } else if (Array.isArray(res.pageContributions.headEnd)) {
        res.pageContributions.headEnd.push(headEndHtmlStr);
    } else {
        res.pageContributions.headEnd = [res.pageContributions.headEnd, headEndHtmlStr];
    }

    if (!res.pageContributions.bodyEnd) {
        res.pageContributions.bodyEnd = [bodyEndHtmlStr];
    } else if (Array.isArray(res.pageContributions.bodyEnd)) {
        res.pageContributions.bodyEnd.push(bodyEndHtmlStr);
    } else {
        res.pageContributions.bodyEnd = [res.pageContributions.bodyEnd, bodyEndHtmlStr];
    }

    return res;
}

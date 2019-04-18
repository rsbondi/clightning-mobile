const https = require("https");

export default {
    methods: {
        base64Encode(str) {
            const text = new java.lang.String(str);
            const data = text.getBytes("UTF-8");
            return android.util.Base64.encodeToString(data,android.util.Base64.DEFAULT);
        },
        callRemote(method, params) {
            const base64String = this.base64Encode(`${global.remoteUser}:${global.remotePassword}`)
            try {
                return https.request({
                    url: global.remoteUrl,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Basic " + base64String 
                    },
                    content: JSON.stringify({
                        jsonrpc: "2.0",
                        method: method,
                        id: "abce", // TODO: make random or meaningful
                        params: params || []
                    })
                });
            } catch (e) {
                this.msg = e;
            }
        },

    }
}
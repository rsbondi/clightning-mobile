const https = require("https");

export default {
    methods: {
        callRemote(method, params) {
            const text = new java.lang.String(`${global.remoteUser}:${global.remotePassword}`);
            const data = text.getBytes("UTF-8");
            const base64String = android.util.Base64.encodeToString(data,android.util.Base64.DEFAULT);

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
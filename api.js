/* eslint-disable prettier/prettier */
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 5000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
  
    return response;
}

module.exports = class
{
    constructor(serverAddress) {
        this.serverAddress = serverAddress;
    }
    async Get(route, params, headers) {
        var r = route;
        if(params != null) r += "?" + new URLSearchParams(params);
        var object = {
            data: null,
            message: ""
        };
        console.log(this.serverAddress + route);
        try {
            const response = await fetch(this.serverAddress + r, { headers: headers});
            const text = await response.text();

            try {
                object.data = JSON.parse(text);
            } catch {
                object.data = text;
            }

        } catch (error) {
            object.message = error.message;
        } 
        return object;
    }

    async SignIn(username, password) {
        return await this.Get("account/login", {username: username, password: password})
    }

    async GetAccountInfo(id) {
        return await this.Get("account/get", { id: id})
    }
    async GetInfoFromToken(token) {
        return await this.Get("account/get", null, {"auth-token": token});
    }
}
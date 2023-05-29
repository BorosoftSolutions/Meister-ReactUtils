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

module.exports = class API
{
    constructor(serverAddress) {
        this.serverAddress = serverAddress;
    }
    async Get(route, params, headers) {
        console.log("test");
        var r = route;
        if(params != null) r += "?" + new URLSearchParams(params);
        var object = {
            data: null,
            message: ""
        };
        console.log(r);
        try {
            const response = await fetch(this.serverAddress + r, { headers: headers});
            object.data = await response.json();
        } catch (error) {
            object.message = error.message;
        } 
        return object;
    }
}
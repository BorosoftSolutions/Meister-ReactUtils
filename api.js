const serverAddress = "/api/";

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

module.exports =
{
    Get: async (route, params, headers) => {
        var r = route;
        if(params != null) r += "?" + new URLSearchParams(params);
        var object = {
            data: null,
            message: ""
        };
        console.log(r);
        try {
            const response = await fetchWithTimeout(serverAddress + r, { headers: headers});
            object.data = await response.json();
        } catch (error) {
            object.message = error.message;
        } 
        return object;
    }
}
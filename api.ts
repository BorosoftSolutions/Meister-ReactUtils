async function fetchWithTimeout(resource : any, options: any) {
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

interface APIResponse {
    data: any,
    message: string,
    status: number
}

module.exports = class
{
    serverAddress: string;
    constructor(serverAddress : string) {
        this.serverAddress = serverAddress;
    }
    async Get(route : string, params : any | null = null, headers : any | undefined = undefined) {
        var r = route;
        if(params != null) r += "?" + new URLSearchParams(params);
        const object : APIResponse = {
            data: null,
            message: "",
            status: 0
        };
        console.log(this.serverAddress + route);
        try {
            const response = await fetch(this.serverAddress + r, { headers: headers});
            const text = await response.text();

            object.status = response.status;

            try {
                object.data = JSON.parse(text);
            } catch {
                object.data = text;
            }

        } catch (error: any) {
            object.message = error.message;
        } 
        return object;
    }

    async SignIn(username : string, password : string) {
        return await this.Get("account/login", {username: username, password: password})
    }

    async SearchListings(query : string, distance : number, longitude : number, latitude : number) {
        return await this.Get("listing/Search", {
            long: longitude,
            lat: latitude,
            search: query,
            dist: distance
          })
    }

    async GetAccountInfo(id: number) {
        return await this.Get("account/get", { id: id})
    }
    async GetInfoFromToken(token: string) {
        return await this.Get("account/get", null, {"auth-token": token});
    }
    async GetMyListings(token: string) {
        return await this.Get("listing/getmylistings", null, {"auth-token": token});
    }
}
class MapUrlCache{
    urlCache:Map<string,string>;

    constructor(){
        this.urlCache = new Map();
    }

    setSliceRemoteUrl(localUrl:string,CDNUrl:string){
        this.urlCache.set(localUrl,CDNUrl);
    }

    getSliceRemoteUrl(localUrl:string){
        return this.urlCache.get(localUrl);
    }
}

export default new MapUrlCache();
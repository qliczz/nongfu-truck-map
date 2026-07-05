/**
 * WGS-84 与 GCJ-02 坐标系互转
 * 用于在高德/腾讯地图瓦片上正确显示 WGS-84 坐标数据
 */
const CoordTransform = {
    PI: 3.1415926535897932384626,
    a: 6378245.0,
    ee: 0.00669342162296594323,

    transformLat(x, y) {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },

    transformLng(x, y) {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    },

    /** WGS-84 -> GCJ-02 */
    wgs84togcj02(lng, lat) {
        let dlat = this.transformLat(lng - 105.0, lat - 35.0);
        let dlng = this.transformLng(lng - 105.0, lat - 35.0);
        const radlat = lat / 180.0 * this.PI;
        let magic = Math.sin(radlat);
        magic = 1 - this.ee * magic * magic;
        const sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
        dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
        const mglat = lat + dlat;
        const mglng = lng + dlng;
        return [mglng, mglat];
    },

    /** GCJ-02 -> WGS-84 (近似) */
    gcj02towgs84(lng, lat) {
        const [mglng, mglat] = this.wgs84togcj02(lng, lat);
        return [lng * 2 - mglng, lat * 2 - mglat];
    },

    /** 批量转换坐标数组 [[lng,lat],...] WGS84->GCJ02 */
    wgs84ArrayToGcj02(coords) {
        return coords.map(c => {
            const [lng, lat] = this.wgs84togcj02(c[0], c[1]);
            return [lng, lat];
        });
    },

    /** 批量转换坐标数组 [[lng,lat],...] GCJ02->WGS84 */
    gcj02ArrayToWgs84(coords) {
        return coords.map(c => {
            const [lng, lat] = this.gcj02towgs84(c[0], c[1]);
            return [lng, lat];
        });
    }
};

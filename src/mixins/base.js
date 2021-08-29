import moment from 'moment';

// 公共脚本
export default {
    computed: {

    },
    methods: {
        $getQueryString(name) {
            let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        $ArraySort(array) {
            array.sort(function (a, b) {
                if (a.type === b.type) {
                    //如果type相同，按照tier的降序
                    return b.tier - a.tier;
                } else {
                    return a.type - b.type;
                }
            });
        },
        $toDate(timeStamp) {
            // let momentData = require('moment');
            let time = moment(timeStamp * 1000).format('YYYY-MM-DD HH:mm:ss');
            return time;   
        },
        $ShipType(data, type){
            if (data.type == 'AirCarrier') {
                type = 1;
            } else if (data.type == 'Battleship') {
                type = 2;
            } else if (data.type == 'Cruiser') {
                type = 3;
            } else if (data.type == 'Destroyer') {
                type = 4;
            }
            return type;
        }
    },
    created() {

    }
};
